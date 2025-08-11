import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';

const ReportPage = () => {
  const navigate = useNavigate();
  const reports = [
    {
      id: '01',
      image: 'https://via.placeholder.com/40x40/4ade80/ffffff?text=RK',
      name: 'Rahul Kumar',
      phone: '7676755676',
      submitter: 'Rahul Kumar',
      submitterPhone: '7676755676',
      reason: 'A scam activity',
      description: 'I want to report a scam attempt',
      location: 'Lucknow, Uttar Pradesh',
      dateTime: '15 Jun 24\n11:55 AM',
      status: 'Verified',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: '03',
      image: 'https://via.placeholder.com/40x40/f59e0b/ffffff?text=RK',
      name: 'Rahul Kumar',
      phone: '7676755676',
      submitter: 'Rahul Kumar',
      submitterPhone: '7676755676',
      reason: 'Suspicious behavior detected',
      description: 'Lucknow, Uttar Pradesh',
      location: 'Lucknow, Uttar Pradesh',
      dateTime: '15 Jun 24\n11:55 AM',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: '04',
      image: 'https://via.placeholder.com/40x40/ef4444/ffffff?text=RK',
      name: 'Rahul Kumar',
      phone: '7676755676',
      submitter: 'Rahul Kumar',
      submitterPhone: '7676755676',
      reason: 'Terms violation',
      description: 'Ayodhya, Uttar Pradesh',
      location: 'Ayodhya, Uttar Pradesh',
      dateTime: '15 Jun 24\n11:55 AM',
      status: 'Reject',
      statusColor: 'bg-red-100 text-red-800'
    }
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleViewClick = (report) => {
    navigate(`/report-list/${report.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'} p-6`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Suspension Reports</h1>
          <p className="text-gray-600">Manage and review account suspension cases</p>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitter</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report, index) => (
                  <tr key={report.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{report.id}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={report.image} alt="User" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="text-sm text-gray-900 font-medium">{report.name}</div>
                          <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                            {report.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 font-medium">{report.submitter}</div>
                      <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        {report.submitterPhone}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">{report.reason}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-500 max-w-xs">{report.description}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 whitespace-pre-line">{report.dateTime}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${report.statusColor}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewClick(report)}
                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;