import React, { useState, useEffect } from "react";
import { CheckCheck } from "lucide-react";
import { baseUrl } from "../../../Admin/Url/baseUrl";

const DriverInfoForm = ({
  data,
  onVerify,
  isVerified,
  verified,
  personalInfoUpdate,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    state: "",
    city: "",
    id: "",
  });
  const [change, setchange] = useState(false);

  console.log(data, "data from driver page");

  useEffect(() => {
    if (data?.DriverInfo) {
      setFormData({
        firstName: data?.DriverInfo.firstName || "",
        lastName: data?.DriverInfo.lastName || "",
        phoneNumber: data?.DriverInfo.phoneNumber || "",
        email: data?.DriverInfo.email || "",
        address: data?.DriverInfo.address || "",
        state: data?.DriverInfo.userId?.state || "",
        city: data?.DriverInfo.userId?.city || "",
        id: data?.DriverInfo._id,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setchange(true);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const imgurl = `${baseUrl}/profilePics/${data?.DriverInfo?.profileImage}`;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {!data?.DriverInfo?.verified ? (
          <button
            onClick={onVerify}
            className={`bg-blue-500 text-white px-4 py-2 rounded transition-colors
              ${
                verified.personal
                  ? "hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            disabled={!verified.personal}
          >
            Verify
          </button>
        ) : (
          <div className="flex items-center text-green-600 font-medium">
            Driver Verified
            <CheckCheck className="ml-2 h-6 w-6" />
          </div>
        )}
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm text-gray-500">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            readOnly={true}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </form>
      <div className="relative w-48 h-48 mt-[2rem]">
        {" "}
        {/* w-48 and h-48 equal 192px, closest to 200px */}
        <img
          src={imgurl}
          alt="Square placeholder"
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="mt-6">
        <button
          onClick={() => {
            personalInfoUpdate(formData);
            setchange(false);
          }}
          type="submit"
          disabled={!change} // Disable the button when `change` is false
          className={`w-1/4 px-4 py-2 rounded transition-colors ${
            change
              ? "bg-blue-500 text-white hover:bg-blue-600" // Enabled state styles
              : "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled state styles
          }`}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default DriverInfoForm;
