import React, { useState } from "react";
import Driver from "../Component/Tables/Driver";
import Travels from "../Component/Tables/Travels";
import Sidebar from "../Component/Sidebar";
import { Car, Users, Search, Plus, BellIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateRoleNotificationMutation, useLazyDriverSearchQuery, useLazyTravelSearchQuery } from "../Redux/Api";
import RoleNotificationModal from "../Component/Modal/RoleNotificationModal"
import toast from "react-hot-toast";

const Travelss = () => {
  const [activeButton, setActiveButton] = useState('travels');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [length, setlength] = useState(0);
  const [travellength, settravellength] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10); // Default limit
  const [triggerSearch, { data: searchData }] = useLazyDriverSearchQuery();
  const [travelSearch, { data: searchTravelData }] = useLazyTravelSearchQuery();
  const [rolenotification] = useCreateRoleNotificationMutation()
  const navigate = useNavigate();
   const [newNotification, setNewNotification] = useState({
      title: "",
      message: "",
      type: "daily",
      schedule: {
        time: "09:00",
        period: "morning",
        date: "",
      },
    });
  const [notificationModel,setnotificationModel] = useState(false);
  const [role,setrole] = useState("all");

  const HandleAddDriverOrTravelOwnerClick = () => {
    if (activeButton === "driver") {
      navigate("/add-driver");
    } else {
      navigate("/add-travel-owner");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (activeButton === "driver") {
      triggerSearch(e.target.value);
    }
    if (activeButton === "travels") {
      travelSearch(e.target.value);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
  };

  const handleAddNotification = async () => {
   const notificationdata = {
     role: role,
     title: newNotification.title,
     message: newNotification.message,
     type: newNotification.type,
     schedule: newNotification.schedule,
   }
   const { data, error } = await rolenotification(notificationdata);
   if (data) {
     toast.success("Notification created successfully!");
     setNewNotification({
       title: "",
       message: "",
       type: "daily",
       schedule: {
         time: "09:00",
         period: "morning",
         date: "",
       },
     });
   }
   if(error){
     console.log(error);
   }
 };

  const DriversData = searchTerm.length > 0 && searchData?.drivers.length > 0 ? searchData?.drivers : [];   
const travelsData = searchTerm.length > 0 && searchTravelData?.travels.length > 0 ? searchTravelData?.travels : []; // Fixed: was searchData?.travels

  // Calculate total items for limit dropdown options
  const totalItems = activeButton === "driver" ? length : travellength;
  const limitOptions = [10, 25, 50, 100].filter(option => option <= totalItems);
  if (!limitOptions.includes(totalItems) && totalItems > 0) {
    limitOptions.push(totalItems);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
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
                    className="w-full px-3 py-2.5 rounded-lg border text-white  bg-blue-500 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search drivers or travels..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                
                {/* Single Notification Button for Both Roles */}
                <button
                  onClick={() => {
                    setrole("all");
                    setnotificationModel(true);
                  }}
                  className="flex flex-row items-center px-4 py-2 bg-blue-500 text-white rounded"
                >
                   Notifications <BellIcon size={20} color="white" className="ml-2" />
                </button>
              </div>

              {/* Tab Navigation */}
              {/* <div className="flex items-center gap-2">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeButton === "driver"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setActiveButton("driver")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Drivers
                    <span className={`ml-2 px-2 py-0.5 rounded-md text-xs ${
                      activeButton === "driver"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {length}
                    </span>
                  </button>
                  <button
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeButton === "travels"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setActiveButton("travels")}
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Travels
                    <span className={`ml-2 px-2 py-0.5 rounded-md text-xs ${
                      activeButton === "travels"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {travellength}
                    </span>
                  </button>
                </div>

                Add Button
                <button
                  className="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                  onClick={HandleAddDriverOrTravelOwnerClick}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add {activeButton === "driver" ? "Driver" : "Travel"}
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                {activeButton === "driver" && (
                  <Driver 
                    setlength={setlength} 
                    DriversData={DriversData}
                    limitpage={limit} // Pass limit to Driver component
                  />
                )}
                {activeButton === "travels" && (
                  <Travels 
                    settravellength={settravellength} 
                    travelsData={travelsData}
                    limitpage={limit} // Pass limit to Travels component
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <RoleNotificationModal
        newNotification={newNotification}
        onAdd={handleAddNotification}
        openAddModal={notificationModel}
        setOpenAddModal={setnotificationModel}
        setNewNotification={setNewNotification}
        role={role}
      />
    </div>
  );
};

export default Travelss;