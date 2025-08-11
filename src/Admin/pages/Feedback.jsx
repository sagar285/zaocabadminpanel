import React, { useState } from 'react'
import Sidebar from "../Component/Sidebar";
import { useGetAllFeedbackQuery } from "../Redux/Api";
import moment from "moment";

const Feedback = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data, error } = useGetAllFeedbackQuery()
  const AllFeedback = data?.getAllFB;

  const formatDate = (date) => {
    const momentDate = moment(date);
    const now = moment();
    
    if (momentDate.isSame(now, 'day')) {
      return 'Today at ' + momentDate.format('h:mm A');
    } else if (momentDate.isSame(now.clone().subtract(1, 'day'), 'day')) {
      return 'Yesterday at ' + momentDate.format('h:mm A');
    } else {
      return momentDate.format('MMM D, YYYY [at] h:mm A');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={`flex-1 p-8 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">User Feedback</h1>
        
        <div className="grid gap-6">
          {AllFeedback?.map((feedback, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {feedback.userId?.firstName?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {feedback?.userId?.firstName} {feedback?.userId?.lastName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {feedback?.userId?.phone}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(feedback.createdAt)}
                </span>
              </div>
              
              <div className="ml-13">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {feedback.feedback}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Feedback ID: {feedback._id?.slice(-6)}</span>
                  <span>{moment(feedback.createdAt).fromNow()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {AllFeedback?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No feedback available</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error loading feedback</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;