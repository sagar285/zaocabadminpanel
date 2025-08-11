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
} from "lucide-react";
import { baseUrl } from "../Url/baseUrl";

import { useParams } from "react-router-dom";
import {
  useGetCategoriesQuery,
  useGetVehicleByIdQuery,
  useUpdateSingleVehicleRcStatusMutation,
  useUpdateVehicleInfoMutation,
  useUpdateVehiclePermitStatusMutation,
  useVerifiedVehicleInfoMutation,
} from "../Redux/Api";
import toast, { Toaster } from "react-hot-toast";

const VehiclePage = () => {
  const { id } = useParams();
  const { data: initialData, error } = useGetVehicleByIdQuery(id);
  const [updateSingleVehicleRc] = useUpdateSingleVehicleRcStatusMutation();
  const [updateVehiclePermit] = useUpdateVehiclePermitStatusMutation();
  const [vehicleVerify] = useVerifiedVehicleInfoMutation();
  const [updateVehicleInfo] = useUpdateVehicleInfoMutation();
  const {
    data: vehicleCategories,
    error: vehicleCategoriesError,
    loading,
  } = useGetCategoriesQuery();
  const [verified, setverified] = useState({
    personal: false,
    document: false,
    vehicleinfo: false,
  });

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

  const handleRcStatus = async (status) => {
    const postdata = {
      vehicleId: id,
      status: status,
    };
    const { data, error } = await updateSingleVehicleRc(postdata);
    console.log(data, error);
  };

  const handlePermitStatus = async (status) => {
    const postdata = {
      vehicleId: id,
      status: status,
    };
    const { data, error } = await updateVehiclePermit(postdata);
    console.log(data, error);
  };

  const [formData, setFormData] = useState({
    vehicleName: "",
    vehicleCategory: "",
    vehicleSubCategory: "",
    vehicleNumber: "",
    modelYear: "",
    seat: "",
    fuel: "",
    color: "",
    vehiclePermitStatus: "",
    vehicleRcStatus: "",
    vehicleRcImage: "",
    vehiclePermitImage: "",
  });

  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [change, setChange] = useState(false);

  const handleVehicleinfoverified = () => {
    if (
      !initialData?.vehicleName ||
      !initialData?.vehicleCategory ||
      !initialData?.vehicleNumber ||
      !initialData?.modelYear ||
      !initialData?.seat ||
      !initialData?.fuel ||
      !initialData?.color ||
      initialData?.vehiclePermit?.vehiclePermitStatus != "Accepted" ||
      initialData?.vehicleRc?.vehicleRcStatus != "Accepted"
    ) {
      setverified({ ...verified, vehicleinfo: false });
    } else {
      setverified({ ...verified, vehicleinfo: true });
    }
  };

  useEffect(() => {
    handleVehicleinfoverified();
  }, [initialData]);

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
        vehiclePermitStatus:
          initialData.vehiclePermit?.vehiclePermitStatus || "",
        vehicleRcStatus: initialData.vehicleRc?.vehicleRcStatus || "",
        vehicleRcImage: initialData.vehicleRc?.rcImage || "",
        vehiclePermitImage: initialData.vehiclePermit?.permitImage || "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.vehicleCategory) {
      // setAvailableSubcategories(
      //   subcategoriesMap[formData.vehicleCategory] || []
      // );
    }
  }, [formData.vehicleCategory]);

  const haldeVehicleinfoApi = async (id) => {
    const postdata = {
      id: id,
    };
    try {
      const { data, error } = await vehicleVerify(postdata);

      if (data) {
        toast.success("updated succesfully");
      }
      if (error) {
        toast.error("error in verified driver");
      }
      refetch();
    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
    }
  };

  const handleInputChange = (e) => {
    setChange(true);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        status === "Accepted"
          ? "bg-green-100 text-green-800"
          : status === "pending"
          ? "bg-yellow-100 text-yellow-800"
          : status === "rejected"
          ? "bg-red-900 text-red-800"
          : "bg-pink-100 text-red-800"
      }`}
    >
      {status}
    </span>
  );
  function handleStatusChange(title, status) {
    console.log(title, status);
    if (title == "Permit Document") {
      console.log("permit baala");
      handlePermitStatus(status);
    }
    if (title == "RC Document") {
      console.log("RC baala");
      handleRcStatus(status);
    }
  }

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

  const ImagePreview = ({ url, title, status }) => {
    if (!url) return null;

    return (
      <div className="w-full max-w-sm mx-auto p-4 border rounded-lg shadow-md flex flex-col items-center space-y-4">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img
            src={url}
            alt={title}
            className="w-full h-32 rounded-lg object-cover"
          />
        </a>
     
          <div className="flex gap-2 w-full">
            <button
              onClick={() => handleStatusChange(title, "Accepted")}
              className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
            >
              Accept
            </button>
            <button
              onClick={() => handleStatusChange(title, "Rejected")}
              className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Reject
            </button>
          </div>
      
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Vehicle Information
        </h2>

        {/* Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex w-[10rem] flex-col space-y-2">
            <span className="text-sm text-gray-600">RC Status</span>
            <StatusBadge status={formData.vehicleRcStatus} />
          </div>
          <div className="flex w-[10rem] flex-col space-y-2">
            <span className="text-sm text-gray-600">Permit Status</span>
            <StatusBadge status={formData.vehiclePermitStatus} />
          </div>
        </div>

        {/* Images Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-gray-600">RC Document</span>
            <ImagePreview
              url={
                formData.vehicleRcImage
                  ? `${baseUrl}/vehicleRc/${formData.vehicleRcImage}`
                  : null
              }
              title="RC Document"
              status={formData.vehicleRcStatus}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-gray-600">Permit Document</span>
            <ImagePreview
              url={
                formData.vehiclePermitImage
                  ? `${baseUrl}/vehiclePermit/${formData.vehiclePermitImage}`
                  : null
              }
              title="Permit Document"
              status={formData.vehiclePermitStatus}
            />
          </div>
        </div>

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
            {/* <InputField
              Icon={Calendar}
              name="modelYear"
              value={formData.modelYear}
              onChange={handleInputChange}
              placeholder="Model Year"
            /> */}
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
            {/* <InputField
              Icon={Users}
              name="seat"
              value={formData.seat}
              onChange={handleInputChange}
              placeholder="Number of Seats"
              type="number"
            /> */}
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
            {/* <InputField
              Icon={Palette}
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Vehicle Color"
            /> */}

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
          <button
            disabled={!change}
            onClick={() => onUpdate(formData)}
            className={`${
              !change
                ? "bg-blue-100 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-6 py-2 rounded-lg mt-6 transition-all duration-300 flex items-center justify-center gap-2`}
          >
            Update Vehicle Information
          </button>

          {initialData?.isverified && (
            <p className="text-green-600 font-medium flex items-center">
              vehicle Verified
              <CheckCheckIcon size={30} color="green" />
            </p>
       
          )}
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

export default VehiclePage;
