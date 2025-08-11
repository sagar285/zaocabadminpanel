import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Upload, ToggleRight, X } from 'lucide-react';
import Sidebar from '../Sidebar';

const OtherServices = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Dinesh Kumar',
      category: 'Driver',
      location: 'Lucknow',
      packageCount: '7 / 12',
      status: 1,
      image: null,
      packages: [
        { id: 1, name: 'Single Bed', price: 4456, type: 'AC | Non-AC Room | Dormitory', description: 'Carpooling offers a commuter option that may work better than other methods of transportation, and compared to other options, carpooling may better fit your schedule.' }
      ],
      contact: {
        name: 'Aditya Kumar',
        phone: '+91-7865433267',
        address: 'Lucknow, Uttar Pradesh'
      },
      showOnAds: false,
      showOnTop5: false
    },
    {
      id: 2,
      name: 'Rahul',
      category: 'Hotel',
      location: 'Agra',
      packageCount: '3 / 7',
      status: 1,
      image: null,
      packages: [
        { id: 1, name: 'Ram Prasth Hotel', price: 4456, type: 'AC | Non-AC Room | Dormitory', description: 'Carpooling offers a commuter option that may work better than other methods of transportation, and compared to other options, carpooling may better fit your schedule.' }
      ],
      contact: {
        name: 'Rahul Sharma',
        phone: '+91-9876543210',
        address: 'Agra, Uttar Pradesh'
      },
      showOnAds: true,
      showOnTop5: false
    },
    {
      id: 4,
      name: 'Sonu',
      category: 'Tourist Guide',
      location: 'Varanasi',
      packageCount: '5 / 16',
      status: 0,
      image: null,
      packages: [],
      contact: {
        name: 'Sonu Gupta',
        phone: '+91-8765432109',
        address: 'Varanasi, Uttar Pradesh'
      },
      showOnAds: false,
      showOnTop5: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [showAddNew, setShowAddNew] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showViewAs, setShowViewAs] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [newService, setNewService] = useState({
    name: '',
    category: '',
    location: '',
    status: 1
  });

  const handleViewService = (service) => {
    // New tab में ViewAs component खोलने के लिए
    const viewAsUrl = `other-services/view-as?serviceId=${service.id}&serviceName=${encodeURIComponent(service.name)}&category=${encodeURIComponent(service.category)}`;
    
    // Service data को localStorage में store करते हैं ताकि new tab में access हो सके
    localStorage.setItem(`service_${service.id}`, JSON.stringify(service));
    
    // New tab open करते हैं
    window.open(viewAsUrl, '_blank');
    
    // या अगर आप current tab में भी functionality चाहते हैं तो uncomment करें:
    // setSelectedService(service);
    // setShowViewAs(true);
  };

  const handleAddNew = () => {
    setNewService({
      name: '',
      category: '',
      location: '',
      status: 1
    });
    setShowAddNew(true);
  };

  const handleSaveNew = () => {
    if (!newService.name || !newService.category || !newService.location) {
      alert('Please fill all fields');
      return;
    }

    const service = {
      id: Date.now(),
      ...newService,
      packageCount: '0 / 0',
      packages: [],
      contact: {
        name: newService.name,
        phone: '',
        address: newService.location
      },
      showOnAds: false,
      showOnTop5: false
    };

    setServices(prev => [...prev, service]);
    setShowAddNew(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(service => service.id !== id));
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ViewAs Component (inline के लिए)
  const ViewAsComponent = ({ service, onClose }) => {
    const [showPackageForm, setShowPackageForm] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    
    const [packageForm, setPackageForm] = useState({
      name: '',
      price: '',
      type: '',
      description: '',
      enabled: true,
      showOnAds: false,
      showOnTop5: false
    });

    const handlePackageClick = (pkg) => {
      setSelectedPackage(pkg);
      setPackageForm({
        name: pkg.name,
        price: pkg.price,
        type: pkg.type,
        description: pkg.description,
        enabled: true,
        showOnAds: false,
        showOnTop5: false
      });
      setShowPackageForm(true);
    };

    return (
      <div className="flex h-screen bg-gray-50">
        {/* Package Form Sidebar */}
        {showPackageForm && (
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Package</h3>
                <button
                  onClick={() => setShowPackageForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Package</span>
                  <button className="flex items-center">
                    <ToggleRight className="text-green-500" size={24} />
                  </button>
                </div>
                
                <div className="bg-blue-100 p-3 rounded">
                  <input
                    type="text"
                    placeholder="Package Name"
                    value={packageForm.name}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-blue-200 font-medium text-blue-800 placeholder-blue-600 border border-blue-300 rounded px-2 py-1 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Type (AC | Non-AC Room | Dormitory)"
                    value={packageForm.type}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-blue-200 text-sm text-blue-700 placeholder-blue-500 border border-blue-300 rounded px-2 py-1 outline-none mt-2"
                  />
                  <textarea
                    placeholder="Description"
                    value={packageForm.description}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-blue-200 text-sm text-blue-700 placeholder-blue-500 border border-blue-300 rounded px-2 py-1 outline-none mt-2 resize-none"
                    rows="3"
                  />
                  <div className="flex items-center mt-3">
                    <span className="text-lg font-bold text-blue-800">₹</span>
                    <input
                      type="number"
                      placeholder="4456"
                      value={packageForm.price}
                      onChange={(e) => setPackageForm(prev => ({ ...prev, price: e.target.value }))}
                      className="ml-1 bg-blue-200 font-bold text-blue-800 placeholder-blue-600 border border-blue-300 rounded px-2 py-1 outline-none flex-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setShowImageUpload(true)}
                    className="bg-green-200 border-2 border-dashed border-green-400 p-6 rounded text-green-600 text-sm font-medium hover:bg-green-300"
                  >
                    UPLOAD<br />IMAGE
                  </button>
                  <button 
                    onClick={() => setShowImageUpload(true)}
                    className="bg-green-200 border-2 border-dashed border-green-400 p-6 rounded text-green-600 text-sm font-medium hover:bg-green-300"
                  >
                    UPLOAD<br />IMAGE
                  </button>
                  <button 
                    onClick={() => setShowImageUpload(true)}
                    className="bg-green-200 border-2 border-dashed border-green-400 p-6 rounded text-green-600 text-sm font-medium hover:bg-green-300"
                  >
                    UPLOAD<br />IMAGE
                  </button>
                </div>
                
                <div className="bg-green-500 text-white p-2 text-center rounded font-medium cursor-pointer hover:bg-green-600">
                  APPROVE
                </div>
                
                <button className="w-full bg-green-500 text-white py-2 rounded font-medium hover:bg-green-600">
                  {selectedPackage ? 'Update Package' : 'Add Package'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
            
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                  {service.name} - {service.category}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">View as</span>
                <button className="flex items-center">
                  <ToggleRight className="text-blue-500" size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-md mx-auto space-y-4">
              {/* Upload Section */}
              <div className="bg-green-200 p-4 rounded">
                <div className="text-center mb-2">
                  <button 
                    onClick={() => setShowImageUpload(true)}
                    className="bg-green-300 border-2 border-dashed border-green-500 w-full h-24 rounded flex items-center justify-center text-green-700 font-medium hover:bg-green-400"
                  >
                    UPLOAD IMAGE
                  </button>
                </div>
                <button 
                  onClick={() => setShowPackageForm(true)}
                  className="bg-green-500 text-white p-2 text-center rounded font-medium w-full hover:bg-green-600"
                >
                  ADD MORE
                </button>
              </div>
              
              {/* Category Section */}
              <div className="bg-blue-200 p-4 rounded">
                <div className="bg-blue-400 text-white p-2 text-center rounded font-medium mb-3">
                  {service.category}
                </div>
                
                {service.packages && service.packages.map((pkg, index) => (
                  <div key={index} className="bg-blue-300 p-3 rounded mb-2">
                    <button 
                      onClick={() => handlePackageClick(pkg)}
                      className="w-full text-left hover:bg-blue-400 p-2 rounded transition-colors"
                    >
                      <div className="font-medium text-blue-800">{pkg.name}</div>
                      <div className="text-sm text-blue-700">{pkg.type}</div>
                      <p className="text-sm text-blue-700 mt-1">{pkg.description}</p>
                    </button>
                  </div>
                ))}
                
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <button 
                    onClick={() => setShowImageUpload(true)}
                    className="bg-blue-100 border-2 border-dashed border-blue-400 p-4 rounded text-blue-600 text-xs font-medium hover:bg-blue-200"
                  >
                    UPLOAD<br />IMAGE
                  </button>
                  <button 
                    onClick={() => setShowImageUpload(true)}
                    className="bg-blue-100 border-2 border-dashed border-blue-400 p-4 rounded text-blue-600 text-xs font-medium hover:bg-blue-200"
                  >
                    UPLOAD<br />IMAGE
                  </button>
                  <button 
                    onClick={() => setShowImageUpload(true)}
                    className="bg-blue-100 border-2 border-dashed border-blue-400 p-4 rounded text-blue-600 text-xs font-medium hover:bg-blue-200"
                  >
                    UPLOAD<br />IMAGE
                  </button>
                </div>
                
                <div className="bg-green-500 text-white p-2 text-center rounded font-medium mt-3 cursor-pointer hover:bg-green-600">
                  APPROVE
                </div>
              </div>
              
              {/* Package List */}
              {service.packages && service.packages.map((pkg, index) => (
                <div key={index} className="bg-blue-100 p-3 rounded">
                  <button 
                    onClick={() => handlePackageClick(pkg)}
                    className="w-full text-left hover:bg-blue-200 p-2 rounded transition-colors"
                  >
                    <div className="font-medium text-blue-800">{pkg.name}</div>
                    <div className="text-sm text-blue-700">{pkg.type}</div>
                    <div className="text-lg font-bold text-blue-800 mt-1">₹ {pkg.price}</div>
                  </button>
                </div>
              ))}
              
              {/* Contact Information */}
              <div className="bg-gray-600 text-white p-3 rounded">
                <div className="font-medium">{service.contact.name}</div>
                <div className="text-sm">{service.contact.phone}</div>
                <div className="text-sm mt-1">{service.contact.address}</div>
                <div className="mt-2 text-sm">
                  <div>Address</div>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Show on Ads</span>
                    <span>{service.showOnAds ? '[ Y ]' : '[ ]'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Show on Top 5</span>
                    <span>{service.showOnTop5 ? '[ Y ]' : '[ ]'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload Modal */}
        {showImageUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Upload / Edit Image</h3>
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Upload / Edit Image</span>
                  <button className="flex items-center">
                    <ToggleRight className="text-green-500" size={24} />
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Title</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button className="bg-green-200 border-2 border-dashed border-green-400 p-6 rounded text-green-600 text-sm font-medium hover:bg-green-300">
                    UPLOAD<br />IMAGE
                  </button>
                  <button className="bg-green-200 border-2 border-dashed border-green-400 p-6 rounded text-green-600 text-sm font-medium hover:bg-green-300">
                    UPLOAD<br />IMAGE
                  </button>
                  <button className="bg-green-200 border-2 border-dashed border-green-400 p-6 rounded text-green-600 text-sm font-medium hover:bg-green-300">
                    UPLOAD<br />IMAGE
                  </button>
                </div>
                
                <div className="bg-green-500 text-white p-2 text-center rounded font-medium cursor-pointer hover:bg-green-600">
                  APPROVE
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 font-medium"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (showViewAs && selectedService) {
    return <ViewAsComponent service={selectedService} onClose={() => setShowViewAs(false)} />;
  }

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
          <h2 className="text-xl font-semibold text-gray-800">Other Services</h2>
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
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm">View as</span>
              <button className="flex items-center">
                <ToggleRight className="text-blue-500" size={24} />
              </button>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center space-x-1"
            >
              <span>+</span>
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S N</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.slice(0, showCount).map((service, index) => (
                <tr key={service.id} className={service.status === 1 ? 'bg-green-50' : 'bg-red-50'}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="w-10 h-10 bg-gray-200 rounded border-2 border-dashed border-gray-400 flex items-center justify-center">
                      <Upload size={16} className="text-gray-500" />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{service.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div>{service.category}</div>
                    <div className="text-xs text-gray-500">{service.location}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{service.packageCount}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.status === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.status === 1 ? 'Active' : 'De-active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewService(service)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Service"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
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

      {/* Add New Modal */}
      {showAddNew && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Add New Service</h3>
              <button
                onClick={() => setShowAddNew(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newService.category}
                  onChange={(e) => setNewService(prev => ({...prev, category: e.target.value}))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Driver">Driver</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Tourist Guide">Tourist Guide</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newService.location}
                  onChange={(e) => setNewService(prev => ({...prev, location: e.target.value}))}
                  placeholder="Enter location"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newService.status}
                  onChange={(e) => setNewService(prev => ({...prev, status: parseInt(e.target.value)}))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Active</option>
                  <option value={0}>De-active</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowAddNew(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNew}
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

export default OtherServices;