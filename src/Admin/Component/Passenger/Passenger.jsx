import React, { useState,useEffect } from "react";
import { Search, Plus, Users, Bell } from "lucide-react";
import Sidebar from "../Sidebar";
import PassengerTable from "../Tables/PassengerTable"; // Import the PassengerTable component
import { useGetAllPassengersyAdminQuery, useLazyPassengerSearchQuery } from "../../Redux/Api";

const Passenger = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [length, setLength] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const [notificationModal, setNotificationModal] = useState(false);
  const [selectedPassengerId, setSelectedPassengerId] = useState(null);
  const [page, setPage] = useState(1);
  const [travelSearch, { data: searchTravelData }] = useLazyPassengerSearchQuery();
 const {data,error} = useGetAllPassengersyAdminQuery({ 
  page, 
  limit: limit 
});

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    travelSearch(e.target.value);
  };

  console.log(data?.meta,length)

    useEffect(() => {
      if (data?.drivers?.length > 0 && data?.meta?.total) {
        setLength(data.meta.totalPages);
      } 
    }, [data?.meta?.total]);

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
  };


  const travelsData = searchTerm.length > 0 && searchTravelData?.travels.length > 0 ? searchTravelData?.travels : data?.drivers; 
  const limitOptions = [10, 25, 50, 100];

  // Global notification handler
  const handleGlobalNotification = () => {
    setNotificationModal(true);
  };

  // Clear search handler
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className={`flex-1 p-8 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Header Section */}
        <div className="bg-white shadow-sm p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search and Limit Controls */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                {/* Limit Dropdown */}
                <div className="min-w-[120px]">
                  <select
                    value={limit}
                    onChange={handleLimitChange}
                    className="w-full px-3 py-2.5 rounded-lg border text-white bg-blue-500 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {limitOptions.map(option => (
                      <option key={option} value={option}>
                        Show {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search by name, phone, city, status..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Global Notification Button */}
                <button
                  onClick={handleGlobalNotification}
                  className="flex flex-row items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Notifications <Bell size={20} color="white" className="ml-2" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white text-blue-600 shadow-sm">
                    <Users className="w-4 h-4 mr-2" />
                    Passengers
                    <span className={`ml-2 px-2 py-0.5 rounded-md text-xs ${
                      length === 0 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {length}
                    </span>
                  </button>
                </div>

                {/* Add Button */}
                {/* <button className="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Passenger
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="p-6 pb-0">
            <div className="max-w-7xl mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Search className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-800">
                      {length === 0 ? (
                        <>No results found for "<strong>{searchTerm}</strong>"</>
                      ) : (
                        <>Found <strong>{length}</strong> passenger{length !== 1 ? 's' : ''} matching "<strong>{searchTerm}</strong>"</>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Clear search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area with PassengerTable */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                {/* Pass search props to PassengerTable */}
                <PassengerTable 
                page={page}
                data={data}
                 setPage={setPage}
                 length={length}
                  setlength={setLength}
                  PassengersData={travelsData || []} // Keep empty for using mock data
                  limitpage={limit}
                  searchTerm={searchTerm} // Pass search term
                  onSearchResults={(count) => setLength(count)} // Callback for result count
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Notification Modal */}
        {notificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Send Global Notification</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md" 
                    placeholder="Notification title" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    className="w-full p-2 border border-gray-300 rounded-md" 
                    rows="3" 
                    placeholder="Notification message"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Send To</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="all">All Passengers</option>
                    <option value="active">Active Passengers</option>
                    <option value="premium">Premium Members</option>
                    <option value="pending">Pending Verification</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setNotificationModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setNotificationModal(false);
                      alert("Notification sent successfully!");
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Send to All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Passenger;