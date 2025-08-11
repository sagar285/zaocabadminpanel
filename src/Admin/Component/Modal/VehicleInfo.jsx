import React, { useState, useEffect } from "react";
import { Car, Hash, Calendar, Users, Fuel, Palette, FileCheck, Shield } from "lucide-react";
import { baseUrl } from "../../Url/baseUrl";
import { useGetCategoriesQuery, useGetVehicleByIdQuery, useUpdateSingleVehicleRcStatusMutation, useUpdateVehiclePermitStatusMutation } from "../../Redux/Api";
import { useParams } from "react-router-dom";

const VehicleInfo = () => {
   const {id} =useParams();
    const {data:initialData,error} = useGetVehicleByIdQuery(id);
    const [updateSingleVehicleRc] =useUpdateSingleVehicleRcStatusMutation();
    const [updateVehiclePermit] =useUpdateVehiclePermitStatusMutation();
      const { data:{categories:vehicleCategories}, error: vehicleCategoriesError, loading } = useGetCategoriesQuery();
  // Sample category data - replace with your actual data
  // const vehicleCategories = [
  //   { id: 1, name: "Sedan" },
  //   { id: 2, name: "SUV" },
  //   { id: 3, name: "Hatchback" }
  // ];

  // Sample subcategory mapping - replace with your actual data
  const subcategoriesMap = {
    "Sedan": ["Compact Sedan", "Mid-size Sedan", "Luxury Sedan"],
    "SUV": ["Compact SUV", "Mid-size SUV", "Full-size SUV"],
    "Hatchback": ["Mini Hatchback", "Premium Hatchback"]
  };

  const [formData, setFormData] = useState({
    vehicleName: initialData?.vehicleName || "",
    vehicleCategory: initialData?.vehicleCategory || "",
    vehicleSubCategory: initialData?.vehicleSubCategory || "",
    vehicleNumber: initialData?.vehicleNumber || "",
    modelYear: initialData?.modelYear || "",
    seat: initialData?.seat || "",
    fuel: initialData?.fuel || "",
    color: initialData?.color || "",
    vehiclePermitStatus: initialData?.vehiclePermit?.vehiclePermitStatus || "",
    vehicleRcStatus: initialData?.vehicleRc?.vehicleRcStatus || "",
    vehicleRcImage: initialData?.vehicleRc?.rcImage || "",
    vehiclePermitImage: initialData?.vehiclePermit?.permitImage || "",
  });

  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [change, setChange] = useState(false);

  useEffect(() => {
    if (formData.vehicleCategory) {
      setAvailableSubcategories(subcategoriesMap[formData.vehicleCategory] || []);
    }
  }, [formData.vehicleCategory]);

  const handleInputChange = (e) => {
    setChange(true);
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
      status === 'Active' ? 'bg-green-100 text-green-800' :
      status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
      'bg-red-100 text-red-800'
    }`}>
      {status}
    </span>
  );

  const ImagePreview = ({ url, title }) => {
    if (!url) return null;
    
    return (
      <div className="relative group">
        <img
          src={url}
          alt={title}
          className="w-32 h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        />
        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
            {title}
          </span>
        </div> */}
        <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange(docType, "Accepted", id)}
                className={`flex-1 py-2 px-4 rounded-lg transition-all`}
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusChange(docType, "Rejected", id)}
                className={`flex-1 py-2 px-4 rounded-lg transition-all`}
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
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Vehicle Information</h2>
        
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
              url={formData.vehicleRcImage ? `${baseUrl}/vehicleRc/${formData.vehicleRcImage}` : null}
              title="RC Document"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-gray-600">Permit Document</span>
            <ImagePreview 
              url={formData.vehiclePermitImage ? `${baseUrl}/vehiclePermit/${formData.vehiclePermitImage}` : null}
              title="Permit Document"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name</label>
            <InputField
              Icon={Car}
              name="vehicleName"
              value={formData.vehicleName}
              onChange={handleInputChange}
              placeholder="Vehicle Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Category</label>
            <div className="relative">
              <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="vehicleCategory"
                value={formData.vehicleCategory}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
              >
                <option value="">Select Category</option>
                {vehicleCategories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.vehicleCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Subcategory</label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="vehicleSubCategory"
                  value={formData.vehicleSubCategory}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
                >
                  <option value="">Select Subcategory</option>
                  {availableSubcategories.map(subcategory => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
            <InputField
              Icon={Hash}
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleInputChange}
              placeholder="Vehicle Number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model Year</label>
            <InputField
              Icon={Calendar}
              name="modelYear"
              value={formData.modelYear}
              onChange={handleInputChange}
              placeholder="Model Year"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Seats</label>
            <InputField
              Icon={Users}
              name="seat"
              value={formData.seat}
              onChange={handleInputChange}
              placeholder="Number of Seats"
              type="number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
            <InputField
              Icon={Fuel}
              name="fuel"
              value={formData.fuel}
              onChange={handleInputChange}
              placeholder="Fuel Type"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <InputField
              Icon={Palette}
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Vehicle Color"
            />
          </div>
        </div>

        <button
          disabled={!change}
          onClick={() => onUpdate(formData)}
          className={`${
            !change ? 'bg-blue-100 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-6 py-2 rounded-lg mt-6 transition-all duration-300 flex items-center justify-center gap-2`}
        >
          Update Vehicle Information
        </button>
      </div>
    </div>
  );
};

const InputField = ({ Icon, name, value, onChange, placeholder, type = "text" }) => (
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

export default VehicleInfo;