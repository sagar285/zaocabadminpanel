import React, { useState } from 'react';
import { Car } from 'lucide-react'; // Make sure you have lucide-react installed
import {useGetAllCarpoolSeatesQuery,} from '../../Redux/Api'
// ViewConfigModal component (from your paste.txt)
const ViewConfigModal = ({ isOpen, onClose, config }) => {
  if (!isOpen || !config) return null;

  const seatConfig = config.seatConfig;

  const renderSeatLayout = () => {
    if (!seatConfig.seatLayout || !Array.isArray(seatConfig.seatLayout)) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Car className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No seat layout available</p>
        </div>
      );
    }
// 
    return (
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-4 border-2 border-gray-300 shadow-lg">
        <div className="text-center mb-4">
          <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-full text-xs font-bold">
            🚗 FRONT
          </div>
        </div>
        
        <div className="space-y-3">
          {seatConfig.seatLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-center">
              <div className="w-6 text-center text-xs text-gray-500 font-medium mr-3">
                R{row.rowNumber}
              </div>
              
              {row.leftSeats && row.leftSeats.length > 0 && row.rightSeats && row.rightSeats.length > 0 ? (
                <>
                  <div className="flex gap-1">
                    {row.leftSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold ${
                          seat.isDriver
                            ? "bg-orange-100 border-orange-400 text-orange-800"
                            : seat.available
                            ? "bg-green-100 border-green-400 text-green-800"
                            : "bg-red-100 border-red-400 text-red-800"
                        }`}
                      >
                        {seat.isDriver ? "🚗" : seat.label}
                      </div>
                    ))}
                  </div>
                  <div className="w-6 flex items-center justify-center">
                    <div className="w-px h-6 bg-gray-300"></div>
                  </div>
                  <div className="flex gap-1">
                    {row.rightSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold ${
                          seat.isDriver
                            ? "bg-orange-100 border-orange-400 text-orange-800"
                            : seat.available
                            ? "bg-green-100 border-green-400 text-green-800"
                            : "bg-red-100 border-red-400 text-red-800"
                        }`}
                      >
                        {seat.isDriver ? "🚗" : seat.label}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex gap-1">
                  {[...(row.leftSeats || []), ...(row.rightSeats || [])].map((seat) => (
                    <div
                      key={seat.id}
                      className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold ${
                        seat.isDriver
                          ? "bg-orange-100 border-orange-400 text-orange-800"
                          : seat.available
                          ? "bg-green-100 border-green-400 text-green-800"
                          : "bg-red-100 border-red-400 text-red-800"
                      }`}
                    >
                      {seat.isDriver ? "🚗" : seat.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-full text-xs font-bold">
            BACK 🚪
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Car className="w-5 h-5 text-blue-600" />
          View Seat Configuration Details
        </h2>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Vehicle Name</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{seatConfig.vehicleName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Vehicle Model</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{seatConfig.vehicleModel || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Total Rows</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{seatConfig.totalRows || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Configuration Type</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {seatConfig.customRowConfig ? 'Custom' : 'Uniform'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Total Seats</label>
              <p className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm font-semibold text-blue-800">{seatConfig.totalSeats || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Available Seats</label>
              <p className="px-3 py-2 bg-green-50 border border-green-200 rounded-md text-sm font-semibold text-green-800">{seatConfig.availableSeats || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Occupied Seats</label>
              <p className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-sm font-semibold text-red-800">{seatConfig.occupiedSeats || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Has Driver Seat</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {seatConfig.hasDriver ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-600">Seat Layout</label>
          {renderSeatLayout()}
          
          {/* Legend */}
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-400 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 border border-red-400 rounded"></div>
              <span>Occupied</span>
            </div>
            {seatConfig.hasDriver && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-100 border border-orange-400 rounded"></div>
                <span>Driver</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Your main component
const AvailableSeatDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sample config data - replace this with your actual data
  const sampleConfig = {
    seatConfig: {
      vehicleName: "Luxury Bus",
      vehicleModel: "Mercedes Sprinter",
      totalRows: 3,
      totalSeats: 12,
      availableSeats: 8,
      occupiedSeats: 4,
      hasDriver: true,
      customRowConfig: false,
      seatLayout: [
        {
          rowNumber: 1,
          leftSeats: [
            { id: 1, label: "1A", available: true, isDriver: true },
            { id: 2, label: "1B", available: false, isDriver: false }
          ],
          rightSeats: [
            { id: 3, label: "1C", available: true, isDriver: false },
            { id: 4, label: "1D", available: false, isDriver: false }
          ]
        },
        {
          rowNumber: 2,
          leftSeats: [
            { id: 5, label: "2A", available: true, isDriver: false },
            { id: 6, label: "2B", available: true, isDriver: false }
          ],
          rightSeats: [
            { id: 7, label: "2C", available: false, isDriver: false },
            { id: 8, label: "2D", available: true, isDriver: false }
          ]
        },
        {
          rowNumber: 3,
          leftSeats: [
            { id: 9, label: "3A", available: true, isDriver: false },
            { id: 10, label: "3B", available: false, isDriver: false }
          ],
          rightSeats: [
            { id: 11, label: "3C", available: true, isDriver: false },
            { id: 12, label: "3D", available: true, isDriver: false }
          ]
        }
      ]
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Seat Details</h1>
      
      {/* Button to open the modal */}
      

      {/* Modal */}
      <ViewConfigModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        config={sampleConfig}
      />
    </div>
  );
};

export default AvailableSeatDetails;