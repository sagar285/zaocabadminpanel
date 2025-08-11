import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '../Sidebar';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const ReportDetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [reportId, setReportId] = useState(null);
  const [passengerData, setPassengerData] = useState(null);
  const [reportData, setReportData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // URL से ID extract करने के लिए और data receive करने के लिए
  useEffect(() => {
    setReportId(id);
    
    // Get passenger data from navigation state
    if (location.state) {
      console.log('Received passenger data:', location.state);
      setPassengerData(location.state.passengerData || location.state.userData);
      setReportData(location.state.reportData);
    }
  }, [id, location.state]);

  const handleBack = () => {
    // Navigate back with passenger data
    if (passengerData) {
      navigate('/view-passenger', {
        state: { passengerData: passengerData }
      });
    } else {
      navigate('/report-list');
    }
  };

  // Sample fallback data - अगर passenger data नहीं मिला तो
  const defaultReportsData = {
    '01': {
      id: '01',
      image: 'https://via.placeholder.com/40x40/4ade80/ffffff?text=RK',
      name: 'Rahul Kumar',
      phone: '7676755676',
      submitter: 'Rahul Kumar',
      submitterPhone: '7676755676',
      reason: 'A scam activity',
      description: 'I want to report a scam attempt',
      location: 'Lucknow, Uttar Pradesh',
      dateTime: '15 Jun 24 11:55 AM',
      status: 'Verified',
      statusColor: 'bg-green-100 text-green-800',
      reasons: [
        { id: 1, text: 'Suspicious behavior detected', selected: false },
        { id: 2, text: 'A scam activity - I want to report a scam attempt', selected: true }
      ]
    }
  };

  // Use passenger data if available, otherwise use default data
  const getReportInfo = () => {
    if (passengerData) {
      return {
        id: reportId,
        image: passengerData.PassengerInfo.userId?.profileImage || 'https://via.placeholder.com/40x40/4ade80/ffffff?text=' + passengerData.PassengerInfo.firstName.charAt(0),
        name: `${passengerData.PassengerInfo.firstName} ${passengerData.PassengerInfo.lastName}`,
        phone: passengerData.PassengerInfo.phoneNumber,
        email: passengerData.PassengerInfo.email,
        submitter: `${passengerData.PassengerInfo.firstName} ${passengerData.PassengerInfo.lastName}`,
        submitterPhone: passengerData.PassengerInfo.phoneNumber,
        reason: reportData?.reportReason || 'Account Suspended',
        description: passengerData.PassengerInfo.address,
        location: `${passengerData.PassengerInfo.userId.city}, ${passengerData.PassengerInfo.userId.state}`,
        dateTime: reportData?.lastReportDate || new Date().toLocaleDateString(),
        status: passengerData.PassengerInfo.verified ? 'Verified' : 'Pending',
        statusColor: passengerData.PassengerInfo.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
        reasons: [
          { id: 1, text: 'Suspicious behavior detected', selected: false },
          { id: 2, text: reportData?.reportReason || 'Account related issue', selected: true }
        ]
      };
    }
    return defaultReportsData[reportId];
  };

  const report = getReportInfo();

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h2>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const handleAction = (action) => {
    console.log(`${action} action for report ${reportId}`);
    console.log('Passenger Data:', passengerData);
    // यहां API call करके action process कर सकते हैं
    alert(`Report ${action} successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-80' : 'pl-16'} p-6`}>
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Passenger Details
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Details - #{report.id}</h1>
          <p className="text-gray-600">Review and manage report case</p>
          
          {/* Show passenger info if available */}
          {passengerData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Passenger Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Name:</strong> {passengerData.PassengerInfo.firstName} {passengerData.PassengerInfo.lastName}</div>
                <div><strong>Phone:</strong> {passengerData.PassengerInfo.phoneNumber}</div>
                <div><strong>Email:</strong> {passengerData.PassengerInfo.email}</div>
                <div><strong>Location:</strong> {passengerData.PassengerInfo.userId.city}, {passengerData.PassengerInfo.userId.state}</div>
                <div><strong>Verified:</strong> {passengerData.PassengerInfo.verified ? 'Yes' : 'No'}</div>
                <div><strong>Document Status:</strong> {passengerData.documents?.aadhar?.aadharStatus}</div>
              </div>
            </div>
          )}
        </div>

        {/* Report Detail Card */}
        <div className="bg-white rounded-lg border shadow-sm p-6 max-w-md mx-auto">
          {/* Header with Date */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">{report.dateTime}</h3>
          </div>

          {/* User Section */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Reported User</h4>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
              <img 
                src={report.image} 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover" 
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{report.name}</p>
                <p className="text-sm text-blue-600">★ 4.5 (112 Review)</p>
                <p className="text-xs text-gray-500">{report.phone}</p>
              </div>
            </div>
          </div>

          {/* Reporter Section */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Reporter</h4>
            <div className="flex items-center space-x-3 p-3 bg-red-600 rounded-lg border">
              <img 
                src={report.image} 
                alt="Reporter" 
                className="w-10 h-10 rounded-full object-cover" 
              />
              <div className="flex-1">
                <p className="font-medium text-white">{report.submitter}</p>
                <p className="text-sm text-red-100">★ 4.5 (112 Review)</p>
                <p className="text-xs text-red-200">{report.submitterPhone}</p>
              </div>
            </div>
          </div>

          {/* Report Count Section */}
          {reportData && (
            <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                <strong>Total Reports:</strong> {reportData.reportCount}
              </p>
              <p className="text-sm text-orange-600">
                <strong>Last Report Date:</strong> {reportData.lastReportDate}
              </p>
            </div>
          )}

          {/* Reason Sections */}
          <div className="mb-4 space-y-3">
            <div className="border rounded-lg p-3">
              <input 
                type="text" 
                placeholder="Reason 1" 
                className="w-full text-sm text-gray-700 bg-transparent outline-none"
                defaultValue={report.reasons && report.reasons[0] ? report.reasons[0].text : ""}
                readOnly
              />
            </div>
            <div className="border rounded-lg p-3">
              <input 
                type="text" 
                placeholder="Reason 2" 
                className="w-full text-sm text-gray-700 bg-transparent outline-none"
                defaultValue={report.reasons && report.reasons[1] ? report.reasons[1].text : ""}
                readOnly
              />
            </div>
          </div>

          {/* Location/Description Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location/Description</label>
            <div className="border rounded-lg p-4 h-24 bg-gray-50">
              <textarea 
                placeholder="Location or additional details"
                className="w-full h-full text-sm text-gray-500 bg-transparent outline-none resize-none"
                defaultValue={report.location || report.description}
                readOnly
              />
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-4 text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${report.statusColor}`}>
              Current Status: {report.status}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => handleAction('Rejected')}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
            <button 
              onClick={() => handleAction('Accepted')}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Accept
            </button>
            <button 
              onClick={() => handleAction('Marked as Unverified')}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
            >
              Unverified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;