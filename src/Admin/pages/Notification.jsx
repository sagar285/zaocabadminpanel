import React, { useEffect, useState } from "react";
import { Bell, Clock, Calendar, Trash2, Upload, Plus } from "lucide-react";
import {
  useCreateNotificationMutation,
  useDeletenotificationMutation,
  useGetNotificationQuery,
} from "../Redux/Api";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../Component/Sidebar";

const Notification = () => {
  const [activeMainTab, setActiveMainTab] = useState("create");
  const [activeNotificationType, setActiveNotificationType] = useState("quick");
  const [notifications, setNotifications] = useState([]);
  const [CreateNotification] = useCreateNotificationMutation();
  const [deleteNotification] = useDeletenotificationMutation();
  const { data, error, refetch } = useGetNotificationQuery();
        const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "quick",
    schedule: {
      time: "10:00",
      days: {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
      },
      date: "",
    },
    links: "",
    oneTime: false,
    manyTime: false
  });
  
  // State for managing date and time picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (data) {
      setNotifications(data?.data);
    }
  }, [data]);

  const handleAddNotification = async () => {
    try {
      // Validate required fields
      if (!newNotification.title.trim()) {
        toast.error("Please enter a notification title");
        return;
      }
      
      if (!newNotification.message.trim()) {
        toast.error("Please enter a notification message");
        return;
      }
      
      // For festival type, ensure date is selected
      if (newNotification.type === "festival" && !newNotification.schedule.date) {
        toast.error("Please select a date for the festival/event");
        return;
      }

      // For daily type, ensure at least one day is selected
      if (newNotification.type === "daily" && 
          !Object.values(newNotification.schedule.days).some(day => day)) {
        toast.error("Please select at least one day of the week");
        return;
      }
      
      // Transform data for API if needed
      const apiNotification = {
        ...newNotification,
        schedule: {
          ...newNotification.schedule,
          // Add any transformations needed for the API
        }
      };
      
      const response = await CreateNotification(apiNotification);
      
      if (response.data) {
        refetch();
        toast.success("Notification created successfully!");
        // Reset form but keep the current tab
        setNewNotification({
          title: "",
          message: "",
          type: activeNotificationType,
          schedule: {
            time: "10:00",
            days: {
              sunday: false,
              monday: false,
              tuesday: false,
              wednesday: false,
              thursday: false,
              friday: false,
              saturday: false
            },
            date: "",
          },
          links: "",
          oneTime: false,
          manyTime: false
        });
      } else if (response.error) {
        console.error("API Error:", response.error);
        toast.error("Failed to create notification: " + (response.error.data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error creating notification:", err);
      toast.error("An error occurred while creating the notification");
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const response = await deleteNotification(id);
      if (response.data) {
        refetch();
        toast.success("Notification deleted successfully!");
      } else {
        toast.error("Error deleting notification");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting notification");
    }
  };

  const handleDayChange = (day) => {
    setNewNotification({
      ...newNotification,
      schedule: {
        ...newNotification.schedule,
        days: {
          ...newNotification.schedule.days,
          [day]: !newNotification.schedule.days[day]
        }
      }
    });
  };

  // Get formatted date string for display
  const getFormattedDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'short' });
    return `Sun ${day} ${month}, ${newNotification.schedule.time || '10:00 AM'}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-pink-50 min-h-screen">
      <Sidebar
                                isSidebarOpen={isSidebarOpen}
                                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                              />
  <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'} p-6`}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Notification Management
        </h1>
      </div>

      {/* Main Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveMainTab("create")}
              className={`py-2 px-4 font-medium -mb-px ${
                activeMainTab === "create"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Create Notification
            </button>
            <button
              onClick={() => setActiveMainTab("scheduled")}
              className={`py-2 px-4 font-medium -mb-px ${
                activeMainTab === "scheduled"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Scheduled Notifications
            </button>
          </nav>
        </div>
      </div>

      {/* Create Notification Tab */}
      {activeMainTab === "create" && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Select notification type</h2>
          
          {/* Notification Type Buttons */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setActiveNotificationType("quick");
                setNewNotification({...newNotification, type: "quick"});
              }}
              className={`py-2 px-4 font-medium rounded-md border ${
                activeNotificationType === "quick"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-black border-gray-300 hover:bg-gray-50"
              }`}
            >
              Quickly
            </button>
            <button
              onClick={() => {
                setActiveNotificationType("daily");
                setNewNotification({...newNotification, type: "daily"});
              }}
              className={`py-2 px-4 font-medium rounded-md border ${
                activeNotificationType === "daily"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-black border-gray-300 hover:bg-gray-50"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => {
                setActiveNotificationType("festival");
                setNewNotification({...newNotification, type: "festival"});
              }}
              className={`py-2 px-4 font-medium rounded-md border ${
                activeNotificationType === "festival"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-black border-gray-300 hover:bg-gray-50"
              }`}
            >
              Festival/Event
            </button>
            <button
              onClick={() => {
                setActiveNotificationType("custom");
                setNewNotification({...newNotification, type: "custom"});
              }}
              className={`py-2 px-4 font-medium rounded-md border ${
                activeNotificationType === "custom"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-black border-gray-300 hover:bg-gray-50"
              }`}
            >
              Custom
            </button>
            <button
              onClick={() => {
                setActiveNotificationType("flash");
                setNewNotification({...newNotification, type: "flash"});
              }}
              className={`py-2 px-4 font-medium rounded-md border ${
                activeNotificationType === "flash"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-black border-gray-300 hover:bg-gray-50"
              }`}
            >
              Flash Notification
            </button>
          </div>
          
          {/* Day selection row for Flash Notification - appears at bottom of form */}
          {activeNotificationType === "flash" && (
            <div className="w-full mt-4 border rounded-md p-2 flex flex-wrap justify-between bg-white">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={newNotification.schedule.days.sunday}
                  onChange={() => handleDayChange('sunday')}
                />
                Sunday
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={newNotification.schedule.days.monday}
                  onChange={() => handleDayChange('monday')}
                />
                Monday
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={newNotification.schedule.days.tuesday}
                  onChange={() => handleDayChange('tuesday')}
                />
                Tuesday
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={newNotification.schedule.days.wednesday}
                  onChange={() => handleDayChange('wednesday')}
                />
                Wednesday
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={newNotification.schedule.days.thursday}
                  onChange={() => handleDayChange('thursday')}
                />
                Thursday
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={newNotification.schedule.days.friday}
                  onChange={() => handleDayChange('friday')}
                />
                Friday
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={newNotification.schedule.days.saturday}
                  onChange={() => handleDayChange('saturday')}
                />
                Saturday
              </label>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Title Field - Common for all types */}
            <div>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newNotification.title}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    title: e.target.value,
                  })
                }
                placeholder="Title"
              />
            </div>

            {/* Message Field - Common for all types */}
            <div>
              <textarea
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="5"
                value={newNotification.message}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    message: e.target.value,
                  })
                }
                placeholder="Message"
              />
            </div>

            {/* Date and Time Section */}
            <div className="flex gap-4">
              <div className="flex-1 p-3 border rounded-md bg-gray-50">
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Select Date & Time
                </label>
                
                {/* Show Day Selection for Daily */}
                {activeNotificationType === "daily" && (
                  <div className="flex flex-wrap justify-between gap-2 mb-3 bg-white p-2 rounded-md">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={newNotification.schedule.days.sunday}
                        onChange={() => handleDayChange('sunday')}
                      />
                      Sun
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={newNotification.schedule.days.monday}
                        onChange={() => handleDayChange('monday')}
                      />
                      Mon
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={newNotification.schedule.days.tuesday}
                        onChange={() => handleDayChange('tuesday')}
                      />
                      Tue
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={newNotification.schedule.days.wednesday}
                        onChange={() => handleDayChange('wednesday')}
                      />
                      Wed
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={newNotification.schedule.days.thursday}
                        onChange={() => handleDayChange('thursday')}
                      />
                      Thu
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={newNotification.schedule.days.friday}
                        onChange={() => handleDayChange('friday')}
                      />
                      Fri
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={newNotification.schedule.days.saturday}
                        onChange={() => handleDayChange('saturday')}
                      />
                      Sat
                    </label>
                  </div>
                )}

                {/* Show Date Picker for Festival */}
                {activeNotificationType === "festival" && (
                  <div className="mb-3">
                    <input
                      type="date"
                      className="w-full p-2 border rounded-md"
                      value={newNotification.schedule.date}
                      onChange={(e) =>
                        setNewNotification({
                          ...newNotification,
                          schedule: {
                            ...newNotification.schedule,
                            date: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                )}

                {/* Flash Notification Options */}
                {activeNotificationType === "flash" && (
                  <div className="mb-3 bg-white p-3 border rounded-md">
                    <div className="flex items-center gap-4 mb-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={newNotification.oneTime}
                          onChange={() => 
                            setNewNotification({
                              ...newNotification,
                              oneTime: !newNotification.oneTime,
                              manyTime: false // Make exclusive
                            })
                          }
                        />
                        One time
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={newNotification.manyTime}
                          onChange={() => 
                            setNewNotification({
                              ...newNotification,
                              manyTime: !newNotification.manyTime,
                              oneTime: false // Make exclusive
                            })
                          }
                        />
                        Many time next day
                      </label>
                    </div>
                    
                    <div className="flex gap-3 mt-3">
                      <button 
                        className="flex-1 border border-gray-300 p-2 rounded-md text-gray-600 bg-gray-50"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                      >
                        {showDatePicker ? 'Hide Date Picker' : 'Select Date'}
                      </button>
                      <button 
                        className="flex-1 border border-gray-300 p-2 rounded-md text-gray-600 bg-gray-50"
                        onClick={() => setShowTimePicker(!showTimePicker)}
                      >
                        {showTimePicker ? 'Hide Time Picker' : 'Select Time'}
                      </button>
                    </div>
                    
                    {/* Date Picker */}
                    {showDatePicker && (
                      <div className="mt-3 p-2 border rounded-md bg-white">
                        <input
                          type="date"
                          className="w-full p-2 border rounded-md"
                          value={newNotification.schedule.date}
                          onChange={(e) =>
                            setNewNotification({
                              ...newNotification,
                              schedule: {
                                ...newNotification.schedule,
                                date: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    )}
                    
                    {/* Time Picker */}
                    {showTimePicker && (
                      <div className="mt-3 p-2 border rounded-md bg-white">
                        <input
                          type="time"
                          className="w-full p-2 border rounded-md"
                          value={newNotification.schedule.time}
                          onChange={(e) =>
                            setNewNotification({
                              ...newNotification,
                              schedule: {
                                ...newNotification.schedule,
                                time: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Time picker for non-flash types */}
                {activeNotificationType !== "flash" && (
                  <div className="flex items-center mb-3">
                    <input
                      type="time"
                      className="flex-1 p-2 border rounded-md"
                      value={newNotification.schedule.time}
                      onChange={(e) =>
                        setNewNotification({
                          ...newNotification,
                          schedule: {
                            ...newNotification.schedule,
                            time: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                )}

                {/* Date preview for non-flash types */}
                {activeNotificationType !== "flash" && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="flex items-center border rounded p-2 bg-white text-xs text-blue-500">
                        <input type="checkbox" className="mr-1" />
                        {getFormattedDate()}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex-1 p-3 border rounded-md bg-gray-50">
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Links
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newNotification.links}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      links: e.target.value,
                    })
                  }
                  placeholder="Add links (optional)"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="flex justify-center mt-4">
              <button className="bg-orange-200 hover:bg-orange-300 text-black font-medium py-8 px-12 rounded-md flex flex-col items-center justify-center transition-colors">
                <Upload className="h-6 w-6 mb-2" />
                UPLOAD IMAGE
              </button>
            </div>
            
            {/* Day selection row for Flash Notification - appears at bottom of form */}
            {activeNotificationType === "flash" && (
              <div className="w-full mt-4 border rounded-md p-2 flex flex-wrap justify-between bg-white">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={newNotification.schedule.days.sunday}
                    onChange={() => handleDayChange('sunday')}
                  />
                  Sunday
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={newNotification.schedule.days.monday}
                    onChange={() => handleDayChange('monday')}
                  />
                  Monday
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={newNotification.schedule.days.tuesday}
                    onChange={() => handleDayChange('tuesday')}
                  />
                  Tuesday
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={newNotification.schedule.days.wednesday}
                    onChange={() => handleDayChange('wednesday')}
                  />
                  Wednesday
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={newNotification.schedule.days.thursday}
                    onChange={() => handleDayChange('thursday')}
                  />
                  Thursday
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={newNotification.schedule.days.friday}
                    onChange={() => handleDayChange('friday')}
                  />
                  Friday
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={newNotification.schedule.days.saturday}
                    onChange={() => handleDayChange('saturday')}
                  />
                  Saturday
                </label>
              </div>
            )}

            {/* Send Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddNotification}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-12 rounded-md text-lg font-medium transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Notifications Tab */}
      {activeMainTab === "scheduled" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Scheduled Notifications</h2>
          
          <div className="space-y-4">
            {!notifications || notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No notifications scheduled
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id || notification.id}
                  className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <div className="flex items-center gap-2">
                      {notification.type === "daily" ? (
                        <Clock className="h-4 w-4 text-blue-500" />
                      ) : notification.type === "festival" ? (
                        <Calendar className="h-4 w-4 text-green-500" />
                      ) : (
                        <Bell className="h-4 w-4 text-orange-500" />
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification._id || notification.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600">{notification.message}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    {/* Show time for all notification types */}
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {notification.schedule.time || "10:00 AM"}
                    </span>
                    
                    {/* Show days for daily notifications */}
                    {notification.type === "daily" && notification.schedule.days && (
                      <span className="flex items-center gap-1 flex-wrap">
                        {Object.entries(notification.schedule.days)
                          .filter(([day, selected]) => selected)
                          .map(([day]) => (
                            <span key={day} className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs">
                              {day.substring(0, 3)}
                            </span>
                          ))}
                      </span>
                    )}
                    
                    {/* Show date for festival/event or custom notifications */}
                    {(notification.type === "festival" || notification.type === "custom") && 
                     notification.schedule.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {notification.schedule.date}
                      </span>
                    )}
                    
                    {/* Show notification type */}
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs capitalize">
                      {notification.type}
                    </span>
                    
                    {/* Show link if available */}
                    {notification.links && (
                      <a 
                        href={notification.links.startsWith('http') ? notification.links : `https://${notification.links}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        Link
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default Notification;