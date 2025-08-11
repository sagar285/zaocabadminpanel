import React, { useState } from "react";
import { useGetTripsAdminModelQuery, useGetTripsQuery, useLazyAdminsearchTripsQuery } from "../Redux/Api";
import Sidebar from "../Component/Sidebar";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from 'lucide-react';

const AdminTrips = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data, error } = useGetTripsQuery();
  const { data: AdminTrips, error: AdminTripsError } = useGetTripsAdminModelQuery();
  const [triggerSearch, { data: searchData }] = useLazyAdminsearchTripsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // City dropdown states - हर trip के लिए अलग state
  const [cityDropdownStates, setCityDropdownStates] = useState({});
  const [cityInputs, setCityInputs] = useState({});
  const [addedCities, setAddedCities] = useState({
    pickup: [],
    drop: []
  });
  
  const navigate = useNavigate();
console.log({data})
  console.log({ AdminTrips });

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      triggerSearch(value);
    }
  };

  // City dropdown change handler
  const handleCityDropdownChange = (tripId, value) => {
    setCityDropdownStates(prev => ({
      ...prev,
      [tripId]: value
    }));
    
    // Reset input when dropdown changes
    setCityInputs(prev => ({
      ...prev,
      [tripId]: { ...prev[tripId], [value]: '' }
    }));
  };

  // City input change handler
  const handleCityInputChange = (tripId, cityType, value) => {
    setCityInputs(prev => ({
      ...prev,
      [tripId]: {
        ...prev[tripId],
        [cityType]: value
      }
    }));


  };


 

  // Add city API call
  const handleAddCity = async (tripId) => {
    const selectedOption = cityDropdownStates[tripId];
    const cityValue = cityInputs[tripId]?.[selectedOption] || '';


   
    
    if (!selectedOption || !cityValue.trim()) {
      alert('Please select option and enter city name');
      return;
    }

    // Check if city already exists
    if (addedCities[selectedOption].includes(cityValue.trim())) {
      alert('City already exists!');
      return;
    }

    const cityData = {
      tripId: tripId,
      type: selectedOption,
      city: cityValue.trim()
    };

    console.log(cityData);
    
    
    console.log('City data to send to API:', cityData);
    console.log(cityData);


    
    // यहाँ आपका API call
    try {
      // const response = await fetch('/api/add-city', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(cityData)
      // });
      // const result = await response.json();
      // console.log('API Response:', result);
      
      // City को dropdown options में add करें
      setAddedCities(prev => ({
        ...prev,
        [selectedOption]: [...prev[selectedOption], cityValue.trim()]
      }));
      
      // Input और dropdown state reset करें
      setCityDropdownStates(prev => ({
        ...prev,
        [tripId]: ''
      }));
      setCityInputs(prev => ({
        ...prev,
        [tripId]: {}
      }));
      
      alert(`${selectedOption} city "${cityValue}" added successfully!`);
      
    } catch (error) {
      console.error('Error adding city:', error);
      alert('Error adding city. Please try again.');
    }
  };

  const handleEdit = (tripId) => {
    console.log('Edit trip:', tripId);
    // Navigate to edit page
    navigate(`/edit-trip/${tripId}`);
  };

  const handleView = (tripId) => {
    console.log('View trip:', tripId);
    navigate(`/trip/${tripId}`);
  };

  const handleDelete = (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      // Add delete functionality here
      console.log('Delete trip:', tripId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };






  
  //  const cityValue = '' || cityInputs[tripId]?.[selectedOption];
  // console.log(cityValue);
  

  const displayData = searchTerm.length > 0 ? searchData?.trips : AdminTrips?.trips;

  const filteredData = displayData?.filter(item =>
    item.tripType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vehicleCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.FareStatus?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex min-h-screen bg-pink-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 p-6`}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Controls Header */}
          <div className="p-4 bg-white border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="bg-cyan-400 text-white px-4 py-2 rounded text-sm font-medium">
                    Show {showEntries} ∨
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="SEARCH"
                    className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="bg-cyan-400 text-white px-4 py-2 rounded font-medium hover:bg-cyan-500 transition-colors"
                >
                  Select Filter
                </button>
                <button
                  onClick={() => navigate("/addFare")}
                  className="bg-green-500 text-white px-4 py-2 rounded font-medium hover:bg-green-600 transition-colors flex items-center space-x-1"
                >
                  <span>+ ADD Fare</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error handling */}
          {(error || AdminTripsError) && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500">
              <p className="text-red-500 text-sm">
                Failed to load trips: {error?.message || AdminTripsError?.message}
              </p>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">S.N</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">Order NO</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">Package Type</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">Trip Type</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">Vehicle Category</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">Pickup City</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">Pickup State</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">Drop City</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">Drop State</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">Fare Status</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">Fare Details</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">Commision</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, showEntries).map((trip, index) => (
                  <tr key={trip._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3 border text-xs">{String(index + 1).padStart(2, '0')}</td>
                    <td className="px-3 py-3 border text-xs">{String(filteredData.length - index).padStart(2, '0')}</td>
                    <td className="px-3 py-3 border text-xs">
                      
                    </td>
                    <td className="px-3 py-3 border text-xs">{trip.tripType || '-'}</td>
                    <td className="px-3 py-3 border text-xs">{trip.vehicleCategory || '-'}</td>
                    
                    <td className="px-3 py-3 border text-xs">
                      <span className='px-2 py-1 rounded text-xs font-medium'>
                        
                      </span>
                    </td>
                    <td className="px-3 py-3 border text-xs">
                    </td>
                    <td className="px-3 py-3 border text-xs">
                    </td>
                    <td className="px-3 py-3 border text-xs"></td>
                    <td className={`px-3 py-3 border text-xs ${trip.FareStatus ==='Active'?'text-green-600':'bg-red-200'}`}>
                      {trip.FareStatus}
                    </td>

                    <td className="px-3 py-3 border text-xs">
                      <div className="space-y-1">
                        <div>Type: {trip.bookingFeeType || '-'}</div>
                        <div>Fee: ₹{trip.bookingFee || 0}</div>
                        <div>Range: {trip.beeokingfeeFromKm || 0}-{trip.beeokingfeeToKm || 0}km</div>
                      </div>                      
                    </td>
                    <td className="px-3 py-3 border text-xs">
                      <div className="space-y-1">
                        <div>Type: {trip.bookingFeeType || '-'}</div>
                        <div>Fee: ₹{trip.bookingFee || 0}</div>
                        <div>Range: {trip.beeokingfeeFromKm || 0}-{trip.beeokingfeeToKm || 0}km</div>
                      </div>
                    </td>
                  
                    <td className="px-3 py-3 border">
                      <div className="flex flex-col space-y-2">
                        
                        {/* City Dropdown */}
                        <select 
                          className="text-black text-xs p-1 border rounded"
                          value={cityDropdownStates[trip._id] || ''}
                          onChange={(e) => handleCityDropdownChange(trip._id, e.target.value)}
                        >
                          <option value="" disabled>Add City</option>
                          <option value="pickup">PickUp City</option>
                          <option value="drop">Drop City</option>
                          
                          {/* Separator */}
                          {(addedCities.pickup.length > 0 || addedCities.drop.length > 0) && (
                            <option disabled>──────────</option>
                          )}
                          
                          {/* Added Pickup Cities */}
                          {addedCities.pickup.length > 0 && (
                            <optgroup label="Pickup Cities">
                              {addedCities.pickup.map((city, index) => (
                                <option key={`pickup-${index}`} value={city}>
                                  📍 {city}
                                </option>
                              ))}
                            </optgroup>
                          )}
                          
                          {/* Added Drop Cities */}
                          {addedCities.drop.length > 0 && (
                            <optgroup label="Drop Cities">
                              {addedCities.drop.map((city, index) => (
                                <option key={`drop-${index}`} value={city}>
                                  🏁 {city}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>

                        {/* Conditional Input Box - केवल तब दिखेगा जब "pickup" या "drop" option select हो */}
                        {(cityDropdownStates[trip._id] === 'pickup' || cityDropdownStates[trip._id] === 'drop') && (
                          <div className="space-y-1">
                            <input
                              type="text"
                              placeholder={`Enter ${cityDropdownStates[trip._id]} city`}
                              className="w-full text-xs p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                              value={cityInputs[trip._id]?.[cityDropdownStates[trip._id]] || ''}
                              onChange={(e) => handleCityInputChange(trip._id, cityDropdownStates[trip._id], e.target.value)}
                            />
                            
                            {/* Add City Button */}
                            {cityInputs[trip._id]?.[cityDropdownStates[trip._id]]?.trim() && (
                              <button
                                onClick={() => handleAddCity(trip._id)}
                                className="w-full bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600 transition-colors"
                              >
                                Add {cityDropdownStates[trip._id]} City
                              </button>
                            )}
                          </div>
                        )}

                        {/* Selected City Display - जब कोई added city select हो */}
                        {cityDropdownStates[trip._id] && 
                         cityDropdownStates[trip._id] !== 'pickup' && 
                         cityDropdownStates[trip._id] !== 'drop' && (
                          <div className="bg-green-50 border border-green-200 p-2 rounded">
                            <div className="text-xs text-green-700 font-medium">
                              Selected: {cityDropdownStates[trip._id]}
                            </div>
                            <button
                              onClick={() => setCityDropdownStates(prev => ({...prev, [trip._id]: ''}))}
                              className="mt-1 text-xs text-red-500 hover:text-red-700"
                            >
                              Clear Selection
                            </button>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(trip._id)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleView(trip._id)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="View"
                          >
                            <Eye size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(trip._id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan="13"
                      className="py-8 px-6 text-center text-gray-500 text-sm"
                    >
                      No trips available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {Math.min(showEntries, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Select Filters</h2>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Trip Types</option>
                    <option value="One-Way">One-Way</option>
                    <option value="Round Trip">Round Trip</option>
                    <option value="Local">Local</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Vehicle Categories</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Mini">Mini</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fare Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-cyan-400 text-white rounded-md hover:bg-cyan-500"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTrips;