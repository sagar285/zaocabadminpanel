import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '.././Sidebar';

const CarpoolPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  const [carpoolStats, setCarpoolStats] = useState({
    brandName: 'Carpool Services',
    vehiclesName: 'Available Vehicles',
    availableSeates:'Available Seats',
    seats: '140',
    fuel: 'Multiple Types',
    colour: '6 Options',
    year: '2022-2024',
    pendingVehicle: 23,
    activeVehicle: 76,
    passengersTrip: 23,
    vehicleTrip: 20,
    carpoolAwareness: 10
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Navigate to different management pages based on card clicked
  const handleCardClick = (cardType) => {
    switch(cardType) {
      case 'brandName':
        navigate('/carpool/brand-management');
        break;
      case 'vehiclesName':
        navigate('/carpool/available-seats');
        break;
      case 'seats':
        navigate('/carpool/seat-management');
        break;
      case 'fuel':
        navigate('/carpool/add-fuel');
        break;
      case 'colour':
        navigate('/carpool/color');
        break;
      case 'year':
        navigate('/carpool/add-year');
        break;
        case 'carpool-awarness':
        navigate('/carpool/carpool-awarness');
        break;
      default:
        navigate('/carpool/brand-management');
    }
  };

  // Simulate fetching data
  useEffect(() => {
    // This would be an API call in a real application
    // fetchCarpoolStats().then(data => setCarpoolStats(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <div className="bg-white shadow-sm p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800">Carpool Management</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Carpool Dashboard */}
            <div className="rounded-lg bg-[#00BFFF] text-black shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-[#00BFFF] p-4 text-center">
                <h2 className="text-2xl font-bold text-black uppercase">CARPOOL</h2>
              </div>

              {/* Grid Layout - Clickable Cards */}
              <div className="grid grid-cols-2 gap-4 p-4">
                {/* Brand Name - Clickable */}
                <div 
                  className="bg-white rounded-md p-4 text-center shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
                  onClick={() => handleCardClick('brandName')}
                >
                  <h3 className="font-semibold text-gray-800">Brand Name</h3>
                  <p className="text-lg mt-2">{carpoolStats.brandName}</p>
                  <p className="text-xs text-blue-600 mt-1">Click to manage</p>
                </div>

                {/* Vehicles Name - Clickable */}
                <div 
                  className="bg-white rounded-md p-4 text-center shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
                  onClick={() => handleCardClick('vehiclesName')}
                >
                  <h3 className="font-semibold text-gray-800">Seat Configration</h3>
                  <p className="text-lg mt-2">{carpoolStats.availableSeates}</p>
                  <p className="text-xs text-blue-600 mt-1">Click to manage</p>
                </div>

                {/* Seats - Clickable */}
                <div 
                  className="bg-white rounded-md p-4 text-center shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
                  onClick={() => handleCardClick('seats')}
                >
                  <h3 className="font-semibold text-gray-800">Seats</h3>
                  <p className="text-lg mt-2">{carpoolStats.seats}</p>
                  <p className="text-xs text-blue-600 mt-1">Click to manage</p>
                </div>

                {/* Fuel - Clickable */}
                <div 
                  className="bg-white rounded-md p-4 text-center shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
                  onClick={() => handleCardClick('fuel')}
                >
                  <h3 className="font-semibold text-gray-800">Fuel</h3>
                  <p className="text-lg mt-2">{carpoolStats.fuel}</p>
                  <p className="text-xs text-blue-600 mt-1">Click to manage</p>
                </div>

                {/* Colour - Clickable */}
                <div 
                  className="bg-white rounded-md p-4 text-center shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
                  onClick={() => handleCardClick('colour')}
                >
                  <h3 className="font-semibold text-gray-800">Colour</h3>
                  <p className="text-lg mt-2">{carpoolStats.colour}</p>
                  <p className="text-xs text-blue-600 mt-1">Click to manage</p>
                </div>

                {/* Year - Clickable */}
                <div 
                  className="bg-white rounded-md p-4 text-center shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
                  onClick={() => handleCardClick('year')}
                >
                  <h3 className="font-semibold text-gray-800">Year</h3>
                  <p className="text-lg mt-2">{carpoolStats.year}</p>
                  <p className="text-xs text-blue-600 mt-1">Click to manage</p>
                </div>

                {/* Non-clickable stats */}
                <div className="bg-white rounded-md p-4 text-center shadow-sm">
                  <h3 className="font-semibold text-gray-800">Pending Vehicle</h3>
                  <p className="text-lg mt-2 font-bold text-orange-600">{carpoolStats.pendingVehicle}</p>
                </div>

                <div className="bg-white rounded-md p-4 text-center shadow-sm">
                  <h3 className="font-semibold text-gray-800">Active Vehicle</h3>
                  <p className="text-lg mt-2 font-bold text-green-600">{carpoolStats.activeVehicle}</p>
                </div>

                <div className="bg-white rounded-md p-4 text-center shadow-sm">
                  <h3 className="font-semibold text-gray-800">Passengers Trip</h3>
                  <p className="text-lg mt-2 font-bold text-blue-600">{carpoolStats.passengersTrip}</p>
                </div>

                <div className="bg-white rounded-md p-4 text-center shadow-sm">
                  <h3 className="font-semibold text-gray-800">Vehicle Trip</h3>
                  <p className="text-lg mt-2 font-bold text-purple-600">{carpoolStats.vehicleTrip}</p>
                </div>

                <div className="bg-white rounded-md p-4 text-center shadow-sm col-span-2"
                 onClick={() => handleCardClick('carpool-awarness')}>
                  <h3 className="font-semibold text-gray-800">Carpool Awareness</h3>
                  <p className="text-lg mt-2 font-bold text-indigo-600">{carpoolStats.carpoolAwareness}</p>
                </div>
              </div>
            </div>

            {/* Additional Carpool Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Feature 1: Recent Carpool Activities */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium">Carpool #{item}0{Math.floor(Math.random() * 10)}</p>
                          <p className="text-sm text-gray-500">
                            {Math.floor(Math.random() * 5) + 1} passengers • {Math.floor(Math.random() * 20) + 5} km
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Completed
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature 2: Carpool Analytics */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Usage Analytics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Total Distance Covered</span>
                      <span className="font-semibold">2,345 km</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <span>Fuel Saved</span>
                      <span className="font-semibold">345 L</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <span>CO₂ Reduction</span>
                      <span className="font-semibold">789 kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => navigate('/brand-management')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🚗</div>
                    <p className="font-medium">Manage Brands</p>
                    <p className="text-sm text-gray-500">Add, edit, or remove vehicle brands</p>
                  </div>
                </button>
                
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <p className="font-medium">View Reports</p>
                    <p className="text-sm text-gray-500">Generate carpool usage reports</p>
                  </div>
                </button>
                
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                  <div className="text-center">
                    <div className="text-3xl mb-2">⚙️</div>
                    <p className="font-medium">Settings</p>
                    <p className="text-sm text-gray-500">Configure carpool preferences</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarpoolPage;