import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCarpoolTripByIdQuery,
  useGetTripDetailsByIdQuery,
  useGetuserTripByIdQuery,
  useUpdateTripwithStateCitiesMutation,
} from "../Redux/Api";
import AddCityModal from "../Component/Modal/AddCityModal";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../Url/baseUrl";
import Sidebar from "../Component/Sidebar";
import moment from "moment";
import CarpoolTripFareDetail from "./dynamic/CarpoolTripFareDetail";

const LoadingState = ({ isSidebarOpen }) => (
  <div
    className={`flex-1 p-4 ${
      isSidebarOpen ? "ml-64" : "ml-20"
    } transition-all duration-300`}
  >
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-blue-500">Loading trip details...</p>
    </div>
  </div>
);

const ErrorState = ({ message, isSidebarOpen }) => (
  <div
    className={`flex-1 p-4 ${
      isSidebarOpen ? "ml-64" : "ml-20"
    } transition-all duration-300`}
  >
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-50 p-6 rounded-lg shadow-sm">
        <p className="text-red-500 font-medium">
          Error fetching trip details: {message}
        </p>
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
    default: "bg-gray-500 text-white",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        statusStyles[status?.toLowerCase()] || statusStyles.default
      }`}
    >
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

const TripHeader = ({
  trip,
  onStatusChange,
  onDriverAction,
  onLocationEdit,
  onHideTrip,
}) => {
  return (
    <div className="bg-white p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-gray-800">
            Trip ID {trip.tripId}
          </h1>
          <p className="text-gray-600 text-sm">
            Trip Type <span className="font-medium">{trip.tripType}</span>
          </p>
          <p className="text-gray-600 text-sm">
            Category / Number of passenger{" "}
            <span className="font-medium">
              {trip.vehicleId} - {trip.seats?.length || 0}
            </span>
          </p>
          <p className="text-gray-600 text-sm">
            Start Date & Time{" "}
            <span className="font-medium">
              {moment(trip.whenAreYouGoing).format("ddd DD MMM YYYY, hh:mm A")}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {/* Travels Partner */}
            <div className="text-center">
              <div className="text-xs text-gray-600">Travels Partner</div>
              <div className="font-medium">Atul Kumar</div>
              <div className="text-xs text-gray-500">+91-7654321457</div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mx-auto mt-1">
                P
              </div>
            </div>

            {/* Driver Partner */}
            <div className="text-center ml-8">
              <div className="text-xs text-gray-600">Driver Partner</div>
              <div className="font-medium">Rohit Kumar</div>
              <div className="text-xs text-gray-500">+91-7654321457</div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mx-auto mt-1">
                P
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={onStatusChange}
              className="px-8 py-2 bg-yellow-400 text-black text-sm rounded font-medium"
            >
              {trip.tripStatus?.toUpperCase() || "PENDING"}
            </button>
            {/* <button
              onClick={onDriverAction}
              className="px-3 py-1 bg-black text-white text-xs rounded"
            >
              ADD, CHANGE, REMOVE DRIVER
            </button> */}
            {/* <div className="flex gap-2">
              <button
                onClick={onLocationEdit}
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded"
              >
                Change trip status
              </button>
              <button
                onClick={onLocationEdit}
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded"
              >
                Edit & Change Location
              </button>
            </div>
            <button
              onClick={onHideTrip}
              className="px-3 py-1 bg-purple-500 text-white text-xs rounded"
            >
              HIDE TRIP
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const RouteTable = ({ trip }) => {
  return (
    <div className="bg-white mb-4">
      <table className="w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold border">Time</th>
            <th className="px-4 py-3 text-left font-semibold border">
              Location
            </th>
            <th className="px-4 py-3 text-left font-semibold border">
              Distance
            </th>
            <th className="px-4 py-3 text-left font-semibold border">
              State, City
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Pickup Location */}
          <tr>
            <td className="px-4 py-2 border">
              {moment(trip.whenAreYouGoing).format("ddd DD MMM YYYY, hh:mm A")}
            </td>
            <td className="px-4 py-2 border">{trip.pickupLocation}</td>
            <td className="px-4 py-2 border">0 Kms</td>
            <td className="px-4 py-2 border">
              {trip.pickupLocation?.includes("Uttar Pradesh")
                ? "Lucknow, Uttar Pradesh"
                : "-"}
            </td>
          </tr>

          {/* Stop Overs */}
          {trip.stopOvers
            ?.filter((stop) => stop.type === "stop")
            .map((stop, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{stop.arrivalTime}</td>
                <td className="px-4 py-2 border">{stop.location}</td>
                <td className="px-4 py-2 border">{stop.distance}</td>
                <td className="px-4 py-2 border">
                  {stop.location?.includes("Uttar Pradesh")
                    ? "Lucknow, Uttar Pradesh"
                    : stop.location?.includes("Madhya Pradesh")
                    ? "Madhya Pradesh"
                    : "-"}
                </td>
              </tr>
            ))}

          {/* Drop Location */}
          <tr>
            <td className="px-4 py-2 border">
              {trip.stopOvers?.find((stop) => stop.type === "drop")
                ?.arrivalTime || "-"}
            </td>
            <td className="px-4 py-2 border">{trip.dropLocation}</td>
            <td className="px-4 py-2 border">{trip.route?.distance || "-"}</td>
            <td className="px-4 py-2 border">
              {trip.dropLocation?.includes("Madhya Pradesh")
                ? "Madhya Pradesh"
                : "-"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const PassengersTable = ({ passengers, onViewPassenger }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pickedup":
        return "bg-green-500";
      case "confirmed":
        return "bg-purple-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pickedup":
        return "Picked";
      case "confirmed":
        return "Confirm";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Expire / Reject";
      default:
        return "Drop";
    }
  };

  return (
    <div className="bg-white mb-4">
      <table className="w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold border">
              Passenger
            </th>
            <th className="px-4 py-3 text-left font-semibold border">Pickup</th>
            <th className="px-4 py-3 text-left font-semibold border">Drop</th>
            <th className="px-4 py-3 text-left font-semibold border">
              Distance
            </th>
            <th className="px-4 py-3 text-left font-semibold border">Seat</th>
            <th className="px-4 py-3 text-left font-semibold border">Fare</th>
            <th className="px-4 py-3 text-left font-semibold border">Status</th>
            <th className="px-4 py-3 text-left font-semibold border">Action</th>
          </tr>
        </thead>
        <tbody>
          {passengers?.map((passenger, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border">
                <div>
                  <div className="font-medium">
                    {passenger.passengerId?.firstName}{" "}
                    {passenger.passengerId?.lastName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {passenger.passengerId?.phone}
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 border text-sm">
                {passenger.pickupLocation}
              </td>
              <td className="px-4 py-2 border text-sm">
                {passenger.dropLocation}
              </td>
              <td className="px-4 py-2 border text-sm">
                {passenger.bookingId?.stopOvers?.[1]?.distance || "230 Kms"}
              </td>
              <td className="px-4 py-2 border text-center">
                {passenger.seatLabel}
              </td>
              <td className="px-4 py-2 border text-center">
                {passenger.totalFare}
              </td>
              <td className="px-4 py-2 border">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${getStatusColor(
                    passenger.status
                  )}`}
                >
                  {getStatusText(passenger.status)}
                </span>
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => onViewPassenger(passenger)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  view
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TripSummary = ({ trip, showCommentBox, onToggleComment }) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Left: Trip Stats */}
      <div className="col-span-3">
        <table className="w-full bg-white border">
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Total Seat</td>
              <td className="px-4 py-2 text-center">
                {trip.seats?.length || "7+1D"}
              </td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-2 font-medium">Available Seat</td>
              <td className="px-4 py-2 text-center">
                {trip.seatAvailable || 4}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Total Booked seat</td>
              <td className="px-4 py-2 text-center">
                {trip.passengers?.length || 3}
              </td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-2 font-medium">Total fare</td>
              <td className="px-4 py-2 text-center">
                {trip.stopOvers?.reduce(
                  (sum, stop) => sum + (stop.fare || 0),
                  0
                ) || "00"}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Total commission</td>
              <td className="px-4 py-2 text-center">00</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Per km charge</td>
              <td className="px-4 py-2 text-center">1.99/km</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Center: Seat Layout */}
      <div className="col-span-3 flex justify-center">
        <div className="bg-white p-4 border rounded">
          <div className="grid grid-cols-2 gap-2 mb-2">
            {trip.seats?.slice(0, 6).map((seat) => (
              <div
                key={seat.id}
                className={`w-8 h-8 rounded text-xs flex items-center justify-center ${
                  seat.available ? "bg-green-500 text-white" : "bg-gray-300"
                }`}
              >
                {seat.label}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            {trip.seats?.slice(6).map((seat) => (
              <div
                key={seat.id}
                className={`w-8 h-8 rounded text-xs flex items-center justify-center ${
                  seat.available ? "bg-green-500 text-white" : "bg-gray-300"
                }`}
              >
                {seat.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Features */}
      <div className="col-span-6">
        <table className="w-full bg-white border">
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Air condition (AC)</td>
              <td className="px-4 py-2 text-center">
                {trip.AcAvaiilable ? "Yes" : "No"} / No
              </td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-2 font-medium">Instant Booking</td>
              <td className="px-4 py-2 text-center">
                {trip.instantBooking ? "Yes" : "No"} / No
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Review every request</td>
              <td className="px-4 py-2 text-center">Yes / No</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-2 font-medium">
                There is no fare for this trip
              </td>
              <td className="px-4 py-2 text-center">
                {trip.nofare ? "Yes" : "No"} / No
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium text-blue-500 underline">
                {trip.isReturn ? "Coming Back" : "Coming Back"}
              </td>
              <td className="px-4 py-2 text-center">
                {trip.isReturn ? "Yes" : "No"} / No
              </td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-2 font-medium">
                {trip.isReturn && `Trip ID #${trip.tripId.replace("#", "")}`}
              </td>
              <td className="px-4 py-2 text-center"></td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Comment Box</td>
              <td className="px-4 py-2 text-center">
                <span className="cursor-pointer" onClick={onToggleComment}>
                  [{showCommentBox ? "✓" : " "}]
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-2 text-right">
          <span className="text-sm cursor-pointer" onClick={onToggleComment}>
            Hide Comment
          </span>
        </div>
      </div>
    </div>
  );
};

const ViewUserCarpoolTrip = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: tripdata,
    error,
    isLoading,
    isFetching,
  } = useGetCarpoolTripByIdQuery(id);

  const trip = tripdata;
  const driver = tripdata?.tripDetail?.userId?.role === "driver";
  const travel = tripdata?.tripDetail?.userId?.role === "travelOwner";
  const [isSkip, setIsSkip] = useState(false);
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
  const [selectedStatus, setSelectedStatus] = useState(trip?.tripStatus || "");
  const [isHidden, setIsHidden] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  // Location state
  const [editLocation, setEditLocation] = useState({
    pickupLocation: trip?.pickupLocation || "",
    dropLocation: trip?.dropLocation || "",
    dropStops: trip?.dropStops || [],
  });

  const [updateTrip] = useUpdateTripwithStateCitiesMutation();

  // Update location state when trip data loads
  React.useEffect(() => {
    if (trip) {
      setEditLocation({
        pickupLocation: trip.pickupLocation || "",
        dropLocation: trip.dropLocation || "",
        dropStops: trip.dropStops || [],
      });
      setSelectedStatus(trip.tripStatus || "");
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

  const toggleSkip = () => {
    setIsSkip(true);
  };

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  console.log(updateTrip);
  console.log(trip);
  console.log(trip?.makeOffer);
  console.log(updateTrip);

  const handleHideTrip = async () => {
    if (window.confirm("Are you sure you want to hide this trip?")) {
      setActionLoading(true);
      try {
        // Add your hide trip API call here
        // await hideTrip(id);
        setIsHidden(true);
        toast.success("Trip hidden successfully");
      } catch (error) {
        toast.error("Failed to hide trip");
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
      toast.error("Failed to update trip status");
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
        dropStops: editLocation.dropStops,
      });
      setShowLocationModal(false);
      toast.success("Locations updated successfully");
    } catch (error) {
      toast.error("Failed to update locations");
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
      toast.success("Driver assigned successfully");
    } catch (error) {
      toast.error("Failed to assign driver");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveDriver = async () => {
    if (window.confirm("Are you sure you want to remove the current driver?")) {
      setActionLoading(true);
      try {
        // Add your remove driver API call here
        // await removeDriver(id);
        toast.success("Driver removed successfully");
      } catch (error) {
        toast.error("Failed to remove driver");
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
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to format date
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
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
              ? "bg-red-500 text-white cursor-not-allowed"
              : isSelected
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return seats;
  };

  const allSeats = renderSeats();

  if (isLoading || isFetching)
    return <LoadingState isSidebarOpen={isSidebarOpen} />;
  if (error)
    return <ErrorState message={error.message} isSidebarOpen={isSidebarOpen} />;
  if (!trip)
    return (
      <ErrorState
        message="No trip data available"
        isSidebarOpen={isSidebarOpen}
      />
    );

  const userInfo = trip?.userId;
  const offeredTrips = tripdata?.userOfferedTrip || [];
  const confirmedTrip = tripdata?.userconfirmOfferedTrip;
  console.log(trip.tripType);
  console.log(offeredTrips);

  return (
    <>

        <div className="min-h-screen bg-gray-100">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <div
            className={`${
              isSidebarOpen ? "ml-64" : "ml-20"
            } transition-all duration-300 p-4`}
          >
           <TripHeader
              trip={trip}
              onStatusChange={handleStatusChange}
              onDriverAction={handleDriverAction}
              onLocationEdit={handleLocationEdit}
              onHideTrip={handleHideTrip}
            />
            <RouteTable trip={trip} />
            <PassengersTable
              passengers={trip.passengers}
              onViewPassenger={handleViewDetails}
            />
            <TripSummary
              trip={trip}
              showCommentBox={showCommentBox}
              onToggleComment={toggleCommentBox}
            />

            {/* Trip Details Summary Tables */}
         
          </div>

          {/* All Modals */}

          <div>
            
          </div>

          <Toaster position="top-right" />
        </div>

      
      

      <Toaster position="top-right" />
    </>
  );
};

export default ViewUserCarpoolTrip;
