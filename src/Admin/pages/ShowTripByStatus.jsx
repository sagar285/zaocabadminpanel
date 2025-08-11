import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import Sidebar from '../Component/Sidebar';
import { useGetTripsByStatusQuery } from "../Redux/Api";
import { format } from 'date-fns';

const ShowTripByStatus = () => {
  const { status } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const { data, error, isLoading } = useGetTripsByStatusQuery({
    status,
    page: currentPage,
    limit
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className={`flex-1 p-8 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {status?.charAt(0).toUpperCase() + status?.slice(1)} Trips
          </h1>
          <p className="text-gray-600 mt-1">
            Showing trips with status: {status}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-red-700">
                  Error loading trips: {error.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip Details</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Info</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.trips.map((trip) => (
                    <tr key={trip._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{trip.tripId}</div>
                        <div className="text-sm text-gray-500">{format(new Date(trip.tripDate), 'MMM dd, yyyy')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{trip.pickupLocation?.substring(0, 30) + '...'}</div>
                        <div className="text-sm text-gray-500 mt-1">→</div>
                        <div className="text-sm text-gray-900">{trip.dropLocation?.substring(0, 30) + '...'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{trip.vehicleType ? trip?.vehicleType : trip?.numberofpassengers + " Passenger"}</div>
                        <div className="text-sm text-gray-500">
                          {trip.requireAc && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">AC</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">₹{trip.tripPrice}</div>
                        {trip.negotiatedPrice && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Negotiable
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${trip.tripStatus === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                          trip.tripStatus === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                          {trip.tripStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-sm text-blue-900 underline cursor-pointer">
                      <a href={`/userTrip/${trip?._id}`} target="_blank" rel="noopener noreferrer">View</a>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!data?.hasMore}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((currentPage - 1) * limit) + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(currentPage * limit, data?.totalTrips || 0)}</span> of{" "}
                      <span className="font-medium">{data?.totalTrips || 0}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                      >
                        Previous
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {currentPage}
                      </span>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!data?.hasMore}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowTripByStatus;