import React, { useState } from "react";
import { useGetStateAndCitiesQuery } from "../../Redux/Api";

const AddCityModal = ({ isOpen, onClose, onSubmit }) => {
  const { data, error, isLoading } = useGetStateAndCitiesQuery();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);

  if (!isOpen) return null;

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    setSelectedCities([]);
  };

  const handleCityToggle = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const handleSelectAllCities = () => {
    const state = data?.state.find((s) => s.name === selectedState);
    if (state) setSelectedCities(state.cities);
  };

  const handleSubmit = () => {
    onSubmit(selectedState,selectedCities);
    onClose();
  };

  if (isLoading) {
    return <p className="text-center text-blue-500">Loading states and cities...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading data: {error.message}</p>;
  }

  const states = data?.state || [];
  const currentCities =
    states.find((s) => s.name === selectedState)?.cities || [];

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 p-6">
        <h2 className="text-xl font-semibold mb-4">Add City</h2>

        {/* State Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select State</label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="" disabled>
              Select a state
            </option>
            {states.map((state) => (
              <option key={state._id} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cities List */}
        {selectedState && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Cities</h3>
              <button
                onClick={handleSelectAllCities}
                className="bg-green-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-green-600"
              >
                Select All
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto border rounded-lg p-2">
              {currentCities.map((city) => (
                <div
                  key={city}
                  className="flex items-center justify-between border-b py-2"
                >
                  <span className="text-gray-700">{city}</span>
                  <input
                    type="checkbox"
                    checked={selectedCities.includes(city)}
                    onChange={() => handleCityToggle(city)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Cities
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCityModal;
