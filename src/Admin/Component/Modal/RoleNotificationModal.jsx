import React, { useState } from 'react';
import { Plus, X, Bell, Clock, MessageSquare, Calendar } from 'lucide-react';

const RoleNotificationModal = ({ role, onAdd, openAddModal, setOpenAddModal,newNotification, setNewNotification }) => {
 

  const timePeriodsMap = {
    morning: "05:00-11:59",
    afternoon: "12:00-16:59",
    evening: "17:00-20:59",
    night: "21:00-04:59",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newNotification);
    setOpenAddModal(false);
  };

  if (!openAddModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Create Notification</h2>
          </div>
          <button
            onClick={() => setOpenAddModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span>driver</span>
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={role}
                 readOnly={true}
            
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span>Notification Title</span>
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={newNotification.title}
                onChange={(e) => setNewNotification({
                  ...newNotification,
                  title: e.target.value,
                })}
                placeholder="Enter title"
              />
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span>Message Content</span>
              </label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px]"
                value={newNotification.message}
                onChange={(e) => setNewNotification({
                  ...newNotification,
                  message: e.target.value,
                })}
                placeholder="Enter your message here..."
              />
            </div>

            {/* Time Period Selection */}
            {newNotification.type === "daily" && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>Time Period</span>
                </label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                  value={newNotification.schedule.period}
                  onChange={(e) => setNewNotification({
                    ...newNotification,
                    schedule: {
                      ...newNotification.schedule,
                      period: e.target.value,
                    },
                  })}
                >
                  {Object.entries(timePeriodsMap).map(([period, time]) => (
                    <option key={period} value={period}>
                      {period.charAt(0).toUpperCase() + period.slice(1)} ({time})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Specific Time Input */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Specific Time</span>
              </label>
              <input
                type="time"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={newNotification.schedule.time}
                onChange={(e) => setNewNotification({
                  ...newNotification,
                  schedule: {
                    ...newNotification.schedule,
                    time: e.target.value,
                  },
                })}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer - Fixed */}
        <div className="p-6 border-t bg-gray-50 rounded-b-xl">
          <div className="flex space-x-4">
            <button
              onClick={() => setOpenAddModal(false)}
              className="flex-1 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Notification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleNotificationModal;




