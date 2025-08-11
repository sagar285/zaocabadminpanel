import React, { useState } from 'react';
import { Eye, Edit2, Trash2, X } from 'lucide-react';
import Sidebar from '../Sidebar';
const OtherCategory = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      orderNo: '01',
      category: 'Driver',
      button1: 'Book',
      button2: 'Drop',
      status: 1
    },
    {
      id: 2,
      orderNo: '02',
      category: 'Hotel',
      button1: 'Check in',
      button2: 'Check out',
      status: 1
    },
    {
      id: 4,
      orderNo: '04',
      category: 'Tourist Guide',
      button1: 'Book',
      button2: 'Drop',
      status: 0
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [formData, setFormData] = useState({
    orderNo: '',
    category: '',
    button1: '',
    button2: '',
    status: 1
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? parseInt(value) : value
    }));
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      orderNo: '',
      category: '',
      button1: '',
      button2: '',
      status: 1
    });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      orderNo: category.orderNo,
      category: category.category,
      button1: category.button1,
      button2: category.button2,
      status: category.status
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.orderNo || !formData.category || !formData.button1 || !formData.button2) {
      alert('Please fill all fields');
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
    } else {
      // Add new category
      const newCategory = {
        id: Date.now(),
        ...formData
      };
      setCategories(prev => [...prev, newCategory]);
    }
    
    setShowModal(false);
    setFormData({
      orderNo: '',
      category: '',
      button1: '',
      button2: '',
      status: 1
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  const filteredCategories = categories.filter(category =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.orderNo.includes(searchTerm)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
              <div
                className={`flex-1 p-8 ${
                  isSidebarOpen ? "ml-64" : "ml-20"
                } transition-all duration-300`}
              >
                <Sidebar
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Other Category</h2>
        </div>

        {/* Controls */}
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Show</label>
              <select 
                value={showCount}
                onChange={(e) => setShowCount(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-blue-500 text-white"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleAddNew}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center space-x-1"
          >
            <span>+</span>
            <span>Add New</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S N</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Button 1</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Button 2</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.slice(0, showCount).map((category, index) => (
                <tr key={category.id} className={category.status === 1 ? 'bg-green-50' : 'bg-red-50'}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{category.orderNo}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{category.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{category.button1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{category.button2}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      category.status === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.status === 1 ? 'Active' : 'De-active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEdit(category)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingCategory ? 'Edit Other Category' : 'Add Other Category'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status (1= Active, 0= De-Active)
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 - Active</option>
                  <option value={0}>0 - De-Active</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
                <input
                  type="text"
                  name="orderNo"
                  value={formData.orderNo}
                  onChange={handleInputChange}
                  placeholder="Enter Number"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button 1</label>
                <input
                  type="text"
                  name="button1"
                  value={formData.button1}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button 2</label>
                <input
                  type="text"
                  name="button2"
                  value={formData.button2}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 font-medium"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
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

export default OtherCategory;