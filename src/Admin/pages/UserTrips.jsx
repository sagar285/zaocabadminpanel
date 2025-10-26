import React, { useState, useEffect } from "react";
import { useGetUserTripsQuery, useLazyUsersearchTripsQuery } from "../Redux/Api";
import Sidebar from "../Component/Sidebar";
import { useNavigate } from "react-router-dom";
import { Search } from 'lucide-react';

const AdminTrips = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Get paginated data
  const { data: paginatedData, error, isLoading } = useGetUserTripsQuery({
    page: currentPage,
    limit,
  });

  // Search functionality
  const [triggerSearch, { data: searchData }] = useLazyUsersearchTripsQuery();

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      triggerSearch(value);
    }
  };

  // Helper function to get status text for demo
  const getStatusText = (index) => {
    const statuses = ["Start trip", "Accept", "Pending", "Drop off", "Complete", "Reached", "Go to Pickup", "Expire"];
    return statuses[index % statuses.length];
  };

  // Helper function to get status color based on status text
  const getStatusStyles = (status) => {
    let bgColor, textColor;
    
    switch(status) {
      case "Start trip":
        bgColor = "#28a745"; // Green
        textColor = "#ffffff"; // White
        break;
      case "Accept":
        bgColor = "#28a745"; // Green
        textColor = "#ffffff"; // White
        break;
      case "Go to Pickup":
        bgColor = "#28a745"; // Green
        textColor = "#ffffff"; // White
        break;
      case "Pending":
        bgColor = "#ffc107"; // Yellow
        textColor = "#000000"; // Black
        break;
      case "Drop off":
        bgColor = "#dc3545"; // Red
        textColor = "#ffffff"; // White
        break;
         case "Canceled":
        bgColor = "#dc3545"; // Red
        textColor = "#ffffff"; // White
        break;
         case "Confirmed":
        bgColor = "#28a745" // Red
        textColor = "#ffffff"; // Whi   te
        break;
      case "Complete":
        bgColor = "#dc3545"; // Red
        textColor = "#ffffff"; // White
        break;
      case "Reached":
        bgColor = "#007bff"; // Blue
        textColor = "#ffffff"; // White
        break;
      case "Expire":
        bgColor = "#6c757d"; // Gray
        textColor = "#ffffff"; // White
        break;
      default:
        bgColor = "#e2e8f0"; // Default gray
        textColor = "#1a202c"; // Dark text
    }
    
    return {
      backgroundColor: bgColor,
      color: textColor,
      padding: "0.25rem 0.5rem",
      borderRadius: "0.25rem",
      fontWeight: "500",
      textAlign: "center",
      display: "inline-block",
      width: "120%"
    };
  };

  // Calculate pagination values
  const displayData = searchTerm.length > 0 ? searchData?.trips : paginatedData?.data;
  const totalItems = searchTerm.length > 0 
    ? searchData?.trips?.length 
    : paginatedData?.pagination?.totalResults || 0;
  const totalPages = searchTerm.length > 0
    ? Math.ceil(searchData?.trips?.length / limit)
    : paginatedData?.pagination?.totalPages || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={`flex-1 p-4 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {error && (
          <p className="text-red-500 text-lg">Failed to load trips: {error.message}</p>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4 bg-gray-100 p-4 rounded-md">
            <button className="bg-blue-400 text-white px-4 py-1.5 rounded-md text-sm flex items-center">
              Show {limit}
            </button>
            
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full px-4 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none"
                placeholder="SEARCH"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <button className="bg-blue-400 text-white px-4 py-1.5 rounded-md text-sm">
              Notification
            </button>
            
            <button className="bg-blue-400 text-white px-4 py-1.5 rounded-md text-sm">
              Select Filter
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="w-full bg-white border border-gray-300 table-fixed">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left py-2 px-3 font-semibold text-xs w-12">S.No</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-16">ID</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Trip ID</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Passenger</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-20">Trip Type</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Category</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-20">Fare</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Driver</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Pickup</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-36">Location</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Created</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-24">Partner/Passenger</th>
                  <th className="text-center py-2 px-3 font-semibold text-xs w-20">Status</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayData?.map((trip, index) => {
                  const status = trip.tripStatus || getStatusText(index);
                  const statusStyle = getStatusStyles(status);
                  
                  return (
                    <tr key={trip._id || index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3 text-xs">
                        {((currentPage - 1) * limit) + index + 1}
                      </td>
                      <td className="py-2 px-3 text-xs">
                        {displayData.length - index}
                      </td>
                      <td className="py-2 px-3 text-xs whitespace-normal">
                        <a href="#" className="text-blue-500 hover:underline">{trip.tripId || `#ZA0342`}</a>
                      </td>
                      <td className="py-2 px-3 text-xs">
                        <div className="flex flex-col">
                          <span className="font-medium">{trip?.userId?.firstName || "Rahul Kumar"}</span>
                          <span className="text-gray-500">{trip?.userId?.phone || "7676755676"}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs">{trip.tripType || "Outstation One-way"}</td>
                      <td className="py-2 px-3 text-xs truncate">
                        {trip.vehicleType ? trip.vehicleType : (trip?.numberofpassengers ? trip?.numberofpassengers + " Passenger" : "Maruti Dzire UP32KT4567")}
                      </td>
                      <td className="py-2 px-3 text-xs">
                        {trip?.totalFare > 0 ? trip?.totalFare : "N/A"}
                      </td>
                      <td className="py-2 px-3 text-xs">
                        <div className="flex flex-col">
                          {
                            trip?.offerUserId ? (
                              <>
                              <span className="font-medium">{trip?.offerUserId?.firstName} {trip?.offerUserId?.lastName}</span>
                              <span className="text-gray-500">{trip?.offerUserId?.phone}</span>
                              </>
                            ) : (
                              <span className="font-medium">{"Not Assign"}</span>
                            )
                          }
                       
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs">
                        <div className="flex flex-col">
                          <span>
                            {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : '12 Feb, 02:00 PM'}
                          </span>
                          <span className="text-gray-500">
                            {trip.createdAt ? new Date(trip.createdAt).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true
                            }) : ''}
                          </span>
                        </div>
                      </td>                       
                      <td className="py-2 px-3 text-xs"> 
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-green-500 mr-1"></div>
                            <span className="truncate">
                              {trip.pickupLocation?.includes(',') ? trip.pickupLocation.split(',')[0] : (trip.pickupLocation || 'Ayodhya')}
                            </span>
                          </div>
                          <div className="flex items-center"> 
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-red-500 mr-1"></div>
                            <span className="text-gray-500 truncate"> 
                              {trip.dropLocation?.includes(',') ? trip.dropLocation.split(',')[0] : (trip.dropLocation || 'Lucknow')}
                            </span>
                          </div>
                        </div>
                      </td>     
                      <td className="py-2 px-3 text-xs">
                        <div className="flex flex-col">
                          <span>
                            {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : '15 Jun 2024'}
                          </span>
                          <span className="text-gray-500">
                            {trip.createdAt ? new Date(trip.createdAt).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true
                            }) : '11:55 AM'}
                          </span>
                        </div>
                      </td>                    
                      <td className="py-2 px-3 text-xs">
                        <div className="flex flex-col">
                          <span>
                            {trip?.tripByPassenger ? "Passenger":"Partner"}
                          </span>
             
                        </div>
                      </td>                    
                      <td className="py-2 px-3">
                        <div style={statusStyle} className="text-xs">
                          {status}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-600">
                        <a href={`/userTrip/${trip?._id || '#'}`} className="text-blue-500 hover:underline">View</a>
                      </td>
                    </tr>
                  );
                })}
                {(!displayData || displayData.length === 0) && (
                  <tr>
                    <td colSpan="13" className="py-4 px-3 text-center text-gray-500 text-sm">
                      No trips available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Summary Footer */}
            {!isLoading && displayData && displayData.length > 0 && (
              <div className="flex w-full text-base font-bold border-t border-gray-200">
                <div className="flex items-center w-1/3 border border-gray-200">
                  <span className="px-6 py-3">Total Trip</span>
                  <div className="ml-auto px-8 py-3 border-l border-gray-200">
                    1500
                  </div>
                </div>
                <div className="flex items-center w-1/3 border-t border-b border-r border-gray-200">
                  <span className="px-6 py-3">Total Trip Amount</span>
                  <div className="ml-auto px-8 py-3 border-l border-gray-200">
                    1750
                  </div>
                </div>
                <div className="flex items-center w-1/3 border-t border-b border-r border-gray-200">
                  <span className="px-6 py-3">Total Commission</span>
                  <div className="ml-auto px-8 py-3 border-l border-gray-200">
                    250
                  </div>
                </div>
              </div>
            )}

            {totalItems > 0 && (
              <div className="flex items-center justify-end bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page numbers - limit displayed page numbers */}
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      // Logic to show pages around current page
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
                      
                      const isCurrentPage = pageNum === currentPage;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-3 py-1 border ${
                            isCurrentPage
                              ? 'bg-blue-50 border-blue-500 text-blue-600'
                              : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                          } text-xs font-medium`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTrips;