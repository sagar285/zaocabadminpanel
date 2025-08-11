import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import {  useUploadPoliceVerificationLicenseMutation, useUploadVehicleRCLicenseMutation } from '../../Redux/Api';

const AddVehicleRCDocumentModal = ({ isOpen, onClose, docType, userId,refetch }) => {
  const [formData, setFormData] = useState({
    frontImage: null,
    backImage: null,
    number: ''
  });
  const [uploadVehicleRc] =useUploadVehicleRCLicenseMutation();

  const [previews, setPreviews] = useState({
    frontImage: null,
    backImage: null
  });

  const handleFileChange = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [side]: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({
          ...prev,
          [side]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = new FormData();
    console.log(data,formData)

    if (formData.frontImage) data.append('vehicle_rc', formData.frontImage);
    data.append("userId",userId);
    data.append("isAdmin",true);
    const response = await uploadVehicleRc(data);
    console.log(response);
    refetch()
    // onSubmit(data);
    onClose();
    // Clear form and previews
    // setFormData({ frontImage: null, backImage: null, number: '' });
    // setPreviews({ frontImage: null, backImage: null });
  };

  const removeImage = (side) => {
    setFormData(prev => ({ ...prev, [side]: null }));
    setPreviews(prev => ({ ...prev, [side]: null }));
  };

  const getTitle = () => {
    switch (docType) {
      case 'aadhar': return 'Add Aadhar Card';
      case 'driverLicense': return 'Add Driving License';
      case 'policeVerification': return 'Add Police Certificate';
      case 'vehicleRc': return 'Add Vehicle RC';
      default: return 'Add Document';
    }
  };

  const needsBackImage = docType === 'aadhar' || docType === 'driverLicense';
  const needsNumber = docType === 'aadhar' || docType === 'driverLicense';

  if (!isOpen) return null;

  const ImageUploadBox = ({ side, preview }) => (
    <div className="relative w-full">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt={`${side} preview`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(side)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col w-full items-center justify-center h-48 cursor-pointer">
            <input
              type="file"
              onChange={(e) => handleFileChange(e, side)}
              className="hidden"
              accept="image/*"
            />
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Click to upload  image</span>
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{getTitle()}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploadBox side="frontImage" preview={previews.frontImage} />
            {needsBackImage && (
              <ImageUploadBox side="backImage" preview={previews.backImage} />
            )}
          </div>

          {needsNumber && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {docType === 'aadhar' ? 'Aadhar Number' : 'License Number'}
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              disabled={!formData.frontImage || (needsBackImage && !formData.backImage)}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleRCDocumentModal;