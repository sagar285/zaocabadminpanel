import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetTripDetailsByIdQuery,
  useGetuserTripByIdQuery,
  useUpdateTripwithStateCitiesMutation,
} from "../Redux/Api";
import AddCityModal from "../Component/Modal/AddCityModal";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../Url/baseUrl";
import Sidebar from '../Component/Sidebar';
import moment from "moment";
import CarpoolTripFareDetail from "./dynamic/CarpoolTripFareDetail";

const LoadingState = ({ isSidebarOpen }) => (
  <div className={`flex-1 p-4 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-blue-500">Loading trip details...</p>
    </div>
  </div>
);

const ErrorState = ({ message, isSidebarOpen }) => (
  <div className={`flex-1 p-4 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-50 p-6 rounded-lg shadow-sm">
        <p className="text-red-500 font-medium">Error fetching trip details: {message}</p>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: "bg-yellow-500 text-white",
    completed: "bg-green-500 text-white",
    cancelled: "bg-red-500 text-white",
    ongoing: "bg-blue-500 text-white",
    picked: "bg-green-500 text-white",
    confirm: "bg-blue-500 text-white",
    "expire / reject": "bg-red-500 text-white",
    drop: "bg-gray-500 text-white",
    default: "bg-gray-500 text-white"
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[status?.toLowerCase()] || statusStyles.default}`}>
      {status}
    </span>
  );
};

const ActionButton = ({ action, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
  >
    {action}
  </button>
);

const ViewUserTrip = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tripdata, error, isLoading, isFetching } = useGetuserTripByIdQuery(id);

  const trip = tripdata?.tripDetail;
  const driver = tripdata?.tripDetail?.userId?.role === "driver";
  const travel = tripdata?.tripDetail?.userId?.role === "travelOwner";
  const [isSkip,setIsSkip]=useState(false)
  // State management for modals and actions
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTravelPartnerModal, setShowTravelPartnerModal] = useState(false);
  const [showDriverPartnerModal, setShowDriverPartnerModal] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(trip?.tripStatus || '');
  const [isHidden, setIsHidden] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  // Location state
  const [editLocation, setEditLocation] = useState({
    pickupLocation: trip?.pickupLocation || '',
    dropLocation: trip?.dropLocation || '',
    dropStops: trip?.dropStops || []
  });

  const [updateTrip] = useUpdateTripwithStateCitiesMutation();

  // Update location state when trip data loads
  React.useEffect(() => {
    if (trip) {
      setEditLocation({
        pickupLocation: trip.pickupLocation || '',
        dropLocation: trip.dropLocation || '',
        dropStops: trip.dropStops || []
      });
      setSelectedStatus(trip.tripStatus || '');
    }
  }, [trip]);

  // Handler functions
  const handleDriverAction = () => {
    setShowDriverModal(true);
  };

  const handleStatusChange = () => {
    setShowStatusModal(true);
  };

  const handleLocationEdit = () => {
    setShowLocationModal(true);
  };


  const toggleSkip =()=>{
    setIsSkip(true)
  }

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  console.log(updateTrip);
  console.log(trip);
  console.log(trip?.makeOffer);
  console.log(updateTrip);

  const handleHideTrip = async () => {
    if (window.confirm('Are you sure you want to hide this trip?')) {
      setActionLoading(true);
      try {
        // Add your hide trip API call here
        // await hideTrip(id);
        setIsHidden(true);
        toast.success('Trip hidden successfully');
      } catch (error) {
        toast.error('Failed to hide trip');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      // Add your status update API call here
      // await updateTripStatus({ tripId: id, status: newStatus });
      setSelectedStatus(newStatus);
      setShowStatusModal(false);
      toast.success(`Trip status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update trip status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLocationUpdate = async () => {
    setActionLoading(true);
    try {
      await updateTrip({
        tripId: id,
        pickupLocation: editLocation.pickupLocation,
        dropLocation: editLocation.dropLocation,
        dropStops: editLocation.dropStops
      });
      setShowLocationModal(false);
      toast.success('Locations updated successfully');
    } catch (error) {
      toast.error('Failed to update locations');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignDriver = (driverId) => {
    setActionLoading(true);
    try {
      // Add your assign driver API call here
      // await assignDriver({ tripId: id, driverId });
      setShowDriverModal(false);
      toast.success('Driver assigned successfully');
    } catch (error) {
      toast.error('Failed to assign driver');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveDriver = async () => {
    if (window.confirm('Are you sure you want to remove the current driver?')) {
      setActionLoading(true);
      try {
        // Add your remove driver API call here
        // await removeDriver(id);
        toast.success('Driver removed successfully');
      } catch (error) {
        toast.error('Failed to remove driver');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleAddTravelPartner = () => {
    setShowTravelPartnerModal(true);
  };

  const handleViewDetails = (driverData) => {
    setSelectedDriver(driverData);
    setShowDetailedView(true);
  };

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to format date
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper function for Yes/No display
  const renderYesNo = (value) => (value ? "Yes" : "No");
  const renderIncludedExcluded = (value) => (value ? "Included" : "Excluded");

  const renderSeats = () => {
    const totalSeats = trip?.totalSeats || 7;
    const bookedSeats = 3;
    const seats = [];
    
    for (let i = 1; i <= totalSeats; i++) {
      const isBooked = i <= bookedSeats;
      const isSelected = selectedSeats.includes(i);
      seats.push(
        <button
          key={i}
          onClick={() => !isBooked && handleSeatClick(i)}
          disabled={isBooked}
          className={`w-8 h-8 m-1 rounded text-xs font-medium ${
            isBooked 
              ? 'bg-red-500 text-white cursor-not-allowed' 
              : isSelected 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }
    return seats;
  };

  const allSeats = renderSeats();

  if (isLoading || isFetching) return <LoadingState isSidebarOpen={isSidebarOpen} />;
  if (error) return <ErrorState message={error.message} isSidebarOpen={isSidebarOpen} />;
  if (!trip) return <ErrorState message="No trip data available" isSidebarOpen={isSidebarOpen} />;

  const userInfo = trip?.userId;
  const offeredTrips = tripdata?.userOfferedTrip || [];
  const confirmedTrip = tripdata?.userconfirmOfferedTrip;
  console.log(trip.tripType);
  console.log(offeredTrips);

  return (
    <>
      {trip.tripType === 'Round-Trip' ? (
        <div className="min-h-screen bg-gray-100">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          
          <div className={`${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300 p-4`}>
            
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm p-14 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="font-semibold">Trip ID:</span> {trip?.tripId}
                </div>
                <div>
                  <span className="font-semibold">Trip Type:</span> {trip?.tripType}
                </div>
                <div>
                  <span className="font-semibold">Vehicle/Category Type:</span> {trip?.vehicleType}
                  <button 
                    onClick={handleStatusChange}
                    disabled={actionLoading}
                    className="text-black bg-green-600 px-8 rounded-full py-2 absolute right-6 top-5 text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {trip?.tripStatus}
                  </button>
                </div>
                <div>
                  <span className="font-semibold pt-4">Start Date & Time:</span> {moment(trip?.tripDate).format("ddd DD MMM YYYY, hh:mm A")}
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4 p-3 bg-blue-50 rounded">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {userInfo?.firstName?.[0]}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{userInfo?.firstName} {userInfo?.lastName}</div>
                  <div className="text-sm text-gray-600">{userInfo?.phone}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{userInfo?.role}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={() => navigate(`/trip-details/${id}`)}
                  className="bg-blue-600 text-white px-6 py-2 rounded text-sm hover:bg-blue-700 transition-colors font-semibold"
                >
                  📋 VIEW TRIP DETAILS
                </button>
                <button 
                  onClick={handleDriverAction}
                  disabled={actionLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Loading...' : 'MANAGE DRIVER'}
                </button>

                <button 
                  onClick={handleLocationEdit}
                  disabled={actionLoading}
                  className="bg-yellow-500 text-white px-4 py-2 rounded text-sm hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Loading...' : 'EDIT LOCATION'}
                </button>
                <button 
                  onClick={handleAddTravelPartner}
                  disabled={actionLoading}
                  className="bg-teal-500 text-white px-4 py-2 rounded text-sm hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Loading...' : 'ADD PARTNER'}
                </button>
                <button 
                  onClick={handleHideTrip}
                  disabled={actionLoading || isHidden}
                  className={`px-4 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isHidden 
                      ? 'bg-gray-400 text-white' 
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  {actionLoading ? 'Loading...' : isHidden ? 'TRIP HIDDEN' : 'HIDE TRIP'}
                </button>
              </div>
            </div>

            {/* Route Information Table */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">Route Information</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Time</th>
                      <th className="px-4 py-3 text-left font-semibold cursor-pointer" 
                        onClick={handleLocationEdit}
                      >Location</th>
                      <th className="px-4 py-3 text-left font-semibold">Distance</th>
                      <th className="px-4 py-3 text-left font-semibold">State, City</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3">{moment(trip?.tripDate).format("ddd DD MMM YYYY, hh:mm A")}</td>
                      <td className="px-4 py-3">{trip?.pickupLocation}</td>
                      <td className="px-4 py-3">0 Kms</td>
                      <td className="px-4 py-3">-</td>
                    </tr>
                    {trip?.dropStops?.map((stop, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">{moment(trip?.tripDate).format("ddd DD MMM YYYY, hh:mm A")}</td>
                        <td className="px-4 py-3">{stop}</td>
                        <td className="px-4 py-3">-</td>
                        <td className="px-4 py-3">-</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="px-4 py-3">{trip?.returnTripDate ? moment(trip?.returnTripDate).format("ddd DD MMM YYYY, hh:mm A") : "-"}</td>
                      <td className="px-4 py-3">{trip?.dropLocation}</td>
                      <td className="px-4 py-3">{trip?.totalKm} Kms</td>
                      <td className="px-4 py-3">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Driver/Offered Trips Table */}
            {(offeredTrips?.length > 0 || confirmedTrip) && (
              <div className="bg-white rounded-lg shadow-sm mb-4">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-lg">Driver Information</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Driver</th>
                        <th className="px-4 py-3 text-left font-semibold">Pickup</th>
                        <th className="px-4 py-3 text-left font-semibold">Drop</th>
                        <th className="px-4 py-3 text-left font-semibold">Distance</th>
                        <th className="px-4 py-3 text-left font-semibold">Seat</th>
                        <th className="px-4 py-3 text-left font-semibold">Fare</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {confirmedTrip && (
                        <tr className="">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {confirmedTrip?.userId?.firstName?.[0]}
                              </div>
                              <div>
                                <div className="font-medium">{confirmedTrip?.userId?.firstName} {confirmedTrip?.userId?.lastName}</div>
                                <div className="text-sm text-gray-600">{confirmedTrip?.userId?.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{trip?.pickupLocation}</td>
                          <td className="px-4 py-3">{trip?.dropLocation}</td>
                          <td className="px-4 py-3">{trip?.totalKm} Kms</td>
                          <td className="px-4 py-3">-</td>
                          <td className="px-4 py-3">₹{confirmedTrip?.offerPrice}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status="confirmed" />
                          </td>
                          <td className="px-4 py-3">
                            <ActionButton action="view" onClick={() => handleViewDetails(confirmedTrip)} />
                          </td>
                        </tr>
                      )}
                      {offeredTrips.map((offeredTrip, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {offeredTrip?.userId?.firstName?.[0] || offeredTrip?.userId?.firstname}
                              </div>
                              <div>
                                <div className="font-medium">{offeredTrip?.userId?.firstName} {offeredTrip?.userId?.lastName}</div>
                                <div className="text-sm text-gray-600">{offeredTrip?.userId?.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{trip?.pickupLocation}</td>
                          <td className="px-4 py-3">{trip?.dropLocation}</td>
                          <td className="px-4 py-3">{trip?.totalKm} Kms</td>
                          <td className="px-4 py-3">-</td>
                          <td className="px-4 py-3">₹{offeredTrip?.offerPrice}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status="pending" />
                          </td>
                          <td className="px-4 py-3">
                            <ActionButton action="view" onClick={() => handleViewDetails(offeredTrip)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Trip Details Summary Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Left Table */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Trip Summary</h3>
                </div>
                <div className="p-4">
                  <table className="w-full">
                    <tbody className="space-y-2">
                      <tr className="border-b">
                        <td className="py-2 font-medium">Total Seat</td>
                        <td className="py-2 text-center">{trip?.totalSeats || '-'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Available Seat</td>
                        <td className="py-2 text-center">{trip?.totalSeats ? trip.totalSeats - 3 : '-'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Total Booked seat</td>
                        <td className="py-2 text-center">3</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Total fare</td>
                        <td className="py-2 text-center">₹{trip?.totalFare || 0}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Total commission</td>
                        <td className="py-2 text-center">₹{trip?.yourcomission || 0}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Per km charge</td>
                        <td className="py-2 text-center">₹{trip?.extrachargeperkmDriver || 0}/km</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Table */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Trip Features</h3>
                </div>
                <div className="p-4">
                  <table className="w-full">
                    <tbody className="space-y-2">
                      <tr className="border-b">
                        <td className="py-2 font-medium">Air condition (AC)</td>
                        <td className="py-2 text-center">{trip?.requireAc ? "Yes" : "No"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Instant Booking</td>
                        <td className="py-2 text-center">No</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Review every request</td>
                        <td className="py-2 text-center">Yes</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Driver Allowance</td>
                        <td className="py-2 text-center">{trip?.DriverAllowance ? "Yes" : "No"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium text-blue-200 underline">#Coming Back #ZAO45344</td>
                        <td className="py-2 text-center">{trip?.Parking ? "Yes" : "No"}</td>
                      </tr>
                      {showCommentBox && (
                        <tr>
                          <td className="py-2 font-medium underline">Comment Box</td>
                          <td className="py-2 text-center">
                            {trip?.comment ? "Yes" : "No"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="pl-96 mt-4">
                    <h1
                      className="cursor-pointer relative right-60 top-14"
                      onClick={toggleCommentBox}
                    >
                      {showCommentBox ? "Hide Comment" : "Show Comment"}
                    </h1>
                    <h1 className="text-blue-200 pt-6 text-2xl">
                      [{showCommentBox ? "✓" : ""}]
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Trip Information */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">Additional Information</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="font-semibold">OTP:</span> {trip?.otp || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Start Meter:</span> {trip?.startMeterReading || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">End Meter:</span> {trip?.endMeterReading || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Trip Price:</span> ₹{trip?.tripPrice || 0}
                  </div>
                  <div>
                    <span className="font-semibold">Who Pays Driver:</span> {trip?.whopayDriver}
                  </div>
                  <div>
                    <span className="font-semibold">State Taxes:</span> {trip?.StateTaxes ? "Yes" : "No"}
                  </div>
                  <div>
                    <span className="font-semibold">Toll Taxes:</span> {trip?.TollTaxes ? "Yes" : "No"}
                  </div>
                  <div>
                    <span className="font-semibold">Urgent Trip:</span> {trip?.isurgent ? "Yes" : "No"}
                  </div>
                </div>
                
                {trip?.comment && (
                  <div className="mt-4">
                    <div className="font-semibold mb-2">Comments:</div>
                    <div className="p-3 bg-gray-50 rounded border">
                      {trip.comment}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* All Modals */}
          
          {/* Driver Management Modal */}
          {showDriverModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Manage Driver</h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => navigate('/drivers')}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add New Driver
                  </button>
                  {confirmedTrip && (
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600 mb-2">Current Driver:</p>
                      <p className="font-medium">{confirmedTrip?.userId?.firstName} {confirmedTrip?.userId?.lastName}</p>
                      <button 
                        onClick={handleRemoveDriver}
                        disabled={actionLoading}
                        className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading ? 'Removing...' : 'Remove Driver'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => setShowDriverModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Trip View Modal */}
          {showDetailedView && selectedDriver && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl font-bold">Trip Details</h2>
                  <button 
                    onClick={() => setShowDetailedView(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Left Side - Driver and Trip Info */}
                    <div className="space-y-6">
                      
                      {/* Driver Contact Section */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {selectedDriver?.userId?.firstName?.[0]}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {selectedDriver?.userId?.firstName} {selectedDriver?.userId?.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">{selectedDriver?.userId?.role}</p>
                          </div>
                        </div>
                        
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-600">Contact {selectedDriver?.userId?.firstName} {selectedDriver?.userId?.lastName}</p>
                        </div>

                        <div className="flex gap-2 mb-4">
                          <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 flex items-center justify-center gap-2">
                            💬 Chat via ZAO CABS
                          </button>
                          <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 flex items-center justify-center gap-2">
                            📞 {selectedDriver?.userId?.phone || 'Contact'}
                          </button>
                        </div>

                        {/* Seat and Fare Info */}
                        <div className="text-center bg-white rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-2xl font-bold">{selectedSeats.length || 2} Seats</div>
                              <div className="text-sm text-gray-600">{trip?.pickupLocation || 'Route'} ({trip?.totalKm || 0} Kms)</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">₹{selectedDriver?.offerPrice || trip?.totalFare || 0}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Route Timeline */}
                      <div className="bg-white rounded-lg border p-4">
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-green-600 font-semibold">
                              {moment(trip?.tripDate).format("ddd DD MMM, hh:mm A")} - {moment(trip?.returnTripDate || trip?.tripDate).add(5, 'hours').format("ddd DD MMM, hh:mm A")}
                            </div>
                            <div className="text-sm text-gray-600">
                              Trip Duration {trip?.returnTripDate ? Math.abs(moment(trip.returnTripDate).diff(moment(trip.tripDate), 'hours')) : 5} hours {trip?.returnTripDate ? Math.abs(moment(trip.returnTripDate).diff(moment(trip.tripDate), 'minutes')) % 60 : 32} minutes
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center text-green-600">
                              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                              <div>
                                <div className="font-medium">{trip?.pickupLocation || 'Starting Point'}</div>
                                <div className="text-sm text-gray-600">{moment(trip?.tripDate).format("ddd DD MMM, hh:mm A")}</div>
                              </div>
                            </div>

                            {trip?.dropStops?.map((stop, index) => (
                              <div key={index} className="flex items-center text-gray-600 ml-2">
                                <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                                <div>
                                  <div className="font-medium">{stop}</div>
                                  <div className="text-sm">Stop {index + 1}</div>
                                </div>
                              </div>
                            ))}

                            <div className="flex items-center text-red-600">
                              <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                              <div>
                                <div className="font-medium">{trip?.dropLocation || 'Destination'}</div>
                                <div className="text-sm text-gray-600">{moment(trip?.returnTripDate || trip?.tripDate).add(5, 'hours').format("ddd DD MMM, hh:mm A")}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Seat Selection */}
                      <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-semibold mb-4 text-center">Select Seats</h3>
                        <div className="text-center">
                          <div className="inline-block border-2 border-gray-300 rounded-lg p-4">
                            <div className="grid grid-cols-3 gap-2 mb-2">
                              {allSeats.slice(0, 6)}
                            </div>
                            <div className="grid grid-cols-1 gap-2 justify-items-center">
                              {allSeats.slice(6)}
                            </div>
                          </div>
                          <div className="flex justify-center gap-4 mt-4 text-sm">
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 bg-gray-200 rounded"></div>
                              <span>Available</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 bg-purple-500 rounded"></div>
                              <span>Selected</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 bg-red-500 rounded"></div>
                              <span>Booked</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Report Section */}
                      <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-semibold mb-4">Report</h3>
                        <div className="space-y-2">
                          <div className="border p-3 rounded">
                            <div className="font-medium">Review & Rating</div>
                            <div className="text-sm text-gray-600">Driver</div>
                          </div>
                          <div className="border p-3 rounded">
                            <div className="font-medium">Review & Rating</div>
                            <div className="text-sm text-gray-600">Passengers</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Financial Info */}
                    <div className="space-y-6">
                      
                      {/* Total Driver Income */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-4">Total Driver Income</h3>
                        <div className="text-right text-2xl font-bold text-green-600 mb-2">₹ {(trip?.totalFare || 3000) + (trip?.TollTaxes ? 200 : 0) + 350 + 200}</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Fix Amount</span>
                            <span>₹ {trip?.totalFare || 3000}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Toll Tax</span>
                            <span>₹ {trip?.TollTaxes ? 200 : 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Extra KM 35 X 10/KM</span>
                            <span>₹ {trip?.extrachargeperkmDriver * 35 || 350}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Extra hour 2 X 100/hr</span>
                            <span>₹ 200</span>
                          </div>
                        </div>
                      </div>

                      {/* Total Partner Incentive */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-4">Total Partner Incentive</h3>
                        <div className="text-right text-2xl font-bold text-blue-600 mb-2">₹ {(trip?.yourcomission || 150) + 70 + 60}</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Fix Amount</span>
                            <span>₹ {trip?.yourcomission || 150}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Extra KM 35 X 2/KM</span>
                            <span>₹ 70</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Extra hour 2 X 30/hr</span>
                            <span>₹ 60</span>
                          </div>
                        </div>
                      </div>

                      {/* Total Admin Incentive */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-4">Total Admin Incentive</h3>
                        <div className="text-right text-2xl font-bold text-purple-600 mb-2">₹ 100</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Booking Fee</span>
                            <span>₹ 50</span>
                          </div>
                          <div className="flex justify-between">
                            <span>GST</span>
                            <span>₹ 50</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax 5% GST</span>
                            <span>₹ 0</span>
                          </div>
                        </div>
                      </div>

                      {/* Trip Summary */}
                      <div className="bg-white rounded-lg border p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Total Seat</span>
                              <span>{trip?.totalSeats || 7}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Available Seat</span>
                              <span>{(trip?.totalSeats || 7) - 3}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Booked seat</span>
                              <span>3</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Air condition (AC)</span>
                              <span>{trip?.requireAc ? "Yes" : "No"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Instant Booking</span>
                              <span>No</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Review every request</span>
                              <span>Yes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3 justify-center">
                    <button 
                      onClick={() => {
                        toast.success('Pickup action triggered');
                        setShowDetailedView(false);
                      }}
                      className="bg-green-500 text-white px-8 py-3 rounded font-semibold hover:bg-green-600"
                    >
                      Pickup 
                    </button>
                    <button 
                      onClick={() => {
                        toast.error('Trip cancelled');
                        setShowDetailedView(false);
                      }}
                      className="bg-red-500 text-white px-8 py-3 rounded font-semibold hover:bg-red-600"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        toast.warning('Trip blocked');
                        setShowDetailedView(false);
                      }}
                      className="bg-yellow-500 text-white px-8 py-3 rounded font-semibold hover:bg-yellow-600"
                    >
                      Block
                    </button>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <div className="inline-block bg-orange-200 px-4 py-2 rounded text-sm">
                      Admin can change trip status
                    </div>
                  </div>

                  {/* Bottom Tabs */}
                  <div className="mt-4 flex gap-2 justify-center">
                    <div className="bg-orange-500 text-white px-4 py-2 rounded flex items-center gap-2">
                      <span>Click Call 12</span>
                      <button className="text-sm underline hover:no-underline">view</button>
                    </div>
                    <div className="bg-pink-300 px-4 py-2 rounded">
                      Travels Partner
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Change Modal */}
          {showStatusModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Change Trip Status</h3>
                <div className="space-y-3">
                  {['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={actionLoading}
                      className={`w-full text-left px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedStatus === status 
                          ? 'bg-blue-100 border-blue-500' 
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="capitalize">{actionLoading ? 'Updating...' : status}</span>
                        <StatusBadge status={status} />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => setShowStatusModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Location Edit Modal */}
          {showLocationModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
                <h3 className="text-lg font-semibold mb-4">Edit Locations</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      value={editLocation.pickupLocation}
                      onChange={(e) => setEditLocation(prev => ({ ...prev, pickupLocation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drop Location
                    </label>
                    <input
                      type="text"
                      value={editLocation.dropLocation}
                      onChange={(e) => setEditLocation(prev => ({ ...prev, dropLocation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drop Stops (comma separated)
                    </label>
                    <textarea
                      value={editLocation.dropStops.join(', ')}
                      onChange={(e) => setEditLocation(prev => ({ 
                        ...prev, 
                        dropStops: e.target.value.split(',').map(stop => stop.trim()).filter(stop => stop) 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => setShowLocationModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLocationUpdate}
                    disabled={actionLoading}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? 'Updating...' : 'Update Locations'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Travel Partner Modal */}
          {showTravelPartnerModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
                <h3 className="text-lg font-semibold mb-4">Add Partner</h3>
                
                {/* Partner Type Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner Type
                  </label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowDriverPartnerModal(true) || setShowTravelPartnerModal(false)}
                      className="flex-1 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    >
                      Driver Partner
                    </button>
                    <button className="flex-1 bg-teal-500 text-white px-4 py-2 rounded">
                      Travel Partner
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partner Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter partner name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Seats
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter number of seats"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Share Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Enter share amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => setShowTravelPartnerModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      // Add travel partner logic here
                      setShowTravelPartnerModal(false);
                      toast.success('Travel partner added successfully');
                    }}
                    disabled={actionLoading}
                    className="flex-1 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? 'Adding...' : 'Add Travel Partner'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Driver Partner Modal */}
          {showDriverPartnerModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
                <h3 className="text-lg font-semibold mb-4">Add Driver Partner</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Driver Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter driver name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter vehicle name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter vehicle number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Share Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Enter share amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => setShowDriverPartnerModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      // Add driver partner logic here
                      setShowDriverPartnerModal(false);
                      toast.success('Driver partner added successfully');
                    }}
                    disabled={actionLoading}
                    className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? 'Adding...' : 'Add Partner'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <Toaster position="top-right" />
        </div>

      //   <CarpoolTripFareDetail
      //     trip={trip}
      //  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      //   showDriverModal={showDriverModal}
      //   confirmedTrip={confirmedTrip}
      //   handleRemoveDriver={handleRemoveDriver}
      //   actionLoading={actionLoading}
      //   showDetailedView={showDetailedView}
      //   selectedDriver={selectedDriver}
      //   selectedSeats={selectedSeats}
      //   allSeats={allSeats}
      //   showStatusModal={showStatusModal}
      //   selectedStatus={selectedStatus}
      //   StatusBadge={StatusBadge}
      //   ActionButton={ActionButton}
      //  offeredTrips={offeredTrips}
      //  showCommentBox={showCommentBox}
      //  handleStatusChange={handleStatusChange}
      //  handleDriverAction={handleDriverAction}
      //  handleLocationEdit={handleLocationEdit}
      //  handleAddTravelPartner={handleAddTravelPartner}
      //  handleHideTrip={handleHideTrip}
      //  isHidden={isHidden}
      //  toggleCommentBox={toggleCommentBox}
      //  showLocationModal={showLocationModal}
      //  showTravelPartnerModal={showTravelPartnerModal}
      //  showDriverPartnerModal={showDriverPartnerModal}
      //  Toaster={Toaster}
      //   />
      ) : 
      
      (
        <div className="min-h-screen bg-gray-50 p-4">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <div>
            <div className={`${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300 p-4`}>

              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h1 className="text-xl font-bold text-gray-800">Trip ID {trip.tripId}</h1>
                  <p className="text-gray-600 text-sm">Trip Type <span className="font-medium">{trip.tripType}</span></p>
                  <p className="text-gray-600 text-sm">Category / Number of passenger <span className="font-medium">{trip.vehicleType} / {trip.numberofpassengers || 'N/A'} Passenger</span></p>
                  <p className="text-gray-600 text-sm">
                    Pickup Date & Time <span className="font-medium">{formatDateTime(trip.tripDate)}</span>
                    {trip.isurgent && <span className="text-red-600 font-medium"> *Urgent pickup</span>}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={handleStatusChange}
                      className={`px-8 py-1 bg-yellow-400 text-black text-xs rounded font-medium ${trip.tripStatus === 'Confirmed' ? 'bg-green-500' : ''}`}
                    >
                      {trip.tripStatus ? trip.tripStatus.toUpperCase() : 'N/A'}
                    </button>
                  </div>
                  <button className="px-3 py-1 bg-black text-white text-xs rounded">ADD, CHANGE, REMOVE DRIVER</button>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-red-500 text-white text-xs rounded">DELETE</button>
                    <button className="px-3 py-1 bg-purple-500 text-white text-xs rounded">HIDE TRIP</button>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="mt-4 flex items-center space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-0.5 h-6 bg-gray-300"></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-green-600 font-medium"> Pickup Location:</span>
                    <span className="text-gray-600 ml-2">{trip.pickupLocation}</span>


                  </div>
                  <div>
                    <span className="text-red-600 font-medium">Drop Location:</span>
                    <span className="text-gray-600 ml-2">{trip.dropLocation}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 mb-6">

                {/* Left Column - Trip Creator Info */}
                <div className="col-span-3">
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <div className="border-2 border-blue-400 rounded p-3">
                      <h3 className="font-semibold text-gray-800 mb-2">Trip Created by</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                          {trip.userId?.firstName ? trip?.userId?.firstName?.charAt(0) : 'N/A'}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{trip?.userId?.firstName} {trip?.userId?.lastName}</p>
                          <p className="text-gray-600 text-xs">{''}</p>
                        </div>
                      </div>

                      <hr className="my-3" />

                      <h4 className="font-semibold text-gray-800 mb-2">My Self Detail</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                          {trip.ismySelf && trip.userId.firstName ? trip.userId.firstName.charAt(0) : 'N/A'}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {trip.ismySelf ? `${trip.userId.firstName} ${trip.userId.lastName}` : 'N/A'}
                          </p>
                          <p className="text-gray-600 text-xs">
                            {trip.ismySelf ? '+91-XXXXXXXXXX' : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {trip?.makeOffer?.length >= 1 && (
                    <div className="bg-blue-200 rounded-lg p-4 h-48">
                      <h4 className="font-semibold text-gray-800 mb-2">Fare offered by driver</h4>
                      <div className="text-center text-gray-600 text-sm mt-8">
                        {trip.makeOffer && trip.makeOffer.length > 0 ?
                          trip.makeOffer.map((offer, index) => (
                            <p key={index}>₹ {offer.fare} by {offer.driverName}</p>
                          )) :
                          ""
                        }
                      </div>
                    </div>
                  )}
                </div>

                <div className={`col-span-4 `}>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-xs border-x-4 ">
                      <tbody>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Request Best Fare</td><td className="p-2 text-center"><span className="font-medium">{renderYesNo(trip.isReuqestBestPrice)}</span></td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Total Fare</td><td className="p-2 text-center">₹ {trip.totalFare}</td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">*Need GST Bill</td><td className="p-2 text-center"><span className="font-medium">{renderYesNo(trip.requireGstBill)}</span></td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Partner Incentive</td><td className="p-2 text-center">₹ {trip.yourcomission}</td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">*secure incentive</td><td className="p-2 text-center"><span className="font-medium">{renderYesNo(trip.securemycomission)}</span></td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Extra / KM Passenger</td><td className="p-2 text-center">₹ {trip.extrachargeperkmPassenger}</td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Extra / KM Driver</td><td className="p-2 text-center">₹ {trip.extrachargeperkmDriver}</td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Negotiable Fare</td><td className="p-2 text-center">{renderYesNo(trip.negotiatedPrice)}</td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">GST 120 included in my incentive</td><td className="p-2 text-center bg-blue-200">Yes</td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Hide identity</td><td className="p-2 text-center"><span className="font-medium">{renderYesNo(trip.hidemyidentity)}</span></td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Me / My Self</td><td className="p-2 text-center"><span className="font-medium">{renderYesNo(trip.ismySelf)}</span></td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Call</td><td className="p-2 text-center"><span className="font-medium">{renderYesNo(trip?.hidemyidentityDetail?.howdriverContact?.includes('Call'))}</span></td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Whatsapp</td><td className="p-2 text-center"><span className="font-medium">{renderYesNo(trip?.hidemyidentityDetail?.howdriverContact?.includes('Whatsapp Chat'))}</span></td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Contact after accept trip</td><td className="p-2 text-center"><span className="font-medium">{renderYesNo(trip?.hidemyidentityDetail?.contactAfterCnfirmation)}</span></td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Skipp </td><td className="p-2 text-center"><span className="font-medium bg-blue-300 w-10 gap-4">Yes</span>/<span className="font-medium bg-blue-300 w-10" >No</span></td></tr>

                      </tbody>
                    </table>
                    <div>
          
                    </div>
                  </div>
                </div>

                {/* Right Column - Additional Details */}
                <div className="col-span-5">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-xs border-x-8">
                      <tbody>
                        <tr className="border-b-2"><td className="p-2 text-gray-600">Only Diesel</td><td className="p-2 text-center"><span className="font-medium">{renderYesNo(trip.onlydiesel)}</span></td></tr>
                        <tr className="border-b-2 bg-gray-50"><td className="p-2 text-gray-600">Air Condition</td><td className="p-2 text-center"><span className="font-medium">{renderYesNo(trip.requireAc)}</span></td></tr>
                        <tr className="border-b-2"><td className="p-2 text-gray-600">Luggage Carrier</td><td className="p-2 text-center"><span className="font-medium">{renderYesNo(trip.LuggageCarrier)}</span></td></tr>
                        <tr className="border-b-2 bg-gray-50"><td className="p-2 text-gray-600">All included</td><td className="p-2 text-center"><span className="font-medium">{renderYesNo(trip.Parking && trip.TollTaxes && trip.StateTaxes && trip.DriverAllowance)}</span></td></tr>
                        <tr className="border-b-2"><td className="p-2 text-gray-600">Parking</td><td className="p-2 text-center">{renderIncludedExcluded(trip.Parking)}</td></tr>
                        <tr className="border-b-2 bg-gray-50"><td className="p-2 text-gray-600">Toll Taxes</td><td className="p-2 text-center">{renderIncludedExcluded(trip.TollTaxes)}</td></tr>
                        <tr className="border-b-2"><td className="p-2 text-gray-600">State entry taxes</td><td className="p-2 text-center">{renderIncludedExcluded(trip.StateTaxes)}</td></tr>
                        <tr className="border-b-2 bg-gray-50"><td className="p-2 text-gray-600">Driver allowance</td><td className="p-2 text-center">{renderIncludedExcluded(trip.DriverAllowance)}</td></tr>
                        <tr className="border-b"><td className="p-2 text-gray-600">Pay the driver</td><td className="p-2 text-center">{trip.whopayDriver}</td></tr>
                        <tr className="border-b-2 bg-gray-50"><td className="p-2 text-gray-600">Payment</td><td className="p-2 text-center">Cash</td></tr>
                        <tr className="border-b-2"><td className="p-2 text-gray-600">Apply Coupon</td><td className="p-2 text-center">No / Coupon no</td></tr>
                        <tr><td className="p-2 text-gray-600">Comment</td><td className="p-2">{trip.comment || 'N/A'}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4">
                     <div className="bg-white rounded p-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs">Hide Comment</span>
          <span 
            className="text-xs cursor-pointer"
            onClick={toggleCommentBox}
          >
            [{showCommentBox ? 'x' : '✓'}]
          </span>
        </div>
        
        {/* Conditionally render the comment box */}
        {showCommentBox && (
          <div className="mt-3">
            <textarea 
              className="w-full p-2 border rounded"
              placeholder="User Comments"
            />
          </div>
        )}
      </div>
                  </div>
                </div>
              </div>

              {/* Second Section - Timeline and Driver Info */}
              <div className="grid grid-cols-12 gap-4">

                {/* Left Column - Driver/Partner Info */}
                <div className="col-span-3">
                  <div className="bg-gray-200 rounded-lg p-3 mb-4 text-xs">
                    <div className="bg-gray-300 p-2 rounded mb-2">
                      <div className="flex justify-between">
                        <span>{trip.createdAt ? `${Math.floor((new Date() - new Date(trip.createdAt)) / (1000 * 60))} min ago` : 'N/A'}</span>
                        <div>
                          <div>{formatDate(trip.tripDate)}</div>
                          <div>N/A</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-200 p-2 rounded mb-2">
                      <h4 className="font-semibold">Travels Partner</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">Ph</div>
                        <div>
                          <p className="font-medium">Sonu</p>
                          <p className="text-gray-600">9872728899 </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-200 p-2 rounded mb-2">
                      <h4 className="font-semibold">Driver</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">Ph</div>
                        <div>
                          <p className="font-medium">Dinesh</p>
                          <p className="text-gray-600">9882709878</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-200 p-2 rounded mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">P</div>
                        <div>
                          <p className="font-medium">Vehicle Number </p>
                          <p className="text-gray-600">{'UP-02-JL-8972' || trip.vechileType}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-1 mb-2">
                      <span className="bg-yellow-300 px-2 py-1 rounded text-xs">Total KM: {trip.totalKm}</span>
                      <span className="bg-yellow-300 px-2 py-1 rounded text-xs">Extra / Km P: ₹ {trip.extrachargeperkmPassenger}</span>
                      <span className="bg-yellow-300 px-2 py-1 rounded text-xs">Extra /Km D: ₹ {trip.extrachargeperkmDriver}</span>
                    </div>

                    <div className="bg-red-500 text-white p-1 rounded text-xs mb-1">
                      Request incentive ₹ {trip.yourcomission}, {formatDateTime(trip.createdAt)}
                    </div>
                    <div className="bg-green-500 text-white p-1 rounded text-xs mb-2">
                      Paid incentive ₹ {trip.yourcomission}, {formatDateTime(trip.updatedAt)}
                    </div>

                    <div className="bg-gray-300 p-2 rounded mb-2">
                      <h4 className="font-semibold">Comments</h4>
                      <p>{trip.comment || 'No comments'}</p>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Trip Timeline */}
                <div className="col-span-4">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-xs border-8">
                      <tbody>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Place time</td><td className="p-2">{formatDateTime(trip.createdAt)}</td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Accept time</td><td className="p-2">N/A</td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">On the way time</td><td className="p-2">{formatDateTime(trip.driveronThewayTime)}</td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Reached time</td><td className="p-2">{formatDateTime(trip.driverReachedTime)}</td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Start time</td><td className="p-2">{formatDateTime(trip.startTripTime)}</td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Drop off time</td><td className="p-2">{formatDateTime(trip.EndTripTime)}</td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Complete</td><td className="p-2">{formatDateTime(trip.CompletedTripTime)}</td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Payment Received</td><td className="p-2">........</td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Review & Rating</td><td className="p-2">Pending</td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Trip duration</td><td className="p-2">N/A</td></tr>
                      </tbody>
                    </table>

                    <div className="p-3 border-t">
                      <table className="w-full text-xs">
                        <tbody>
                          <tr className="border-b"><td className="p-1 text-gray-600">Start OTP</td><td className="p-1 text-center font-bold">{trip.otp || 'N/A'}</td></tr>
                          <tr className="border-b bg-gray-50"><td className="p-1 text-gray-600">Start meter reading</td><td className="p-1 text-center">N/A</td></tr>
                          <tr className="border-b"><td className="p-1 text-gray-600">End meter reading</td><td className="p-1 text-center">N/A</td></tr>
                          <tr className="border-b bg-gray-50"><td className="p-1 text-gray-600">Total KM</td><td className="p-1 text-center font-bold">{trip.distance || 'N/A'}</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 border-t">
                      <table className="w-full text-xs">
                        <tbody>
                          <tr className="border-b">
                            <td className="p-1 text-gray-600">Driver Partner</td>
                            <td className="p-1 text-center">No Review</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="p-1 text-gray-600">4.5/5</td>
                            <td></td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-1 text-gray-600">Passenger</td>
                            <td className="p-1 text-center">No Review</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="p-1 text-gray-600">No Rating</td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 border-t">
                      <table className="w-full text-xs">
                        <tbody>
                          <tr>
                            <td className="p-1 bg-red-100 text-red-700 font-medium">Report Trip</td>
                            <td className="p-1 text-center">Details with {trip.tripId}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Column - Fare Breakdown */}
                <div className="col-span-5">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-xs border-8 ">
                      <tbody>
                        <tr className="border-b bg-blue-50">
                          <td className="p-2 text-gray-600">Driver income</td>
                          <td className="p-2 text-right">₹  {trip?.totalFare - trip?.yourcomission}</td>
                        </tr>
                        <tr className="border-b text-xs text-gray-500">
                          <td className="px-2 pb-1">Paid Incentive Excluded</td>
                          <td></td>
                        </tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Partner incentive</td><td className="p-2 text-right">₹ {trip.yourcomission}</td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Booking fee (user)</td><td className="p-2 text-right">₹ 00</td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Admin commission (Driver)</td><td className="p-2 text-right">₹ 00</td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Extra KM {trip?.distance?.split(' ')[0]} X ₹{trip?.extrachargeperkmDriver}</td><td className="p-2 text-right">₹ {parseFloat(tripdata?.distance?.split('')[0]) * tripdata?.extrachargeperkmDriver}</td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Extra hour 2 X ₹120</td><td className="p-2 text-right">₹ 00</td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Taxes {trip.GstTax}% GST</td><td className="p-2 text-right">₹ {trip.GstTax}</td></tr>
                        <tr className="border-b-4 font-bold bg-yellow-50"><td className="p-2 text-gray-800">Total Amount</td><td className="p-2 text-right">₹ {trip.totalFare}</td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Paid for promo</td><td className="p-2 text-right">₹ 00</td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Skip for pay</td><td className="p-2 text-right">₹ 00</td></tr>
                        <tr className="border-b-4"><td className="p-2 text-gray-600">Advance received partner</td><td className="p-2 text-right">₹ {trip.advanceamount}</td></tr>
                        <tr className="border-b-4 bg-gray-50"><td className="p-2 text-gray-600">Round off</td><td className="p-2 text-right">₹ 00</td></tr>
                        <tr className="border-b-4 font-bold bg-green-50"><td className="p-2 text-gray-800">Payable amount</td><td className="p-2 text-right">₹ {trip.totalFare - trip.advanceamount}</td></tr>
                        <tr className="bg-blue-50"><td className="p-2 text-gray-600">Paid</td><td className="p-2 text-right font-medium">{trip.whopayDriver === 'Passenger' ? 'Cash/Online by Passenger' : 'Cash/Online by Me'}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-white rounded p-3 text-xs">
                      <h4 className="font-bold text-gray-800 mb-2">Total Driver Income</h4>
                      <p className="font-bold text-lg">₹ {trip.totalFare - trip.yourcomission}</p>
                      <div className="space-y-1 text-gray-600">
                        <div>Fix Amount: ₹ {trip?.totalFare - trip?.yourcomission - (parseFloat(trip?.distance?.split(' ')[0]) * trip?.extrachargeperkmDriver)}</div>
                        <div>Advance paid commission: ₹ {trip.advanceamount}</div>
                        <div>Extra KM {trip?.distance?.split(' ')[0]} KM: ₹ {parseFloat(trip?.distance?.split(' ')[0]) * trip?.extrachargeperkmDriver}</div>
                        <div>Extra hour: ₹ 00</div>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3 text-xs">
                      <h4 className="font-bold text-gray-800 mb-2">Total Partner Incentive</h4>
                      <p className="font-bold text-lg">₹ {trip.yourcomission}</p>
                      <div className="space-y-1 text-gray-600">
                        <div>Fix Incentive: ₹ {trip.yourcomission}</div>
                        <div>Extra KM: ₹ 00</div>
                        <div>Extra hour: ₹ 00</div>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3 text-xs">
                      <h4 className="font-bold text-gray-800 mb-2">Total Admin Incentive</h4>
                      <p className="font-bold text-lg">₹ {trip.GstTax}</p>
                      <div className="space-y-1 text-gray-600">
                        <div>Commission: ₹ 00</div>
                        <div>Booking Fee: ₹ 00</div>
                        <div>Tax {trip.GstTax}% GST: ₹ {trip.GstTax}</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal for non-CarPool trips */}
      {showStatusModal && trip.tripType !== 'CarPool' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Change Trip Status</h3>
            <div className="space-y-3">
              {['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={actionLoading}
                  className={`w-full text-left px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedStatus === status 
                      ? 'bg-blue-100 border-blue-500' 
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize">{actionLoading ? 'Updating...' : status}</span>
                    <StatusBadge status={status} />
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => setShowStatusModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Toaster position="top-right" />
    </>
  );
};

export default ViewUserTrip;