import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useDeleteTripByAdminInAdminTripMutation,
  useGetTripDetailsByIdFromAdminModelQuery,
  useGetTripDetailsByIdQuery,
  useUpdateTripwithStateCitiesInAdminModelMutation,
  useUpdateTripwithStateCitiesMutation,
} from "../Redux/Api";
import AddCityModal from "../Component/Modal/AddCityModal";
import toast, { Toaster } from "react-hot-toast";

const ViewTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading, isFetching } = useGetTripDetailsByIdQuery(id);
  const { data : dataFromAdminModel, error : errorFromAdminModel, isLoading : isLoadingFromAdminModel, isFetching : isFetchingFromAdminModel } = useGetTripDetailsByIdFromAdminModelQuery(id);
  const [DeleteTrip] =useDeleteTripByAdminInAdminTripMutation()


  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [updateTrip] = useUpdateTripwithStateCitiesMutation();
  const [updateTripAdminModel] = useUpdateTripwithStateCitiesInAdminModelMutation();
  const [showAllStates, setShowAllStates] = useState(false);

  if (isLoadingFromAdminModel || isFetchingFromAdminModel) {
    return <p className="text-center text-blue-500">Loading trip details...</p>;
  }

  const onClose = () => {
    setShowAddCityModal(false);
  };

  const onSubmit = async (state, cities) => {
    const putdata = {
      id: id,
      stateName: state,
      cities: cities,
    };
    try {
      // const { data, error } = await updateTrip(putdata);
      const { data:updateData, error :updateError } = await updateTripAdminModel(putdata);
      if (updateData ) {
        toast.success("Trip updated successfully");
      }
      if (updateError) {
        toast.error("Error updating trip");
      }
    } catch (error) {
      toast.error("Error updating trip");
    }
  };

  const handleEditTrip = () => {
    if (trip?.perKmFare === true) {
      navigate(`/faretrip/perkm/${trip?._id}`);
    } else {
      navigate(`/faretrip/${trip?._id}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const {data,error} = await DeleteTrip(id)
      if(data){
        toast.success("Trip deleted successfully");
        navigate('/trips')
      }
      if(error){
        toast.error("Error deleting trip")
      }
    } catch (error) {
      console.log(error)
    }

  }

  const UserCard = ({ value }) => (
    <div className="absolute z-20 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-64 -translate-y-full -translate-x-1/2 top-0 left-1/2">
      <div className="relative">
        {console.log(value,"translate")}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">User Details</h3>
        </div>
        <div className="space-y-2">
          <p className="text-sm"><span className="font-medium">Name:</span> {value.name || 'N/A'}</p>
          <p className="text-sm"><span className="font-medium">Email:</span> {value.email || 'N/A'}</p>
          <p className="text-sm"><span className="font-medium">Phone:</span> {value.phone || 'N/A'}</p>
          <p className="text-sm"><span className="font-medium">Role:</span> {value.role || 'N/A'}</p>
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
          <div className="border-8 border-transparent border-t-white drop-shadow-lg"></div>
        </div>
      </div>
    </div>
  );

  const renderValue = (key, value) => {
    console.log(key, value,"render value is");
    if (key === "userId" && typeof value === "object") {
      return (
        <div className="group relative flex items-center">
          <span className="cursor-help text-blue-600 underline relative">
            {value._id || "N/A"}
            <div className="hidden group-hover:block absolute">
              <UserCard value={value} />
            </div>
          </span>
        </div>
      );
    }

    if (key === "activeStates") {
      if (Array.isArray(value) && value.length > 0) {
        const initialStatesToShow = 6;
        const displayedStates = showAllStates ? value : value.slice(0, initialStatesToShow);
        const hasMoreStates = value.length > initialStatesToShow;

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {displayedStates.map((state, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/trip/${id}/${state.name}`)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-md text-sm text-left transition-colors"
                >
                  {state.name}
                </button>
              ))}
            </div>
            {hasMoreStates && (
              <button
                onClick={() => setShowAllStates(!showAllStates)}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                {showAllStates ? 'Show Less' : `Show ${value.length - initialStatesToShow} More States`}
              </button>
            )}
          </div>
        );
      } else {
        return (
          <button
            onClick={() => setShowAddCityModal(true)}
            className="text-gray-600 hover:text-gray-800"
          >
            Add State
          </button>
        );
      }
    }

    if (Array.isArray(value)) {
      return value.length === 0 ? "No Data" : value.join(", ");
    }

    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }

    return value?.toString() || "N/A";
  };

  if (errorFromAdminModel) {
    return (
      <p className="text-center text-red-500">
        Error fetching trip details: {error.message}
      </p>
    );
  }

  const trip = dataFromAdminModel?.trip;

  return (
    <>
      <div className="p-4 sm:p-6 md:p-10 bg-gray-100 min-h-screen">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
          Trip Details
        </h2>
        {trip ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(trip).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-500 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </div>
                  <div className="text-gray-800 break-words">
                    {renderValue(key, value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No trip data available.</p>
        )}

        <div className="flex gap-4 mt-6">
           <button onClick={()=>handleEditTrip()} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">
            Edit
          </button>
          <button onClick={()=>handleDelete(trip?._id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">
            Delete
          </button> 
          <button
            onClick={() => setShowAddCityModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            Add City
          </button>
        </div>
      </div>
      <AddCityModal
        isOpen={showAddCityModal}
        onClose={onClose}
        onSubmit={onSubmit}
      />
      <Toaster />
    </>
  );
};

export default ViewTrip;