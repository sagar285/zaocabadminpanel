import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  useAddCityinStateMutation, 
  useLazyCityInStateQuery, 
  useGetStateAndCitiesQuery,
  useUpdateCityofStateMutation,
  useGetCityofActiveStateQuery,
  // useDeleteCityMutation // Add this if available
} from "../Redux/Api";
import Sidebar from "../Component/Sidebar";
import AddCityFormComponent from "../Component/AddCityFormComponent";

const CitiesPage = () => {
  const { stateName } = useParams();
  const { data, error } = useGetStateAndCitiesQuery();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [AddCity, setAddCity] = useState(false);
  const [addCityApi] = useAddCityinStateMutation();
  const [updateCityApi] = useUpdateCityofStateMutation();
  // const [deleteCityApi] = useDeleteCityMutation(); // Add this
  const [triggerSearch, { data: searchData }] = useLazyCityInStateQuery();
  
  // Get cities with active/inactive status
  const { data: activeCitiesData, refetch: refetchActiveCities } = useGetCityofActiveStateQuery(stateName);
  
  console.log(searchData, "search data");
  console.log(activeCitiesData, "active cities data");
  
  const [searchTerm, setSearchTerm] = useState("");

  const onClose = () => {
    setAddCity(false);
  }

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      triggerSearch({ name: stateName, searchTerm: value });
    }
  };

  const handleAddCity = async (city) => {
    console.log(`City "${city}" added successfully!`);
    const postData = {
      statename: stateName,
      city
    }

    const { data, error } = await addCityApi(postData);
    console.log(data, error);
    
    if (!error) {
      refetchActiveCities(); // Refresh cities data after adding
      setAddCity(false);
      alert("City added successfully!");
    } else {
      alert("Failed to add city");
    }
  };

  // Handle city status toggle (Active/Deactive)
  const handleStatusToggle = async (cityId, cityName, currentStatus, useNameAsFallback = false) => {
    // Use cityName as identifier when cityId is null/undefined
    const identifier = cityId || cityName;
    const identifierType = cityId ? 'cityId' : 'cityName';

    if (!identifier) {
      alert('Cannot update status - no city identifier available.');
      console.error('No cityId or cityName available');
      return;
    }

    try {
      const requestData = cityId 
        ? { cityId: cityId, isActive: !currentStatus }
        : { cityName: cityName, stateName: stateName, isActive: !currentStatus };

      console.log(`Updating city using ${identifierType}:`, requestData);

      const { data, error } = await updateCityApi(requestData);
      
      if (!error) {
        refetchActiveCities(); // Refresh data
        alert(`${cityName} ${!currentStatus ? 'activated' : 'deactivated'} successfully! (Updated by ${identifierType})`);
      } else {
        alert("Failed to update city status");
        console.error('Update error:', error);
      }
    } catch (error) {
      console.error("Failed to update city status:", error);
      alert("Failed to update city status");
    }
  };

  // Handle city deletion
  const handleDeleteCity = async (cityId, cityName, useNameAsFallback = false) => {
    // Use cityName as identifier when cityId is null/undefined
    const identifier = cityId || cityName;
    const identifierType = cityId ? 'cityId' : 'cityName';

    if (!identifier) {
      alert('Cannot delete city - no city identifier available.');
      console.error('No cityId or cityName available');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${cityName}"? This action cannot be undone.`)) {
      try {
        // Choose API call based on available identifier
        if (cityId) {
          // Use cityId if available
          // const { data, error } = await deleteCityApi(cityId);
          alert(`Delete city by ID: ${cityId} - API not implemented yet`);
        } else {
          // Use cityName and stateName as fallback
          const requestData = { cityName: cityName, stateName: stateName };
          console.log(`Deleting city using ${identifierType}:`, requestData);
          
          // Example API call with cityName
          // const { data, error } = await deleteCityByNameApi(requestData);
          alert(`Delete city by name: ${cityName} in ${stateName} - API not implemented yet`);
        }
        
        // Uncomment when delete API is implemented
        // if (!error) {
        //   refetchActiveCities(); // Refresh data
        //   alert(`${cityName} deleted successfully! (Deleted by ${identifierType})`);
        // } else {
        //   alert("Failed to delete city");
        //   console.error('Delete error:', error);
        // }
      } catch (error) {
        console.error("Failed to delete city:", error);
        alert("Failed to delete city");
      }
    }
  };

  // Handle city edit
  const handleEditCity = (cityId, cityName, useNameAsFallback = false) => {
    // Use cityName as identifier when cityId is null/undefined
    const identifier = cityId || cityName;
    const identifierType = cityId ? 'cityId' : 'cityName';

    if (!identifier) {
      alert('Cannot edit city - no city identifier available.');
      console.error('No cityId or cityName available');
      return;
    }

    // You can implement edit functionality here
    console.log(`Edit city: ${cityName} using ${identifierType}: ${identifier}`);
    
    if (cityId) {
      alert(`Edit functionality for "${cityName}" using ID: ${cityId} - You can implement this!`);
      // Example: navigate(`/edit-city/${cityId}`);
    } else {
      alert(`Edit functionality for "${cityName}" using name in ${stateName} - You can implement this!`);
      // Example: navigate(`/edit-city-by-name/${stateName}/${cityName}`);
    }
  };

  if (error) {
    return <div className="text-red-500">Error loading data!</div>;
  }

  // Find the selected state
  const selectedState = data?.state?.find((state) => state.name === stateName);

  // Use activeCitiesData for displaying cities with status, fallback to selectedState cities
  const displayData = searchTerm.length > 0 
    ? searchData?.cities 
    : (activeCitiesData?.cities || selectedState?.cities);

  // Handle different data structures
// Original array change nahi hoga, new array banegi
const cities = Array.isArray(displayData) ? displayData : [];
const Cities = [...cities].sort((a, b) => 
    a.toLowerCase().localeCompare(b.toLowerCase())
);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className={`flex-1 p-6 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-row justify-between items-center mb-4">
            <div>
              <Link
                to="/"
                className="text-blue-500 hover:underline mb-2 inline-block"
              >
                &larr; Back to States
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">
                Cities in {stateName}
              </h1>
            </div>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              onClick={() => setAddCity(true)}
            >
              Add City
            </button>
          </div>

          {/* Search Input */}
          <div className="w-1/2">
            <input
              type="text"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Cities Table */}
        {selectedState ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Cities.length > 0 ? (
                  Cities.map((city, index) => {
                    // Handle both string array and object array
                    const cityName = typeof city === 'string' ? city : city.name;
                    const cityId = typeof city === 'object' ? (city.id || city._id) : null;
                    const isActive = typeof city === 'object' ? city.isActive : true;
                    
                    // Check if cityId is valid or use default buttons
                    const hasValidId = cityId && cityId !== 'undefined' && cityId !== null;
                    
                    // Debug log to check cityId
                    console.log('City data:', { city, cityId, cityName, isActive, hasValidId });
                    
                    return (
                      <tr key={cityId || `city-${index}`} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cityName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {typeof city === 'object' ? (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {isActive ? 'Active' : 'Inactive'}
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-400 text-gray-800">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {/* Show buttons regardless of cityId validity */}
                          {typeof city === 'object' || typeof city === 'string' ? (
                            <div className="flex space-x-2">
                              {/* Active/Deactive Button with Conditional Styling */}
                              {(typeof city === 'object' && isActive) || typeof city === 'string' ? (
                                // Show Deactivate button with red background when city is active
                                <button
                                  onClick={() => handleStatusToggle(
                                    hasValidId ? cityId : null, 
                                    cityName, 
                                    isActive, 
                                    !hasValidId
                                  )}
                                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                    hasValidId 
                                      ? ' hover:bg-red-600 text-white' 
                                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                                  }`}
                                  title={!hasValidId ? `Will use name: ${cityName}` : `Will use ID: ${cityId}`}
                                >
                                  Deactivate
                                </button>
                              ) : (
                                // Show Activate button with green background when city is inactive
                                <button
                                  onClick={() => handleStatusToggle(
                                    hasValidId ? cityId : null, 
                                    cityName, 
                                    isActive, 
                                    !hasValidId
                                  )}
                                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                    hasValidId 
                                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                                      : 'bg-lime-500 hover:bg-lime-600 text-white'
                                  }`}
                                  title={!hasValidId ? `Will use name: ${cityName}` : `Will use ID: ${cityId}`}
                                >
                                  Activate
                                </button>
                              )}

                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditCity(
                                  hasValidId ? cityId : null, 
                                  cityName, 
                                  !hasValidId
                                )}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                  hasValidId 
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                                }`}
                                title={!hasValidId ? `Will use name: ${cityName}` : `Will use ID: ${cityId}`}
                              >
                                Edit
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteCity(
                                  hasValidId ? cityId : null, 
                                  cityName, 
                                  !hasValidId
                                )}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                  hasValidId 
                                    ? ' hover:bg-red-600 text-white' 
                                    : 'bg-pink-500 hover:bg-pink-600 text-white'
                                }`}
                                title={!hasValidId ? `Will use name: ${cityName}` : `Will use ID: ${cityId}`}
                              >
                                Delete
                              </button>

                              {/* Identifier Type Indicator */}
                             
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">
                              No actions available
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? `No cities found matching "${searchTerm}"` : 'No cities found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">State not found.</div>
        )}

        {/* Summary Cards */}
        {cities.length > 0 && typeof cities[0] === 'object' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Total Cities</div>
              <div className="text-2xl font-semibold text-gray-900">
                {cities.length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-green-600">Active Cities</div>
              <div className="text-2xl font-semibold text-green-900">
                {cities.filter(city => city.isActive).length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-red-600">Inactive Cities</div>
              <div className="text-2xl font-semibold text-red-900">
                {cities.filter(city => !city.isActive).length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add City Modal */}
      {AddCity && (
        <AddCityFormComponent 
          onAddCity={handleAddCity}  
          states={data?.state} 
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default CitiesPage;