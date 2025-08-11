import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { Search, Plus, Eye, Edit, Trash2, ArrowLeft, Loader2, Car, Truck, Users } from 'lucide-react';
import {
  // Carpool Seat APIs
  useCreateCarpoolSeatMutation,
  useGetallSeatCarpoolQuery,
  useEditCarpoolseatMutation,
  useDeleteCarpoolseatMutation,
  // General Seat APIs (you need to add these to Redux/Api.js)
  useAddGeneralSeatMutation,
  useGetAllGenralSeatQuery,
  useUpdateGeneralSeatMutation,
  useDeleteGeneralSeatMutation
  // useCreateGeneralSeatMutation,
  // useGetAllGeneralSeatQuery,
  // useEditGeneralSeatMutation,
  // useDeleteGeneralSeatMutation,
} from '../../Redux/Api.js';

// View Seat Modal Component (Read-Only)
const ViewSeatModal = ({ isOpen, onClose, seat, isCarpoolRoute }) => {
  if (!isOpen || !seat) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
          View {isCarpoolRoute ? 'Carpool' : 'General'} Seat Details
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Seat ID</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{seat._id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Status</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {seat.status === 1 || seat.status === '1' ? 'Active' : 'De-active'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">No of Seat</label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{seat.noOfSeat} seater</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Storage Category</label>
            <p className={`px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm flex items-center ${
              isCarpoolRoute ? 'text-blue-700' : 'text-green-700'
            }`}>
              {isCarpoolRoute ? <Car className="w-4 h-4 mr-1" /> : <Truck className="w-4 h-4 mr-1" />}
              {isCarpoolRoute ? 'Carpool Seat' : 'General Trip Seat'}
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

// Edit Seat Modal Component
const EditSeatModal = ({ isOpen, onClose, seat, onSave, isLoading, isCarpoolRoute }) => {
  const [formData, setFormData] = useState({
    noOfSeat: '',
    status: '1',
  });

  useEffect(() => {
    if (seat) {
      setFormData({
        noOfSeat: seat.noOfSeat || '',
        status: seat.status?.toString() || '1',
      });
    }
  }, [seat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      _id: seat._id,
      noOfSeat: parseInt(formData.noOfSeat),
      status: formData.status,
      storageType: isCarpoolRoute ? 'carpool' : 'general'
    });
  };

  if (!isOpen || !seat) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
          Edit {isCarpoolRoute ? 'Carpool' : 'General'} Seat Details
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">No of Seat</label>
              <input
                type="number"
                value={formData.noOfSeat}
                onChange={(e) => setFormData({...formData, noOfSeat: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="1"
                max="50"
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
                  This will be stored as {isCarpoolRoute ? 'Carpool' : 'General Trip'} seat
                </span>
              </div>
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

// Add Seat Modal Component
const AddSeatModal = ({ isOpen, onClose, onSave, isLoading, isCarpoolRoute }) => {
  const [formData, setFormData] = useState({
    noOfSeat: '',
    status: '1',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const seatDataWithType = {
      noOfSeat: parseInt(formData.noOfSeat),
      status: formData.status,
      storageType: isCarpoolRoute ? 'carpool' : 'general'
    };
    
    onSave(seatDataWithType);
  };

  const handleClose = () => {
    setFormData({ noOfSeat: '', status: '1' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isCarpoolRoute ? <Car className="w-5 h-5 mr-2 text-blue-600" /> : <Truck className="w-5 h-5 mr-2 text-green-600" />}
          Add {isCarpoolRoute ? 'Carpool' : 'General Trip'} Seat
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">No of Seat</label>
              <input
                type="number"
                placeholder="Enter seat number"
                value={formData.noOfSeat}
                onChange={(e) => setFormData({...formData, noOfSeat: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="1"
                max="50"
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
                  This will be stored as {isCarpoolRoute ? 'Carpool' : 'General Trip'} seat
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              disabled={isLoading}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Seat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Error Message Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">Error</h3>
        <div className="mt-2 text-sm text-red-700">
          <p>{message}</p>
        </div>
        {onRetry && (
          <div className="mt-4">
            <button
              type="button"
              onClick={onRetry}
              className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Loading Component
const LoadingSpinner = ({ isCarpoolRoute }) => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    <span className="ml-2 text-gray-600">
      Loading {isCarpoolRoute ? 'carpool' : 'general'} seats...
    </span>
  </div>
);

const ManageVehicleSeats = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSeatModal, setShowAddSeatModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Check current route to determine storage type
  const isCarpoolRoute = location.pathname.includes('/carpool');

  // Conditional API hooks based on route for separate storage
  const { 
    data: seatsData, 
    isLoading: isLoadingSeats, 
    error: seatsError, 
    refetch: refetchSeats 
  } = isCarpoolRoute 
    ? useGetallSeatCarpoolQuery() 
    : useGetAllGenralSeatQuery();


    console.log(seatsData)

  const [createSeat, { isLoading: isCreating }] = isCarpoolRoute 
    ? useCreateCarpoolSeatMutation() 
    : useAddGeneralSeatMutation();

  const [editSeat, { isLoading: isEditing }] = isCarpoolRoute 
    ? useEditCarpoolseatMutation() 
    : useUpdateGeneralSeatMutation()
    ;

  const [deleteSeat, { isLoading: isDeleting }] = isCarpoolRoute 
    ? useDeleteCarpoolseatMutation() 
    : useDeleteCarpoolseatMutation();

  // Transform API data - handle different response structures
  const seats = isCarpoolRoute 
    ? (seatsData?.allSeat || []) 
    : (seatsData?.allSeat || []);

    console.log(seats)
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

  const handleSaveSeat = async (seatData) => {
    try {
      console.log(`Adding ${isCarpoolRoute ? 'carpool' : 'general'} seat data:`, seatData);
      
      const result = await createSeat(seatData).unwrap();
      setShowAddSeatModal(false);
      refetchSeats();
      
      alert(`${isCarpoolRoute ? 'Carpool' : 'General'} seat created successfully!`);
      console.log('Seat created successfully', result);
    } catch (error) {
      console.error('Failed to create seat:', error);
      alert(`Failed to create ${isCarpoolRoute ? 'carpool' : 'general'} seat: ${error?.data?.message || 'Please try again.'}`);
    }
  };

  const handleEditSeat = async (updatedData) => {
    try {
      console.log(`Updating ${isCarpoolRoute ? 'carpool' : 'general'} seat:`, updatedData);
      
      // Handle different API structures
      const apiPayload = isCarpoolRoute 
        ? {
            id: updatedData._id,
            data: {
              noOfSeat: updatedData.noOfSeat,
              status: updatedData.status,
            }
          }
        : {
            id: updatedData._id,
            body: {
              noOfSeat: updatedData.noOfSeat,
              status: updatedData.status,
              storageType: updatedData.storageType
            }
          };

          console.log(apiPayload)
      const result = await editSeat({id:updatedData._id,data:apiPayload}).unwrap();

      setShowEditModal(false);
      setSelectedSeat(null);
      refetchSeats();
      
      alert(`${isCarpoolRoute ? 'Carpool' : 'General'} seat updated successfully!`);
      console.log('Seat updated successfully', result);
    } catch (error) {
      console.error('Failed to update seat:', error);
      alert(`Failed to update ${isCarpoolRoute ? 'carpool' : 'general'} seat: ${error?.data?.message || 'Please try again.'}`);
    }
  };

  const handleViewSeat = (seat) => {
    setSelectedSeat(seat);
    setShowViewModal(true);
  };

  const handleEditClick = (seat) => {
    setSelectedSeat(seat);
    setShowEditModal(true);
  };

  const handleDelete = async (seatId) => {
    const confirmMessage = `Are you sure you want to delete this ${isCarpoolRoute ? 'carpool' : 'general'} seat?`;
    if (window.confirm(confirmMessage)) {
      try {
        console.log(`Deleting ${isCarpoolRoute ? 'carpool' : 'general'} seat:`, seatId);
        const result = await deleteSeat(seatId).unwrap();
        console.log('Seat deleted successfully', result);
        refetchSeats();
        alert(`${isCarpoolRoute ? 'Carpool' : 'General'} seat deleted successfully!`);
      } catch (error) {
        console.error('Failed to delete seat:', error);
        alert(`Failed to delete ${isCarpoolRoute ? 'carpool' : 'general'} seat: ${error?.data?.message || 'Please try again.'}`);
      }
    }
  };


  console.log(seats)

  const filteredSeats = seats?.filter(seat =>
    seat?.noOfSeat?.toString().includes(searchTerm) ||
    (seat?.status === 1 ? 'Active' : 'De-active').toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredSeats)

  const sortedSeats = filteredSeats
    .slice()
    .sort((a, b) => a.noOfSeat - b.noOfSeat);

  // Calculate stats
  const activeSeats = seats.filter(seat => seat.status === 1 || seat.status === '1').length;
  const inactiveSeats = seats.length - activeSeats;

  // Loading state
  if (isLoadingSeats) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
          <div className="flex items-center justify-center h-screen">
            <LoadingSpinner isCarpoolRoute={isCarpoolRoute} />
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
                  <h1 className={`text-2xl font-bold ${
                    isCarpoolRoute ? 'text-blue-800' : 'text-green-800'
                  }`}>
                    {isCarpoolRoute ? 'Carpool Vehicle Seats' : 'General Trip Vehicle Seats'}
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
                {/* Error Message */}
                {seatsError && (
                  <ErrorMessage 
                    message={seatsError?.data?.message || `Failed to load ${isCarpoolRoute ? 'carpool' : 'general'} seats`} 
                    onRetry={refetchSeats}
                  />
                )}

                {/* Search and Add Seat Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder={`Search ${isCarpoolRoute ? 'carpool' : 'general'} seats...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 text-sm"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowAddSeatModal(true)}
                    className={`text-white px-5 py-2 rounded-md hover:opacity-90 flex items-center space-x-2 text-sm ${
                      isCarpoolRoute ? 'bg-blue-600' : 'bg-green-600'
                    }`}
                    disabled={isCreating}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add {isCarpoolRoute ? 'Carpool' : 'General'} Seat</span>
                  </button>
                </div>

                {/* Seat Table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse border border-gray-300 min-w-full">
                    <thead>
                      <tr className={isCarpoolRoute ? 'bg-blue-50' : 'bg-green-50'}>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-20">S. No.</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-32">No of seat</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Status</th>
                        {/* <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Storage</th> */}
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-32">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSeats.length > 0 ? (
                        sortedSeats.map((seat, index) => (
                          <tr key={seat._id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-2 text-xs">{String(index + 1).padStart(2, '0')}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs font-medium">
                              <div className="flex items-center justify-center">
                                <Users className="w-4 h-4 mr-1 text-gray-500" />
                                {seat.noOfSeat} seater
                              </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                seat.status === 1 || seat.status === '1'
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {seat.status === 1 || seat.status === '1' ? 'Active' : 'De-active'}
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
                                  onClick={() => handleViewSeat(seat)}
                                  title="View Details"
                                />
                                <Edit 
                                  className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-800" 
                                  onClick={() => handleEditClick(seat)}
                                  title="Edit Seat"
                                />
                                <Trash2 
                                  className={`w-3 h-3 cursor-pointer hover:text-red-800 ${
                                    isDeleting ? 'text-gray-400' : 'text-red-600'
                                  }`}
                                  onClick={() => !isDeleting && handleDelete(seat._id)}
                                  title="Delete Seat"
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="border border-gray-300 px-3 py-6 text-center text-gray-500 text-sm">
                            {searchTerm 
                              ? `No ${isCarpoolRoute ? 'carpool' : 'general'} seats found matching your search.` 
                              : `No ${isCarpoolRoute ? 'carpool' : 'general'} seats found. Click "Add ${isCarpoolRoute ? 'Carpool' : 'General'} Seat" to create your first seat.`
                            }
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats */}
                {seats.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className={`p-3 rounded-lg ${isCarpoolRoute ? 'bg-blue-50' : 'bg-green-50'}`}>
                      <h3 className={`text-xs font-medium ${isCarpoolRoute ? 'text-blue-700' : 'text-green-700'}`}>
                        Total {isCarpoolRoute ? 'Carpool' : 'General'} Seats
                      </h3>
                      <p className={`text-xl font-bold ${isCarpoolRoute ? 'text-blue-900' : 'text-green-900'}`}>
                        {seats.length}
                      </p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <h3 className="text-xs font-medium text-emerald-700">Active Seats</h3>
                      <p className="text-xl font-bold text-emerald-900">{activeSeats}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <h3 className="text-xs font-medium text-red-700">Inactive Seats</h3>
                      <p className="text-xl font-bold text-red-900">{inactiveSeats}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h3 className="text-xs font-medium text-purple-700">Avg Capacity</h3>
                      <p className="text-xl font-bold text-purple-900">
                        {seats.length > 0 ? Math.round(seats.reduce((sum, seat) => sum + seat.noOfSeat, 0) / seats.length) : 0}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddSeatModal 
        isOpen={showAddSeatModal}
        onClose={() => setShowAddSeatModal(false)}
        onSave={handleSaveSeat}
        isLoading={isCreating}
        isCarpoolRoute={isCarpoolRoute}
      />

      <ViewSeatModal 
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedSeat(null);
        }}
        seat={selectedSeat}
        isCarpoolRoute={isCarpoolRoute}
      />

      <EditSeatModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSeat(null);
        }}
        seat={selectedSeat}
        onSave={handleEditSeat}
        isLoading={isEditing}
        isCarpoolRoute={isCarpoolRoute}
      />
    </div>
  );
};

export default ManageVehicleSeats;