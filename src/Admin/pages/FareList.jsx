import React, { useState } from "react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import Sidebar from "../Component/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  useAddTripDetailInAdminMutation,
  useAddTripDetailMutation,
  useGetCategoriesQuery,
  useGetStateAndCitiesQuery,
} from "../Redux/Api";
const FareList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { data, error } = useGetCategoriesQuery();
  console.log({ data, error });
  const navigate = useNavigate();
  // Sample fare data based on the PDF design
  const [fareData, setFareData] = useState([]);

  const handleAddFare = () => {
    // Navigate to add fare page
    window.location.href = "/add-fare";
  };

  const handleEdit = (fareId) => {
    console.log("Edit fare:", fareId);
  };

  const handleView = (fareId) => {
    console.log("View fare:", fareId);
  };

  const handleDelete = (fareId) => {
    if (window.confirm("Are you sure you want to delete this fare?")) {
      setFareData(fareData.filter((item) => item.id !== fareId));
    }
  };

  const filteredData = fareData.filter(
    (item) =>
      item.tripType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.drop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-pink-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`flex-1 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 p-6`}
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Controls Header */}
          <div className="p-4 bg-white border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="bg-cyan-400 text-white px-4 py-2 rounded text-sm font-medium">
                    Show {showEntries} ∨
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="SEARCH"
                    className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="bg-cyan-400 text-white px-4 py-2 rounded font-medium hover:bg-cyan-500 transition-colors"
                >
                  Select Filter
                </button>
                <button
                  onClick={() => navigate("/addfare")}
                  className="bg-green-500 text-white px-4 py-2 rounded font-medium hover:bg-green-600 transition-colors flex items-center space-x-1"
                >
                  <span>+ ADD Fare</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">
                    S.N
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">
                    Order No.
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">
                    Trip Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">
                    Vehicle Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">
                    Pickup City
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">
                    Pickup State
                  </th>

                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">
                    Drop City
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">
                    Drop State
                  </th>

                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">
                    Fare Details
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">
                    Commission
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, showEntries).map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3 border text-xs">{item.sn}</td>
                    <td className="px-3 py-3 border text-xs font-medium">
                      {item.orderNo}
                    </td>
                    <td className="px-3 py-3 border text-xs">
                      {item.tripType}
                    </td>
                    <td className="px-3 py-3 border text-xs">
                      {item.vehicleType}
                    </td>
                    <td className="px-3 py-3 border text-xs">
                      {item.pickCity}
                    </td>
                    <td className="px-3 py-3 border text-xs">
                      {item.pickState}
                    </td>
                    <td className="px-3 py-3 border text-xs">
                      {item.dropCity}
                    </td>

                    <td className="px-3 py-3 border text-xs">
                      {item.dropState}
                    </td>

                    <td className="px-3 py-3 border text-xs">
                      <div className="space-y-1">
                        <div>Min. {item.fareDetails.min}</div>
                        <div>Max. {item.fareDetails.max}</div>
                        <div>Rec. {item.fareDetails.rec}</div>
                      </div>
                    </td>
                    <td className="px-3 py-3 border text-xs">
                      <div className="space-y-1">
                        <div>{item.commission.driver}</div>
                        <div>{item.commission.booking}</div>
                        {item.commission.commissionType && (
                          <div>{item.commission.commissionType}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 border">
                      <div className="flex flex-col space-y-2">
                        <button
                          className="text-blue-600 text-xs hover:underline"
                          onClick={() => handleEdit(item.id)}
                        >
                          {item.addedBy}
                        </button>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleView(item.id)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="View"
                          >
                            <Eye size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {Math.min(showEntries, filteredData.length)} of{" "}
                {filteredData.length} entries
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Select Filters
                </h2>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trip Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Trip Types</option>
                    <option value="outstation">Outstation</option>
                    <option value="local">Local</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Vehicle Types</option>
                    <option value="mini">Mini</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Locations</option>
                    <option value="up">UP</option>
                    <option value="bihar">Bihar</option>
                    <option value="mp">MP</option>
                    <option value="delhi">Delhi</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-cyan-400 text-white rounded-md hover:bg-cyan-500"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FareList;
