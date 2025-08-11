import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from "../Sidebar";

const FollowingList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { followingList = [], passengerName = "Passenger" } = location.state || {};
  
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
              <div className="flex items-center gap-4 mb-1">
                <button
                  onClick={handleGoBack}
                  className="flex items-center mt-0  text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                  Following List - {passengerName}
                </h1>
              </div>
              <p className="text-gray-600">
                Total Following: {followingList.length}
              </p>
            </div>

            {/* Following List */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Following ({followingList.length})
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {followingList.map((following) => (
                  <div key={following.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{following.name}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Following
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Phone:</span> {following.phone}</p>
                      <p><span className="font-medium">Location:</span> {following.location}</p>
                      <p><span className="font-medium">Started:</span> {following.joinDate}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="px-3 py-1.5 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors">
                        View Profile
                      </button>
                      <button className="px-3 py-1.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors">
                        Unfollow
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {followingList.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">👤</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Not Following Anyone</h3>
                  <p className="text-gray-500">This passenger is not following anyone yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowingList;