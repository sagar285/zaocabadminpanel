import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from "../Sidebar";

const MembershipList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { membershipList = [], passengerName = "Passenger" } = location.state || {};
  
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
                  Membership History - {passengerName}
                </h1>
              </div>
              <p className="text-gray-600">
                Total Memberships: {membershipList.length}
              </p>
            </div>

            {/* Membership List */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Membership History ({membershipList.length})
                </h3>
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                  Add New Membership
                </button>
              </div>
              
              <div className="space-y-4">
                {membershipList.map((membership) => (
                  <div key={membership.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h4 className="text-lg font-medium text-gray-900">
                          {membership.type} Membership
                        </h4>
                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                          membership.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {membership.status}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        {membership.amount}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">Start Date:</span>
                          <span className="text-sm text-gray-900">{membership.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">End Date:</span>
                          <span className="text-sm text-gray-900">{membership.endDate}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">Type:</span>
                          <span className="text-sm text-gray-900">{membership.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">Amount:</span>
                          <span className="text-sm text-gray-900">{membership.amount}</span>
                        </div>
                      </div>
                    </div>
                    
                    {membership.status === 'Active' && (
                      <div className="flex gap-3 pt-4 border-t">
                        <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                          Extend Membership
                        </button>
                        <button className="px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors">
                          Upgrade Plan
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors">
                          Cancel Membership
                        </button>
                      </div>
                    )}
                    
                    {membership.status === 'Expired' && (
                      <div className="flex gap-3 pt-4 border-t">
                        <button className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors">
                          Renew Membership
                        </button>
                        <button className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors">
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {membershipList.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🎫</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Membership History</h3>
                  <p className="text-gray-500 mb-6">This passenger doesn't have any membership history yet.</p>
                  <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Add First Membership
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipList;