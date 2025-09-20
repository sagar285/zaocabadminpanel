import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import { Search, Plus, Eye, Edit, Trash2, ArrowLeft } from "lucide-react";
import {
  useCreateVechileCategoryMutation,
  useGetAllVehicleCategoryQuery,
  useEditVechileCategoryMutation,
  useDeleteCategoryMutation,
} from "../Redux/Api"; // Adjust import path as needed
import { baseUrl, baseUrll } from "../Url/baseUrl";
const url = `${baseUrl}/categoryIcons/`

// View Brand Modal Component (Read-Only)
const ViewBrandModal = ({ isOpen, onClose, brand }) => {
  if (!isOpen || !brand) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">View Brand Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Category
            </label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
              {brand.brandName}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Vehicle Icon
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
  {<img
                  src={`${url}/${brand?.vehicleIcon}`}
                  alt="Icon"
                  className="w-16 h-16 object-cover border rounded-md"
                />}            </div>
          </div>

          <div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                No of Seats
              </label>
              <p className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {brand.seats}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Order No
            </label>
            <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
              {brand.orderNo}
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

// Edit Brand Modal Component
const EditBrandModal = ({ isOpen, onClose, brand, onSave }) => {
  const [editCategory, { isLoading: isEditing }] =
    useEditVechileCategoryMutation();
  const {
    data: apiData,
    isLoading,
    isError,
    error,
    refetch: refetchCategory,
  } = useGetAllVehicleCategoryQuery();
  console.log(apiData)
  const [formData, setFormData] = useState({
    brandName: "",
    seats: "",
    status: "",
    description: "",
    orderNo: "",
    similarModal:"",
    image:"",

  });

  // Update form data when brand changes
  React.useEffect(() => {
    if (brand) {
      setFormData({
        brandName: brand.brandName || "",
        seats: brand.seats || "",
        status: brand.status || "",
        orderNo: brand.orderNo || "",

      });
    }
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
   
      const editCategoryData = new FormData();
      editCategoryData.append("orderNo",formData.orderNo);
      editCategoryData.append("brandName",formData.brandName);
      editCategoryData.append("seats",formData.seats);
      editCategoryData.append("status",formData.status);
      editCategoryData.append("similarModal",formData.similarModal);
      editCategoryData.append("description",formData.description);
      // editCategoryData.append("category_icon",formData.image)
     
      editCategoryData.append("category_icon", formData.image);
    

  //      console.log(
  // "FormData Entries:",
  // [...editCategoryData.entries()].reduce((acc, [key, value]) => {
  //   acc[key] = value;
  //   return acc;
  // }, {}))

      await editCategory({id:brand._id,data:editCategoryData}).unwrap();
      refetchCategory();
      console.log("Category updated successfully");
      onSave && onSave({ ...brand, ...formData  });
      onClose();
    } catch (error) {
      console.error("Failed to update category:", error);
      // You can add error handling here (e.g., toast notification)
    }
  };

  if (!isOpen || !brand) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Brand Details</h2>

  <form onSubmit={handleSubmit}>
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Order No
        </label>
        <input
          type="text"
          value={formData.orderNo}
          onChange={(e) =>
            setFormData({ ...formData, orderNo: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isEditing}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          No. of Seats
        </label>
        <input
          type="number"
          min="1"
          value={formData.seats}
          onChange={(e) =>
            setFormData({ ...formData, seats: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isEditing}
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Category</label>
      <input
        type="text"
        value={formData.brandName} 
        onChange={(e) =>
          setFormData({ ...formData,  brandName: e.target.value })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isEditing}
      />
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
        disabled={isEditing}
      >
        <option value="">Select Status</option>
        <option value="1">Active</option>
        <option value="0">De-active</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Similar Model</label>
      <input
        type="text"
        placeholder="Similar Model"
        value={formData.similarModel}
        onChange={(e) =>
          setFormData({ ...formData, similarModel: e.target.value })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isEditing}
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Vehicle Icon
      </label>
      <input
        type="file"
        accept="image/*" 
        onChange={(e) =>
          setFormData({
            ...formData,
            image: e.target.files[0]
          })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
        disabled={isEditing}
      />
      {formData.image && (
        <p className="text-sm text-gray-600 mt-1">
          Selected: {formData.image.name}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Description (Optional)
      </label>
      <textarea
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
        disabled={isEditing} 
      />
    </div>
  </div>

  <div className="flex justify-end space-x-3 mt-6">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
      disabled={isEditing}
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      disabled={isEditing}
    >
      {isEditing ? "Saving..." : "Save Changes"}
    </button>
  </div>
</form>
      </div>
    </div>
  );
};

const AddBrandModal = ({ isOpen, onClose, onSave }) => {
  const [addCategory, { isLoading: isAdding }] =
    useCreateVechileCategoryMutation();

  const [formData, setFormData] = useState({
    orderNo: "",
    brandName: "",
    seats: "",
    status: "1",
    description: "",
    similarModal:"",
    image:""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
           const categoryData = new FormData(); // ✅ सही class
  categoryData.append("orderNo", formData.orderNo);
  categoryData.append("brandName", formData.brandName);
  categoryData.append("seats", formData.seats);
  categoryData.append("status", formData.status);
  categoryData.append("similarModal", formData.similarModal);
  categoryData.append("description", formData.description);
  categoryData.append("category_icon", formData.image)

      // console.log(formData,categoryData);
      console.log(
  "FormData Entries:",
  [...categoryData.entries()].reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {})
);
      const result = await addCategory(categoryData).unwrap();

      console.log("Category added successfully:", result);

      // Reset form
      setFormData({
        orderNo: "",
        brandName: "",
        seats: "",
        similarModal: "",
        status: "1",
        vehicleIcon: "",
        image: null,
      });

      // Clear file input
      onSave && onSave(result);

      // Close modal
      onClose();
    } catch (error) {
      console.error("Failed to add category:", error);
      // You can add error handling here (e.g., toast notification)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Category Add</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
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
                disabled={isAdding}
              />
            </div>
            <div>
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
                disabled={isAdding}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                placeholder="Name"
                value={formData.brandName}
                onChange={(e) =>
                  setFormData({ ...formData, brandName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isAdding}
              />
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
                disabled={isAdding}
              >
                <option value="1">Active</option>
                <option value="0">De-Active</option>
              </select>
            </div>


  <div>
              <label className="block text-sm font-medium mb-2">Similar Model</label>
              <input
                type="text"
                placeholder="Similar Modal"
                value={formData.similarModal}
                onChange={(e) =>
                  setFormData({ ...formData, similarModal: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isAdding}
              />
            </div>
            

            <div>
              <label className="block text-sm font-medium mb-2">
                Vehicle Icon
              </label>
              <input
               type="file"
               placeholder="Icon"
               
               onChange={
                (e)=>setFormData({
                  ...formData,image:e.target.files[0]
                })
               }
              
              
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description (Optional)
              </label>
              <textarea
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div></div>
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

// Add Vehicle Name Modal Component (Optional - for future use)
const AddVehicleNameModal = ({ isOpen, onClose, onSave, selectedBrand }) => {};

const VechileCategory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const navigate = useNavigate();

const url = `${baseUrl}/categoryIcons/`
  // API hooks
  const {
    data: apiData,
    isLoading,
    isError,
    error,
    refetch: refetchCategory,
  } = useGetAllVehicleCategoryQuery();


  
  const [deleteCategory, { isLoading: isDeleting}] =
    useDeleteCategoryMutation();

 

  // Handle different API response structures
  const categories = React.useMemo(() => {
    if (!apiData) return [];


    // If API returns direct array
    if (Array.isArray(apiData)) return apiData;

    // If API returns object with data property
    if (apiData.data && Array.isArray(apiData.data)) return apiData.data;

    // If API returns object with categories property
    if (apiData.categories && Array.isArray(apiData.categories))
      return apiData.categories;

    // If API returns object with results property
    if (apiData.results && Array.isArray(apiData.results))
      return apiData.results;

    // Debug: log the actual structure
    console.log("Unexpected API response structure:", apiData);
    return [];
  }, [apiData]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSaveBrand = (brandData) => {
    console.log("Brand saved:", brandData);
    setShowAddBrandModal(false);
  };

  const handleEditBrand = (updatedBrand) => {
    setShowEditModal(false);
    setSelectedBrand(null);
  };

  const handleViewBrand = (brand) => {
    setSelectedBrand(brand);
    setShowViewModal(true);
  };

  const handleEditClick = (brand, brandObj) => {
    setSelectedBrand(brandObj);
    setShowEditModal(true);
  };

  const handleSaveVehicleName = (vehicleData) => {
    console.log("Vehicle name saved:", vehicleData);
    setShowAddVehicleModal(false);
    setSelectedBrand(null);
  };

  const handleAddVehicleName = (brand) => {
    setSelectedBrand(brand);
    setShowAddVehicleModal(true);
  };

  const handleDelete = async (brandId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        console.log(brandId);

        await deleteCategory(brandId);
        refetchCategory()
     

        console.log("Category deleted successfully");
      } catch (error) {
        console.error("Failed to delete category:", error);
        // You can add error handling here (e.g., toast notification)
      }
    }
  };

  // Filter categories based on search term with safety checks
  const filteredBrands = React.useMemo(() => {
    if (!Array.isArray(categories)) {
      console.log("Categories is not an array:", categories);
      return [];
    }

    if (!searchTerm.trim()) return categories;

    return categories.filter((brand) => {
      if (!brand) return false;

      const brandName = (brand.brandName || "").toLowerCase();
      const modelModels = (brand.modelModels || "").toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      return (
        brandName.includes(searchLower) || modelModels.includes(searchLower)
      );
    });
  }, [categories, searchTerm]);

  console.log(filteredBrands);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error loading categories: {error?.message || "Unknown error"}
          </p>
          <button
            onClick={() => window.location.reload()}
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
                  Category Management
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
                {/* Search and Category Add Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddBrandModal(true)}
                    className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Category Add</span>
                  </button>
                </div>

                {/* Category Table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse border border-gray-300 min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-16">
                          Od.No
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-32">
                          Category
                        </th>

                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 w-14">
                          VehicleIcon
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">
                          No of Seat
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
                      {filteredBrands?.length > 0 ? (
                        [...filteredBrands]?.sort((a,b)=>a.orderNo-b.orderNo)
                        .map((brand, index) => (
                          <tr key={brand.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-2 text-xs">
                              {brand?.orderNo}
                            </td>

                            <td className="border border-gray-300 px-3 py-2 text-xs font-medium">
                              {brand?.brandName}
                            </td>

                            <td className="border border-gray-300 px-3 py-2 text-xs font-medium">
                              {
                                <img
                      src={`${url}/${brand?.vehicleIcon}`}
                      alt="Icon"
                      className="w-16 h-16 object-cover border rounded-md"
                    />
                              }
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs">
                              {brand?.seats} seater
                            </td>
                            {/* <td className="border border-gray-300 px-3 py-2 text-xs">{brand.modelModels}</td> */}
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  brand.status === "1"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {brand.status === "1" ? "Active" : "De-active"}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-black underline-offset-1">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() =>
                                    navigate(
                                      "/vechile-category/add-category-vehicle",
                                      {
                                        state: {
                                          categoryId: brand._id,
                                          categoryName: brand.brandName,
                                          seats: brand.seats,
                                        },
                                      }
                                    )
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
                                  onClick={() =>
                                    handleEditClick(brand._id, brand)
                                  }
                                  title="Edit Brand"
                                />
                                <Trash2
                                  className={`w-3 h-3 text-red-600 cursor-pointer hover:text-red-800 ${
                                    isDeleting ? "opacity-50" : ""
                                  }`}
                                  onClick={() => handleDelete(brand._id)}
                                  title="Delete Brand"
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            className="border border-gray-300 px-3 py-6 text-center text-gray-500 text-sm"
                          >
                            {!Array.isArray(categories) ||
                            categories.length === 0
                              ? 'No categories added yet. Click "Category Add" to add your first category.'
                              : "No categories found matching your search."}
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
                      Total Categories
                    </h3>
                    <p className="text-xl font-bold text-blue-900">
                      {Array.isArray(categories) ? categories.length : 0}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-green-700">
                      Active Categories
                    </h3>
                    <p className="text-xl font-bold text-green-900">
                      {Array.isArray(categories)
                        ? categories.filter((b) => b?.status === "1").length
                        : 0}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-yellow-700">
                      Total Seats
                    </h3>
                    <p className="text-xl font-bold text-yellow-900">
                      {Array.isArray(categories)
                        ? categories.reduce(
                            (sum, b) => sum + parseInt(b?.seats || 0),
                            0
                          )
                        : 0}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h3 className="text-xs font-medium text-purple-700">
                      Vehicle Types
                    </h3>
                    <p className="text-xl font-bold text-purple-900">
                      {Array.isArray(categories)
                        ? new Set(
                            categories
                              .map((b) => b?.vehicleIcon)
                              .filter(Boolean)
                          ).size
                        : 0}
                    </p>
                  </div>
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
        isOpen={showAddVehicleModal}
        onClose={() => {
          setShowAddVehicleModal(false);
          setSelectedBrand(null);
        }}
        onSave={handleSaveVehicleName}
        selectedBrand={selectedBrand}
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

export default VechileCategory;
