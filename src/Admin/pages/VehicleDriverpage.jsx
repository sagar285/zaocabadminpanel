import React, { useState, useEffect } from "react";
import {
  Car,
  Hash,
  Calendar,
  Users,
  Fuel,
  Palette,
  FileCheck,
  Shield,
  CheckCheckIcon
} from "lucide-react";
import { baseUrl } from "../Url/baseUrl";

import { useParams } from "react-router-dom";
import {
  useGetCategoriesQuery,
  useGetVehicleByIdQuery,
  useUpdateVehiclePermitStatusMutation,
  useUpdateVehicleInfoMutation
} from "../Redux/Api";
import toast, { Toaster } from "react-hot-toast";

const VehicleDriverPage = ({ initialData,verified,haldeVehicleinfoApi }) => {
  const { id } = useParams();
  const [updateVehicleInfo] = useUpdateVehicleInfoMutation();
  const {
    data: vehicleCategories,
    error: vehicleCategoriesError,
    loading,
  } = useGetCategoriesQuery();

  const subcategoriesMap = {
    Sedan: ["Compact Sedan", "Mid-size Sedan", "Luxury Sedan"],
    SUV: ["Compact SUV", "Mid-size SUV", "Full-size SUV"],
    Hatchback: ["Mini Hatchback", "Premium Hatchback"],
  };

 

  const color = [
    { name: "White", color: "#ffffff" },
    { name: "Silver", color: "#C0C0C0" },
    { name: "Black", color: "#000000" },
    { name: "Gray", color: "#808080" },
    { name: "Golden", color: "#756300" },
    { name: "Maroon", color: "#800000" },
    { name: "Brown", color: "#A52A2A" },
    { name: "Yellow", color: "#FFFF00" },
    { name: "Green", color: "#008000" },
    { name: "Orange", color: "#FFA500" },
    { name: "Blue", color: "#0000FF" },
    { name: "Purple", color: "#800080" },
    { name: "Dark Blue", color: "#020a52" },
    { name: "Red", color: "#FF0000" },
  ];

  const modelYear = [
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
  ];

  const fuel = ["Petrol", "Diesel", "Electric", "CNG"];
  const seat = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50",
  ];


  const [formData, setFormData] = useState({
    vehicleName: "",
    vehicleCategory: "",
    vehicleSubCategory: "",
    vehicleNumber: "",
    modelYear: "",
    seat: "",
    fuel: "",
    color: "",
  });

  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [change, setChange] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicleName: initialData.vehicleName || "",
        vehicleCategory: initialData.vehicleCategory || "",
        vehicleSubCategory: initialData.vehicleSubCategory || "",
        vehicleNumber: initialData.vehicleNumber || "",
        modelYear: initialData.modelYear || "",
        seat: initialData.seat || "",
        fuel: initialData.fuel || "",
        color: initialData.color || "",
      });
    }
  }, [initialData]);

  const onUpdate = async (data) => {

    try {
      const postdata = {
        id: initialData?._id,
        vehicleCategory: formData?.vehicleCategory,
        vehicleName: formData?.vehicleName,
        vehicleNumber: formData?.vehicleNumber,
        color: formData?.color,
        modelYear: formData?.modelYear,
        fuel: formData?.fuel,
        seat: formData?.seat,
      };
    
      const { data, error } = await updateVehicleInfo(postdata);
      console.log(data, error, "update vehicle info");
      if (data) {
        toast.success("updated succesfully");
      } else {
        toast.error("error in updating vehicle info");
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    if (formData.vehicleCategory) {
      setAvailableSubcategories(
        subcategoriesMap[formData.vehicleCategory] || []
      );
    }
  }, [formData.vehicleCategory]);

  const handleInputChange = (e) => {
    setChange(true);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 

  

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Vehicle Information
        </h2>

       

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Name
            </label>
            <InputField
              Icon={Car}
              name="vehicleName"
              value={formData.vehicleName}
              onChange={handleInputChange}
              placeholder="Vehicle Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Category
            </label>
            <div className="relative">
              <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="vehicleCategory"
                value={formData.vehicleCategory}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
              >
                <option value="">Select Category</option>
                {vehicleCategories?.categories.map((category) => (
                  <option key={category.id} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* {formData.vehicleCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Subcategory
              </label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="vehicleSubCategory"
                  value={formData.vehicleSubCategory}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
                >
                  <option value="">Select Subcategory</option>
                  {availableSubcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )} */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Number
            </label>
            <InputField
              Icon={Hash}
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleInputChange}
              placeholder="Vehicle Number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Year
            </label>
            <select
              name="modelYear"
              value={formData?.modelYear || ""} // Ensure it doesn't throw an error if formData is undefined
              onChange={
                (e) => {
                  setFormData({ ...formData, modelYear: e.target.value });
                  setChange(true);
                } // Correctly update the state
              }
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
            >
              <option value="">Select Year</option>
              {modelYear?.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Seats
            </label>
            <select
              name="modelYear"
              value={formData?.seat?.toString() || ""} // Ensure it doesn't throw an error if formData is undefined
              onChange={
                (e) => {
                  setFormData({ ...formData, seat: e.target.value });
                  setChange(true);
                } 
              }
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
            >
              <option value="">Select Seat</option>
              {seat?.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type
            </label>
            <select
              name="Fuel Type"
              value={formData?.fuel || ""} // Ensure it doesn't throw an error if formData is undefined
              onChange={
                (e) => {
                  setFormData({ ...formData, fuel: e.target.value });
                  setChange(true);
                } 
              }
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
            >
              <option value="">Select Seat</option>
              {fuel?.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <select
              name="color"
              value={formData?.color || ""} // Ensure it doesn't throw an error if formData is undefined
              onChange={
                (e) => {
                  setFormData({ ...formData, color: e.target.value });
                  setChange(true);
                } // Correctly update the state
              }
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
            >
              <option value="">Select color</option>
              {color?.map((category, index) => (
                <option key={index} value={category}>
                  {category?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between">
         { !initialData?.isverified && <button
            disabled={!change}
            onClick={() => onUpdate(formData)}
            className={`${
              !change
                ? "bg-blue-100 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-6 py-2 rounded-lg mt-6 transition-all duration-300 flex items-center justify-center gap-2`}
          >
            Update Vehicle Information
          </button>}

         {
          initialData?.isverified &&(
            <p className="text-green-600 font-medium flex items-center">
                    Driver Verified
                    <CheckCheckIcon size={30} color="green" />
                  </p>
          )
          }
        </div>
      </div>
          <Toaster />
    </div>
  );
};

const InputField = ({
  Icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="relative">
    <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
    />
  </div>
);

export default VehicleDriverPage;
