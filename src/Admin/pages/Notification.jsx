import React, { useEffect, useState } from "react";
import { Bell, Clock, Calendar, Trash2, Upload, Plus, Loader2 } from "lucide-react";
import {
  useCreateRoleNotificationMutation,
  useDeletenotificationMutation,
  useGetNotificationQuery,
  useUploadNotificationImageMutation,
} from "../Redux/Api";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../Component/Sidebar";
import {
  NOTIFICATION_IMAGE_MAX_MB,
  NOTIFICATION_IMAGE_ACCEPT,
  formatNotificationImageSize,
  validateNotificationImageFile,
} from "../constants/notificationImage";

const Notification = () => {
  const [activeMainTab, setActiveMainTab] = useState("create");
  const [activeNotificationType, setActiveNotificationType] = useState("quick");
  const [notifications, setNotifications] = useState([]);
  const [createRoleNotification] = useCreateRoleNotificationMutation();
  const [targetRole, setTargetRole] = useState("");
  const [uploadNotificationImage] = useUploadNotificationImageMutation();
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSending, setIsSending] = useState(false);

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

      if (!targetRole) {
        toast.error("Please select who should receive this notification");
        return;
      }
      
      // For festival / custom / scheduled flash — date required
      if (
        ["festival", "custom", "flash"].includes(newNotification.type) &&
        !newNotification.oneTime &&
        !newNotification.schedule.date
      ) {
        toast.error("Please select a schedule date");
        return;
      }

      // For daily type, ensure at least one day is selected
      if (newNotification.type === "daily" && 
          !Object.values(newNotification.schedule.days).some(day => day)) {
        toast.error("Please select at least one day of the week");
        return;
      }

      if (
        newNotification.links?.trim() &&
        !/^https?:\/\//i.test(newNotification.links.trim())
      ) {
        toast.error("Image link must start with http:// or https://");
        return;
      }
      
      // Transform data for API if needed
      const apiNotification = {
        ...newNotification,
        role: targetRole,
        schedule: {
          ...newNotification.schedule,
        },
      };

      setIsSending(true);
      const response = await createRoleNotification(apiNotification);
      
      if (response.data) {
        refetch();
        if (response.data?.queuedInBackground) {
          toast.success(
            response.data?.message ||
              "Notification accepted! Delivering to devices in the background."
          );
        } else {
          toast.success("Notification scheduled successfully!");
        }
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
        toast.error(
          "Failed to create notification: " +
            (response.error.data?.error || response.error.data?.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error creating notification:", err);
      toast.error("An error occurred while creating the notification");
    } finally {
      setIsSending(false);
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

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateNotificationImageFile(file);
    if (!validation.ok) {
      toast.error(validation.error);
      event.target.value = "";
      return;
    }

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("notification_image", file);
      const response = await uploadNotificationImage(formData);

      if (response?.data?.imageUrl) {
        setNewNotification((prev) => ({
          ...prev,
          links: response.data.imageUrl,
        }));
        toast.success(
          `Image uploaded (${formatNotificationImageSize(file.size)}, max ${NOTIFICATION_IMAGE_MAX_MB} MB)`
        );
      } else {
        const status = response?.error?.status;
        const apiError = response?.error?.data?.error;
        if (status === 413) {
          toast.error(
            `Upload rejected: file too large for the server. Use JPG or PNG up to ${NOTIFICATION_IMAGE_MAX_MB} MB. If this persists, ask your host to set nginx client_max_body_size to at least 5m.`
          );
        } else {
          toast.error(apiError || "Image upload failed");
        }
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 relative">
          {isSending && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-3 rounded-lg border border-green-200 bg-white px-8 py-6 shadow-lg">
                <Loader2 className="h-10 w-10 animate-spin text-green-500" />
                <p className="text-base font-medium text-gray-800">
                  Sending notification...
                </p>
                <p className="text-sm text-gray-500">
                  Validating and queuing delivery
                </p>
              </div>
            </div>
          )}
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

          {/* Audience / role selection */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-sm font-semibold text-blue-600 mb-3">
              Send to (admin users are excluded)
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "Passenger", label: "Passenger" },
                { value: "driver", label: "Driver" },
                { value: "travelOwner", label: "Travel Owner" },
                { value: "all", label: "All (Passenger + Driver + Travel Owner)" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-colors ${
                    targetRole === option.value
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="targetRole"
                    value={option.value}
                    checked={targetRole === option.value}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

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
                {(activeNotificationType === "festival" ||
                  activeNotificationType === "custom") && (
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

                {activeNotificationType === "quick" && (
                  <p className="text-sm text-green-700 mb-2">
                    Quickly sends immediately to the selected audience when you tap Send.
                  </p>
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
                  placeholder="Image URL — https://... (shown in push notification)"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col items-center mt-4 gap-2">
              <p className="text-sm text-gray-600 text-center">
                JPG, JPEG, or PNG · up to {NOTIFICATION_IMAGE_MAX_MB} MB per image
              </p>
              <label className="cursor-pointer bg-orange-200 hover:bg-orange-300 text-black font-medium py-8 px-12 rounded-md flex flex-col items-center justify-center transition-colors">
                <input
                  type="file"
                  accept={NOTIFICATION_IMAGE_ACCEPT}
                  className="hidden"
                  onChange={handleUploadImage}
                  disabled={isUploadingImage}
                />
                <Upload className="h-6 w-6 mb-2" />
                {isUploadingImage ? "UPLOADING..." : "UPLOAD IMAGE"}
              </label>
              {newNotification.links && (
                <p className="text-xs text-green-700 break-all text-center max-w-md">
                  Image ready: {newNotification.links}
                </p>
              )}
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
                disabled={isSending}
                className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white py-2 px-12 rounded-md text-lg font-medium transition-colors flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
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

                    {notification.role && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs capitalize">
                        To: {notification.role === "all" ? "All users" : notification.role}
                      </span>
                    )}
                    
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