import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Calendar,
  Car,
  Truck
} from "lucide-react";
import {
  // Carpool Year APIs
  useAddCarpoolYearsMutation,
  useGetCarpoolYearsQuery,
  useDeleteCarpoolYearMutation,
  useUpdateCarpoolYearMutation,
  // General Year APIs (you need to add these to Redux/Api.js)
  // useAddGeneralYearMutation,
  // useGetAllGeneralYearQuery,
  // useDeleteGeneralYearMutation,
  // useUpdateGeneralYearMutation,
  useAddGeneralYearMutation,
  useGetAllGeneralYearQuery,
  useUpdateGeneralYearMutation,
  useDeleteGeneralYearMutation
} from "../../Redux/Api";

// View Year Modal Component (Read-Only)
const ViewYearModal = ({ isOpen, onClose, year, isCarpoolRoute }) => {
  if (!isOpen || !year) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
          View {isCarpoolRoute ? 'Carpool' : 'General'} Year Details
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Order No
              </label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {year.orderNo}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Status
              </label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {year.status === 1 ? "Active" : "De-active"}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Vehicle Model Year
            </label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
              {year.vehicleModelYear}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Storage Category</label>
            <p className={`px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm flex items-center ${
              isCarpoolRoute ? 'text-blue-700' : 'text-green-700'
            }`}>
              {isCarpoolRoute ? <Car className="w-4 h-4 mr-1" /> : <Truck className="w-4 h-4 mr-1" />}
              {isCarpoolRoute ? 'Carpool Year' : 'General Trip Year'}
            </p>
          </div>

          {year.keyFeatures && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Key Features
              </label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {year.keyFeatures}
              </p>
            </div>
          )}
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

// Edit Year Modal Component
const EditYearModal = ({ isOpen, onClose, year, onSave, isUpdating, isCarpoolRoute }) => {
  const [formData, setFormData] = useState({
    orderNo: "",
    vehicleModelYear: "",
    status: 1,
    description: "",
    era: "",
    generation: "",
    technologyLevel: "",
    safetyRating: "",
    marketValue: "",
    availability: "",
    keyFeatures: "",
  });

  useEffect(() => {
    if (year) {
      setFormData({
        orderNo: year.orderNo || "",
        vehicleModelYear: year.vehicleModelYear || "",
        status: year.status || 1,
        description: year.description || "",
        era: year.era || "",
        generation: year.generation || "",
        technologyLevel: year.technologyLevel || "",
        safetyRating: year.safetyRating || "",
        marketValue: year.marketValue || "",
        availability: year.availability || "",
        keyFeatures: year.keyFeatures || "",
      });
    }
  }, [year]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const apiData = {
      id: year.id,
      orderNo: parseInt(formData.orderNo),
      vehicleModelYear: parseInt(formData.vehicleModelYear),
      status: parseInt(formData.status),
      storageType: isCarpoolRoute ? 'carpool' : 'general'
    };
    
    onSave(apiData);
  };

  if (!isOpen || !year) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
          Edit {isCarpoolRoute ? 'Carpool' : 'General'} Year Details
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Order No
                </label>
                <input
                  type="number"
                  value={formData.orderNo}
                  onChange={(e) =>
                    setFormData({ ...formData, orderNo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={1}>Active</option>
                  <option value={0}>De-active</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Vehicle Model Year
              </label>
              <input
                type="number"
                min="1900"
                max="2030"
                value={formData.vehicleModelYear}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleModelYear: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className={`p-3 rounded-lg border-2 border-dashed ${
              isCarpoolRoute ? 'border-blue-300 bg-blue-50' : 'border-green-300 bg-green-50'
            }`}>
              <div className="flex items-center justify-center">
                {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
                <span className={`text-sm font-medium ${
                  isCarpoolRoute ? 'text-blue-700' : 'text-green-700'
                }`}>
                  This will be stored as {isCarpoolRoute ? 'Carpool' : 'General Trip'} year
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Year Modal Component
const AddYearModal = ({ isOpen, onClose, onSave, isAdding, isCarpoolRoute }) => {
  const [formData, setFormData] = useState({
    orderNo: "",
    vehicleModelYear: "",
    status: 1,
    description: "",
    era: "",
    generation: "",
    technologyLevel: "",
    safetyRating: "",
    marketValue: "",
    availability: "",
    keyFeatures: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const apiData = {
      orderNo: parseInt(formData.orderNo),
      vehicleModelYear: parseInt(formData.vehicleModelYear),
      status: parseInt(formData.status),
      storageType: isCarpoolRoute ? 'carpool' : 'general'
    };
    
    onSave(apiData);
    
    setFormData({
      orderNo: "",
      vehicleModelYear: "",
      status: 1,
      description: "",
      era: "",
      generation: "",
      technologyLevel: "",
      safetyRating: "",
      marketValue: "",
      availability: "",
      keyFeatures: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
          Add {isCarpoolRoute ? 'Carpool' : 'General Trip'} Model Year
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Order No.
              </label>
              <input
                type="number"
                placeholder="Enter order number"
                value={formData.orderNo}
                onChange={(e) =>
                  setFormData({ ...formData, orderNo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={1}>Active</option>
                <option value={0}>De-active</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Vehicle Model Year
            </label>
            <input
              type="number"
              min="1900"
              max="2030"
              placeholder="Enter model year"
              value={formData.vehicleModelYear}
              onChange={(e) =>
                setFormData({ ...formData, vehicleModelYear: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className={`p-3 rounded-lg border-2 border-dashed mb-4 ${
            isCarpoolRoute ? 'border-blue-300 bg-blue-50' : 'border-green-300 bg-green-50'
          }`}>
            <div className="flex items-center justify-center">
              {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
              <span className={`text-sm font-medium ${
                isCarpoolRoute ? 'text-blue-700' : 'text-green-700'
              }`}>
                This will be stored as {isCarpoolRoute ? 'Carpool' : 'General Trip'} year
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              disabled={isAdding}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, year, isDeleting, isCarpoolRoute }) => {
  if (!isOpen || !year) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-red-600 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2" /> : <Truck className="w-5 h-5 mr-2" />}
          Confirm Delete
        </h2>
        
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete the {isCarpoolRoute ? 'carpool' : 'general'} year <strong>{year.vehicleModelYear}</strong>? 
          This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const YearManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddYearModal, setShowAddYearModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check current route to determine storage type
  const isCarpoolRoute = location.pathname.includes('/carpool');

  // Conditional API hooks based on route for separate storage
  const {
    data: yearsData,
    isLoading,
    error,
    refetch,
  } = isCarpoolRoute 
    ? useGetCarpoolYearsQuery() 
    : useGetAllGeneralYearQuery();

  const [addYear, { isLoading: isAdding }] = isCarpoolRoute 
    ? useAddCarpoolYearsMutation() 
    : useAddGeneralYearMutation();

  const [updateYear, { isLoading: isUpdating }] = isCarpoolRoute 
    ? useUpdateCarpoolYearMutation() 
    : useUpdateGeneralYearMutation();

  const [deleteYear, { isLoading: isDeleting }] = isCarpoolRoute 
    ? useDeleteCarpoolYearMutation() 
    : useDeleteGeneralYearMutation();

  // Transform API data to match component structure
  const years =
    yearsData?.data?.map((year, index) => ({
      id: year._id || year.id || index + 1,
      sn: String(index + 1).padStart(2, "0"),
      yearId: `Y${String(year.orderNo || index + 1).padStart(3, "0")}`,
      orderNo: year.orderNo,
      vehicleModelYear: year.vehicleModelYear,
      status: year.status,
      createdAt: year.createdAt,
      updatedAt: year.updatedAt,
      description: year.description || "",
      era: year.era || "",
      generation: year.generation || "",
      technologyLevel: year.technologyLevel || "",
      safetyRating: year.safetyRating || "",
      marketValue: year.marketValue || "",
      availability: year.availability || "",
      keyFeatures: year.keyFeatures || "",
      storageType: isCarpoolRoute ? 'carpool' : 'general'
    })) || [];

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

  const handleSaveYear = async (yearData) => {
    try {
      console.log(`Adding ${isCarpoolRoute ? 'carpool' : 'general'} year:`, yearData);
      
      const result = await addYear(yearData).unwrap();
      refetch();
      setShowAddYearModal(false);
      
      alert(`${isCarpoolRoute ? 'Carpool' : 'General'} year added successfully!`);
    } catch (error) {
      console.error("Error adding year:", error);
      alert(`Failed to add ${isCarpoolRoute ? 'carpool' : 'general'} year: ${error?.data?.message || 'Please try again.'}`);
    }
  };

  const handleEditYear = async (updatedYear) => {
    try {
      console.log(`Updating ${isCarpoolRoute ? 'carpool' : 'general'} year:`, updatedYear);
      
      const { id, ...updateData } = updatedYear;
      
      // Handle different API structures based on route
      let result;
      if (isCarpoolRoute) {
        // Carpool API might use different structure
        result = await updateYear({
          id: id,
          data: updateData
        }).unwrap();
      } else {
        // General API structure
        result = await updateYear({
          id: id,
          data: updateData
        }).unwrap();
      }
      
      console.log("Update result:", result);
      refetch();
      setShowEditModal(false);
      setSelectedYear(null);
      
      alert(`${isCarpoolRoute ? 'Carpool' : 'General'} year updated successfully!`);
    } catch (error) {
      console.error("Error updating year:", error);
      alert(`Failed to update ${isCarpoolRoute ? 'carpool' : 'general'} year: ${error?.data?.message || 'Please try again.'}`);
    }
  };

  const handleViewYear = (year) => {
    setSelectedYear(year);
    setShowViewModal(true);
  };

  const handleEditClick = (year) => {
    setSelectedYear(year);
    setShowEditModal(true);
  };

  const handleDeleteClick = (year) => {
    setSelectedYear(year);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedYear) return;
    
    try {
      console.log(`Deleting ${isCarpoolRoute ? 'carpool' : 'general'} year:`, selectedYear.id);
      
      const result = await deleteYear(selectedYear.id).unwrap();
      refetch();
      setShowDeleteModal(false);
      setSelectedYear(null);
      
      alert(`${isCarpoolRoute ? 'Carpool' : 'General'} year deleted successfully!`);
    } catch (error) {
      console.error("Error deleting year:", error);
      alert(`Failed to delete ${isCarpoolRoute ? 'carpool' : 'general'} year: ${error?.data?.message || 'Please try again.'}`);
    }
  };

  const filteredYears = years.filter(
    (year) =>
      year.vehicleModelYear.toString().includes(searchTerm.toLowerCase()) ||
      year.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      year.era.toLowerCase().includes(searchTerm.toLowerCase()) ||
      year.technologyLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      year.generation.toLowerCase().includes(searchTerm.toLowerCase())
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
                Loading {isCarpoolRoute ? 'carpool' : 'general'} years...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">⚠️</div>
              <p className="text-red-600">
                Error loading {isCarpoolRoute ? 'carpool' : 'general'} years: {error.message}
              </p>
              <button
                onClick={refetch}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
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
                  <Calendar className="w-6 h-6 text-indigo-600" />
                  <h1 className={`text-2xl font-bold ${
                    isCarpoolRoute ? 'text-blue-800' : 'text-green-800'
                  }`}>
                    {isCarpoolRoute ? 'Carpool Year Management' : 'General Trip Year Management'}
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
                {/* Search and Add Year Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder={`Search ${isCarpoolRoute ? 'carpool' : 'general'} years...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddYearModal(true)}
                    disabled={isAdding}
                    className={`text-white px-5 py-2 rounded-md hover:opacity-90 flex items-center space-x-2 text-sm disabled:opacity-50 ${
                      isCarpoolRoute ? 'bg-blue-600' : 'bg-green-600'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAdding ? "Adding..." : `Add ${isCarpoolRoute ? 'Carpool' : 'General'} Year`}</span>
                  </button>
                </div>

                {/* Year Table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse border border-gray-300 min-w-full">
                    <thead>
                      <tr className={isCarpoolRoute ? 'bg-blue-50' : 'bg-green-50'}>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-16">
                          SN
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-20">
                          Year
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">
                          Status
                        </th>
                        {/* <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">
                          Storage
                        </th> */}
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-32">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredYears.length > 0 ? (
                        filteredYears.map((year, index) => (
                          <tr key={year.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-2 text-xs">
                              {year.sn}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs font-bold">
                              {year.vehicleModelYear}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  year.status === 1
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {year.status === 1 ? "Active" : "De-active"}
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
                                  onClick={() => handleViewYear(year)}
                                  title="View Details"
                                />
                                <Edit
                                  className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-800"
                                  onClick={() => handleEditClick(year)}
                                  title="Edit Year"
                                />
                                <Trash2
                                  className="w-3 h-3 text-red-600 cursor-pointer hover:text-red-800"
                                  onClick={() => handleDeleteClick(year)}
                                  title="Delete Year"
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="border border-gray-300 px-3 py-6 text-center text-gray-500 text-sm"
                          >
                            {searchTerm 
                              ? `No ${isCarpoolRoute ? 'carpool' : 'general'} years found matching your search.`
                              : `No ${isCarpoolRoute ? 'carpool' : 'general'} years found. Add a year to get started.`
                            }
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className={`p-3 rounded-lg ${isCarpoolRoute ? 'bg-blue-50' : 'bg-green-50'}`}>
                    <h3 className={`text-xs font-medium ${isCarpoolRoute ? 'text-blue-700' : 'text-green-700'}`}>
                      Total {isCarpoolRoute ? 'Carpool' : 'General'} Years
                    </h3>
                    <p className={`text-xl font-bold ${isCarpoolRoute ? 'text-blue-900' : 'text-green-900'}`}>
                      {years.length}
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-emerald-700">
                      Active Years
                    </h3>
                    <p className="text-xl font-bold text-emerald-900">
                      {years.filter((y) => y.status === 1).length}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-purple-700">
                      Latest Year
                    </h3>
                    <p className="text-xl font-bold text-purple-900">
                      {years.length > 0 ? Math.max(...years.map(y => y.vehicleModelYear)) : 0}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-yellow-700">
                      Oldest Year
                    </h3>
                    <p className="text-xl font-bold text-yellow-900">
                      {years.length > 0 ? Math.min(...years.map(y => y.vehicleModelYear)) : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddYearModal
        isOpen={showAddYearModal}
        onClose={() => setShowAddYearModal(false)}
        onSave={handleSaveYear}
        isAdding={isAdding}
        isCarpoolRoute={isCarpoolRoute}
      />

      <ViewYearModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedYear(null);
        }}
        year={selectedYear}
        isCarpoolRoute={isCarpoolRoute}
      />

      <EditYearModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedYear(null);
        }}
        year={selectedYear}
        onSave={handleEditYear}
        isUpdating={isUpdating}
        isCarpoolRoute={isCarpoolRoute}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedYear(null);
        }}
        year={selectedYear}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        isCarpoolRoute={isCarpoolRoute}
      />
    </div>
  );
};

export default YearManagement;