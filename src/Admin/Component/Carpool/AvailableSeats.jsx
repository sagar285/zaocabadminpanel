import { useEffect, useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, ArrowLeft, Car } from 'lucide-react';
import {useGetAllCarpoolSeatesQuery,useEditCarpoolseatMutation,useDeleteCarpoolVehicleMutation, useGetCarpoolSeatsQuery, useDeleteSeatConfigMutation } from '../../Redux/Api';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';

// View Seat Configuration Modal Component (Read-Only)
const ViewConfigModal = ({ isOpen, onClose, config }) => {
  if (!isOpen || !config) return null;

  const seatConfig = config.seatConfig;

  const renderSeatLayout = () => {
    if (!seatConfig.seatLayout || !Array.isArray(seatConfig.seatLayout)) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Car className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No seat layout available</p>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-4 border-2 border-gray-300 shadow-lg">
        <div className="text-center mb-4">
          <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-full text-xs font-bold">
            🚗 FRONT
          </div>
        </div>
        
        <div className="space-y-3">
          {seatConfig.seatLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-center">
              <div className="w-6 text-center text-xs text-gray-500 font-medium mr-3">
                R{row.rowNumber}
              </div>
              
              {row.leftSeats && row.leftSeats.length > 0 && row.rightSeats && row.rightSeats.length > 0 ? (
                <>
                  <div className="flex gap-1">
                    {row.leftSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold ${
                          seat.isDriver
                            ? "bg-orange-100 border-orange-400 text-orange-800"
                            : seat.available
                            ? "bg-green-100 border-green-400 text-green-800"
                            : "bg-red-100 border-red-400 text-red-800"
                        }`}
                      >
                        {seat.isDriver ? "🚗" : seat.label}
                      </div>
                    ))}
                  </div>
                  <div className="w-6 flex items-center justify-center">
                    <div className="w-px h-6 bg-gray-300"></div>
                  </div>
                  <div className="flex gap-1">
                    {row.rightSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold ${
                          seat.isDriver
                            ? "bg-orange-100 border-orange-400 text-orange-800"
                            : seat.available
                            ? "bg-green-100 border-green-400 text-green-800"
                            : "bg-red-100 border-red-400 text-red-800"
                        }`}
                      >
                        {seat.isDriver ? "🚗" : seat.label}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex gap-1">
                  {[...(row.leftSeats || []), ...(row.rightSeats || [])].map((seat) => (
                    <div
                      key={seat.id}
                      className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold ${
                        seat.isDriver
                          ? "bg-orange-100 border-orange-400 text-orange-800"
                          : seat.available
                          ? "bg-green-100 border-green-400 text-green-800"
                          : "bg-red-100 border-red-400 text-red-800"
                      }`}
                    >
                      {seat.isDriver ? "🚗" : seat.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-full text-xs font-bold">
            BACK 🚪
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Car className="w-5 h-5 text-blue-600" />
          View Seat Configuration Details
        </h2>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Vehicle Name</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{seatConfig.vehicleName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Vehicle Model</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{seatConfig.vehicleModel || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Total Rows</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{seatConfig.totalRows || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Configuration Type</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {seatConfig.customRowConfig ? 'Custom' : 'Uniform'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Total Seats</label>
              <p className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm font-semibold text-blue-800">{seatConfig.totalSeats || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Available Seats</label>
              <p className="px-3 py-2 bg-green-50 border border-green-200 rounded-md text-sm font-semibold text-green-800">{seatConfig.availableSeats || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Occupied Seats</label>
              <p className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-sm font-semibold text-red-800">{seatConfig.occupiedSeats || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Has Driver Seat</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {seatConfig.hasDriver ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-600">Seat Layout</label>
          {renderSeatLayout()}
          
          {/* Legend */}
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-400 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 border border-red-400 rounded"></div>
              <span>Occupied</span>
            </div>
            {seatConfig.hasDriver && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-100 border border-orange-400 rounded"></div>
                <span>Driver</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
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

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, vehicleName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the seat configuration for "{vehicleName}"? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const AvailableSeates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [brandFilter, setBrandFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [configToDelete, setConfigToDelete] = useState(null);
  
  const navigate = useNavigate();

  // API Hooks
  const { data: data, error, isLoading, refetch } = useGetCarpoolSeatsQuery();
  const [editCarpoolSeat, { isLoading: isEditing }] = useEditCarpoolseatMutation();
  const [deleteCarpoolVehicle, { isLoading: isDeleting }] = useDeleteCarpoolVehicleMutation();
  const [deleteSeatConfig] =useDeleteSeatConfigMutation()

  // const data = date?.data || [];
  
  const seatData = data?.seatConfigs;
  console.log(seatData,"useGetCarpoolSeatsQuery");


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigateBack = () => {
    console.log('Navigate back to brand management');
  };

  // Extract brand from vehicle name
  const extractBrand = (vehicleName, vehicleModel) => {
    const brandKeywords = ['Honda', 'Toyota', 'Maruti', 'Hyundai', 'Tata', 'Ford', 'BMW', 'Audi', 'Mercedes'];
    const searchText = `${vehicleName || ''} ${vehicleModel || ''}`.toLowerCase();
    
    for (const keyword of brandKeywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return keyword;
      }
    }
    return 'Other';
  };


  const deleteSeatconfig = async(deleteConfigId) =>{
    const payloadData ={
      id:deleteConfigId
    }
    try {
    const {data,error} = await deleteSeatConfig(payloadData)
    if(data){
      refetch()
      alert("Seat deleted succesfully");
    }
    if(error){
      alert("error in deleting seat");
    }
  } catch (error) {
      
  }

  }

  const handleViewConfig = (config) => {
    setSelectedConfig(config);
    setShowViewModal(true);
  };
  // Integrated Edit Function
  const handleEdit = async (configId) => {
    try {
      // Navigate to edit page with config ID
      navigate(`/carpool/editSeat/${configId}`);
      // Alternative: If you want to edit inline, you could open an edit modal
      // setSelectedConfigForEdit(config);
      // setShowEditModal(true);
    } catch (error) {
      console.error('Error navigating to edit:', error);
      alert('Failed to navigate to edit page');
    }
  };

  // Integrated Delete Function
  const handleDelete = (config) => {
    setConfigToDelete(config);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!configToDelete) return;

    try {
      const result = await deleteCarpoolVehicle(configToDelete._id).unwrap();
      
      console.log('Delete successful:', result);
      alert('Seat configuration deleted successfully!');
      
      // Refresh the data
      refetch();
      
      // Close modal
      setShowDeleteModal(false);
      setConfigToDelete(null);
      
    } catch (error) {
      console.error('Error deleting configuration:', error);
      alert(error?.data?.message || 'Failed to delete seat configuration');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setConfigToDelete(null);
  };

  // Toggle seat availability function (for quick edit)
  const handleToggleSeatAvailability = async (configId, seatId, currentAvailability) => {
    try {
      // Find the config to update
      const configToUpdate = data.find(config => config._id === configId);
      if (!configToUpdate) {
        throw new Error('Configuration not found');
      }

      // Create updated seat layout
      const updatedSeatLayout = configToUpdate.seatConfig.seatLayout.map(row => ({
        ...row,
        leftSeats: row.leftSeats?.map(seat => 
          seat.id === seatId ? { ...seat, available: !currentAvailability } : seat
        ) || [],
        rightSeats: row.rightSeats?.map(seat => 
          seat.id === seatId ? { ...seat, available: !currentAvailability } : seat
        ) || []
      }));

      // Calculate new totals
      let availableSeats = 0;
      let occupiedSeats = 0;
      
      updatedSeatLayout.forEach(row => {
        [...(row.leftSeats || []), ...(row.rightSeats || [])].forEach(seat => {
          if (!seat.isDriver) {
            if (seat.available) {
              availableSeats++;
            } else {
              occupiedSeats++;
            }
          }
        });
      });

      const updatedSeatConfig = {
        ...configToUpdate.seatConfig,
        seatLayout: updatedSeatLayout,
        availableSeats,
        occupiedSeats
      };

      const updateData = {
        seatConfig: updatedSeatConfig
      };

      const result = await editCarpoolSeat({ 
        id: configId, 
        data: updateData 
      }).unwrap();
      
      console.log('Seat updated successfully:', result);
      
      // Refresh the data
      refetch();
      
    } catch (error) {
      console.error('Error updating seat:', error);
      alert(error?.data?.message || 'Failed to update seat');
    }
  };

  const getAvailabilityStatus = (available, total) => {
    if (total === 0) return { status: 'Unknown', color: 'gray' };
    const percentage = (available / total) * 100;
    
    if (percentage >= 80) return { status: 'Active', color: 'green' };
    return { status: 'Inactive', color: 'red' };
  };

  // Process and filter data
  const processedData = data?.data?.map((config, index) => ({
    ...config,
    brand: extractBrand(config.seatConfig?.vehicleName, config.seatConfig?.vehicleModel),
    serialNo: String(index + 1).padStart(2, '0')
  })) || [];

  console.log(processedData);

  const filteredConfigs = processedData.filter(config => {
    const seatConfig = config.seatConfig;
    const matchesSearch = 
      seatConfig?.vehicleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seatConfig?.vehicleModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = brandFilter === 'all' || config.brand === brandFilter;
    
    return matchesSearch && matchesBrand;
  });

  // Get unique brands for filter
  const uniqueBrands = [...new Set(processedData.map(config => config.brand))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Loading seat configurations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600">Failed to fetch seat configurations</p>
          <p className="text-sm text-gray-500 mt-2">{error?.message || 'Please try again later'}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="flex-1 transition-all duration-300">
          {/* Header */}
          <div className="bg-white shadow-sm p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate('/carpool')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back  
                  </button>
                  <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Car className="w-7 h-7 text-blue-600" />
                    Manage Seat Configurations
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4">
                  {/* Search and Filters Header */}
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search configurations..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 text-sm"
                        />
                      </div>
                      
                      <select
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="all">All Brands</option>
                        {uniqueBrands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => navigate('/carpool/addSeat')}
                      className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Configuration</span>
                    </button>
                  </div>

                  {/* Configuration Table - Full Width */}
                  <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse border border-gray-300 min-w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-16">S. No.</th>
                          {/* <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-48">Vehicle Details</th>
                          <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Brand</th> */}
                          <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Total Seats</th>
                          <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Available</th>
                          <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Rows</th>
                          {/* <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Status</th> */}
                          <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-32">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seatData?.length > 0 ? (
                          seatData.map((config,index) => {
                            const seatConfig = config.seatConfig;
                            const availability = getAvailabilityStatus(seatConfig?.availableSeats || 0, seatConfig?.totalSeats || 0);
                            
                            return (
                              <tr key={config._id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-3 py-2 text-xs">{index}</td>
                                {/* <td className="border border-gray-300 px-3 py-2 text-xs">
                                  <div>
                                    <div className="font-medium">{seatConfig?.vehicleName || 'Unnamed Vehicle'}</div>
                                    {seatConfig?.vehicleModel && (
                                      <div className="text-gray-500">{seatConfig.vehicleModel}</div>
                                    )}
                                  </div>
                                </td> */}
                                {/* <td className="border border-gray-300 px-3 py-2 text-center">
                                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {config.brand}
                                  </span>
                                </td> */}
                                <td className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-blue-600">
                                  {seatConfig?.totalSeats || 0}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-green-600">
                                  {seatConfig?.availableSeats || 0}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center text-xs">
                                  {seatConfig?.totalRows || 0}
                                </td>
                               
                                {/* <td className="border border-gray-300 px-3 py-2 text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    availability.color === 'green' ? 'bg-green-100 text-green-800' :
                                    availability.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                    availability.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                                    availability.color === 'red' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {availability.status}
                                  </span>
                                </td> */}
                                <td className="border border-gray-300 px-3 py-2">
                                  <div className="flex items-center justify-center space-x-2">
                                    <Eye 
                                      className="w-3 h-3 text-gray-600 cursor-pointer hover:text-gray-800" 
                                      onClick={() => handleViewConfig(config)}
                                      title="View Configuration"
                                    />
                                    <Edit 
                                      className={`w-3 h-3 cursor-pointer hover:text-blue-800 ${
                                        isEditing ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'
                                      }`}
                                      onClick={() => !isEditing && handleEdit(config._id)}
                                      title="Edit Configuration"
                                    />
                                    <Trash2 
                                      className={`w-3 h-3 cursor-pointer hover:text-red-800 ${
                                        isDeleting ? 'text-gray-400 cursor-not-allowed' : 'text-red-600'
                                      }`}
                                      onClick={() => !isDeleting && deleteSeatconfig(config._id)}
                                      title="Delete Configuration"
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="8" className="border border-gray-300 px-3 py-6 text-center text-gray-500 text-sm">
                              {/* {processedData.length === 0 && !isLoading ? 
                                'No seat configurations available.' : 
                                'No seat configurations found matching your search.'
                              } */}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h3 className="text-xs font-medium text-blue-700">Total Configurations</h3>
                      <p className="text-xl font-bold text-blue-900">{processedData.length}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h3 className="text-xs font-medium text-green-700">Total Available Seats</h3>
                      <p className="text-xl font-bold text-green-900">
                        {processedData.reduce((sum, config) => sum + (config.seatConfig?.availableSeats || 0), 0)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h3 className="text-xs font-medium text-purple-700">Custom Configs</h3>
                      <p className="text-xl font-bold text-purple-900">
                        {processedData.filter(config => config.seatConfig?.customRowConfig).length}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <h3 className="text-xs font-medium text-orange-700">With Driver</h3>
                      <p className="text-xl font-bold text-orange-900">
                        {processedData.filter(config => config.seatConfig?.hasDriver).length}
                      </p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <h3 className="text-xs font-medium text-indigo-700">Total Brands</h3>
                      <p className="text-xl font-bold text-indigo-900">{uniqueBrands.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Modal */}
        <ViewConfigModal 
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedConfig(null);
          }}
          config={selectedConfig}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          vehicleName={configToDelete?.seatConfig?.vehicleName || 'Unknown Vehicle'}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default AvailableSeates;