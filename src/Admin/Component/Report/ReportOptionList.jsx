import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Eye } from 'lucide-react';

// Import your original Sidebar component
import Sidebar from '../Sidebar';

const ReportOptionListPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddOptionModal, setShowAddOptionModal] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Mock Sidebar Component (Replace with your actual Sidebar)
//   const Sidebar = ({ isSidebarOpen, toggleSidebar }) => (
//     <div className={`fixed left-0 top-0 h-full bg-gray-800 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
//       <div className="p-4">
//         <h2 className={`font-bold ${isSidebarOpen ? 'block' : 'hidden'}`}>Admin Panel</h2>
//       </div>
//     </div>
//   );

  // Report Option List State
  const [reportOptionList, setReportOptionList] = useState([
    {
      id: 1,
      orderNo: '01',
      title: 'A scam activity',
      option: 'I want to report a scam attempt',
      status: 'Active',
      statusColor: 'bg-green-500'
    },
    {
      id: 2,
      orderNo: '02',
      title: 'A scam activity',
      option: 'I was scammed',
      status: 'Active',
      statusColor: 'bg-green-500'
    },
    {
      id: 3,
      orderNo: '04',
      title: 'A scam activity',
      option: "I'm the quiet type",
      status: 'De-active',
      statusColor: 'bg-red-500'
    }
  ]);

  // Form State for new option
  const [newOption, setNewOption] = useState({
    orderNo: '',
    title: 'A scam activity', // Default from parent report
    option: '',
    status: 'Active'
  });

  // Load report data on component mount
  useEffect(() => {
    // In real implementation, get reportId from URL params
    // const reportId = useParams().reportId;
    // Then fetch report data from API or localStorage
    
    // For demo, using mock data
    setReportData({
      id: 1,
      title: 'A scam activity',
      orderNo: '01',
      user: 'Driver'
    });
  }, []);

  // Add New Option
  const handleAddOption = () => {
    if (newOption.orderNo && newOption.title && newOption.option) {
      const newOptionData = {
        id: Date.now(),
        orderNo: newOption.orderNo,
        title: newOption.title,
        option: newOption.option,
        status: newOption.status,
        statusColor: newOption.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
      };
      
      setReportOptionList([...reportOptionList, newOptionData]);
      setNewOption({ 
        orderNo: '', 
        title: reportData?.title || 'A scam activity', 
        option: '', 
        status: 'Active' 
      });
      setShowAddOptionModal(false);

      // In real implementation, also update the parent report's option list
      // This could be done via API call or postMessage to parent tab
      console.log('New option added:', newOptionData);
    }
  };

  // Delete Option
  const handleDeleteOption = (id) => {
    if (confirm('Are you sure you want to delete this option?')) {
      setReportOptionList(reportOptionList.filter(option => option.id !== id));
      
      // In real implementation, also update the parent report's option list
      console.log('Option deleted:', id);
    }
  };

  // Edit Option
  const handleEditOption = (id) => {
    console.log('Edit option:', id);
    // Implement edit functionality here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'} p-6`}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Report Option List - {reportData?.title || 'Loading...'}
              </h1>
              <p className="text-gray-600">Manage individual report options</p>
            </div>
            <div className="text-sm text-gray-500">
              Order No: {reportData?.orderNo} | User: {reportData?.user}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
              Show 10
            </button>
            <input
              type="text"
              placeholder="Search"
              className="px-3 py-1 border rounded text-sm w-48"
            />
          </div>
          <button
            onClick={() => setShowAddOptionModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Plus size={16} />
            <span>Add New</span>
          </button>
        </div>

        {/* Report Option List Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">S.N</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order No.</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Option</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {reportOptionList.map((option, index) => (
                <tr key={option.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm">{String(index + 1).padStart(2, '0')}</td>
                  <td className="px-4 py-3 text-sm">{option.orderNo}</td>
                  <td className="px-4 py-3 text-sm max-w-xs">{option.title}</td>
                  <td className="px-4 py-3 text-sm max-w-xs">{option.option}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium text-white rounded ${option.statusColor}`}>
                      {option.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleEditOption(option.id)}
                        className="p-1 text-blue-500 hover:bg-blue-100 rounded"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="p-1 text-green-500 hover:bg-green-100 rounded"
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteOption(option.id)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <div>
            Showing {reportOptionList.length} entries
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>

        {/* Implementation Instructions */}
       
       
      </div>

      {/* Add Report Option Modal */}
      {showAddOptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Report option</h3>
              <button
                onClick={() => setShowAddOptionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status (1= Active, 0= De-Active)
                </label>
                <select
                  value={newOption.status}
                  onChange={(e) => setNewOption({...newOption, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">1 (Active)</option>
                  <option value="De-active">0 (De-active)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Number"
                  value={newOption.orderNo}
                  onChange={(e) => setNewOption({...newOption, orderNo: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="A scam activity"
                  value={newOption.title}
                  onChange={(e) => setNewOption({...newOption, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Title is auto-filled from parent report</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option
                </label>
                <input
                  type="text"
                  placeholder="Enter option"
                  value={newOption.option}
                  onChange={(e) => setNewOption({...newOption, option: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddOptionModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={handleAddOption}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                ADD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportOptionListPage;