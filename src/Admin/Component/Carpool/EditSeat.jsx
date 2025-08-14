import React, { useState, useEffect } from "react";
import {
  Car,
  Users,
  Grid3X3,
  Plus,
  Minus,
  Save,
  Eye,
  Settings,
  UserCheck,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useGetCarpoolSeatsQuery, useGetSingleCarpoolSeatConfigQuery, useUpdateSeatConfigMutation } from "../../Redux/Api";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";

const EditSeat = () => {
  // State management
  const [totalRows, setTotalRows] = useState(2);
  const [seatsPerRow, setSeatsPerRow] = useState(2);
  const [customRowConfig, setCustomRowConfig] = useState(false);
  const [rowConfigurations, setRowConfigurations] = useState([]);
  const [seatLayout, setSeatLayout] = useState([]);
  const [showPreview, setShowPreview] = useState(true);
  const [showAvailableSeats, setShowAvailableSeats] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasDriver, setHasDriver] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();

  // API Hooks
  const { data: singleSeatConfig, error: singleSeatConfigError, isLoading: isLoadingConfig } = useGetSingleCarpoolSeatConfigQuery(id);
  const [updateSeatConfig, { isLoading: isUpdating }] = useUpdateSeatConfigMutation();
  const { data, error } = useGetCarpoolSeatsQuery();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Initialize data from API response
  useEffect(() => {
    if (singleSeatConfig?.data?.seatConfig && !isDataLoaded) {
      const config = singleSeatConfig.data.seatConfig;
      
      console.log("Loading configuration from API:", config);
      
      // Set basic configuration
      setTotalRows(config.totalRows || 2);
      setSeatsPerRow(config.seatsPerRow || 2);
      setCustomRowConfig(config.customRowConfig || false);
      setHasDriver(config.hasDriver || false);
      
      // Set vehicle info if available
      setVehicleName(config.vehicleName || "");
      setVehicleModel(config.vehicleModel || "");
      
      // Set row configurations
      if (config.rowConfigurations && config.rowConfigurations.length > 0) {
        setRowConfigurations([...config.rowConfigurations]);
      }
      
      // Set seat layout
      if (config.seatLayout && config.seatLayout.length > 0) {
        setSeatLayout([...config.seatLayout]);
      }
      
      setIsDataLoaded(true);
    }
  }, [singleSeatConfig, isDataLoaded]);

  // Initialize row configurations when basic settings change
  useEffect(() => {
    if (isDataLoaded && !customRowConfig) {
      const configs = Array(totalRows)
        .fill(null)
        .map((_, index) => ({
          rowNumber: index + 1,
          seatsInRow: seatsPerRow,
          leftSeats: Math.floor(seatsPerRow / 2),
          rightSeats: Math.ceil(seatsPerRow / 2),
          hasAisle: seatsPerRow > 2,
        }));
      setRowConfigurations(configs);
    }
  }, [totalRows, seatsPerRow, customRowConfig, isDataLoaded]);

  // Generate seat layout when configurations change
  useEffect(() => {
    if (rowConfigurations.length > 0 && isDataLoaded) {
      console.log("Regenerating seat layout with configs:", rowConfigurations);
      
      const layout = [];
      let seatCounter = 1;

      rowConfigurations.forEach((rowConfig, rowIndex) => {
        const row = {
          rowNumber: rowConfig.rowNumber,
          leftSeats: [],
          rightSeats: [],
          hasAisle: rowConfig.hasAisle,
        };

        // Left side seats
        for (let i = 0; i < rowConfig.leftSeats; i++) {
          row.leftSeats.push({
            id: seatCounter++,
            row: rowConfig.rowNumber,
            side: "left",
            position: i + 1,
            available: true,
            isDriver: false,
            label: `${rowConfig.rowNumber}${String.fromCharCode(65 + i)}`,
          });
        }

        // Right side seats
        for (let i = 0; i < rowConfig.rightSeats; i++) {
          const isDriverSeat = hasDriver && rowConfig.rowNumber === 1 && i === (rowConfig.rightSeats - 1);
          
          row.rightSeats.push({
            id: seatCounter++,
            row: rowConfig.rowNumber,
            side: "right",
            position: i + 1,
            available: !isDriverSeat,
            isDriver: isDriverSeat,
            label: `${rowConfig.rowNumber}${String.fromCharCode(65 + rowConfig.leftSeats + i)}`,
          });
        }
        layout.push(row);
      });

      console.log("Generated new seat layout:", layout);
      setSeatLayout(layout);
    }
  }, [rowConfigurations, hasDriver, isDataLoaded]);

  // Utility functions
  const updateRowConfiguration = (rowIndex, field, value) => {
    setRowConfigurations((prev) => {
      const newConfigs = [...prev];
      newConfigs[rowIndex] = {
        ...newConfigs[rowIndex],
        [field]: parseInt(value) || 0,
      };

      if (field === "seatsInRow") {
        const totalSeats = newConfigs[rowIndex].seatsInRow;
        newConfigs[rowIndex].leftSeats = Math.floor(totalSeats / 2);
        newConfigs[rowIndex].rightSeats = Math.ceil(totalSeats / 2);
        newConfigs[rowIndex].hasAisle = totalSeats > 2;
      } else if (field === "leftSeats" || field === "rightSeats") {
        const totalSeats = newConfigs[rowIndex].leftSeats + newConfigs[rowIndex].rightSeats;
        newConfigs[rowIndex].seatsInRow = totalSeats;
        newConfigs[rowIndex].hasAisle = totalSeats > 2;
      }

      return newConfigs;
    });
  };

  const toggleSeatAvailability = (rowIndex, side, seatIndex) => {
    setSeatLayout((prev) => {
      const newLayout = [...prev];
      const seat = newLayout[rowIndex][side][seatIndex];

      if (seat.isDriver) {
        return prev;
      }

      seat.available = !seat.available;
      return newLayout;
    });
  };

  // Helper functions for calculations
  const getTotalSeats = () => {
    return rowConfigurations.reduce((total, row) => total + row.seatsInRow, 0);
  };

  const getAvailableSeats = () => {
    return seatLayout.reduce((total, row) => {
      const leftAvailable = row.leftSeats.filter((seat) => seat.available).length;
      const rightAvailable = row.rightSeats.filter((seat) => seat.available).length;
      return total + leftAvailable + rightAvailable;
    }, 0);
  };

  const getDriverSeats = () => {
    return seatLayout.reduce((total, row) => {
      const leftDriver = row.leftSeats.filter((seat) => seat.isDriver).length;
      const rightDriver = row.rightSeats.filter((seat) => seat.isDriver).length;
      return total + leftDriver + rightDriver;
    }, 0);
  };

  const getOccupiedSeats = () => {
    return getTotalSeats() - getAvailableSeats();
  };

  // Row management functions
  const addRow = () => {
    const newRowNumber = totalRows + 1;
    setTotalRows(newRowNumber);
    
    if (customRowConfig) {
      setRowConfigurations((prev) => [
        ...prev,
        {
          rowNumber: newRowNumber,
          seatsInRow: 2,
          leftSeats: 1,
          rightSeats: 1,
          hasAisle: false,
        },
      ]);
    }
  };

  const removeRow = () => {
    if (totalRows > 1) {
      setTotalRows((prev) => prev - 1);
      if (customRowConfig) {
        setRowConfigurations((prev) => prev.slice(0, -1));
      }
    }
  };

  const resetConfiguration = () => {
    setTotalRows(2);
    setSeatsPerRow(2);
    setCustomRowConfig(false);
    setHasDriver(false);
    setVehicleName("");
    setVehicleModel("");
    setSaveStatus(null);
    setIsDataLoaded(false);
    setRowConfigurations([]);
    setSeatLayout([]);
  };

  // API function for updating seat configuration
  const updateSeatConfiguration = async () => {
    setSaveStatus(null);
    const config = {
      totalSeats: getTotalSeats(),
      totalRows,
      seatsPerRow: customRowConfig ? null : seatsPerRow,
      customRowConfig,
      hasDriver,
      rowConfigurations,
      seatLayout,
      noOfSeats: getTotalSeats(),
      availableSeats: getAvailableSeats(),
      occupiedSeats: getOccupiedSeats(),
      driverSeats: getDriverSeats(),
      updatedAt: new Date().toISOString(),
      id:id,
    };

    try {
      const configPayload = {
        seatConfig: config,
      };
      
      console.log('Updating seat configuration...', configPayload);
      const result = await updateSeatConfig(configPayload)
      
      console.log('Seat config updated:', result);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 4000);
      
    } catch (error) {
      console.error('Error updating seat configuration:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 6000);
    }
  };

  const isLoading = isUpdating || isLoadingConfig;

  // Show loading state while fetching data
  if (isLoadingConfig) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading seat configuration...</p>
        </div>
      </div>
    );
  }

  // Show error state if data fetch failed
  if (singleSeatConfigError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">Failed to load seat configuration</p>
          <button 
            onClick={() => navigate('/carpool/seat-configurations')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <Car className="w-10 h-10 text-blue-600" />
              Edit Car Seat Configuration
            </h1>

            <button 
              className="p-4 rounded-xl border-2 top-8 flex-row absolute right-40 bg-green-500 text-white"
              onClick={() => navigate('/carpool/available-seats')}
            >
              View Available Seats Configuration
            </button>

            <p className="text-gray-600 text-lg">
              Update the seating arrangement for your carpool vehicle
            </p>
            
            {/* Status Messages */}
            {saveStatus && (
              <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 shadow-md ${
                saveStatus === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {saveStatus === 'success' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
                <div>
                  <span className="font-semibold">
                    {saveStatus === 'success' ? 'Success!' : 'Error!'}
                  </span>
                  <p className="text-sm mt-1">
                    {saveStatus === 'success' 
                      ? 'Seat configuration has been updated successfully.' 
                      : 'Failed to update configuration. Please check your inputs and try again.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Configuration Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Vehicle Information */}
            

              {/* Basic Configuration */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Basic Configuration
                </h2>

                {/* Driver Configuration */}
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={hasDriver}
                      onChange={(e) => setHasDriver(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-700 block">
                        Include Driver Seat
                      </span>
                      <span className="text-xs text-gray-500">
                        Reserves first right seat for the driver
                      </span>
                    </div>
                  </label>
                </div>

                {/* Total Rows */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Number of Rows
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={removeRow}
                      disabled={totalRows <= 1 || isLoading}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={totalRows}
                      onChange={(e) => setTotalRows(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
                      className="flex-1 px-4 py-2 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:opacity-50"
                      disabled={isLoading}
                    />
                    <button
                      onClick={addRow}
                      disabled={totalRows >= 8 || isLoading}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Maximum 8 rows allowed</p>
                </div>

                {/* Seats Per Row (only when not custom) */}
                {!customRowConfig && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Seats Per Row
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSeatsPerRow((prev) => Math.max(1, prev - 1))}
                        disabled={seatsPerRow <= 1 || isLoading}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={seatsPerRow}
                        onChange={(e) => setSeatsPerRow(Math.max(1, Math.min(6, parseInt(e.target.value) || 1)))}
                        className="flex-1 px-4 py-2 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:opacity-50"
                        disabled={isLoading}
                      />
                      <button
                        onClick={() => setSeatsPerRow((prev) => Math.min(6, prev + 1))}
                        disabled={seatsPerRow >= 6 || isLoading}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Maximum 6 seats per row</p>
                  </div>
                )}

                {/* Custom Row Configuration Toggle */}
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customRowConfig}
                      onChange={(e) => setCustomRowConfig(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Custom configuration per row
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-7">
                    Allow different seat arrangements for each row
                  </p>
                </div>

                {/* Stats */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {getTotalSeats()}
                      </div>
                      <div className="text-sm text-gray-600">Total Seats</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {getAvailableSeats()}
                      </div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center mt-3 pt-3 border-t border-blue-200">
                    <div>
                      <div className="text-lg font-bold text-red-600">
                        {getOccupiedSeats()}
                      </div>
                      <div className="text-xs text-gray-600">Occupied</div>
                    </div>
                    {hasDriver && (
                      <div>
                        <div className="text-lg font-bold text-orange-600">
                          {getDriverSeats()}
                        </div>
                        <div className="text-xs text-gray-600">Driver</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Custom Row Configuration Panel */}
              {customRowConfig && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Grid3X3 className="w-5 h-5 text-green-600" />
                    Custom Row Configuration
                  </h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {rowConfigurations.map((row, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                          <span>Row {row.rowNumber}</span>
                          <span className="text-xs text-gray-500">
                            {row.seatsInRow} seats total
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Left Side
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="3"
                              value={row.leftSeats}
                              onChange={(e) => updateRowConfiguration(index, "leftSeats", e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none disabled:opacity-50"
                              disabled={isLoading}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Right Side
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="3"
                              value={row.rightSeats}
                              onChange={(e) => updateRowConfiguration(index, "rightSeats", e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none disabled:opacity-50"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? "Hide" : "Show"} Preview
                </button>
              
                <button
                  onClick={updateSeatConfiguration}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isLoading ? "Updating..." : "Update Configuration"}
                </button>
                
                <button
                  onClick={resetConfiguration}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Configuration
                </button>
              </div>
            </div>

  {/* Preview Panel */}
  <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Car Layout Preview
                  {vehicleName && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      - {vehicleName}
                    </span>
                  )}
                </h2>

                {showPreview && seatLayout.length > 0 ? (
                  <div className="space-y-6">
                    {/* Car Frame */}
                    <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl p-8 border-4 border-gray-400 mx-auto max-w-2xl shadow-xl">
                      {/* Front indicator */}
                      <div className="text-center mb-6">
                        <div className="inline-block bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-bold shadow-md">
                          🚗 FRONT
                        </div>
                      </div>
                      
                      {/* Seat Rows */}
                      <div className="space-y-4">
                        {seatLayout.map((row, rowIndex) => (
                          <div key={rowIndex} className="flex items-center justify-center">
                            {/* Row number indicator */}
                            <div className="w-8 text-center text-xs text-gray-500 font-medium mr-4">
                              R{row.rowNumber}
                            </div>
                            
                            {/* Conditional layout based on seat configuration */}
                            {row.leftSeats.length > 0 && row.rightSeats.length > 0 ? (
                              // Both left and right seats exist - show with gap
                              <>
                                {/* Left seats */}
                                <div className="flex gap-2">
                                  {row.leftSeats.map((seat, seatIndex) => (
                                    <button
                                      key={seat.id}
                                      onClick={() => toggleSeatAvailability(rowIndex, "leftSeats", seatIndex)}
                                      disabled={seat.isDriver || isLoading}
                                      className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all hover:scale-110 disabled:cursor-not-allowed shadow-md ${
                                        seat.isDriver
                                          ? "bg-orange-100 border-orange-400 text-orange-800"
                                          : seat.available
                                          ? "bg-green-100 border-green-400 text-green-800 hover:bg-green-200"
                                          : "bg-red-100 border-red-400 text-red-800 hover:bg-red-200"
                                      } ${isLoading ? 'opacity-50' : ''}`}
                                      title={`Seat ${seat.label} - ${
                                        seat.isDriver
                                          ? "Driver Seat"
                                          : seat.available
                                          ? "Available"
                                          : "Occupied"
                                      }`}
                                    >
                                      {seat.isDriver ? "🚗" : seat.label}
                                    </button>
                                  ))}
                                </div>

                                {/* Aisle gap */}
                                <div className="w-12 flex items-center justify-center">
                                  <div className="w-px h-8 bg-gray-300"></div>
                                </div>

                                {/* Right seats */}
                                <div className="flex gap-2">
                                  {row.rightSeats.map((seat, seatIndex) => (
                                    <button
                                      key={seat.id}
                                      onClick={() => toggleSeatAvailability(rowIndex, "rightSeats", seatIndex)}
                                      disabled={seat.isDriver || isLoading}
                                      className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all hover:scale-110 disabled:cursor-not-allowed shadow-md ${
                                        seat.isDriver
                                          ? "bg-orange-100 border-orange-400 text-orange-800"
                                          : seat.available
                                          ? "bg-green-100 border-green-400 text-green-800 hover:bg-green-200"
                                          : "bg-red-100 border-red-400 text-red-800 hover:bg-red-200"
                                      } ${isLoading ? 'opacity-50' : ''}`}
                                      title={`Seat ${seat.label} - ${
                                        seat.isDriver
                                          ? "Driver Seat"
                                          : seat.available
                                          ? "Available"
                                          : "Occupied"
                                      }`}
                                    >
                                      {seat.isDriver ? "🚗" : seat.label}
                                    </button>
                                  ))}
                                </div>
                              </>
                            ) : (
                              // Only one side has seats - center them without gap
                              <div className="flex gap-2">
                                {/* Render left seats if they exist */}
                                {row.leftSeats.length > 0 &&
                                  row.leftSeats.map((seat, seatIndex) => (
                                    <button
                                      key={seat.id}
                                      onClick={() => toggleSeatAvailability(rowIndex, "leftSeats", seatIndex)}
                                      disabled={seat.isDriver || isLoading}
                                      className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all hover:scale-110 disabled:cursor-not-allowed shadow-md ${
                                        seat.isDriver
                                          ? "bg-orange-100 border-orange-400 text-orange-800"
                                          : seat.available
                                          ? "bg-green-100 border-green-400 text-green-800 hover:bg-green-200"
                                          : "bg-red-100 border-red-400 text-red-800 hover:bg-red-200"
                                      } ${isLoading ? 'opacity-50' : ''}`}
                                      title={`Seat ${seat.label} - ${
                                        seat.isDriver
                                          ? "Driver Seat"
                                          : seat.available
                                          ? "Available"
                                          : "Occupied"
                                      }`}
                                    >
                                      {seat.isDriver ? "🚗" : seat.label}
                                    </button>
                                  ))}

                                {/* Render right seats if they exist */}
                                {row.rightSeats.length > 0 &&
                                  row.rightSeats.map((seat, seatIndex) => (
                                    <button
                                      key={seat.id}
                                      onClick={() => toggleSeatAvailability(rowIndex, "rightSeats", seatIndex)}
                                      disabled={seat.isDriver || isLoading}
                                      className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all hover:scale-110 disabled:cursor-not-allowed shadow-md ${
                                        seat.isDriver
                                          ? "bg-orange-100 border-orange-400 text-orange-800"
                                          : seat.available
                                          ? "bg-green-100 border-green-400 text-green-800 hover:bg-green-200"
                                          : "bg-red-100 border-red-400 text-red-800 hover:bg-red-200"
                                      } ${isLoading ? 'opacity-50' : ''}`}
                                      title={`Seat ${seat.label} - ${
                                        seat.isDriver
                                          ? "Driver Seat"
                                          : seat.available
                                          ? "Available"
                                          : "Occupied"
                                      }`}
                                    >
                                      {seat.isDriver ? "🚗" : seat.label}
                                    </button>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Back indicator */}
                      <div className="text-center mt-6">
                        <div className="inline-block bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-bold shadow-md">
                          BACK 🚪
                        </div>
                      </div>
                    </div>

                    {/* Legend and Controls */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Legend & Controls</h3>
                      
                      {/* Legend */}
                      <div className="flex justify-center gap-8 text-sm flex-wrap mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-100 border-2 border-green-400 rounded shadow-sm"></div>
                          <span className="font-medium">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-100 border-2 border-red-400 rounded shadow-sm"></div>
                          <span className="font-medium">Occupied</span>
                        </div>
                        {hasDriver && (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-orange-100 border-2 border-orange-400 rounded flex items-center justify-center text-xs shadow-sm">
                              🚗
                            </div>
                            <span className="font-medium">Driver</span>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => {
                            setSeatLayout(prev => 
                              prev.map(row => ({
                                ...row,
                                leftSeats: row.leftSeats.map(seat => 
                                  seat.isDriver ? seat : { ...seat, available: true }
                                ),
                                rightSeats: row.rightSeats.map(seat => 
                                  seat.isDriver ? seat : { ...seat, available: true }
                                )
                              }))
                            );
                          }}
                          disabled={isLoading}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          Make All Available
                        </button>
                        <button
                          onClick={() => {
                            setSeatLayout(prev => 
                              prev.map(row => ({
                                ...row,
                                leftSeats: row.leftSeats.map(seat => 
                                  seat.isDriver ? seat : { ...seat, available: false }
                                ),
                                rightSeats: row.rightSeats.map(seat => 
                                  seat.isDriver ? seat : { ...seat, available: false }
                                )
                              }))
                            );
                          }}
                          disabled={isLoading}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          Make All Occupied
                        </button>
                      </div>

                      <p className="text-center text-sm text-gray-600 mt-4">
                        💡 <strong>Tip:</strong> Click on seats to toggle between available and occupied •
                        Seats are labeled as Row + Letter (1A, 1B, etc.)
                        {hasDriver && " • Driver seat is automatically reserved and cannot be changed"}
                      </p>
                    </div>

                    {/* Configuration Summary */}
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4 text-blue-800">Configuration Summary</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Vehicle:</strong> {vehicleName || 'Unnamed Vehicle'}</p>
                          <p><strong>Model:</strong> {vehicleModel || 'Not specified'}</p>
                          <p><strong>Configuration Type:</strong> {customRowConfig ? 'Custom' : 'Uniform'}</p>
                        </div>
                        <div>
                          <p><strong>Total Rows:</strong> {totalRows}</p>
                          <p><strong>Seats per Row:</strong> {customRowConfig ? 'Variable' : seatsPerRow}</p>
                          <p><strong>Driver Included:</strong> {hasDriver ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                      
                      {/* Last Updated Info */}
                      {singleSeatConfig?.data?.updatedAt && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <p className="text-xs text-blue-600">
                            <strong>Last Updated:</strong> {new Date(singleSeatConfig.data.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Car className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">
                      {showPreview ? "Configure Your Vehicle" : "Preview Hidden"}
                    </h3>
                    <p className="text-gray-400 text-lg">
                      {showPreview
                        ? "Set up your car seating layout using the configuration panel"
                        : 'Click "Show Preview" to see your car layout'}
                    </p>
                    {!showPreview && (
                      <button
                        onClick={() => setShowPreview(true)}
                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Show Preview
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSeat;