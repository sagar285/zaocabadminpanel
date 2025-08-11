import React,{useState} from 'react'
import Sidebar from '../../Component/Sidebar';
import moment from "moment";

const CarpoolTripFareDetail = ({
    trip,
    toggleSidebar,
    confirmedTrip,
    handleRemoveDriver,
    actionLoading,
    showDetailedView,
    selectedDriver,
    selectedSeats,
    allSeats,
    showStatusModal,
    StatusBadge,
    ActionButton,
    offeredTrips,
    showCommentBox,
    handleStatusChange,
    handleDriverAction,
    handleLocationEdit,
    handleAddTravelPartner,
    handleHideTrip,
    isHidden,
    toggleCommentBox,
    showLocationModal,
    showTravelPartnerModal,
    showDriverPartnerModal,
    Toaster


    



}) => {


      const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      const [showDriverModal, setShowDriverModal] = useState(false);
    
        const userInfo = trip?.userId;









  return (
    <div>
      


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
            {(offeredTrips.length > 0 || confirmedTrip) && (
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
      




























    </div>
  )
}

export default CarpoolTripFareDetail
