import React, { useState } from 'react';
import { Upload, Eye, Edit, Trash2, ChevronDown, Image, Video, X } from 'lucide-react';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';

const CarpoolAwareness = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLeftForm, setShowLeftForm] = useState(false);
  const [showMiddleForm, setShowMiddleForm] = useState(false);
  const [showRightForm, setShowRightForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    orderNumber: '',
    cityState: '',
    title: '',
    subTitle: '',
    longDescription: ''
  });

  const carpoolData = [
    {
      id: 1,
      sn: '01',
      idCode: 'A',
      title: 'Save Fuel & Toll Cost',
      subTitle: 'Carpooling will save you fuel and toll cost',
      status: 'Active'
    },
    {
      id: 2,
      sn: '02', 
      idCode: 'B',
      title: 'Save Fuel & Toll Cost',
      subTitle: 'Carpooling will save you fuel and toll cost',
      status: 'Active'
    },
    {
      id: 3,
      sn: '04',
      idCode: 'C', 
      title: 'Save Fuel & Toll Cost',
      subTitle: 'Carpooling will save you fuel and toll cost',
      status: 'De-active'
    }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const navigate = useNavigate()
  const handleAddNew = () => {
    setShowLeftForm(true);
    setShowMiddleForm(false);
    setShowRightForm(false);
    setFormData({
      orderNumber: '',
      cityState: '',
      title: '',
      subTitle: '',
      longDescription: ''
    });
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowRightForm(true);
    setShowLeftForm(false);
    setShowMiddleForm(false);
    setFormData({
      orderNumber: item.sn,
      cityState: 'All',
      title: item.title,
      subTitle: item.subTitle,
      longDescription: 'Carpooling offers a commuter option that may work better than other methods of transportation, and compared to other options, carpooling may better fit your schedule.'
    });
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowLeftForm(true);
    setShowMiddleForm(false);
    setShowRightForm(false);
    setFormData({
      orderNumber: item.sn,
      cityState: 'All',
      title: item.title,
      subTitle: item.subTitle,
      longDescription: 'Carpooling offers a commuter option that may work better than other methods of transportation, and compared to other options, carpooling may better fit your schedule.'
    });
  };

  const handleUploadClick = () => {
    setShowMiddleForm(true);
    if (!showLeftForm && !showRightForm) {
      setShowLeftForm(true);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const closeAllForms = () => {
    setShowLeftForm(false);
    setShowMiddleForm(false);
    setShowRightForm(false);
    setSelectedItem(null);
  };



  const ImageUploadBox = ({ label = "UPLOAD IMAGE", onClick = null }) => (
    <div 
      className={`bg-gradient-to-br from-green-100 to-green-200 border-2 border-dashed border-green-400 rounded-lg p-4 flex flex-col items-center justify-center h-24 transition-all duration-200 hover:shadow-md ${onClick ? 'cursor-pointer hover:from-green-200 hover:to-green-300' : ''}`}
      onClick={onClick}
    >
      <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs font-semibold mb-2 transition-colors duration-200">
        <Upload className="w-3 h-3 inline mr-1" />
        ADD MORE
      </button>
      <span className="text-gray-700 text-xs font-semibold">{label}</span>
    </div>
  );

  const VideoUploadBox = ({ label = "UPLOAD VIDEO", onClick = null }) => (
    <div 
      className={`bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-dashed border-blue-400 rounded-lg p-4 flex flex-col items-center justify-center h-24 transition-all duration-200 hover:shadow-md ${onClick ? 'cursor-pointer hover:from-blue-200 hover:to-blue-300' : ''}`}
      onClick={onClick}
    >
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold mb-2 transition-colors duration-200">
        <Video className="w-3 h-3 inline mr-1" />
        ADD VIDEO
      </button>
      <span className="text-gray-700 text-xs font-semibold">{label}</span>
    </div>
  );

  const getActiveFormsCount = () => {
    return [showLeftForm, showMiddleForm, showRightForm].filter(Boolean).length;
  };

  const getGridCols = () => {
    const count = getActiveFormsCount();
    if (count === 1) return 'lg:grid-cols-1 max-w-2xl mx-auto';
    if (count === 2) return 'lg:grid-cols-2';
    return 'lg:grid-cols-3';
  };

  return (
    <>
      {/* Sidebar Component */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isSidebarOpen 
          ? 'ml-64 mr-4' 
          : 'ml-4 mr-4'  
      }`}>
        <div className="p-6 bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Carpool Awareness List</h1>
              {(showLeftForm || showMiddleForm || showRightForm) && (
                <button 
                  onClick={closeAllForms}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Close All Forms
                </button>
              )}
            </div>
          </div>

          {/* Table Controls */}
          <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200">
                    Show 10 <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={handleAddNew}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
              >
                + Add New
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">S N</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Sub Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {carpoolData.map((item, index) => (
                    <tr key={item.id} className={`${item.status === 'De-active' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border-b hover:shadow-md transition-shadow duration-200`}>
                      <td className="px-6 py-4 text-sm font-medium">{item.sn}</td>
                      <td className="px-6 py-4 text-sm font-bold">{item.idCode}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="w-16 h-10 bg-gradient-to-br from-green-200 to-green-300 rounded-md shadow-sm"></div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.subTitle}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'Active' 
                            ? 'bg-green-100 text-green-800 border border-green-300' 
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => navigate('/carpool-awarness/offer-carpool')}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(item)}
                            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors duration-200" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dynamic Forms Section */}
         
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CarpoolAwareness;