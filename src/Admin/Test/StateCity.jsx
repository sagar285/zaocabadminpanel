import React, { useState } from "react";
import { useGetTripsQuery, useGetUserTripsQuery, useLazyUsersearchTripsQuery } from "../Redux/Api";
import Sidebar from "../Component/Sidebar";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Search } from 'lucide-react';

const AdminTrips = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data, error } = useGetUserTripsQuery();

  // const newData = [...data]
  // const Data = newData.sort()
  const navigate = useNavigate();
  const [triggerSearch, { data: searchData }] = useLazyUsersearchTripsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Add pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search

    if (value.trim().length > 0) {
      triggerSearch(value);
    }
  };

  const reversedArray = [...(data?.data || [])].reverse();
  const displayData = searchTerm.length > 0 ? searchData?.trips : reversedArray;

  // Pagination calculations
  const totalItems = displayData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayData?.slice(indexOfFirstItem, indexOfLastItem);
  const correctItems =[...currentItems].sort((a,b)=>
  a.toLowerCase().localeCompare(b.toLowerCase())
);


  const Cities = [...cities].sort((a, b) => 
    a.toLowerCase().localeCompare(b.toLowerCase())
);
  return (
    <div className="flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={`flex-1 p-8 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {error && (
          <p className="text-red-500 text-lg">Failed to load trips: {error.message}</p>
        )}
        
        <div className="relative w-[80%]">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-900 placeholder:text-gray-400"
            placeholder="Search trips..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="overflow-x-auto shadow rounded-lg mt-[2rem]">
          <table className="min-w-full bg-white border border-gray-300">
            {/* Your existing thead section remains the same */}
            <thead>
              {/* ... your existing thead content ... */}
            </thead>
            <tbody>
              {correctItems.map((trip) => (
               ''
              ))}
              {correctItems?.length === 0 && (
                <tr>
                  <td
                    colSpan="13"
                    className="py-4 px-6 text-center text-gray-500 text-sm"
                  >
                    No trips available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Pagination Controls */}
        {totalItems > 0 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
              >
                Next
              </button>
            </div>
            
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{indexOfFirstItem + 1}</span>
                  {' '}-{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, totalItems)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{totalItems}</span> results
                </p>
              </div>
              
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                  >
                    Previous
                  </button>
                  {/* Current page indicator */}
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTrips;