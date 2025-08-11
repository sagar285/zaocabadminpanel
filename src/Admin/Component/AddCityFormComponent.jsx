import React, { useState, memo } from "react";

const AddCityFormComponent = ({ onClose, onAddCity }) => {
  const [cityInput, setCityInput] = useState('');

  const handleAddCity = () => {
    if (cityInput.trim()) {
      onAddCity(cityInput.trim());
      setCityInput(''); // Clear input field
      onClose(); // Close modal
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-80 rounded-lg shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Form Content */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* City Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City Name
            </label>
            <input
              type="text"
              placeholder="Enter city name"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Add City Button */}
          <button
            type="button"
            onClick={handleAddCity}
            disabled={!cityInput.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300"
          >
            Add City
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(AddCityFormComponent);
