import React, { useState } from 'react';
import { Eye, Users, X, Bell } from 'lucide-react';
import Sidebar from '../Sidebar';

const TravelPartner = () => {
  const [partners] = useState([
    {
      sNo: '01',
      id: '75',
      partnerId: '#ZA0342',
      image: '',
      name: 'Rahul Kumar',
      phone: '7676755676',
      driverList: '02',
      vehicleList: '01',
      tripComplete: '5690',
      cityState: 'Lucknow Uttar Pradesh',
      walletBalance: '5690',
      wallet: '',
      idCreate: '15 Jun 24 11:55 AM',
      status: 'Verified',
      rowColor: 'verified'
    },
    {
      sNo: '02',
      id: '74',
      partnerId: '#ZA0342',
      image: '',
      name: 'Rahul Kumar',
      phone: '7676755676',
      driverList: '05',
      vehicleList: '05',
      tripComplete: '5000',
      cityState: 'Ayodhya Uttar Pradesh',
      walletBalance: '5000',
      wallet: '',
      idCreate: '15 Jun 24 11:55 AM',
      status: 'Verified',
      rowColor: 'verified'
    },
    {
      sNo: '03',
      id: '73',
      partnerId: '#ZA0342',
      image: '',
      name: 'Rahul Kumar',
      phone: '7676755676',
      driverList: '00',
      vehicleList: '00',
      tripComplete: '00',
      cityState: 'Lucknow Uttar Pradesh',
      walletBalance: '00',
      wallet: '',
      idCreate: '15 Jun 24 11:55 AM',
      status: 'Pending',
      rowColor: 'pending'
    },
    {
      sNo: '04',
      id: '72',
      partnerId: '#ZA0342',
      image: '',
      name: 'Rahul Kumar',
      phone: '7676755676',
      driverList: '02',
      vehicleList: '01',
      tripComplete: '3425',
      cityState: 'Ayodhya Uttar Pradesh',
      walletBalance: '3425',
      wallet: '',
      idCreate: '15 Jun 24 11:55 AM',
      status: 'Reject',
      rowColor: 'reject'
    },
    {
      sNo: '05',
      id: '71',
      partnerId: '#ZA0342',
      image: '',
      name: 'Rahul Kumar',
      phone: '7676755676',
      driverList: '05',
      vehicleList: '05',
      tripComplete: '3249',
      cityState: 'Lucknow Uttar Pradesh',
      walletBalance: '3249',
      wallet: '',
      idCreate: '15 Jun 24 11:55 AM',
      status: 'T / P Block',
      rowColor: 'block'
    }
  ]);

  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleViewPartner = (partner) => {
    setSelectedPartner(partner);
    setShowModal(true);
  };

  const handleSendNotification = (partner) => {
    alert(`Notification sent to ${partner.name} (${partner.phone})`);
    // Yahan aap notification sending logic add kar sakte hain
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPartner(null);
  };  const getRowColorClass = (rowColor) => {
    switch(rowColor) {
      case 'verified':
        return 'bg-green-50 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-50 hover:bg-yellow-100';
      case 'reject':
        return 'bg-red-50 hover:bg-red-100';
      case 'block':
        return 'bg-red-100 hover:bg-red-150';
      default:
        return 'bg-white hover:bg-gray-50';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Verified':
        return (
          <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
            Verified
          </span>
        );
      case 'Pending':
        return (
          <span className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
            Pending
          </span>
        );
      case 'Reject':
        return (
          <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
            Reject
          </span>
        );
      case 'T / P Block':
        return (
          <span className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
            T / P Block
          </span>
        );
      default:
        return (
          <span className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">


        <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'} p-6`}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Travels Partner list
          </h1>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Header */}
              <thead>
                <tr className="bg-gray-600">
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    S. No.
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    #ID
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    Partner ID
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    Image
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    Name
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    Driver List
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    Vehicle List
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    Trip Complete
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    City State
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    Wallet Balance
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    Wallet
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    ID Create
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    Status
                  </th>
                  <th className="border border-gray-400 px-3 py-3 text-white text-sm font-semibold text-left">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {partners.map((partner, index) => (
                  <tr key={index} className={`transition-colors duration-200 ${getRowColorClass(partner.rowColor)}`}>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-gray-800 font-medium">
                      {partner.sNo}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-gray-800 font-medium">
                      {partner.id}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-blue-600 font-medium underline">
                      {partner.partnerId}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-gray-800">
                      <div className="w-8 h-8 bg-gray-200 rounded border flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm">
                      <div>
                        <div className="font-medium text-gray-800">{partner.name}</div>
                        <div className="text-blue-600 text-xs underline">{partner.phone}</div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-gray-800 text-center font-medium">
                      {partner.driverList}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-gray-800 text-center font-medium">
                      {partner.vehicleList}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-gray-800 text-center font-medium">
                      {partner.tripComplete}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-gray-800">
                      <div>
                        <div className="font-medium">{partner.cityState.split(' ')[0]}</div>
                        <div className="text-xs text-gray-600">{partner.cityState.split(' ').slice(1).join(' ')}</div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-gray-800 text-center font-medium">
                      {partner.walletBalance}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-gray-800 text-center">
                      {partner.wallet}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-gray-800">
                      <div>
                        <div className="text-xs">{partner.idCreate.split(' ').slice(0, 3).join(' ')}</div>
                        <div className="text-xs">{partner.idCreate.split(' ').slice(3).join(' ')}</div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-center">
                      {getStatusBadge(partner.status)}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-sm text-center">
                      <div className="flex flex-col gap-2 items-center">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewPartner(partner)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleSendNotification(partner)}
                            className="text-orange-600 hover:text-orange-800 transition-colors p-1 hover:bg-orange-50 rounded"
                            title="Send Notification"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                        </div>
                        <div className=" text-black px-2 py-1 rounded text-xs font-semibold hover:bg-purple-700 transition-colors cursor-pointer">
                          ROLE CHANGE
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Partner Details */}
        {showModal && selectedPartner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Partner Details</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Partner ID</label>
                      <p className="text-lg font-semibold text-blue-600">{selectedPartner.partnerId}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                      <p className="text-lg font-semibold text-gray-800">{selectedPartner.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                      <p className="text-lg text-blue-600">{selectedPartner.phone}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                      <p className="text-lg text-gray-800">{selectedPartner.cityState}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Registration Date</label>
                      <p className="text-lg text-gray-800">{selectedPartner.idCreate}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                      <div className="mt-1">
                        {getStatusBadge(selectedPartner.status)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Driver Count</label>
                      <p className="text-lg font-semibold text-gray-800">{selectedPartner.driverList}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Vehicle Count</label>
                      <p className="text-lg font-semibold text-gray-800">{selectedPartner.vehicleList}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Completed Trips</label>
                      <p className="text-lg font-semibold text-green-600">{selectedPartner.tripComplete}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Wallet Balance</label>
                      <p className="text-lg font-semibold text-gray-800">₹{selectedPartner.walletBalance}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Role Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelPartner;