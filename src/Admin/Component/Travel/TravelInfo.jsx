import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { CheckCheck } from 'lucide-react';

const TravelInfoForm = ({ data, onVerify, onUpdate, verified }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    phoneNumber: '',
    email: '',
    address: '',
    firmAddress: '',
    firmOpeningDate: '',
    gstNumber: '',
    state: '',
    city: ''
  });

  const [isFormModified, setIsFormModified] = useState(false);

  useEffect(() => {
    if (data?.travel) {
      setFormData({
        firstName: data.travel.firstName || '',
        lastName: data.travel.lastName || '',
        dob: moment(data.travel.dob).format('YYYY-MM-DD'),
        phoneNumber: data.travel.phoneNumber || '',
        email: data.travel.email || '',
        address: data.travel.address || '',
        firmAddress: data.travel.firmAddress || '',
        firmOpeningDate: moment(data.travel.firmOpeningDate).format('YYYY-MM-DD'),
        gstNumber: data.travel.gstNumber || '',
        state: data.travel.userId?.state || '',
        city: data.travel.userId?.city || ''
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsFormModified(true);
  };

  const handleUpdate = () => {
    onUpdate(formData);
    setIsFormModified(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <div className="flex gap-4">
          {isFormModified && (
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Update Changes
            </button>
          )}
          {!data?.travel?.verified ? (
            <button
              onClick={() => onVerify(data?.travel?._id)}
              className={`bg-blue-500 text-white px-4 py-2 rounded transition-colors
                ${verified.personal ? 'hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={!verified.personal}
            >
              Verify
            </button>
          ) : (
            <div className="flex items-center text-green-600 font-medium">
              Travel Verified
              <CheckCheck className="ml-2 h-6 w-6" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <label className="text-sm text-gray-500">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
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
            onChange={handleChange}
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
          <label className="text-sm text-gray-500">Firm Address</label>
          <input
            type="text"
            name="firmAddress"
            value={formData.firmAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">Firm Opening Date</label>
          <input
            type="date"
            name="firmOpeningDate"
            value={formData.firmOpeningDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">GST Number</label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
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
      </div>
    </div>
  );
};

export default TravelInfoForm;