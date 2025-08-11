import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetuserTripByIdQuery,
  useUpdateTripwithStateCitiesMutation,
} from "../../Redux/Api";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
import Sidebar from "../../Component/Sidebar";

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-blue-500">Loading trip details...</p>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="bg-red-50 p-6 rounded-lg shadow-sm">
      <p className="text-red-500 font-medium">Error fetching trip details: {message}</p>
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

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tripdata, error, isLoading, isFetching } = useGetuserTripByIdQuery(id);

  const trip = tripdata?.tripDetail;
  const offeredTrips = tripdata?.userOfferedTrip || [];
  const confirmedTrip = tripdata?.userconfirmOfferedTrip;
        const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State management
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(trip?.tripStatus || '');

  const [updateTrip] = useUpdateTripwithStateCitiesMutation();

  // Update status when trip data loads
  React.useEffect(() => {
    if (trip) {
      setSelectedStatus(trip.tripStatus || '');
    }
  }, [trip]);

  // Handler functions
  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      // Add your status update API call here
      setSelectedStatus(newStatus);
      setShowStatusModal(false);
      toast.success(`Trip status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update trip status');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePickup = async () => {
    setActionLoading(true);
    try {
      // Add your pickup API call here
      toast.success('Pickup action triggered successfully');
      // Optionally update trip status to "ongoing"
      setSelectedStatus('ongoing');
    } catch (error) {
      toast.error('Failed to trigger pickup action');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this trip?')) {
      setActionLoading(true);
      try {
        // Add your cancel API call here
        toast.error('Trip cancelled successfully');
        setSelectedStatus('cancelled');
      } catch (error) {
        toast.error('Failed to cancel trip');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleBlock = async () => {
    if (window.confirm('Are you sure you want to block this trip?')) {
      setActionLoading(true);
      try {
        // Add your block API call here
        toast.warning('Trip blocked successfully');
        setSelectedStatus('blocked');
      } catch (error) {
        toast.error('Failed to block trip');
      } finally {
        setActionLoading(false);
      }
    }
  };

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

  if (isLoading || isFetching) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  if (!trip) return <ErrorState message="No trip data available" />;

  const userInfo = trip?.userId;
  const driverInfo = confirmedTrip?.userId || offeredTrips[0]?.userId;

  return (
    <div className="min-h-screen bg-gray-100 p-4">


         <Sidebar
                                      isSidebarOpen={isSidebarOpen}
                                      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                                    />
  <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'} p-6`}>
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold">Trip Details</h1>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={selectedStatus} />
              <button 
                onClick={() => setShowStatusModal(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Change Status
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="font-semibold">Trip ID:</span> {trip?.tripId}
            </div>
            <div>
              <span className="font-semibold">Trip Type:</span> {trip?.tripType}
            </div>
            <div>
              <span className="font-semibold">Vehicle Type:</span> {trip?.vehicleType}
            </div>
            <div>
              <span className="font-semibold">Start Date & Time:</span> {moment(trip?.tripDate).format("ddd DD MMM YYYY, hh:mm A")}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Side - Driver and Trip Info */}
          <div className="space-y-6">
            
            {/* Driver Contact Section */}
            {driverInfo && (
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {driverInfo?.firstName?.[0]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {driverInfo?.firstName} {driverInfo?.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{driverInfo?.role}</p>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Contact {driverInfo?.firstName} {driverInfo?.lastName}</p>
                </div>

                <div className="flex gap-2 mb-4">
                  <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 flex items-center justify-center gap-2">
                    💬 Chat via ZAO CABS
                  </button>
                  <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 flex items-center justify-center gap-2">
                    📞 {driverInfo?.phone || 'Contact'}
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
                      <div className="text-2xl font-bold text-green-600">₹{confirmedTrip?.offerPrice || trip?.totalFare || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Info Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Trip Creator</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {userInfo?.firstName?.[0]}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{userInfo?.firstName} {userInfo?.lastName}</div>
                  <div className="text-sm text-gray-600">{userInfo?.phone}</div>
                  <div className="text-sm text-blue-600">{userInfo?.role}</div>
                </div>
              </div>
            </div>

            {/* Route Timeline */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Route Timeline</h3>
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
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-4 text-center">Seat Selection</h3>
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
          </div>

          {/* Right Side - Financial Info */}
          <div className="space-y-6">
            
            {/* Total Driver Income */}
            <div className="bg-gray-50 rounded-lg p-6">
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
            <div className="bg-gray-50 rounded-lg p-6">
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
            <div className="bg-gray-50 rounded-lg p-6">
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
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Trip Summary</h3>
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

            {/* Additional Trip Information */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div><span className="font-medium">OTP:</span> {trip?.otp || "N/A"}</div>
                  <div><span className="font-medium">Trip Price:</span> ₹{trip?.tripPrice || 0}</div>
                  <div><span className="font-medium">State Taxes:</span> {trip?.StateTaxes ? "Yes" : "No"}</div>
                  <div><span className="font-medium">Urgent Trip:</span> {trip?.isurgent ? "Yes" : "No"}</div>
                </div>
                <div className="space-y-2">
                  <div><span className="font-medium">Start Meter:</span> {trip?.startMeterReading || "N/A"}</div>
                  <div><span className="font-medium">End Meter:</span> {trip?.endMeterReading || "N/A"}</div>
                  <div><span className="font-medium">Toll Taxes:</span> {trip?.TollTaxes ? "Yes" : "No"}</div>
                  <div><span className="font-medium">Who Pays Driver:</span> {trip?.whopayDriver || "N/A"}</div>
                </div>
              </div>
              
              {trip?.comment && (
                <div className="mt-4">
                  <div className="font-medium mb-2">Comments:</div>
                  <div className="p-3 bg-gray-50 rounded border text-sm">
                    {trip.comment}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={handlePickup}
              disabled={actionLoading}
              className="bg-green-500 text-white px-8 py-3 rounded font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Processing...' : 'Pickup >'}
            </button>
            <button 
              onClick={handleCancel}
              disabled={actionLoading}
              className="bg-red-500 text-white px-8 py-3 rounded font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Processing...' : 'Cancel'}
            </button>
            <button 
              onClick={handleBlock}
              disabled={actionLoading}
              className="bg-yellow-500 text-white px-8 py-3 rounded font-semibold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Processing...' : 'Block'}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <div className="inline-block bg-orange-200 px-4 py-2 rounded text-sm">
              Admin can change trip status
            </div>
          </div>

          {/* Bottom Info Tabs */}
          <div className="mt-4 flex gap-2 justify-center flex-wrap">
            <div className="bg-orange-500 text-white px-4 py-2 rounded flex items-center gap-2">
              <span>Click Call 12</span>
              <button className="text-sm underline hover:no-underline">view</button>
            </div>
            <div className="bg-pink-300 px-4 py-2 rounded">
              Travels Partner
            </div>
          </div>
        </div>

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

      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default TripDetails;