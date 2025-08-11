import React, { useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLazyVehicleSearchQuery } from "../../Redux/Api";

const VehicleInfo = ({ vehicleData, onView }) => {
    const navigate = useNavigate();
      const [triggerSearch,{data:searchData}] = useLazyVehicleSearchQuery()
      const [searchTerm,setSearchTerm] =useState("");

      const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    
        if (value.trim().length > 0) {
          triggerSearch(value);  // Call the search API with input value
        }
      };
    
      const displayData = searchTerm.length > 0 ? searchData?.vehicles : vehicleData;

   

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800"> Number of Vehicles ({vehicleData?.length})

          </h2>
          <div className="w-1/2">
          <input
            type="text"
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            placeholder="Search Vehicle..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">S No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Vehicle Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Number</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Model Year</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Seats</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Fuel</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Color</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Permit Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">RC Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
                {
                    displayData?.map((vehicle,index)=>(
                        <tr className="border-t border-gray-100">
                        <td className="px-4 py-3 text-gray-800">{index}</td>
                        <td className="px-4 py-3 text-gray-800">{vehicle.vehicleName || '-'}</td>
                        <td className="px-4 py-3 text-gray-800">{vehicle.vehicleCategory || '-'}</td>
                        <td className="px-4 py-3 text-gray-800">{vehicle.vehicleNumber || '-'}</td>
                        <td className="px-4 py-3 text-gray-800">{vehicle.modelYear || '-'}</td>
                        <td className="px-4 py-3 text-gray-800">{vehicle.seat || '-'}</td>
                        <td className="px-4 py-3 text-gray-800">{vehicle.fuel || '-'}</td>
                        <td className="px-4 py-3 text-gray-800">{vehicle.color || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                            ${vehicle.vehiclePermit?.vehiclePermitStatus === 'Accepted' ? 'bg-green-100 text-green-800' : 
                                vehicle.vehiclePermit?.vehiclePermitStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {vehicle?.vehiclePermit?.vehiclePermitStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                            ${vehicle.vehicleRc.vehicleRcStatus === 'Accepted' ? 'bg-green-100 text-green-800' : 
                                vehicle.vehicleRc.vehicleRcStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {vehicle.vehicleRc.vehicleRcStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <button
                              onClick={() =>navigate(`/vehicle/${vehicle?._id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
             
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfo;