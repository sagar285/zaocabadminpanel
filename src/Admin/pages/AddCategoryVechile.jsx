import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Component/Sidebar.jsx";
import { Plus, ArrowLeft, Eye, Edit, Trash2, X, Loader2 } from "lucide-react";
import {
  useCreateCategoryAddVechileMutation,
  useEditVechileCategoryMutation,
  useGetAllVehicleCategoryQuery,
  useGetCategoryAllVehicleQuery,
  useDeleteCategoryAddVehicleMutation,
  useEditCategoryAddVehicleMutation // ✅ Correct edit mutation
} from "../Redux/Api.js";

// Toast Component (same as before)
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
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
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

// Enhanced Add Vehicle Button Component (same as before)
const EnhancedAddVehicleButton = ({ 
  onClick, 
  isLoading, 
  vehicleCount, 
  categoryName, 
  isDisabled = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    if (vehicleCount === 0) return 'Add First Vehicle';
    return 'Add Another Vehicle';
  };

  const getButtonIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    return <Plus className="w-4 h-4" />;
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={isLoading || isDisabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          bg-green-600 text-white px-5 py-2 rounded-md flex items-center space-x-2 text-sm
          transition-all duration-200 transform
          ${isLoading || isDisabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-green-700 hover:shadow-lg hover:scale-105 active:scale-95'
          }
          ${isHovered && !isLoading && !isDisabled ? 'shadow-lg' : ''}
        `}
      >
        {getButtonIcon()}
        <span className="font-medium">{getButtonText()}</span>
        {vehicleCount > 0 && !isLoading && (
          <span className="ml-1 px-2 py-1 bg-green-500 rounded-full text-xs">
            +{vehicleCount}
          </span>
        )}
      </button>
      
      {/* Tooltip */}
      {isHovered && !isLoading && !isDisabled && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50">
          Add vehicle to "{categoryName}" category
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

// Add Vehicle Modal (same as before)
const AddCategoryVehicleModal = ({ isOpen, onClose, onSave, isLoading, category }) => {
  const [formData, setFormData] = useState({
    vehicleName: '',
    status: '1',
    description: '',
  
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ vehicleName: '', status: '1', description: ''});
      setValidationErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.vehicleName.trim()) {
      errors.vehicleName = 'Vehicle name is required';
    } else if (formData.vehicleName.trim().length < 2) {
      errors.vehicleName = 'Vehicle name must be at least 2 characters';
    } else if (formData.vehicleName.trim().length > 50) {
      errors.vehicleName = 'Vehicle name must be less than 50 characters';
    }

    if (formData.description && formData.description.length > 200) {
      errors.description = 'Description must be less than 200 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave({
        vehicleName: formData.vehicleName.trim(),
        status: formData.status,
        description: formData.description.trim(),
        categoryId: category?.id
      });
    } catch (error) {
      console.error('Error in modal submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isLoading) {
      setFormData({ vehicleName: '', status: '1', description: ''});
      setValidationErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add Vehicle to Category</h2>
          {!isSubmitting && !isLoading && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Category:</span> {category?.categoryName}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Vehicle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter vehicle name (e.g., Swift, Baleno, Creta)"
                value={formData.vehicleName}
                onChange={(e) => {
                  setFormData({...formData, vehicleName: e.target.value});
                  if (validationErrors.vehicleName) {
                    setValidationErrors(prev => ({...prev, vehicleName: null}));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  validationErrors.vehicleName 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
                disabled={isLoading || isSubmitting}
                maxLength={50}
              />
              {validationErrors.vehicleName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.vehicleName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading || isSubmitting}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (Optional)
                <span className="text-gray-400 text-xs ml-1">
                  ({formData.description.length}/200)
                </span>
              </label>
              <textarea
                placeholder="Enter vehicle description"
                value={formData.description}
                onChange={(e) => {
                  setFormData({...formData, description: e.target.value});
                  if (validationErrors.description) {
                    setValidationErrors(prev => ({...prev, description: null}));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors resize-none ${
                  validationErrors.description 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                rows="3"
                disabled={isLoading || isSubmitting}
                maxLength={200}
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              disabled={isLoading || isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center transition-colors disabled:opacity-50"
              disabled={isLoading || isSubmitting || !formData.vehicleName.trim()}
            >
              {(isLoading || isSubmitting) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading || isSubmitting ? 'Adding Vehicle...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ✅ Updated Edit Vehicle Modal with proper API integration
const EditVehicleModal = ({ isOpen, onClose, vehicle, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    vehicleName: '',
    status: '1',
    description: '',
    // vehicleIcon: '',
    // brandName: '',
    seats: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleName: vehicle.vehicleName || '',
        status: vehicle.status?.toString() || '1',
        description: vehicle.description || '',
        // vehicleIcon: vehicle.vehicleIcon || 
        // brandName: vehicle.brandName || '',
        seats: vehicle.seats || ''
      });
      setValidationErrors({});
    }
  }, [vehicle]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.vehicleName.trim()) {
      errors.vehicleName = 'Vehicle name is required';
    } else if (formData.vehicleName.trim().length < 2) {
      errors.vehicleName = 'Vehicle name must be at least 2 characters';
    } else if (formData.vehicleName.trim().length > 50) {
      errors.vehicleName = 'Vehicle name must be less than 50 characters';
    }

    if (formData.description && formData.description.length > 200) {
      errors.description = 'Description must be less than 200 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // ✅ Prepare data for the edit API
    const updateData = {
      vehicleName: formData.vehicleName.trim(),
      status: formData.status,
      description: formData.description.trim(),
      // vehicleIcon: formData.vehicleIcon,
      // brandName: formData.brandName,
      seats: formData.seats
    };

    console.log('Updating vehicle with data:', updateData);
    onSave(vehicle._id, updateData);
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit Vehicle</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Vehicle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.vehicleName}
                onChange={(e) => {
                  setFormData({...formData, vehicleName: e.target.value});
                  if (validationErrors.vehicleName) {
                    setValidationErrors(prev => ({...prev, vehicleName: null}));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  validationErrors.vehicleName 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
                placeholder="Enter vehicle name"
                disabled={isLoading}
                maxLength={50}
              />
              {validationErrors.vehicleName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.vehicleName}</p>
              )}
            </div>

            {/* <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
                disabled={isLoading}
              />
            </div> */}

            {/* <div>
              <label className="block text-sm font-medium mb-2">Seats</label>
              <input
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({...formData, seats: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter number of seats"
                disabled={isLoading}
                min="1"
                max="50"
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {/* <div>
              <label className="block text-sm font-medium mb-2">Vehicle Icon</label>
              <input
                type="text"
                value={formData.vehicleIcon}
                onChange={(e) => setFormData({...formData, vehicleIcon: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter vehicle icon (emoji)"
                disabled={isLoading}
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
                <span className="text-gray-400 text-xs ml-1">
                  ({formData.description.length}/200)
                </span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({...formData, description: e.target.value});
                  if (validationErrors.description) {
                    setValidationErrors(prev => ({...prev, description: null}));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none ${
                  validationErrors.description 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                rows="3"
                disabled={isLoading}
                maxLength={200}
                placeholder="Enter vehicle description"
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center transition-colors disabled:opacity-50"
              disabled={isLoading || !formData.vehicleName.trim()}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Vehicle Modal (same as before)
const ViewVehicleModal = ({ isOpen, onClose, vehicle }) => {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Vehicle Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Vehicle Name</label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium">
              {vehicle.vehicleName}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Category Name</label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
              {vehicle.brandName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Vehicle Icon</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-center text-2xl">
                {vehicle.vehicleIcon}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Seats</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {vehicle.seats} seater
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Status</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  vehicle.status === 1 || vehicle.status === '1'
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {vehicle.status === 1 || vehicle.status === '1' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {vehicle.description && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Description</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {vehicle.description}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Main Component with proper edit integration
const AddCategoryVehicle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId, categoryName, seats } = location.state || {};
  
  const [vehicleNames, setVehicleNames] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [toast, setToast] = useState(null);

  // API Integration
  const {
    data: categoriesD,
    error: fetchError,
    isLoading: isFetchingCategories,
    refetch: refetchCategories,
  } = useGetAllVehicleCategoryQuery();

  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryAddVehicleMutation();
  
  const {
    data: categoriesDataa,
    error: fetchErro,
    isLoading: isFetchingCategorie,
    refetch: refetchCategorie,
  } = useGetCategoryAllVehicleQuery();

  // ✅ Correct edit mutation hook
  const [editVehicle, { isLoading: isEditing }] = useEditCategoryAddVehicleMutation();
  const [addCategory, { isLoading: isAdding }] = useCreateCategoryAddVechileMutation();

  const categoriesData = categoriesD?.categories;
  console.log('All vehicles data:', categoriesDataa);

  // Redirect if no category info
  useEffect(() => {
    if (!categoryId || !categoryName) {
      navigate("/vechile-category");
    }
  }, [categoryId, categoryName, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Effect to set vehicle names from categoriesDataa
  useEffect(() => {
    if (categoriesDataa && Array.isArray(categoriesDataa)) {
      setVehicleNames(categoriesDataa);
    }
  }, [categoriesDataa]);

  // Enhanced handleSaveVehicleName with better error handling
  const handleSaveVehicleName = async (vehicleData) => {
    try {
      console.log('Adding vehicle to category:', vehicleData);
      
      // Validation
     
      // Show loading toast
      showToast('Adding vehicle...', 'info');

      // Prepare data for API
      const apiData = {
        vehicleName: vehicleData.vehicleName,
        status: vehicleData.status,
        description: vehicleData.description || '',
        brandName: categoryName,
        seats: seats
      };

      console.log('Sending to API:', apiData);
      
      await addCategory(apiData);
      
      refetchCategorie(); // Refresh vehicle list
      setShowAddVehicleModal(false);
      showToast(`Vehicle "${vehicleData.vehicleName}" added successfully!`, 'success');
      
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      showToast(
        error?.data?.message || 'Failed to add vehicle. Please try again.', 
        'error'
      );
    }
  };

  // Enhanced handleAddVehicleName function
  const handleAddVehicleName = () => {
    try {
      if (!categoryId || !categoryName) {
        showToast('Category information is missing. Please go back and try again.', 'error');
        return;
      }

      const categoryObject = {
        id: categoryId,
        categoryName: categoryName
      };
      
      setShowAddVehicleModal(true);
      
    } catch (error) {
      console.error('Error opening add vehicle modal:', error);
      showToast('Error opening add vehicle form. Please try again.', 'error');
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

  // ✅ Updated handleSaveEditedVehicle with proper API integration
  const handleSaveEditedVehicle = async (vehicleId, updatedData) => {
    try {
      console.log('Updating vehicle:', vehicleId, updatedData);
      
      // Validation
      if (!updatedData.vehicleName || !updatedData.vehicleName.trim()) {
        showToast('Vehicle name is required!', 'error');
        return;
      }

      // Check for duplicate vehicle names (excluding current vehicle)
      const isDuplicate = categoriesDataa?.some(
        vehicle => vehicle._id !== vehicleId && 
        vehicle.vehicleName.toLowerCase() === updatedData.vehicleName.trim().toLowerCase()
      );

      if (isDuplicate) {
        showToast(`Vehicle name "${updatedData.vehicleName}" already exists!`, 'error');
        return;
      }

      showToast('Updating vehicle...', 'info');


      const apis = {
     vehicleId, 
        ...updatedData   
          }


        console.log("dhnnnnnnnnnnn",apis)
      // ✅ Call the correct edit API
      const result = await editVehicle({ 
        id: vehicleId, 
        updatedData 
      })
      
      console.log('Edit API response:', result);

      setShowEditModal(false);
      setSelectedVehicle(null);
      
      // Refresh the vehicle list
      refetchCategorie();
      
      showToast(`Vehicle "${updatedData.vehicleName}" updated successfully!`, 'success');
      
    } catch (error) {
      console.error('Failed to update vehicle:', error);
      
      let errorMessage = 'Failed to update vehicle. Please try again.';
      
      if (error?.status === 404) {
        errorMessage = 'Vehicle not found. It may have been deleted.';
      } else if (error?.status === 400) {
        errorMessage = error?.data?.message || 'Invalid data provided.';
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }
      
      showToast(errorMessage, 'error');
    }
  };

  // Handle vehicle deletion
  const handleDeleteVehicle = async (vehicleId) => {
    const vehicleToDelete = categoriesDataa?.find(v => v._id === vehicleId);
    const vehicleName = vehicleToDelete?.vehicleName || 'this vehicle';
    
    if (window.confirm(`Are you sure you want to delete "${vehicleName}"?`)) {
      try {
        console.log('Deleting vehicle:', vehicleId);
        
        showToast('Deleting vehicle...', 'info');
        
        await deleteCategory(vehicleId).unwrap();
        
        refetchCategorie(); // Refresh vehicle list
        showToast(`Vehicle "${vehicleName}" deleted successfully!`, 'success');
        
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        
        let errorMessage = 'Error deleting vehicle. Please try again.';
        
        if (error?.status === 404) {
          errorMessage = 'Vehicle not found. It may have been already deleted.';
        } else if (error?.data?.message) {
          errorMessage = error.data.message;
        }
        
        showToast(errorMessage, 'error');
      }
    }
  };

  // Handle back to category with refresh
  const handleBackToCategory = () => {
    navigate("/vechile-category", { 
      state: { 
        refresh: true, 
        updatedCategoryId: categoryId 
      } 
    });
  };

  const isLoading = isFetchingCategorie;

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

  if (fetchErro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading vehicles: {fetchErro.message}</p>
          <button
            onClick={() => refetchCategorie()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!categoryId || !categoryName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Category information not found</p>
          <button
            onClick={() => navigate("/vechile-category")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <div className="bg-white shadow-sm p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToCategory}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Categories
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Vehicle Management
                  </h1>
                  <p className="text-gray-600">
                    Category: <span className="font-medium text-blue-600">{categoryName}</span> 
                    ({seats} seater)
                  </p>
                </div>
              </div>
              
              {/* Enhanced Add Vehicle Button */}
              <EnhancedAddVehicleButton
                onClick={handleAddVehicleName}
                isLoading={isAdding}
                vehicleCount={categoriesDataa?.length || 0}
                categoryName={categoryName}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {categoriesDataa?.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm">
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
                        Category Name
                      </th>
                    
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seats
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
                    {categoriesDataa?.map((vehicle, index) => (
                      <tr key={vehicle._id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vehicle?.vehicleName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle?.brandName}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle?.seats} seater
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              vehicle?.status === "1" || vehicle?.status === 1
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {vehicle?.status === "1" || vehicle?.status === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <Eye
                              className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
                              onClick={() => handleViewVehicle(vehicle)}
                              title="View Details"
                            />
                            <Edit
                              className={`w-4 h-4 cursor-pointer transition-colors ${
                                isEditing 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-blue-600 hover:text-blue-800'
                              }`}
                              onClick={() => !isEditing && handleEditVehicle(vehicle)}
                              title={isEditing ? "Updating..." : "Edit Vehicle"}
                            />
                            <Trash2
                              className={`w-4 h-4 cursor-pointer transition-colors ${
                                isDeleting 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-red-600 hover:text-red-800'
                              }`}
                              onClick={() => !isDeleting && handleDeleteVehicle(vehicle._id)}
                              title={isDeleting ? "Deleting..." : "Delete Vehicle"}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Summary Stats */}
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-blue-700">Total Vehicles</h3>
                    <p className="text-xl font-bold text-blue-900">{categoriesDataa?.length || 0}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-green-700">Active Vehicles</h3>
                    <p className="text-xl font-bold text-green-900">
                      {categoriesDataa?.filter(v => v.status === "1" || v.status === 1).length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-gray-700">Category Seats</h3>
                    <p className="text-xl font-bold text-gray-900">{seats} seater</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4 flex items-center justify-center text-6xl">
                  🚗
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-500 mb-6">
                  No vehicles found for category "<span className="font-medium text-blue-600">{categoryName}</span>". 
                  Add some vehicles to get started.
                </p>
                <EnhancedAddVehicleButton
                  onClick={handleAddVehicleName}
                  isLoading={isAdding}
                  vehicleCount={0}
                  categoryName={categoryName}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modals */}
      <AddCategoryVehicleModal
        isOpen={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        onSave={handleSaveVehicleName}
        isLoading={isAdding}
        category={{ id: categoryId, categoryName: categoryName }}
      />

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

      {/* Custom CSS for animations */}
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

export default AddCategoryVehicle;