import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from "../Sidebar";

const FollowersList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { followersList = [], passengerName = "Passenger" } = location.state || {};
  
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`flex-1 p-8 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={handleGoBack}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                  Followers List - {passengerName}
                </h1>
              </div>
              <p className="text-gray-600">
                Total Followers: {followersList.length}
              </p>
            </div>

            {/* Followers List */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Followers ({followersList.length})
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {followersList.map((follower) => (
                  <div key={follower.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{follower.name}</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Phone:</span> {follower.phone}</p>
                      <p><span className="font-medium">Location:</span> {follower.location}</p>
                      <p><span className="font-medium">Joined:</span> {follower.joinDate}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                        View Profile
                      </button>
                      <button className="px-3 py-1.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {followersList.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Followers Yet</h3>
                  <p className="text-gray-500">This passenger doesn't have any followers yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowersList;