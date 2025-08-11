import React, { useState } from 'react';
import { Eye, Edit, Trash2, X, Plus } from 'lucide-react';
import Sidebar from '../Sidebar';

const DriverCancel = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [editingItem, setEditingItem] = useState(null);
            const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  

  // Form state for add/edit
  const [formData, setFormData] = useState({
    status: '1',
    orderNumber: '',
    title: ''
  });

  // Sample data matching the PDF
  const [cancelData, setCancelData] = useState([
    {
      id: 1,
      sn: '01',
      idCode: 'A',
      title: '',
      status: 'Active'
    },
    {
      id: 2,
      sn: '02', 
      idCode: 'B',
      title: '',
      status: 'Active'
    },
    {
      id: 3,
      sn: '04',
      idCode: 'C', 
      title: '',
      status: 'Deactive'
    }
  ]);

  const getRowColor = (status) => {
    return status === 'Active' ? 'bg-green-100' : 'bg-red-100';
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      status: '1',
      orderNumber: '',
      title: ''
    });
    setShowAddModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      status: item.status === 'Active' ? '1' : '0',
      orderNumber: item.idCode,
      title: item.title
    });
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (editingItem) {
      // Update existing item
      setCancelData(cancelData.map(item => 
        item.id === editingItem.id 
          ? {
              ...item,
              idCode: formData.orderNumber,
              title: formData.title,
              status: formData.status === '1' ? 'Active' : 'Deactive'
            }
          : item
      ));
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        sn: String(cancelData.length + 1).padStart(2, '0'),
        idCode: formData.orderNumber,
        title: formData.title,
        status: formData.status === '1' ? 'Active' : 'Deactive'
      };
      setCancelData([...cancelData, newItem]);
    }
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this cancel reason?')) {
      setCancelData(cancelData.filter(item => item.id !== id));
    }
  };

  const filteredData = cancelData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.idCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-pink-50 p-6">


      <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              />
  <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'} p-6`}></div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="bg-gray-100 p-4 border-b">
            <h1 className="text-2xl font-bold text-gray-800">Cancel Driver </h1>
          </div>

          {/* Controls */}
          <div className="p-4 bg-white border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show</span>
                  <select 
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-medium"
                    value={showEntries}
                    onChange={(e) => setShowEntries(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                
                <input
                  type="text"
                  placeholder="Search"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={handleAdd}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 font-medium"
              >
                <Plus size={16} />
                <span>Reason</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-400">
                <tr>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-white border border-gray-500">S N</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-white border border-gray-500">ID</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-white border border-gray-500">Title</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-white border border-gray-500">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-white border border-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, showEntries).map((item) => (
                  <tr key={item.id} className={`${getRowColor(item.status)} border-b`}>
                    <td className="px-6 py-4 border border-gray-300 text-sm font-medium text-center">{item.sn}</td>
                    <td className="px-6 py-4 border border-gray-300 text-sm text-center font-medium">{item.idCode}</td>
                    <td className="px-6 py-4 border border-gray-300 text-sm text-center">{item.title}</td>
                    <td className="px-6 py-4 border border-gray-300 text-center">
                      <span className={`px-4 py-2 rounded text-sm font-bold ${
                        item.status === 'Active' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border border-gray-300">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Add Cancel Reason
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status (1= Active, 00= De-Active)
                  </label>
                  <input
                    type="text"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Number"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter reason"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverCancel;