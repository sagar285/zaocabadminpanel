import React, { useState, useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from ".././Sidebar";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  useAddCarpoolBrandNameMutation,
  useGetAllCarpoolBrandQuery,
  useAddCarpoolVechileColorMutation,
  useAddCarpoolVechileMutation,
  useGetAllCarpoolVechileQuery,
  useDeleteCarpoolBrandMutation,
  useGetAllVehicleCategoryQuery,
  useUpdateCarpoolBrandMutation
} from "../../Redux/Api.js";
import SweetAlert2 from 'react-sweetalert2';




// View Brand Modal Component (Read-Only)
const ViewBrandModal = ({ isOpen, onClose, brand }) => {
  if (!isOpen || !brand) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">View Brand Details</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                ID
              </label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {brand.vehicleId || brand.id}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Status
              </label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {brand.status}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Brand Name
            </label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
              {brand.brandName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                No of Seats
              </label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {brand.seats}
              </p>
            </div> */}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Vehicle Names
            </label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
              {brand.vehicleName || "No vehicles added"}
            </p>
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Vehicle Icon
            </label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md  text-center text-2xl">
              {brand.vehicleIcon}
            </p>
          </div> */}
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

// FIXED: Edit Brand Modal Component with proper API integration
const EditBrandModal = ({ isOpen, onClose, brand, onSave }) => {
  const [formData, setFormData] = useState({
    brandName: "",
    seats: "",
    similarModel: "",
    status: "",
    vehicleIcon: "",
  });

  const [updateBrand, { isLoading: isUpdating }] = useUpdateCarpoolBrandMutation();

  // Update form data when brand changes
  React.useEffect(() => {
    if (brand) {
      setFormData({
        brandName: brand.brandName || "",
        seats: brand.seats || "",
        similarModel: brand.similarModel || "",
        status: brand.status === "Active" ? "1" : "00",
        vehicleIcon: brand.vehicleIcon || "",
      });
    }
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = {
        id:brand.id,
        brandName: formData.brandName,
        noOfSeats: parseInt(formData.seats),
        similarModel: formData.similarModel,
        status: formData.status,
        vehicleIcon: formData.vehicleIcon,
      };

      console.log("Updating brand with data:", updateData);
      console.log("Brand ID:", brand.id);

      // Call the update mutation
      const result = await updateBrand({
        id: brand.id,
        ...updateData
      })

      console.log("Update API Success Response:", result);

      // Call parent onSave function
      onSave(result);

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error updating brand:", error);
      alert(`Error updating brand: ${error.data?.message || 'Please try again.'}`);
    }
  };

  if (!isOpen || !brand) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Brand Details</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) =>
                  setFormData({ ...formData, brandName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isUpdating}
              />
            </div>

            <div className="">
              {/* <div>
                <label className="block text-sm font-medium mb-2">
                  No. of Seats
                </label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) =>
                    setFormData({ ...formData, seats: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isUpdating}
                />
              </div> */}
              {/* <div>
                <label className="block text-sm font-medium mb-2">
                  Similar Model
                </label>
                <input
                  type="text"
                  value={formData.similarModel}
                  onChange={(e) =>
                    setFormData({ ...formData, similarModel: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                />
              </div> */}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isUpdating}
              >
                <option value="">Select Status</option>
                <option value="1">Active</option>
                <option value="00">De-active</option>
              </select>
            </div>

            {/* <div>
              <label className="block text-sm font-medium mb-2">
                Vehicle Icon
              </label>
              <select
                value={formData.vehicleIcon}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleIcon: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUpdating}
              >
                <option value="">Select Icon</option>
                <option value="🚗">🚗 Car</option>
                <option value="🚙">🚙 SUV</option>
                <option value="🚐">🚐 Van</option>
                <option value="🚚">🚚 Truck</option>
                <option value="🏎️">🏎️ Sports Car</option>
              </select>
            </div> */}
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Brand Modal Component
const AddBrandModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    brandName: "",
    seats: "",
    status: "1",
  });
const [errorHandle,seterrorHandle] =useState(null);
  const [addBrandMutation, { isLoading: isAddingBrand }] =
    useAddCarpoolBrandNameMutation();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    // formdata.append("brand_image", formData.image);
    // formdata.append("brandName", formData.brandName);
    // formdata.append("orderNo", formData.orderNo);
    // formdata.append("noOfSeats", formData.seats);
    // formdata.append("status", formData.status);
    const postdata ={
       brandName :formData.brandName ,   status :formData.status
    }

    try {
      const result = await addBrandMutation(postdata);
      console.log("API Success Response:", result);
    if(result.data){
      onSave(result);
   setFormData({
  
        brandName: "",
        seats: "",
        status: "1",
      });
      
      onClose();
    }

    if(result.error){
      console.log(result.error, "yeh aa rhi hai")
      seterrorHandle(result.error?.data?.message)
      return;
    }

      // Reset form
   

    
    } catch (error) {
      console.error("API Error Details:", error);
      if (error.data?.message) {
        // alert(`Error: ${error.data.message}`);                                                                                        
      } else if (error.status === 500) {
        // alert("Server error. Please check your data and try again.");
      } else {
        // alert("Error adding brand. Please try again.");
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Brand</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                Order No.
              </label>
              <input
                type="text"
                placeholder="Number"
                value={formData.orderNo}
                onChange={(e) =>
                  setFormData({ ...formData, orderNo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isAddingBrand}
              />
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                No. of seats
              </label>
              <input
                type="number"
                placeholder="No. of seat"
                value={formData.seats}
                onChange={(e) =>
                  setFormData({ ...formData, seats: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isAddingBrand}
              />
            </div> */}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Brand Name
              </label>
              <input
                type="text"
                placeholder="Name"
                value={formData.brandName}
                onChange={(e) =>
                  setFormData({ ...formData, brandName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isAddingBrand}
              />

               {
              errorHandle && (
                <div>
                  <p className="text-red-800">{errorHandle}</p>
                </div> 
              )
            }
            </div>

           
            <div>
              <label className="block text-sm font-medium mb-2">
                Status (1= Active, 00= De-Active)
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isAddingBrand}
              >
                <option value="1">1 - Active</option>
                <option value="00">00 - De-Active</option>
              </select>
            </div>
          </div>
{/* 
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Upload Image(Required)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              disabled={isAddingBrand}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-2"
              disabled={isAddingBrand}
            >
              {isAddingBrand && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isAddingBrand ? "Adding..." : "Add"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Vehicle Name Modal Component
export const AddVehicleNameModal = ({
  isOpen,
  onClose,
  onSave,
  selectedBrand,
  brands,
  vehicle,
  brand_id,
  localBrands,
}) => {
  const [addVehicleMutation, { isLoading: isAddingVehicle }] =
    useAddCarpoolVechileMutation();

      const { data: apiDataa, isLoading, isError, error } = useGetAllVehicleCategoryQuery();
      console.log(apiDataa)

  const [formData, setFormData] = useState({
    brandId: brand_id[0]?._id,
    // orderNo: "",
    brandName: "",
    vehicleName: "",
    status: "1",
  });


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiData = {
        brandId: formData.brandId,
        brandName: formData.brandName,
        // orderNo: formData.orderNo,
        vehicleName: formData.vehicleName,
        status: formData.status,
      };

      console.log("Adding vehicle with data:", apiData);

      const result = await addVehicleMutation(apiData);

      if(result.data){
        onSave(result);
        setFormData({
          brandId: "",
          vehicleName: "",
          brandName: "",
          status: "1",
        });
        onClose();
        alert("vehicle added succesfully");
        return;
      }
     
    } catch (error) {
console.error("Error adding vehicle:", error);
onClose();
      // alert("Error adding vehicle. Please try again.",error);
    }
  };

  React.useEffect(() => {
    if (selectedBrand) {
      setFormData((prev) => ({
        ...prev,
        brandId: selectedBrand.id,
      }));
    }
  }, [selectedBrand]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Vehicle Name</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                Order No.
              </label>
              <input
                type="text"
                placeholder="Number"
                value={formData.orderNo}
                onChange={(e) =>
                  setFormData({ ...formData, orderNo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isAddingVehicle}
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Status (1= Active, 00= De-Active)
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isAddingVehicle}
              >
                <option value="1">1 - Active</option>
                <option value="00">00 - De-Active</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Vehicle Name
            </label>
            <input
              type="text"
              placeholder="Vehicle Name (e.g., Swift, Baleno, Creta)"
              value={formData.vehicleName}
              onChange={(e) =>
                setFormData({ ...formData, vehicleName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isAddingVehicle}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Brand Name</label>
            <select
  value={formData.brandName}
  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  required
  disabled={isAddingVehicle}
>
  <option value="">Select a brand</option>
  {apiDataa?.map((category) => (

    category?.status === '1'&&(
       <option key={category?._id} value={category?.brandName}>
      {category?.brandName}
    </option>
    )
   
   
  ))}
</select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              disabled={isAddingVehicle}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-2"
              disabled={isAddingVehicle}
            >
              {isAddingVehicle && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isAddingVehicle ? "Adding..." : "Add"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BrandManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [localBrands, setLocalBrands] = useState([]);
  const navigate = useNavigate();

  // FIXED: RTK Query hooks properly placed at component level
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteCarpoolBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateCarpoolBrandMutation();

  // API Integration
  const {
    data: apiData,
    error: fetchError,
    isLoading: isFetchingBrands,
    refetch: refetchBrands,
  } = useGetAllCarpoolBrandQuery();

  console.log("API Data:", apiData);

  // Effect to handle API data and transform it to local format
  useEffect(() => {
    if (apiData && apiData.data) {
      const transformedBrands = apiData.data.map((brand, index) => ({
        id: brand._id,
        sn: String(index + 1).padStart(2, "0"),
        vehicleId: brand.vehicleId || String.fromCharCode(65 + index),
        vehicleIcon: brand.vehicleIcon || "🚗",
        brandName: brand.brandName,
        seats: brand.seats || brand.noOfSeats,
        vehicleName: brand.vehicles?.join(",") || "",
        similarModel: brand.similarModel || brand.modelModels,
        status:
          brand.status === "1" || brand.status === 1 ? "Active" : "De-active",
      }));
      setLocalBrands(transformedBrands);
      console.log("Transformed brands:", transformedBrands);
    }
  }, [apiData]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSaveBrand = async (newBrandFromAPI) => {
    refetchBrands();
    setShowAddBrandModal(false);
  };

  // FIXED: Delete brand function with proper error handling
  const handleDeleteBrand = async (brandId) => {
      try {
        console.log("Deleting brand with ID:", brandId);
        
        // Call the delete mutation
        const result = await deleteBrand(brandId)
        
        console.log("Brand deleted successfully:", result.error);
        
        // Refresh data after deletion
        refetchBrands();
        
        // Show success message
        alert("Brand deleted successfully!");
        
      } catch (error) {
        console.error("Error deleting brand:", error);
        
        // Show specific error message
        const errorMessage = error.data?.message || error.message || "Failed to delete brand";
        alert(`Error: ${errorMessage}`);
      }
    
  };

  // FIXED: Edit brand function with proper API integration
  const handleEditBrand = async (updatedData) => {
    try {
      console.log("Updating brand with data:", updatedData);
      
     const res = updateBrand(updatedData)
     console.log(res);
     
      refetchBrands();
      
      // Close modal and reset selected brand
      setShowEditModal(false);
      setSelectedBrand(null);
      
      // Show success message
      
    } catch (error) {
      console.error("Error in handleEditBrand:", error);
      // Error is already handled in EditBrandModal component
    }
  };

  const handleViewBrand = (brand) => {
    setSelectedBrand(brand);
    setShowViewModal(true);
  };

  const handleEditClick = (brand) => {
    setSelectedBrand(brand);
    setShowEditModal(true);
  };

  const handleSaveVehicleName = (vehicleData) => {
    setLocalBrands(
      localBrands.map((brand) =>
        brand._id === parseInt(vehicleData.brandId)
          ? {
              ...brand,
              vehicleName: brand.vehicleName
                ? `${brand.vehicleName}, ${vehicleData.vehicleName}`
                : vehicleData.vehicleName,
            }
          : brand
      )
    );
    setShowAddVehicleModal(false);
    setSelectedBrand(null);
  };

  const handleAddVehicleName = (brand = null) => {
    setSelectedBrand(brand);
    setShowAddVehicleModal(true);
  };

  // Filter brands based on search term
  const filteredBrands = localBrands.filter(brand =>
    brand.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (brand.vehicleName && brand.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Loading state
  if (isFetchingBrands) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading brands...</span>
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
            Error loading brands: {fetchError.message}
          </p>
          <button
            onClick={refetchBrands}
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
                  onClick={() => navigate("/carpool")}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Carpool
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                  Brand Management
                </h1>
              </div>
              <button
                onClick={refetchBrands}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 flex items-center space-x-1"
                disabled={isFetchingBrands}
              >
                <Loader2 className={`w-3 h-3 ${isFetchingBrands ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4">
                {/* Search and Add Buttons Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search brands or vehicles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowAddBrandModal(true)}
                      className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Brand</span>
                    </button>
                  </div>
                </div>

                {/* Brand Table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse border border-gray-300 min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-16">
                          SN
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-16">
                          ID
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-32">
                          Brand Name
                        </th>
                       
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-48">
                          Vehicle Name
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">
                          Status
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-48">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBrands.length > 0 ? (
                        filteredBrands.map((brand, index) => (
                          <tr
                            key={`brand-${brand.id}-${index}`}
                            className="hover:bg-gray-50"
                          >
                            <td className="border border-gray-300 px-3 py-2 text-xs">
                              {brand.sn}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-xs font-medium">
                              {brand.vehicleId}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-xs font-medium">
                              {brand.brandName}
                            </td>
                           
                            <td className="border border-gray-300 px-3 py-2 text-xs">
                              {brand.vehicleName || "No vehicles added"}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  brand.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {brand.status}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  className="text-blue-600 hover:text-blue-800 underline text-xs"
                                  onClick={() =>
                                    navigate("/carpool/addcarpool-vechile", {
                                      state: {
                                        vehicleId: brand.id,
                                        brandName: brand.brandName,
                                      },
                                    })
                                  }
                                >
                                  Add vehicle
                                </button>
                                <Eye
                                  className="w-3 h-3 text-gray-600 cursor-pointer hover:text-gray-800"
                                  onClick={() => handleViewBrand(brand)}
                                  title="View Details"
                                />
                                <Edit
                                  className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-800"
                                  onClick={() => handleEditClick(brand)}
                                  title="Edit Brand"
                                  disabled={isUpdating}
                                />
                                <Trash2
                                  className={`w-3 h-3 cursor-pointer hover:text-red-800 ${
                                    isDeleting ? 'text-gray-400 cursor-not-allowed' : 'text-red-600'
                                  }`}
                                  onClick={() => !isDeleting && handleDeleteBrand(brand.id)}
                                  title={isDeleting ? "Deleting..." : "Delete Brand"}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key="no-data">
                          <td
                            colSpan="7"
                            className="border border-gray-300 px-3 py-6 text-center text-gray-500 text-sm"
                          >
                            {searchTerm
                              ? "No brands found matching your search."
                              : "No brands available. Add a brand to get started."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-blue-700">
                      Total Brands
                    </h3>
                    <p className="text-xl font-bold text-blue-900">
                      {localBrands.length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-green-700">
                      Active Brands
                    </h3>
                    <p className="text-xl font-bold text-green-900">
                      {localBrands.filter((b) => b.status === "Active").length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-yellow-700">
                      Total Seats
                    </h3>
                    <p className="text-xl font-bold text-yellow-900">
                      {localBrands.reduce(
                        (sum, b) => sum + (parseInt(b.seats) || 0),
                        0
                      )}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-purple-700">
                      Vehicle Models
                    </h3>
                    <p className="text-xl font-bold text-purple-900">
                      {
                        localBrands.filter(
                          (b) => b.vehicleName && b.vehicleName.trim()
                        ).length
                      }
                    </p>
                  </div>
                </div>

                {/* API Status Indicator */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Connected to API</span>
                  </div>
                  <div>Last updated: {new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddBrandModal
        isOpen={showAddBrandModal}
        onClose={() => setShowAddBrandModal(false)}
        onSave={handleSaveBrand}
      />

      <AddVehicleNameModal
        brand_id={localBrands}
        isOpen={showAddVehicleModal}
        onClose={() => {
          setShowAddVehicleModal(false);
          setSelectedBrand(null);
        }}
        onSave={handleSaveVehicleName}
        selectedBrand={selectedBrand}
        brands={localBrands}
      />

      <ViewBrandModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedBrand(null);
        }}
        brand={selectedBrand}
      />

      <EditBrandModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBrand(null);
        }}
        brand={selectedBrand}
        onSave={handleEditBrand}
      />
    </div>
  );
};

export default BrandManagement;