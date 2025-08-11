import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAllCityofStateQuery, useGetCityofActiveStateFromAdminModelQuery, useGetCityofActiveStateQuery, useUpdateCityofStateFromAdminModelMutation, useUpdateCityofStateMutation } from '../../Redux/Api';

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const TripStates = () => {
  const { id, state } = useParams();
  const { data: allCitiesData, error: allCitiesError, isLoading: allCitiesLoading } = useGetAllCityofStateQuery(state);
  const [updateActiveCities] =  useUpdateCityofStateFromAdminModelMutation()
 
  
  const postdata = {
    id: id,
    state: state
  };
  
  const { 
    data: ActiveCity, 
    error: ActiveCityError, 
    isLoading: activeCitiesLoading 
  } = useGetCityofActiveStateFromAdminModelQuery(postdata);

  

  const [activeCities, setActiveCities] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (ActiveCity) {
      setActiveCities(ActiveCity?.cities);
    }
  }, [ActiveCity]);

  const handleCityToggle = (city) => {
    setActiveCities(prev => {
      if (prev.includes(city)) {
        return prev.filter(c => c !== city);
      } else {
        return [...prev, city];
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Replace this with your actual API call
    //   await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
    const postdata ={
        tripId : id, state : state, ActiveCity :activeCities
    }
      const {data,error} = await updateActiveCities(postdata);
      if (data) {
        setSaveSuccess(true);
      } else {
        if(error){
            setSaveError('Failed to update cities. Please try again.');
        }
      }
    } catch (error) {
      setSaveError('Failed to update cities. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (allCitiesLoading || activeCitiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (allCitiesError || ActiveCityError) {
    return (
      <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
        {allCitiesError?.message || ActiveCityError?.message || 'Error loading cities'}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cities in {state}
          </h1>
          <p className="text-gray-500 mt-1">
            Select cities to include in your trip
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? <LoadingSpinner /> : <SaveIcon />}
          <span>Save Changes</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          Cities updated successfully!
        </div>
      )}

      {saveError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allCitiesData?.cities.map((city, index) => (
          <div
            key={index}
            className="relative flex items-center gap-3 p-4 bg-white rounded-lg border hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => handleCityToggle(city)}
          >
            <div className={`w-5 h-5 rounded border flex items-center justify-center
              ${activeCities.includes(city) 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300'}`}
            >
              {activeCities.includes(city) && (
                <CheckIcon />
              )}
            </div>
            <span className="text-gray-700 font-medium">{city}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Selected Cities ({activeCities.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {activeCities.map((city, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {city}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripStates;