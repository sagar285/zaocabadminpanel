import React, { useState, useMemo } from "react";
import {
  useGetStateAndCitiesQuery,
  useUpdateCityofStateMutation,
  useGetCityofActiveStateQuery,
} from "../Redux/Api";
import { Link } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import { Plus, Edit, Trash2 } from 'lucide-react';

const StateCity = () => {
  const { data, error } = useGetStateAndCitiesQuery();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // State to manage individual state statuses
  const [stateStatuses, setStateStatuses] = useState({});

  const correctItems = useMemo(() => {
    if (!data?.state || !Array.isArray(data.state)) {
      return [];
    }

    return [...data.state].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }, [data?.state]);

  // Initialize state statuses when data loads
  React.useEffect(() => {
    if (correctItems.length > 0) {
      const initialStatuses = {};
      correctItems.forEach((state, index) => {
        // Use state.id if available, otherwise use index
        const stateKey = state.id || index;
        initialStatuses[stateKey] = state.status || 'Active'; // Default to Active if no status
      });
      setStateStatuses(initialStatuses);
    }
  }, [correctItems]);

  console.log(correctItems);

  if (error) {
    return <div className="text-red-500">Error loading data!</div>;
  }

  // Function to toggle individual state status
  const handleStatusToggle = (stateKey) => {
    setStateStatuses(prev => ({
      ...prev,
      [stateKey]: prev[stateKey] === "Active" ? "Deactive" : "Active"
    }));
  };

  // Get status for a specific state
  const getStateStatus = (stateKey) => {
    return stateStatuses[stateKey] || 'Active';
  };

  const handleAddState = () => {
    // Logic to add new state
    console.log('Add new state');
  };

  const handleEditState = (state) => {
    // Logic to edit state
    console.log('Edit state:', state);
  };

  const handleDeleteState = (stateId) => {
    // Logic to delete state
    if (window.confirm('Are you sure you want to delete this state?')) {
      console.log('Delete state with ID:', stateId);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className={`flex-1 p-6 ${isSidebarOpen ? "ml-64" : "ml-20"} space-y-6`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">States</h1>
          <button
            onClick={() => handleAddState()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add State
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  View City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {correctItems?.map((state, index) => {
                const stateKey = state.id || index;
                const currentStatus = getStateStatus(stateKey);
                
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {state.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/state/${state.name}`}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                      >
                        View Cities
                      </Link>
                    </td>

                    {/* Status Display */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        currentStatus === "Active"
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {currentStatus}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        
                        {/* Status Toggle Button */}
                        <button
                          onClick={() => handleStatusToggle(stateKey)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            currentStatus === 'Active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          title={currentStatus === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {currentStatus === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditState(state)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-md transition-colors"
                          title="Edit State"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteState(state.id || index)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors"
                          title="Delete State"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StateCity;