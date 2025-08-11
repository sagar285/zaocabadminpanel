import React, { useState } from "react";
import Sidebar from "../Component/Sidebar";
import {
  useAddCategoryMutation,
  useDeleteCategoryByAdminMutation,
  useEditCategoryMutation,
  useGetCategoriesQuery,
  useLazyCategorySearchQuery,
  useUpdateCategoryByAdminMutation,
} from "../Redux/Api";
import { Link } from "react-router-dom";
import {
  DeleteIcon,
  EditIcon,
  ViewIcon,
  LucideDelete,
  Trash,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../Url/baseUrl";
import CategoryEditModal from "../Component/Modal/EditCategoryModal";

const Category = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data, error, loading } = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [NumberofSheet, setNumberOfSheet] = useState(0);
  const [subcategories, setSubcategories] = useState([""]);
  const [logoPreview, setLogoPreview] = useState(null);

  const [index, setIndex] = useState(null);
  const [logo, setLogo] = useState(null); // State to store the logo file
  const [DeleteCategory] = useDeleteCategoryByAdminMutation();
  const [UpdateCategory] = useUpdateCategoryByAdminMutation();
  const [EditCategory] = useEditCategoryMutation();
  const [triggerSearch, { data: searchData }] = useLazyCategorySearchQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, ""]);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      triggerSearch(value); // Call the search API with input value
    }
  };

  const displayData =
    searchTerm.length > 0 ? searchData?.category : data?.categories;

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setLogo(file); // Set the logo state to the selected file
      const reader = new FileReader(); // Create a new FileReader to read the file
      reader.onloadend = () => {
        setLogoPreview(reader.result); // Set the logo preview to the result of FileReader
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleSubcategoryChange = (index, value) => {
    const newSubcategories = subcategories.map((sub, i) =>
      i === index ? value : sub
    );
    setSubcategories(newSubcategories);
  };

  const url = `${baseUrl}/vehicleCategoryLogo`;

  const handleSubmit = async () => {
    const formdata = new FormData();
    formdata.append("categoryName", categoryName);
    formdata.append("description", description);
    formdata.append("vehicle_category_logo", logo);
    formdata.append("NumberofSeats", NumberofSheet);
    formdata.append("index", index);
    formdata.append("subcategory", subcategories);
    try {
      const { data: responseData, error } = await addCategory(formdata);
      if (responseData) {
        toast.success("Category added successfully!");
        setIsModalOpen(false);
        setCategoryName("");
        setSubcategories([""]);
        setLogo(null);
        setIndex(0);
        setNumberOfSheet(null);
        setLogoPreview(null);
      }
      if (error) {
        console.log(error?.data?.message);
        toast.error(error?.data?.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteVehicleCategory = async (id) => {
    try {
      const { data, error } = await DeleteCategory(id);
      console.log(data);
      if (data) {
        toast.success("Category deleted successfully!");
      }
      if (error) {
        toast.error("Error deleting category");
      }

      // setIsModalOpen(false)
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (category) => {
    setEditData(category);
    setIsEditModalOpen(true);
  };

  const EditCategoryApi = async (category) => {
    const postdata = {
      categoryName: category?.categoryName,
      subcategory: category?.subcategories,
      index: category?.index,
      NumberofSeats: category?.numberOfSheet,
      description: category?.description,
      img : category?.img,
      logo: category?.logo,
      id: category?.id,
    };
    const formdata = new FormData();
    formdata.append("categoryName", postdata?.categoryName);
    formdata.append("description", postdata?.description);
    formdata.append("vehicle_category_logo", postdata?.logo);
    formdata.append("NumberofSeats", postdata?.NumberofSeats);
    formdata.append("index", postdata?.index);
    formdata.append("img",postdata?.img)
    formdata.append("id",postdata?.id)
    formdata.append("subcategory", postdata?.subcategory);
    const { data, error } = await UpdateCategory(formdata);
    console.log(data, error, "useeeeeeee");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      <div
        className={`flex-1 p-8 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <h1 className="font-bold text-3xl mb-4">Categories</h1>
        <div className="w-1/2">
          <input
            type="text"
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            placeholder="Search Category..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-row justify-end">
          <button
            className="text-white bg-blue-600 rounded-md p-2"
            onClick={() => setIsModalOpen(true)}
          >
            Add Category
          </button>
        </div>

        {/* Display Categories */}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  #
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Number of Seats
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Logo
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData?.map((category, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {category?.categoryName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {category?.NumberofSeats} Seats
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {category?.description}
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src={`${url}/${category?.categoryLogo}`}
                      alt="Logo"
                      className="w-16 h-16 object-cover border rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 flex gap-2 flex-row">
                    <Link
                      to={`/category/${category?.categoryName}`}
                      className="text-blue-500 hover:underline"
                    >
                      <ViewIcon color="green" />
                    </Link>
                    <button
                      onClick={() => handleDeleteVehicleCategory(category?._id)}
                    >
                      <Trash />
                    </button>
                    <button onClick={() => handleEdit(category)}>
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 h-[80%] rounded shadow-lg overflow-y-scroll">
            <h2 className="text-xl font-semibold mb-4">Add Category</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />

              <label className="block text-sm font-medium text-gray-700">
                Index number
              </label>
              <input
                type="text"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <label className="block text-sm font-medium text-gray-700">
                Number of Sheet
              </label>
              <input
                type="number"
                value={NumberofSheet}
                onChange={(e) => setNumberOfSheet(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {subcategories.map((sub, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Subcategory {index + 1}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sub}
                    onChange={(e) =>
                      handleSubcategoryChange(index, e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    onClick={() =>
                      setSubcategories(
                        subcategories.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}

            <label className="block text-sm font-medium text-gray-700">
              description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />

            {/* Logo Upload */}
            <label className="block text-sm font-medium text-gray-700">
              Add Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {logoPreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">Logo Preview:</p>
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="mt-2 w-24 h-24 object-cover border rounded-md"
                />
              </div>
            )}

            <button
              onClick={handleAddSubcategory}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 mr-2"
            >
              Add Subcategory
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
            >
              Submit
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <CategoryEditModal
        visible={isEditModalOpen}
        data={editData}
        closeModal={() => setIsEditModalOpen(false)}
        onConfirm={(data) => EditCategoryApi(data)}
      />

      <Toaster />
    </div>
  );
};

export default Category;
