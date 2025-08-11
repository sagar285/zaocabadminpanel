import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { Search, Plus, Eye, Edit, Trash2, ArrowLeft, Palette, Loader2, Car, Truck } from 'lucide-react';
import { 
  // Carpool Color APIs
 useAddCarpoolVechileColorMutation,
 
 useGetCarpoolColorsQuery,
 useDeleteCarpoolColorMutation,
  useAddGeneralColorMutation,
  useGetAllGeneralColorQuery,
  useUpdateGeneralColorMutation,
  useDeleteGeneralColorMutation,
} from '../../Redux/Api';

// View Color Modal Component (Read-Only)
const ViewColorModal = ({ isOpen, onClose, color, isCarpoolRoute }) => {
  if (!isOpen || !color) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
          View {isCarpoolRoute ? 'Carpool' : 'General'} Color Details
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Color ID</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{color.colorId || color.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Status</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{color.status}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Color Name</label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{color.colorName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Color Preview</label>
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: color.colorCode || color.hexCode }}
              ></div>
              <div>
                <p className="text-sm font-medium">{color.colorCode || color.hexCode}</p>
                <p className="text-xs text-gray-500">Order: {color.orderNo}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Storage Category</label>
            <p className={`px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm flex items-center ${
              isCarpoolRoute ? 'text-blue-700' : 'text-green-700'
            }`}>
              {isCarpoolRoute ? <Car className="w-4 h-4 mr-1" /> : <Truck className="w-4 h-4 mr-1" />}
              {isCarpoolRoute ? 'Carpool Color' : 'General Trip Color'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Description</label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{color.description || 'No description available'}</p>
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

// Edit Color Modal Component
const EditColorModal = ({ isOpen, onClose, color, onSave, isCarpoolRoute }) => {
  const [formData, setFormData] = useState({
    colorName: '',
    colorCode: '#000000',
    status: '1',
    orderNo: ''
  });

  useEffect(() => {
    if (color) {
      setFormData({
        colorName: color.colorName || '',
        colorCode: color.colorCode || color.hexCode || '#000000',
        status: color.status === 'Active' ? '1' : '0',
        orderNo: color.orderNo || ''
      });
    }
  }, [color]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedColor = {
      ...color,
      colorName: formData.colorName,
      colorCode: formData.colorCode,
      status: formData.status === '1' ? 'Active' : 'De-active',
      orderNo: formData.orderNo,
      storageType: isCarpoolRoute ? 'carpool' : 'general'
    };
    onSave(updatedColor);
  };

  if (!isOpen || !color) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
          Edit {isCarpoolRoute ? 'Carpool' : 'General'} Color Details
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Order No.</label>
              <input
                type="number"
                value={formData.orderNo}
                onChange={(e) => setFormData({...formData, orderNo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color Name</label>
              <input
                type="text"
                value={formData.colorName}
                onChange={(e) => setFormData({...formData, colorName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color Code</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={formData.colorCode}
                  onChange={(e) => setFormData({...formData, colorCode: e.target.value})}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.colorCode}
                  onChange={(e) => setFormData({...formData, colorCode: e.target.value})}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
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
                <option value="0">De-active</option>
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
                  This will be stored as {isCarpoolRoute ? 'Carpool' : 'General Trip'} color
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

// Add Color Modal Component
const AddColorModal = ({ isOpen, onClose, onSave, isCarpoolRoute }) => {
  const [formData, setFormData] = useState({
    orderNo: '',
    colorName: '',
    colorCode: '#000000',
    status: '1'
  });

  // Conditional API hooks based on route
  const [addCarpoolColor, { isLoading: isAddingCarpoolColor }] = useAddCarpoolVechileColorMutation();
  const [addGeneralColor, { isLoading: isAddingGeneralColor }] = useAddGeneralColorMutation();
  
  const isAddingColor = isCarpoolRoute ? isAddingCarpoolColor : isAddingGeneralColor;
  const addColorMutation = isCarpoolRoute ? addCarpoolColor : addGeneralColor;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log(`Adding ${isCarpoolRoute ? 'carpool' : 'general'} color:`, formData);

      const apiData = {
        orderNo: parseInt(formData.orderNo),
        colorName: formData.colorName,
        colorCode: formData.colorCode,
        status: parseInt(formData.status),
        storageType: isCarpoolRoute ? 'carpool' : 'general'
      };

      console.log('Sending API data:', apiData);

      const result = await addColorMutation(apiData).unwrap();
      console.log('API Success Response:', result);
      
      onSave(result);
      
      setFormData({ 
        orderNo: '', 
        colorName: '', 
        colorCode: '#000000',
        status: '1' 
      });
      
      onClose();
      
      alert(`${isCarpoolRoute ? 'Carpool' : 'General'} color added successfully!`);
      
    } catch (error) {
      console.error('API Error Details:', error);
      
      if (error.data?.message) {
        alert(`Error: ${error.data.message}`);
      } else if (error.status === 500) {
        alert('Server error. Please check your data and try again.');
      } else {
        alert(`Error adding ${isCarpoolRoute ? 'carpool' : 'general'} color. Please try again.`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
          Add {isCarpoolRoute ? 'Carpool' : 'General Trip'} Color
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Order No.</label>
              <input
                type="number"
                placeholder="Enter order number"
                value={formData.orderNo}
                onChange={(e) => setFormData({...formData, orderNo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isAddingColor}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color Name</label>
              <input
                type="text"
                placeholder="Enter color name (e.g., black, white, red)"
                value={formData.colorName}
                onChange={(e) => setFormData({...formData, colorName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isAddingColor}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color Code</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={formData.colorCode}
                  onChange={(e) => setFormData({...formData, colorCode: e.target.value})}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  disabled={isAddingColor}
                />
                <input
                  type="text"
                  value={formData.colorCode}
                  onChange={(e) => setFormData({...formData, colorCode: e.target.value})}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isAddingColor}
                  pattern="^#[0-9A-Fa-f]{6}$"
                  title="Please enter a valid hex color code (e.g., #000000)"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use the color picker or enter hex code manually
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isAddingColor}
              >
                <option value="1">Active</option>
                <option value="0">De-active</option>
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
                  This will be stored as {isCarpoolRoute ? 'Carpool' : 'General Trip'} color
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              disabled={isAddingColor}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-2"
              disabled={isAddingColor}
            >
              {isAddingColor && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isAddingColor ? 'Adding...' : 'Add Color'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ColorManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [localColors, setLocalColors] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check current route to determine storage type
  const isCarpoolRoute = location.pathname.includes('/carpool');

  // Conditional API hooks based on route for separate storage
  const { 
    data: apiData, 
    error: fetchError, 
    isLoading: isFetchingColors, 
    refetch: refetchColors 
  } = isCarpoolRoute 
    ? useGetCarpoolColorsQuery() 
    : useGetAllGeneralColorQuery();

  const [deleteColorMutation, { isLoading: isDeleting }] = isCarpoolRoute 
    ? useDeleteCarpoolColorMutation() 
    : useDeleteGeneralColorMutation();

  const [updateColorMutation, { isLoading: isUpdating }] = isCarpoolRoute 
    ?" useUpdateCarpoolColorMutation()" 
    : useUpdateGeneralColorMutation();

  // Effect to handle API data and transform it to local format
  useEffect(() => {
    if (apiData && apiData.data) {
      console.log(`${isCarpoolRoute ? 'Carpool' : 'General'} API Data received:`, apiData);
      
      const transformedColors = apiData.data.map((color, index) => ({
        id: color._id,
        sn: String(index + 1).padStart(2, '0'),
        colorId: color.colorId || `C${String(color.id).padStart(3, '0')}`,
        colorName: color.colorName,
        colorCode: color.colorCode,
        hexCode: color.colorCode,
        orderNo: color.orderNo,
        description: color.description || `${color.colorName} color`,
        status: color.status === 1 || color.status === '1' ? 'Active' : 'De-active',
        storageType: isCarpoolRoute ? 'carpool' : 'general'
      }));
      
      console.log(`Transformed ${isCarpoolRoute ? 'carpool' : 'general'} colors:`, transformedColors);
      setLocalColors(transformedColors);
    }
  }, [apiData, isCarpoolRoute]);

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

  const handleSaveColor = async (newColorFromAPI) => {
    console.log(`${isCarpoolRoute ? 'Carpool' : 'General'} color added successfully:`, newColorFromAPI);
    refetchColors();
    setShowAddColorModal(false);
  };

  const handleEditColor = async (updatedColor) => {
    try {
      console.log(`Updating ${isCarpoolRoute ? 'carpool' : 'general'} color:`, updatedColor);
      
      const apiData = {
        colorName: updatedColor.colorName,
        colorCode: updatedColor.colorCode,
        status: updatedColor.status === 'Active' ? 1 : 0,
        orderNo: updatedColor.orderNo,
        storageType: updatedColor.storageType || (isCarpoolRoute ? 'carpool' : 'general')
      };


      console.log(apiData)

      const result = await updateColorMutation({ 
        id: updatedColor.id, 
        data: apiData 
      }).unwrap();

      console.log("Color updated successfully", result);
      
      setShowEditModal(false);
      setSelectedColor(null);
      refetchColors();
      
      alert(`${isCarpoolRoute ? 'Carpool' : 'General'} color updated successfully!`);
      
    } catch (error) {
      console.error("Error updating color:", error);
      alert(`Failed to update ${isCarpoolRoute ? 'carpool' : 'general'} color: ${error?.data?.message || 'Please try again.'}`);
    }
  };

  const handleViewColor = (color) => {
    setSelectedColor(color);
    setShowViewModal(true);
  };

  const handleEditClick = (color) => {
    setSelectedColor(color);
    setShowEditModal(true);
  };

  const handleDelete = async (colorId) => {
    const confirmMessage = `Are you sure you want to delete this ${isCarpoolRoute ? 'carpool' : 'general'} color?`;
    if (window.confirm(confirmMessage)) {
      try {
        console.log(`Deleting ${isCarpoolRoute ? 'carpool' : 'general'} color:`, colorId);
        const result = await deleteColorMutation(colorId).unwrap();
        console.log("Color deleted successfully", result);
        refetchColors();
        alert(`${isCarpoolRoute ? 'Carpool' : 'General'} color deleted successfully!`);
      } catch (error) {
        console.error("Error deleting color:", error);
        alert(`Failed to delete ${isCarpoolRoute ? 'carpool' : 'general'} color: ${error?.data?.message || 'Please try again.'}`);
      }
    }
  };

  const filteredColors = localColors.filter(color =>
    color.colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (color.colorCode && color.colorCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (color.description && color.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Loading state
  if (isFetchingColors) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading {isCarpoolRoute ? 'carpool' : 'general'} colors...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error loading {isCarpoolRoute ? 'carpool' : 'general'} colors: {fetchError.message}
          </p>
          <button 
            onClick={refetchColors}
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
                  <Palette className="w-6 h-6 text-pink-600" />
                  <h1 className={`text-2xl font-bold ${
                    isCarpoolRoute ? 'text-blue-800' : 'text-green-800'
                  }`}>
                    {isCarpoolRoute ? 'Carpool Color Management' : 'General Trip Color Management'}
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isCarpoolRoute 
                    ? 'bg-blue-200 text-blue-800' 
                    : 'bg-green-200 text-green-800'
                }`}>
                  {isCarpoolRoute ? 'Carpool Storage' : 'General Storage'}
                </div>
                <button 
                  onClick={refetchColors}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 flex items-center space-x-1"
                >
                  <Loader2 className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4">
                {/* Search and Add Color Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder={`Search ${isCarpoolRoute ? 'carpool' : 'general'} colors...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 text-sm"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowAddColorModal(true)}
                    className={`text-white px-5 py-2 rounded-md hover:opacity-90 flex items-center space-x-2 text-sm ${
                      isCarpoolRoute ? 'bg-blue-600' : 'bg-green-600'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add {isCarpoolRoute ? 'Carpool' : 'General'} Color</span>
                  </button>
                </div>

                {/* Color Table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse border border-gray-300 min-w-full">
                    <thead>
                      <tr className={isCarpoolRoute ? 'bg-blue-50' : 'bg-green-50'}>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-16">SN</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Preview</th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-32">Color Name</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Color Code</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-20">Order No</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Status</th>
                        {/* <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Storage</th> */}
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-32">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredColors.length > 0 ? (
                        filteredColors.map((color, index) => (
                          <tr key={`color-${color.id}-${index}`} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-2 text-xs">{color.sn}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              <div 
                                className="w-8 h-8 rounded-full border-2 border-gray-300 mx-auto shadow-sm"
                                style={{ backgroundColor: color.colorCode }}
                                title={`${color.colorName} - ${color.colorCode}`}
                              ></div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-xs font-medium">{color.colorName}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs font-mono">{color.colorCode}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs">{color.orderNo}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                color.status === 'Active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {color.status}
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
                                  onClick={() => handleViewColor(color)}
                                  title="View Details"
                                />
                                <Edit 
                                  className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-800" 
                                  onClick={() => handleEditClick(color)}
                                  title="Edit Color"
                                />
                                <Trash2 
                                  className="w-3 h-3 text-red-600 cursor-pointer hover:text-red-800" 
                                  onClick={() => handleDelete(color.id)}
                                  title="Delete Color"
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key="no-data">
                          <td colSpan="8" className="border border-gray-300 px-3 py-6 text-center text-gray-500 text-sm">
                            {searchTerm 
                              ? `No ${isCarpoolRoute ? 'carpool' : 'general'} colors found matching your search.` 
                              : `No ${isCarpoolRoute ? 'carpool' : 'general'} colors available. Add a color to get started.`
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
                      Total {isCarpoolRoute ? 'Carpool' : 'General'} Colors
                    </h3>
                    <p className={`text-xl font-bold ${isCarpoolRoute ? 'text-blue-900' : 'text-green-900'}`}>
                      {localColors.length}
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-emerald-700">Active Colors</h3>
                    <p className="text-xl font-bold text-emerald-900">
                      {localColors.filter(c => c.status === 'Active').length}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-red-700">De-active Colors</h3>
                    <p className="text-xl font-bold text-red-900">
                      {localColors.filter(c => c.status === 'De-active').length}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-purple-700">Latest Order</h3>
                    <p className="text-xl font-bold text-purple-900">
                      {localColors.length > 0 ? Math.max(...localColors.map(c => c.orderNo || 0)) : 0}
                    </p>
                  </div>
                </div>

                {/* API Status Indicator */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Connected to {isCarpoolRoute ? 'Carpool' : 'General'} API</span>
                  </div>
                  <div>
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddColorModal 
        isOpen={showAddColorModal}
        onClose={() => setShowAddColorModal(false)}
        onSave={handleSaveColor}
        isCarpoolRoute={isCarpoolRoute}
      />

      <ViewColorModal 
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedColor(null);
        }}
        color={selectedColor}
        isCarpoolRoute={isCarpoolRoute}
      />

      <EditColorModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedColor(null);
        }}
        color={selectedColor}
        onSave={handleEditColor}
        isCarpoolRoute={isCarpoolRoute}
      />
    </div>
  );
};

export default ColorManagement;