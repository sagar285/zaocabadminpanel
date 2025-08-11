import React,{useState} from 'react';
import { Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useLazySearchTravelDriverQuery } from '../../Redux/Api';

const DriversTable = ({ activeTab, data, url }) => {
  if (activeTab !== "Drivers") return null;
  const navigate = useNavigate();
  const [searchTerm,setSearchTerm] =useState("");
 const [triggerSearch,{data:searchData}] = useLazySearchTravelDriverQuery()

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      triggerSearch(value);  // Call the search API with input value
    }
  };

  const displayData = searchTerm.length > 0 ? searchData?.drivers : data.Drivers

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800"> Number of Drivers ({data?.Drivers?.length})
          </h2>
          <div className="w-1/2">
          <input
            type="text"
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            placeholder="Search Driver..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        </div>
        {displayData?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-gray-50 border-b">Driver Name</th>
                  <th className="text-left p-4 bg-gray-50 border-b">Phone Number</th>
                  <th className="text-left p-4 bg-gray-50 border-b">Profile Image</th>
                  <th className="text-left p-4 bg-gray-50 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((driver, index) => (
                  <tr key={index} className="group hover:bg-gray-50">
                    <td className="p-4 border-b">
                      {driver.firstName} {driver.lastName}
                    </td>
                    <td className="p-4 border-b">
                      {driver.phoneNumber}
                    </td>
                    <td className="p-4 border-b">
                      <img 
                        src={`${url}/profilePics/${driver.profileImage}`}
                        alt={`${driver.firstName} ${driver.lastName}`}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm group-hover:opacity-90 transition-opacity"
                      />
                    </td>
                    <td className="p-4 border-b">
                          <div className="flex justify-center">
                            <button
                              onClick={() =>navigate(`/driver/${driver?.userId}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No drivers available
          </p>
        )}
      </div>
    </div>
  );
};

export default DriversTable;