
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { Plus, ArrowLeft, Eye, Edit, Trash2, X, Loader2, Search } from "lucide-react";
import { AddVehicleNameModal } from "./BrandManagement";
import {
  useGetAllCarpoolVechileQuery,
  useGetAllCarpoolBrandQuery,
  useEditCarpoolVechileMutation,
  useDeleteCarpoolVehicleMutation
} from "../../Redux/Api.js";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type] || 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${bgColor} text-white animate-slide-in`}>
      <div className="flex items-center justify-between max-w-sm">
        <span className="pr-4">{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Edit Vehicle Modal Component
const EditVehicleModal = ({ isOpen, onClose, vehicle, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    vehicleName: '',
    status: '1',
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleName: vehicle.vehicleName || '',
        status: vehicle.status?.toString() || '1',
      });
    }
  }, [vehicle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...vehicle,
      vehicleName: formData.vehicleName.trim(),
      status: formData.status,
    });
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Vehicle</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Vehicle Name</label>
              <input
                type="text"
                value={formData.vehicleName}
                onChange={(e) => setFormData({...formData, vehicleName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter vehicle name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand Name</label>
              <input
                type="text"
                value={vehicle.brandName}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled
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

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Vehicle Modal Component
const ViewVehicleModal = ({ isOpen, onClose, vehicle }) => {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Vehicle Name</label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{vehicle.vehicleName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Brand Name</label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{vehicle.brandName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Order No</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{vehicle.orderNo}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Status</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {vehicle.status === 1 || vehicle.status === '1' ? 'Active' : 'Inactive'}
              </p>
            </div>
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

const AddCarpoolVehicle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicleId, brandName } = location.state || {};
  
  const [vehicleNames, setVehicleNames] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  
  // Search functionality states
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  
  console.log(vehicleNames)
  // New states for edit functionality
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [toast, setToast] = useState(null);

  // API Integration for both vehicles and brands
  const {
    data: vehiclesData,
    error: fetchError,
    isLoading: isFetchingVehicles,
    refetch: refetchVehicles,
  } = useGetAllCarpoolVechileQuery();

  console.log(vehiclesData)

  const [deleteVehicle] = useDeleteCarpoolVehicleMutation();
  
  // Add the edit mutation hook
  const [editVehicle, { isLoading: isEditing }] = useEditCarpoolVechileMutation();

  const {
    data: brandsData,
    isLoading: isFetchingBrands,
    refetch: refetchBrands,
  } = useGetAllCarpoolBrandQuery();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Search functionality
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Filter vehicles based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredVehicles(vehicleNames);
    } else {
      const filtered = vehicleNames.filter(vehicle =>
        vehicle.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.orderNo.toString().includes(searchTerm.toLowerCase()) ||
        (vehicle.status === 1 || vehicle.status === '1' ? 'active' : 'inactive').includes(searchTerm.toLowerCase())
      );
      setFilteredVehicles(filtered);
    }
  }, [searchTerm, vehicleNames]);

  // Effect to get vehicle names from brand data
  useEffect(() => {
    if (brandsData && brandsData.data && vehicleId) {
      console.log("Brands Data:", brandsData);
      
      // Find the specific brand by ID
      const currentBrand = brandsData.data.find(brand => brand._id === vehicleId);
        
      if (currentBrand) {
        console.log("Current Brand Found:", currentBrand);
        
        // Get vehicle names from the brand's vehicles array or vehicleName string
        let vehicleArray = [];
        
        // Check if vehicles array exists
        if (currentBrand.vehicles && Array.isArray(currentBrand.vehicles)) {
          vehicleArray = currentBrand.vehicles;
        } 
        // Check if vehicleName string exists (comma-separated)
        // else if (currentBrand.vehicleName) {
        //   vehicleArray = currentBrand.vehicleName
        // }

        console.log("Vehicle Names Array:", vehicleArray);

        // Convert to objects for table display
        const vehicleObjects = vehicleArray.map((vehicleName, index) => ({
          _id: vehicleName._id, // Create unique ID
          vehicleName: vehicleName.name,
          brandName: currentBrand.brandName,
          brandId: currentBrand._id,
          orderNo: index + 1,
          status: currentBrand.status || "1",
          originalIndex: index
        }));

        setVehicleNames(vehicleObjects);
        console.log("Vehicle Objects:", vehicleObjects);
      }
    }
  }, [brandsData, vehicleId]);

  // Handle saving new vehicle
  const handleSaveVehicleName = (vehicleData) => {
    // Refetch both vehicles and brands to get updated list
    refetchVehicles();
    refetchBrands();
    setShowAddVehicleModal(false);
    setSelectedBrand(null);
  };

  // Handle opening add vehicle modal
  const handleAddVehicleName = () => {
    try {
      const brandObject = {
        id: vehicleId,
        brandName: brandName
      };
      setSelectedBrand(brandObject);
      setShowAddVehicleModal(true);
    } catch (error) {
      // showToast(error, 'error');
      console.log(error)
    }
  };

  // Handle view vehicle
  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowViewModal(true);
  };

  // Handle edit vehicle click
  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
  };

  // Handle save edited vehicle
  const handleSaveEditedVehicle = async (updatedVehicle) => {
    try {
      console.log('Updating vehicle:', updatedVehicle);
      
      // Get the brand ID from the vehicle
      const brandId = updatedVehicle.brandId || vehicleId;
      
      // Find the current brand data
      const currentBrand = brandsData.data.find(brand => brand._id === brandId);
      
      if (!currentBrand) {
        throw new Error('Brand not found');
      }

      // Get current vehicle names array
      let vehicleNamesArray = [];
      if (currentBrand.vehicles && Array.isArray(currentBrand.vehicles)) {
        vehicleNamesArray = [...currentBrand.vehicles];
      } else if (currentBrand.vehicleName) {
        vehicleNamesArray = currentBrand.vehicleName
          .split(',')
          .map(name => name.trim())
          .filter(name => name.length > 0);
      }

      // Update the specific vehicle name
      const originalIndex = updatedVehicle.originalIndex;
      if (originalIndex >= 0 && originalIndex < vehicleNamesArray.length) {
        vehicleNamesArray[originalIndex] = updatedVehicle.vehicleName;
      }

      // Prepare the update data
     const updateData = {
  brandName: currentBrand.brandName,
  vehicleName: vehicleNamesArray.join(', '),
  status: updatedVehicle.status,
};

await editVehicle({
  id: brandId,
  updateData: updateData
});

      // Close modal and refresh data
      setShowEditModal(false);
      setSelectedVehicle(null);
      refetchBrands();
      refetchVehicles();
      
      showToast(`Vehicle "${updatedVehicle.vehicleName}" updated successfully!`, 'success');
      
    } catch (error) {
      console.error('Failed to update vehicle:', error);
      showToast(
        error?.data?.message || 'Failed to update vehicle. Please try again.', 
        'error'
      );
    }
  };

  // Handle vehicle deletion
  const handleDeleteVehicle = async (vehicleId) => {
    console.log(vehicleId,"yeh vehicle id aa rhi hai");
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        console.log(vehicleId);

        
        const result = await deleteVehicle(vehicleId);
        console.log('Delete result:', result);
        
        // Refresh data after deletion
        refetchVehicles();
        refetchBrands();
        
        // showToast('Vehicle deleted successfully!', 'success');
        
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        showToast('Error deleting vehicle. Please try again.', 'error');
      }
    }
  };

  // Handle vehicle selection (you can customize this based on your needs)
  const handleSelectVehicle = (vehicle) => {
    console.log("Selected vehicle:", vehicle);
    showToast(`Selected: ${vehicle.vehicleName}`, 'info');
  };

  const isLoading = isFetchingVehicles || isFetchingBrands;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading vehicles...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading vehicles: {fetchError.message}</p>
          <button
            onClick={() => {
              refetchVehicles();
              refetchBrands();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <div className="bg-white shadow-sm p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/carpool/brand-management")}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Vehicle Management
                  </h1>
                  <p className="text-gray-600">Brand Name: {brandName}</p>
                </div>
              </div>
              <button
                onClick={handleAddVehicleName}
                className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-0">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search vehicles by name, brand, order number, or status..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-600">
                Found {filteredVehicles.length} vehicle(s) matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-0">
          {filteredVehicles.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 bg-gray-50 border-b">
                {/* Header content can be added here if needed */}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order No
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
                    {filteredVehicles.map((vehicle, index) => (
                      <tr key={vehicle._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vehicle.vehicleName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.brandName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.brandName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.orderNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              vehicle.status === "1" || vehicle.status === 1
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {vehicle.status === "1" || vehicle.status === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <Eye
                              className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800"
                              onClick={() => handleViewVehicle(vehicle)}
                              title="View Details"
                            />
                            <Edit
                              className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-800"
                              onClick={() => handleEditVehicle(vehicle)}
                              title="Edit Vehicle"
                            />
                            <Trash2
                              className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-800"
                              onClick={() => handleDeleteVehicle(vehicle._id)}
                              title="Delete Vehicle"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-blue-700">
                      {searchTerm ? 'Filtered' : 'Total'} Vehicles
                    </h3>
                    <p className="text-xl font-bold text-blue-900">{filteredVehicles.length}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-green-700">Active Vehicles</h3>
                    <p className="text-xl font-bold text-green-900">
                      {filteredVehicles.filter(v => v.status === "1" || v.status === 1).length}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-gray-700">Inactive Vehicles</h3>
                    <p className="text-xl font-bold text-gray-900">
                      {filteredVehicles.filter(v => v.status === "0" || v.status === 0).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4 flex items-center justify-center text-6xl">
                  {searchTerm ? '🔍' : '🚗'}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No vehicles found' : 'No vehicles found'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? `No vehicles match your search "${searchTerm}". Try a different search term.`
                    : `No vehicle names found for the brand "${brandName}". Add some vehicles to get started.`
                  }
                </p>
                {searchTerm ? (
                  <button
                    onClick={clearSearch}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear Search</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAddVehicleName}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Vehicle</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <AddVehicleNameModal
          brand_id={[{ _id: vehicleId, brandName: brandName }]}
          isOpen={showAddVehicleModal}
          onClose={() => {
            setShowAddVehicleModal(false);
            setSelectedBrand(null);
          }}
          onSave={handleSaveVehicleName}
          selectedBrand={selectedBrand}
          brands={[{ id: vehicleId, brandName: brandName }]}
          localBrands={[{ _id: vehicleId, brandName: brandName }]}
        />
      )}

      {/* Edit Vehicle Modal */}
      <EditVehicleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedVehicle(null);
        }}
        vehicle={selectedVehicle}
        onSave={handleSaveEditedVehicle}
        isLoading={isEditing}
      />

      {/* View Vehicle Modal */}
      <ViewVehicleModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedVehicle(null);
        }}
        vehicle={selectedVehicle}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Add some custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddCarpoolVehicle;
