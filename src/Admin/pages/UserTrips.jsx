import React, { useState, useEffect } from "react";
import { useGetUserTripsQuery, useLazyUsersearchTripsQuery } from "../Redux/Api";
import Sidebar from "../Component/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  getDisplayTripStatus,
  getStatusStyles,
  formatTripIdLabel,
  shortLocation,
} from "./userTripsUtils";

const emptyFilters = { tripStatus: "", tripType: "" };

const TRIP_STATUS_OPTIONS = [
  "",
  "Pending",
  "Confirmed",
  "Expired",
  "End",
  "Completed",
  "Canceled",
  "onTheWay",
  "Reached",
  "StartTrip",
];

const TRIP_TYPE_OPTIONS = [
  "",
  "CityRide",
  "Rental",
  "one-way",
  "round-trip",
  "Carpool",
];

const UserTrips = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [pendingFilters, setPendingFilters] = useState(emptyFilters);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLimitMenu, setShowLimitMenu] = useState(false);

  const isSearching = searchTerm.trim().length > 0;

  const { data: paginatedData, error, isLoading, isFetching } = useGetUserTripsQuery(
    {
      page: currentPage,
      limit,
      ...appliedFilters,
    },
    { skip: isSearching }
  );

  const [triggerSearch, { data: searchData, isFetching: isSearchFetching }] =
    useLazyUsersearchTripsQuery();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, limit, appliedFilters]);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      triggerSearch(searchTerm.trim());
    }
  }, [searchTerm, triggerSearch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const displayData = isSearching ? searchData?.trips : paginatedData?.data;
  const totalItems = isSearching
    ? searchData?.trips?.length || 0
    : paginatedData?.pagination?.totalResults || 0;
  const totalPages = isSearching
    ? Math.max(1, Math.ceil((searchData?.trips?.length || 0) / limit))
    : paginatedData?.pagination?.totalPages || 1;

  const summary = paginatedData?.summary;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const openFilterModal = () => {
    setPendingFilters(appliedFilters);
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    setAppliedFilters({ ...pendingFilters });
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setAppliedFilters(emptyFilters);
    setPendingFilters(emptyFilters);
    setCurrentPage(1);
  };

  const hasFilters = Boolean(appliedFilters.tripStatus || appliedFilters.tripType);
  const loading = isLoading || isFetching || isSearchFetching;

  return (
    <div className="flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`flex-1 p-4 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        {error && (
          <p className="text-red-500 text-lg mb-4">
            Failed to load trips: {error?.data?.message || error?.message || "Unknown error"}
          </p>
        )}

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4 bg-gray-100 p-4 rounded-md">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLimitMenu((v) => !v)}
                className="bg-blue-400 text-white px-4 py-1.5 rounded-md text-sm"
              >
                Show {limit} ▾
              </button>
              {showLimitMenu && (
                <div className="absolute z-20 mt-1 bg-white border border-gray-200 rounded shadow-md">
                  {[10, 20, 30].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        limit === n ? "bg-blue-50 font-medium" : ""
                      }`}
                      onClick={() => {
                        setLimit(n);
                        setShowLimitMenu(false);
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                className="w-full px-4 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Search trip ID, status, type, location…"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/notifications")}
              className="bg-blue-400 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-500"
            >
              Notification
            </button>

            <button
              type="button"
              onClick={openFilterModal}
              className="bg-blue-400 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-500"
            >
              Select Filter
            </button>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-gray-600 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="w-full bg-white border border-gray-300 table-fixed">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left py-2 px-3 font-semibold text-xs w-12">S.No</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Trip ID</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Passenger</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-20">Trip Type</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Category</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-20">Fare</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Driver / Partner</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Trip Date</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-36">Location</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Created</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-20">Role</th>
                  <th className="text-center py-2 px-3 font-semibold text-xs w-20">Status</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayData?.map((trip, index) => {
                  const status = getDisplayTripStatus(trip);
                  const statusStyle = getStatusStyles(status);
                  const tripDateRaw =
                    trip?.tripType === "Carpool"
                      ? trip?.whenAreYouGoing
                      : trip?.tripDate;

                  return (
                    <tr key={trip._id || index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3 text-xs">
                        {isSearching
                          ? index + 1
                          : (currentPage - 1) * limit + index + 1}
                      </td>
                      <td className="py-2 px-3 text-xs whitespace-normal">
                        <button
                          type="button"
                          onClick={() => navigate(`/userTrip/${trip._id}`)}
                          className="text-blue-500 hover:underline text-left"
                        >
                          {formatTripIdLabel(trip.tripId)}
                        </button>
                      </td>
                      <td className="py-2 px-3 text-xs">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {[trip?.userId?.firstName, trip?.userId?.lastName]
                              .filter(Boolean)
                              .join(" ") || "—"}
                          </span>
                          <span className="text-gray-500">
                            {trip?.userId?.phone || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs">{trip.tripType || "—"}</td>
                      <td className="py-2 px-3 text-xs truncate">
                        {trip.vehicleType ||
                          (trip?.numberofpassengers
                            ? `${trip.numberofpassengers} Passenger`
                            : "—")}
                      </td>
                      <td className="py-2 px-3 text-xs">
                        {trip?.totalFare > 0 ? `₹${trip.totalFare}` : "N/A"}
                      </td>
                      <td className="py-2 px-3 text-xs">
                        {trip?.offerUserId?.firstName ? (
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {trip.offerUserId.firstName} {trip.offerUserId.lastName || ""}
                            </span>
                            <span className="text-gray-500">
                              {trip.offerUserId.phone || "—"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Not assigned</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-xs">
                        {tripDateRaw ? (
                          <div className="flex flex-col">
                            <span>
                              {new Date(tripDateRaw).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="text-gray-500">
                              {new Date(tripDateRaw).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2 px-3 text-xs">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-green-500 mr-1 shrink-0" />
                            <span className="truncate">
                              {shortLocation(trip.pickupLocation)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-red-500 mr-1 shrink-0" />
                            <span className="text-gray-500 truncate">
                              {shortLocation(trip.dropLocation)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs">
                        {trip.createdAt ? (
                          <div className="flex flex-col">
                            <span>
                              {new Date(trip.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="text-gray-500">
                              {new Date(trip.createdAt).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2 px-3 text-xs">
                        {trip?.userId?.role || "—"}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div style={statusStyle} className="text-xs">
                          {status}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-600">
                        <button
                          type="button"
                          onClick={() => navigate(`/userTrip/${trip._id}`)}
                          className="text-blue-500 hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {(!displayData || displayData.length === 0) && (
                  <tr>
                    <td
                      colSpan="13"
                      className="py-4 px-3 text-center text-gray-500 text-sm"
                    >
                      No trips available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {!isSearching && displayData && displayData.length > 0 && (
              <div className="flex w-full text-sm font-semibold border-t border-gray-200">
                <div className="flex items-center w-1/3 border border-gray-200">
                  <span className="px-6 py-3">Total Trip</span>
                  <div className="ml-auto px-8 py-3 border-l border-gray-200">
                    {summary?.totalTrips ?? paginatedData?.pagination?.totalResults ?? 0}
                  </div>
                </div>
                <div className="flex items-center w-1/3 border-t border-b border-r border-gray-200">
                  <span className="px-6 py-3">Total Trip Amount</span>
                  <div className="ml-auto px-8 py-3 border-l border-gray-200">
                    ₹{Math.round(summary?.totalFare || 0)}
                  </div>
                </div>
                <div className="flex items-center w-1/3 border-t border-b border-r border-gray-200">
                  <span className="px-6 py-3">Total Commission</span>
                  <div className="ml-auto px-8 py-3 border-l border-gray-200">
                    ₹{Math.round(summary?.totalCommission || 0)}
                  </div>
                </div>
              </div>
            )}

            {!isSearching && totalItems > 0 && (
              <div className="flex items-center justify-end bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }

                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-3 py-1 border ${
                          pageNum === currentPage
                            ? "bg-blue-50 border-blue-500 text-blue-600"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                        } text-xs font-medium`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>

      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Filter passenger trips</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              value={pendingFilters.tripStatus}
              onChange={(e) =>
                setPendingFilters((f) => ({ ...f, tripStatus: e.target.value }))
              }
            >
              {TRIP_STATUS_OPTIONS.map((s) => (
                <option key={s || "all"} value={s}>
                  {s || "All statuses"}
                </option>
              ))}
            </select>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trip type
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
              value={pendingFilters.tripType}
              onChange={(e) =>
                setPendingFilters((f) => ({ ...f, tripType: e.target.value }))
              }
            >
              {TRIP_TYPE_OPTIONS.map((t) => (
                <option key={t || "all"} value={t}>
                  {t || "All types"}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded border border-gray-300"
                onClick={() => setShowFilterModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-blue-500 text-white"
                onClick={applyFilters}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTrips;
