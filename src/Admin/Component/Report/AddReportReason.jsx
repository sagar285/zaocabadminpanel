import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Eye } from 'lucide-react';

// Import your original Sidebar component
import Sidebar from '../Sidebar';
const AddReportReason = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddReportModal, setShowAddReportModal] = useState(false);

  // Report Options State
  const [reportOptions, setReportOptions] = useState([
    {
      id: 1,
      orderNo: '01',
      title: 'A scam activity',
      optionList: [
        'I want to report a scam attempt',
        'I was scammed',
        "I'm the quiet type"
      ],
      user: 'Driver',
      status: 'Active',
      statusColor: 'bg-green-500'
    },
    {
      id: 2,
      orderNo: '02',
      title: 'Unsafe or inappropriate behaviour',
      optionList: [],
      user: 'Both',
      status: 'Active',
      statusColor: 'bg-green-500'
    },
    {
      id: 3,
      orderNo: '04',
      title: 'Something wrong with this trip or profile',
      optionList: [],
      user: 'Driver',
      status: 'De-active',
      statusColor: 'bg-red-500'
    },
    {
      id: 4,
      orderNo: '04',
      title: 'Suspicious payments or pricing',
      optionList: [],
      user: 'Passengers',
      status: 'De-active',
      statusColor: 'bg-red-500'
    }
  ]);

  // Form States
  const [newReport, setNewReport] = useState({
    orderNo: '',
    title: '',
    userRole: 'Driver',
    status: 'Active'
  });

  // Mock Sidebar Component (Replace with your actual Sidebar)
  
  // Add New Report
  const handleAddReport = () => {
    if (newReport.orderNo && newReport.title) {
      const newReportData = {
        id: Date.now(),
        orderNo: newReport.orderNo,
        title: newReport.title,
        optionList: [],
        user: newReport.userRole,
        status: newReport.status,
        statusColor: newReport.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
      };
      setReportOptions([...reportOptions, newReportData]);
      setNewReport({ orderNo: '', title: '', userRole: 'Driver', status: 'Active' });
      setShowAddReportModal(false);
    }
  };

  // Open Report Option List in New Tab
  const handleOpenOptionList = (reportId) => {
    // Store report data in localStorage for the new tab to access
    const reportData = reportOptions.find(report => report.id === reportId);
    if (reportData) {
      // In real implementation, you would navigate to a new route
      // For demo purposes, we'll show an alert
    //   alert(`Opening Report Option List for: "${reportData.title}" in new tab\n\nIn real implementation, this would open:\n/report-reason/${reportId}`);
      
      // Real implementation would be:
      window.open(`/report-reason/${reportId}`, '_blank');
    }
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
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu Button */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Option</h1>
                <p className="text-gray-600">Manage report reasons and options</p>
              </div>
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
            onClick={() => setShowAddReportModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Plus size={16} />
            <span>Add New</span>
          </button>
        </div>

        {/* Report Options Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">S.N</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order No.</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Option List</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {reportOptions.map((report, index) => (
                <tr key={report.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm">{String(index + 1).padStart(2, '0')}</td>
                  <td className="px-4 py-3 text-sm">{report.orderNo}</td>
                  <td className="px-4 py-3 text-sm max-w-xs">{report.title}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="max-w-xs">
                      {report.optionList.length > 0 ? (
                        <div className="space-y-1">
                    
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No options added</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{report.user}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium text-white rounded ${report.statusColor}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleOpenOptionList(report.id)}
                        className="p-1 text-blue-500 hover:bg-blue-100 rounded"
                        title="Add Options"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        className="p-1 text-green-500 hover:bg-green-100 rounded"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="p-1 text-purple-500 hover:bg-purple-100 rounded"
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      <button
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

        {/* Table Information */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <div>
            Showing {reportOptions.length} entries
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Add Report Modal */}
      {showAddReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Report</h3>
              <button
                onClick={() => setShowAddReportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Number"
                  value={newReport.orderNo}
                  onChange={(e) => setNewReport({...newReport, orderNo: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter Title"
                  value={newReport.title}
                  onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Role
                </label>
                <div className="space-y-2">
                  {['Driver', 'Passengers', 'Both'].map(role => (
                    <label key={role} className="flex items-center">
                      <input
                        type="radio"
                        name="userRole"
                        value={role}
                        checked={newReport.userRole === role}
                        onChange={(e) => setNewReport({...newReport, userRole: e.target.value})}
                        className="mr-2"
                      />
                      <span className="text-sm">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newReport.status}
                  onChange={(e) => setNewReport({...newReport, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="De-active">De-active</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddReportModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={handleAddReport}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReportReason;