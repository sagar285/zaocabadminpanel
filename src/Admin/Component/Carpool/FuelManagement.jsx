import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { Search, Plus, Eye, Edit, Trash2, ArrowLeft, Fuel, Car, Truck } from 'lucide-react';
import { 
  // Carpool Fuel APIs
  useAddCarpoolFuelMutation, 
  useGetCarpoolFuelQuery, 
  useDeleteCarpoolFuelMutation, 
  useUpdateCarpoolFuelMutation,
  // General/Normal Trip Fuel APIs
  useAddGeneralFuelMutation, 
  useGetAllGeneralFuelQuery, 
   useDeleteGeneralFuelMutation, 
  useUpdateGeneralFuelMutation,
  
} from '../../Redux/Api.js';

// View Fuel Modal Component (Read-Only)
const ViewFuelModal = ({ isOpen, onClose, fuel, isCarpoolRoute }) => {
  if (!isOpen || !fuel) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
          View {isCarpoolRoute ? 'Carpool' : 'General'} Fuel Details
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Fuel ID</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{fuel._id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Status</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {fuel.status === '1' || fuel.status === 1 ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Fuel Type</label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{fuel.fuelName}</p>
          </div>

          {fuel.orderNo && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Order Number</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{fuel.orderNo}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Storage Category</label>
            <p className={`px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm flex items-center ${
              isCarpoolRoute ? 'text-blue-700' : 'text-green-700'
            }`}>
              {isCarpoolRoute ? <Car className="w-4 h-4 mr-1" /> : <Truck className="w-4 h-4 mr-1" />}
              {isCarpoolRoute ? 'Carpool Fuel' : 'General Trip Fuel'}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Fuel Modal Component
const EditFuelModal = ({ isOpen, onClose, fuel, onSave, isCarpoolRoute }) => {
  const [formData, setFormData] = useState({
    fuelName: '',
    status: ''
  });

  useEffect(() => {
    if (fuel) {
      setFormData({
        fuelName: fuel.fuelName || '',
        status: fuel.status?.toString() || '1'
      });
    }
  }, [fuel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!fuel || !fuel._id) {
      alert('Error: Fuel data is missing. Please try again.');
      return;
    }
    
    const updatedPayload = {
      fuelName: formData.fuelName,
      status: formData.status,
      storageType: isCarpoolRoute ? 'carpool' : 'general'
    };
    
    onSave(fuel._id, updatedPayload);
  };

  if (!isOpen || !fuel) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
          Edit {isCarpoolRoute ? 'Carpool' : 'General'} Fuel Details
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fuel Type</label>
              <select
                value={formData.fuelName}
                onChange={(e) => setFormData({...formData, fuelName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="LPG">LPG</option>
                <option value="Hydrogen">Hydrogen</option>
                <option value="Petrol&CNG">Petrol&CNG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <div className={`p-3 rounded-lg border-2 border-dashed ${
              isCarpoolRoute ? 'border-blue-300 bg-blue-50' : 'border-green-300 bg-green-50'
            }`}>
              <div className="flex items-center justify-center">
                {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
                <span className={`text-sm font-medium ${
                  isCarpoolRoute ? 'text-blue-700' : 'text-green-700'
                }`}>
                  This will be stored as {isCarpoolRoute ? 'Carpool' : 'General Trip'} fuel
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Fuel Modal Component
const AddFuelModal = ({ isOpen, onClose, onSave, isLoading, isCarpoolRoute }) => {
  const [formData, setFormData] = useState({
    orderNo: '',
    fuelName: '',
    status: '1'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add storageType to form data
    const fuelDataWithType = {
      ...formData,
      storageType: isCarpoolRoute ? 'carpool' : 'general'
    };
    
    onSave(fuelDataWithType);
  };

  const resetForm = () => {
    setFormData({ 
      orderNo: '', 
      fuelName: '', 
      status: '1' 
    });
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
          Add {isCarpoolRoute ? 'Carpool' : 'General Trip'} Fuel Type
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Order No.</label>
              <input
                type="text"
                placeholder="Number"
                value={formData.orderNo}
                onChange={(e) => setFormData({...formData, orderNo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Fuel Type</label>
            <select
              value={formData.fuelName}
              onChange={(e) => setFormData({...formData, fuelName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="LPG">LPG</option>
              <option value="Hydrogen">Hydrogen</option>
              <option value="Petrol&CNG">Petrol&CNG</option>
            </select>
          </div>

          <div className={`p-3 rounded-lg border-2 border-dashed mb-4 ${
            isCarpoolRoute ? 'border-blue-300 bg-blue-50' : 'border-green-300 bg-green-50'
          }`}>
            <div className="flex items-center justify-center">
              {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
              <span className={`text-sm font-medium ${
                isCarpoolRoute ? 'text-blue-700' : 'text-green-700'
              }`}>
                This will be stored as {isCarpoolRoute ? 'Carpool' : 'General Trip'} fuel
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              disabled={isLoading}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FuelManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFuelModal, setShowAddFuelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check current route to determine storage type
  const isCarpoolRoute = location.pathname.includes('/carpool');
  
  // Conditional API hooks based on route for separate storage
  const { 
    data: fuelData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = isCarpoolRoute 
    ? useGetCarpoolFuelQuery() 
    : useGetAllGeneralFuelQuery();

  const [addFuel, { isLoading: isAddingFuel }] = isCarpoolRoute 
    ? useAddCarpoolFuelMutation() 
    : useAddGeneralFuelMutation();

  const [deleteFuel, { isLoading: isDeleting }] = isCarpoolRoute 
    ? useDeleteCarpoolFuelMutation() 
    :  useDeleteGeneralFuelMutation();

  const [updateFuel, { isLoading: isUpdating }] = isCarpoolRoute 
    ? useUpdateCarpoolFuelMutation() 
    : useUpdateGeneralFuelMutation();

  const fuels = fuelData?.data || [];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleBackNavigation = () => {
    if (isCarpoolRoute) {
      navigate('/carpool');
    } else {
      navigate('/trips'); // या जो भी trips dashboard हो
    }
  };

  const handleDeleteFuel = async (fuelId) => {
    const confirmMessage = `Are you sure you want to delete this ${isCarpoolRoute ? 'carpool' : 'general'} fuel type?`;
    if (window.confirm(confirmMessage)) {
      try {
        console.log(`Deleting ${isCarpoolRoute ? 'Carpool' : 'General'} Fuel`, fuelId);
        const result = await deleteFuel(fuelId).unwrap();
        console.log("Fuel Deleted Successfully", result);
        refetch();
      } catch (error) {
        console.error("Error deleting fuel:", error);
        alert('Failed to delete fuel type. Please try again.');
      }
    }
  };

  const handleSaveFuel = async (fuelData) => {
    try {
      console.log(`Adding ${isCarpoolRoute ? 'carpool' : 'general'} fuel data:`, fuelData);
      
      const apiData = {
        orderNo: fuelData.orderNo?.toString() || '',
        fuelName: fuelData.fuelName || '',
        status: fuelData.status?.toString() || '1',
        storageType: fuelData.storageType || (isCarpoolRoute ? 'carpool' : 'general')
      };

      console.log('API payload:', apiData);

      const result = await addFuel(apiData).unwrap();
      console.log('Fuel added successfully:', result);
      
      setShowAddFuelModal(false);
      refetch();
      
      alert(`${isCarpoolRoute ? 'Carpool' : 'General'} fuel type added successfully!`);
      
    } catch (error) {
      console.error('Error adding fuel:', error);
      alert(`Failed to add ${isCarpoolRoute ? 'carpool' : 'general'} fuel type: ${error?.data?.message || 'Please try again.'}`);
    }
  };

  const handleEditFuel = async (fuelId, updatedData) => {
    try {
      console.log(`Updating ${isCarpoolRoute ? 'carpool' : 'general'} fuel - ID:`, fuelId, 'Data:', updatedData);
      
      if (!fuelId) {
        throw new Error('Fuel ID is missing');
      }
      
      const payload = {
        fuelName: updatedData.fuelName,
        status: updatedData.status,
        storageType: updatedData.storageType || (isCarpoolRoute ? 'carpool' : 'general')
      };
      
      console.log('Final payload being sent to API:', payload);
      
      const result = await updateFuel({ 
        id: fuelId, 
        body: payload 
      }).unwrap();

      console.log("Fuel updated successfully", result);
      
      setShowEditModal(false);
      setSelectedFuel(null);
      
      await refetch();
      
      alert(`${isCarpoolRoute ? 'Carpool' : 'General'} fuel updated successfully!`);
      
    } catch (err) {
      console.error("Error updating fuel:", err);
      
      let errorMessage = `Failed to update ${isCarpoolRoute ? 'carpool' : 'general'} fuel type.`;
      
      if (err.message === 'Fuel ID is missing') {
        errorMessage = 'Error: Fuel ID is missing. Please try again.';
      } else if (err.status === 404) {
        errorMessage = 'Fuel type not found.';
      } else if (err.status === 400) {
        errorMessage = err.data?.message || 'Invalid data provided. Please check your input.';
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleViewFuel = (fuel) => {
    setSelectedFuel(fuel);
    setShowViewModal(true);
  };

  const handleEditClick = (fuel) => {
    console.log('Edit clicked for fuel:', fuel);
    setSelectedFuel(fuel);
    setShowEditModal(true);
  };

  const filteredFuels = fuels.filter(fuel =>
    fuel.fuelName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                Loading {isCarpoolRoute ? 'carpool' : 'general'} fuel data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
              <p className="text-gray-600 mb-4">
                {error?.message || `Failed to load ${isCarpoolRoute ? 'carpool' : 'general'} fuel data`}
              </p>
              <button 
                onClick={refetch}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCarpoolRoute ? "ml-60" : "ml-60"}`}>
        {/* Header */}
        <div className={`shadow-sm p-6 ${isCarpoolRoute ? 'bg-blue-50' : 'bg-green-50'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackNavigation}
                  className={`flex items-center hover:text-blue-800 ${
                    isCarpoolRoute ? 'text-blue-600' : 'text-green-600'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {isCarpoolRoute ? 'Back to Carpool' : 'Back to Trips'}
                </button>
                <div className="flex items-center space-x-2">
                  {isCarpoolRoute ? (
                    <Car className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Truck className="w-6 h-6 text-green-600" />
                  )}
                  <h1 className={`text-2xl font-bold ${
                    isCarpoolRoute ? 'text-blue-800' : 'text-green-800'
                  }`}>
                    {isCarpoolRoute ? 'Carpool Fuel Management' : 'General Trip Fuel Management'}
                  </h1>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isCarpoolRoute 
                  ? 'bg-blue-200 text-blue-800' 
                  : 'bg-green-200 text-green-800'
              }`}>
                {isCarpoolRoute ? 'Carpool Storage' : 'General Storage'}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4">
                {/* Search and Add Fuel Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder={`Search ${isCarpoolRoute ? 'carpool' : 'general'} fuel types...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 text-sm"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowAddFuelModal(true)}
                    className={`text-white px-5 py-2 rounded-md hover:opacity-90 flex items-center space-x-2 text-sm disabled:opacity-50 ${
                      isCarpoolRoute ? 'bg-blue-600' : 'bg-green-600'
                    }`}
                    disabled={isAddingFuel}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAddingFuel ? 'Adding...' : `Add ${isCarpoolRoute ? 'Carpool' : 'General'} Fuel`}</span>
                  </button>
                </div>

                {/* Fuel Table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse border border-gray-300 min-w-full">
                    <thead>
                      <tr className={isCarpoolRoute ? 'bg-blue-50' : 'bg-green-50'}>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-16">SN</th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-32">Fuel Type</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Status</th>
                        {/* <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Storage</th> */}
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-32">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFuels.length > 0 ? (
                        filteredFuels.map((fuel, index) => (
                          <tr key={fuel._id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-2 text-xs font-medium">{index + 1}</td>
                            <td className="border border-gray-300 px-3 py-2 text-xs font-medium">{fuel.fuelName}</td>
                            <td className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                fuel.status === '1' || fuel.status === 1 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {fuel.status === '1' || fuel.status === 1 ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            {/* <td className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">
                              <span className={`px-2 py-1 rounded-full text-xs flex items-center justify-center ${
                                isCarpoolRoute 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {isCarpoolRoute ? <Car className="w-3 h-3 mr-1" /> : <Truck className="w-3 h-3 mr-1" />}
                                {isCarpoolRoute ? 'CP' : 'GT'}
                              </span>
                            </td> */}
                            <td className="border border-gray-300 px-3 py-2">
                              <div className="flex items-center justify-center space-x-2">
                                <Eye 
                                  className="w-3 h-3 text-gray-600 cursor-pointer hover:text-gray-800" 
                                  onClick={() => handleViewFuel(fuel)}
                                  title="View Details"
                                />
                                <Edit 
                                  className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-800" 
                                  onClick={() => handleEditClick(fuel)}
                                  title="Edit Fuel"
                                />
                                <Trash2 
                                  className="w-3 h-3 text-red-600 cursor-pointer hover:text-red-800" 
                                  onClick={() => handleDeleteFuel(fuel._id)}
                                  title="Delete Fuel"
                                  disabled={isDeleting}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="border border-gray-300 px-3 py-6 text-center text-gray-500 text-sm">
                            No {isCarpoolRoute ? 'carpool' : 'general'} fuel types found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className={`p-3 rounded-lg ${isCarpoolRoute ? 'bg-blue-50' : 'bg-green-50'}`}>
                    <h3 className={`text-xs font-medium ${isCarpoolRoute ? 'text-blue-700' : 'text-green-700'}`}>
                      Total {isCarpoolRoute ? 'Carpool' : 'General'} Fuels
                    </h3>
                    <p className={`text-xl font-bold ${isCarpoolRoute ? 'text-blue-900' : 'text-green-900'}`}>
                      {fuels.length}
                    </p>
                  </div>
                  
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-emerald-700">Active Types</h3>
                    <p className="text-xl font-bold text-emerald-900">
                      {fuels.filter(f => f.status === '1' || f.status === 1).length}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-purple-700">CNG Types</h3>
                    <p className="text-xl font-bold text-purple-900">
                      {fuels.filter(f => f.fuelName === "CNG").length}
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-red-700">Petrol Types</h3>
                    <p className="text-xl font-bold text-red-900">
                      {fuels.filter(f => f.fuelName === "Petrol").length}
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-yellow-700">Diesel Types</h3>
                    <p className="text-xl font-bold text-yellow-900">
                      {fuels.filter(f => f.fuelName === "Diesel").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddFuelModal 
        isOpen={showAddFuelModal}
        onClose={() => setShowAddFuelModal(false)}
        onSave={handleSaveFuel}
        isLoading={isAddingFuel}
        isCarpoolRoute={isCarpoolRoute}
      />

      <ViewFuelModal 
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedFuel(null);
        }}
        fuel={selectedFuel}
        isCarpoolRoute={isCarpoolRoute}
      />

      <EditFuelModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedFuel(null);
        }}
        fuel={selectedFuel}
        onSave={handleEditFuel}
        isCarpoolRoute={isCarpoolRoute}
      />
    </div>
  );
};

export default FuelManagement;