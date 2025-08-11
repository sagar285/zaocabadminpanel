import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '.././Sidebar';
import { Search, Plus, Eye, Edit, Trash2, ArrowLeft } from 'lucide-react';
import {useGetAllCarpoolVechileQuery,useAddCarpoolVechileColorMutation} from '../../Redux/Api'

import { AddVehicleNameModal } from './BrandManagement';
// View Vehicle Modal Component (Read-Only)


// Edit Vehicle Modal Component
const EditVehicleModal = ({ isOpen, onClose, vehicle, onSave }) => {
  const [formData, setFormData] = useState({
    vehicleName: '',
    brandName: '',
    modelYear: '',
    fuelType: '',
    color: '',
    seats: '',
    status: ''
  });

  // Update form data when vehicle changes
  React.useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleName: vehicle.vehicleName || '',
        brandName: vehicle.brandName || '',
        modelYear: vehicle.modelYear || '',
        fuelType: vehicle.fuelType || '',
        color: vehicle.color || '',
        seats: vehicle.seats || '',
        status: vehicle.status || ''
      });
    }
  }, [vehicle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...vehicle, ...formData });
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Vehicle Details</h2>
        
        <form onSubmit=''>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Vehicle Name</label>
              <input
                type="text"
                value={formData.vehicleName}
                onChange={(e) => setFormData({...formData, vehicleName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand Name</label>
              <select
                value={formData.brandName}
                onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Brand</option>
                <option value="Tata">Tata</option>
                <option value="Maruti">Maruti</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Honda">Honda</option>
                <option value="Toyota">Toyota</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Model Year</label>
                <input
                  type="text"
                  value={formData.modelYear}
                  onChange={(e) => setFormData({...formData, modelYear: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fuel Type</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Seats</label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) => setFormData({...formData, seats: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="De-active">De-active</option>
              </select>
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

// Add Vehicle Name Modal Component
// const AddVehicleNameModal = ({ isOpen, onClose, onSave,brand_id }) => {
//   // const [formData, setFormData] = useState({
//   //   orderNo: '',
//   //   vehicleName: '',
//   //   brandName: '',
//   //   status: '1'
//   // });

//       const [addVehicleMutation, { isLoading: isAddingVehicle }] = useAddCarpoolVechileColorMutation()
  


//         const [formData, setFormData] = useState({
//             orderNo: '',
//             brandName: '',
//             vehicleName:'',
//             status: '1'
//           });


//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//     setFormData({ orderNo: '', vehicleName: '', brandName: '', status: '1' });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4">Add Vehicle Name</h2>
        
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Order No.</label>
//               <input
//                 type="text"
//                 placeholder="Number"
//                 value={formData.orderNo}
//                 onChange={(e) => setFormData({...formData, orderNo: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Status (1= Active, 00= De-Active)</label>
//               <input
//                 type="text"
//                 placeholder="Status"
//                 value={formData.status}
//                 onChange={(e) => setFormData({...formData, status: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-2">Vehicle Name</label>
//             <input
//               type="text"
//               placeholder="Vehicle Name"
//               value={formData.vehicleName}
//               onChange={(e) => setFormData({...formData, vehicleName: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-2">Brand Name</label>
//             <select
//               value={formData.brandName}
//               onChange={(e) => setFormData({...formData, brandName: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="">Select Brand</option>
//               <option value="Tata">Tata</option>
//               <option value="Maruti">Maruti</option>
//               <option value="Hyundai">Hyundai</option>
//               <option value="Honda">Honda</option>
//               <option value="Toyota">Toyota</option>
//             </select>
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//             >
//               Close
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//             >
//               Add
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

export const VehicleNameManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [localBrands, setLocalBrands] = useState([]);
  
  const navigate = useNavigate();
  // Sample vehicle data - replace with API calls
  // const [vehicles, setVehicles] = useState([
  //   {
  //     id: 1,
  //     sn: '01',
  //     vehicleId: 'V001',
  //     vehicleIcon: '🚗',
  //     vehicleName: 'Indigo',
  //     brandName: 'Tata',
  //     modelYear: '2022',
  //     fuelType: 'Petrol',
  //     color: 'White',
  //     seats: 4,
  //     status: 'Active'
  //   },
  //   {
  //     id: 2,
  //     sn: '02',
  //     vehicleId: 'V002',
  //     vehicleIcon: '🚗',
  //     vehicleName: 'Zest',
  //     brandName: 'Tata',
  //     modelYear: '2023',
  //     fuelType: 'Diesel',
  //     color: 'Silver',
  //     seats: 4,
  //     status: 'Active'
  //   },
  //   {
  //     id: 3,
  //     sn: '03',
  //     vehicleId: 'V003',
  //     vehicleIcon: '🚙',
  //     vehicleName: 'Swift',
  //     brandName: 'Maruti',
  //     modelYear: '2023',
  //     fuelType: 'Petrol',
  //     color: 'Red',
  //     seats: 5,
  //     status: 'Active'
  //   },
  //   {
  //     id: 4,
  //     sn: '04',
  //     vehicleId: 'V004',
  //     vehicleIcon: '🚙',
  //     vehicleName: 'Baleno',
  //     brandName: 'Maruti',
  //     modelYear: '2022',
  //     fuelType: 'Petrol',
  //     color: 'Blue',
  //     seats: 5,
  //     status: 'De-active'
  //   },
  //   {
  //     id: 5,
  //     sn: '05',
  //     vehicleId: 'V005',
  //     vehicleIcon: '🚐',
  //     vehicleName: 'Creta',
  //     brandName: 'Hyundai',
  //     modelYear: '2024',
  //     fuelType: 'Petrol',
  //     color: 'Black',
  //     seats: 7,
  //     status: 'Active'
  //   }
  // ]);


   const { 
      data, 
      error: fetchError, 
      isLoading: isFetchingBrands, 
      refetch: refetchBrands 
    } = useGetAllCarpoolVechileQuery();
    const vehicles = data?.data;
    console.log(data,fetchError,"api response data");
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSaveVehicle = (vehicleData) => {
    const newVehicle = {
      id: vehicles.length + 1,
      sn: String(vehicles.length + 1).padStart(2, '0'),
      vehicleId: `V${String(vehicles.length + 1).padStart(3, '0')}`,
      vehicleIcon: '🚗',
      vehicleName: vehicleData.vehicleName,
      brandName: vehicleData.brandName,
      modelYear: '2024',
      fuelType: 'Petrol',
      color: 'White',
      seats: 5,
      status: vehicleData.status === '1' ? 'Active' : 'De-active'
    };
    
    setVehicles([...vehicles, newVehicle]);
    setShowAddVehicleModal(false);

  };

  // const handleEditVehicle = (updatedVehicle) => {
  //   setVehicles(vehicles.map(vehicle => 
  //     vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
  //   ));
  //   setShowEditModal(false);
  //   setSelectedVehicle(null);
  // };

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowViewModal(true);
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
  };

  const handleDelete = (vehicleId) => {
    vehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
  };

  const filteredVehicles = vehicles?.filter(vehicle =>
    vehicle.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.fuelType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
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
                  onClick={() => navigate('/carpool')}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Carpool
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Vehicle Name Management</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4">
                {/* Search and Add Vehicle Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search vehicles..."
                        // value={searchTerm}
                        // onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 text-sm"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowAddVehicleModal(true)}
                    className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Vehicle Name</span>
                  </button>
                </div>

                {/* Vehicle Table - Full Width */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse border border-gray-300 min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-16">SN</th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-20">Vehicle ID</th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-32">Vehicle Name</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Status</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-32">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVehicles?.length > 0 ? (
                        filteredVehicles?.map((vehicle, index) => (
                          <tr key={vehicle.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-2 text-xs">{index+1}</td>
                            <td className="border border-gray-300 px-3 py-2 text-xs font-medium">{vehicle.orderNo}</td>
                            <td className="border border-gray-300 px-3 py-2 text-xs font-medium">{vehicle.vehicleName}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                vehicle.status === 1
                                  ? `bg-green-100 text-green-800` 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {vehicle.status===1?"Active":"Dactive"}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <div className="flex items-center justify-center space-x-2">
                                <Eye 
                                  className="w-3 h-3 text-gray-600 cursor-pointer hover:text-gray-800" 
                                  onClick={() => handleViewVehicle(vehicle)}
                                  title="View Details"
                                />
                                <Edit 
                                  className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-800" 
                                  onClick={() => handleEditClick(vehicle)}
                                  title="Edit Vehicle"
                                />
                                <Trash2 
                                  className="w-3 h-3 text-red-600 cursor-pointer hover:text-red-800" 
                                  onClick={() => handleDelete(vehicle.id)}
                                  title="Delete Vehicle"
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="border border-gray-300 px-3 py-6 text-center text-gray-500 text-sm">
                            No vehicles found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-blue-700">Total Vehicles</h3>
                    <p className="text-xl font-bold text-blue-900">{vehicles?.length}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-green-700">Active Vehicles</h3>
                    <p className="text-xl font-bold text-green-900">
                      {vehicles?.filter(v => v.status === 1).length}
                    </p>
                  </div>
                 
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-purple-700">Fuel Types</h3>
                    <p className="text-xl font-bold text-purple-900">
                      {[...new Set(vehicles?.map(v => v.fuelType))].length}
                    </p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-indigo-700">Brands</h3>
                    <p className="text-xl font-bold text-indigo-900">
                      {[...new Set(vehicles?.map(v => v.brandName))].length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* <AddVehicleNameModal 
        isOpen={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        onSave={handleSaveVehicle}
      /> */}

<AddVehicleNameModal
 isOpen={showAddVehicleModal}
      onClose={() => setShowAddVehicleModal(false)}
brand_id={localBrands}
//  onClose={setShowAddVehicleModal(fals)}

/>



      <EditVehicleModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedVehicle(null);
        }}
        vehicle={selectedVehicle}
        // onSave={handleEditVehicle}
      />
    </div>
  );
};

export default VehicleNameManagement;