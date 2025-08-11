import React, { useState, useEffect } from 'react';
import { X, Upload, ToggleLeft, ToggleRight, Plus, ArrowLeft, Settings, Edit, Save, Calendar, Star, Eye, Camera } from 'lucide-react';
import Sidebar from '../Component/Sidebar';

const ViewAsPage = () => {
  const [service, setService] = useState(null);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [packageForm, setPackageForm] = useState({
    name: '',
    price: '',
    type: '',
    description: '',
    enabled: true,
    showOnAds: false,
    showOnTop5: false
  });

  const [imageForm, setImageForm] = useState({
    title: '',
    subTitle: '',
    description: '',
    enabled: true,
    adsFromDate: '',
    adsToDate: '',
    showOnAds: false,
    showOnTop5: false
  });

  // Component mount होने पर URL से service data लोड करते हैं
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('serviceId');
    
    if (serviceId) {
      const serviceData = localStorage.getItem(`service_${serviceId}`);
      if (serviceData) {
        setService(JSON.parse(serviceData));
      }
    }
    
    if (!serviceId) {
      setService({
        id: 1,
        name: 'Dinesh Kumar',
        category: 'Driver',
        location: 'Lucknow',
        packages: [
          { id: 1, name: 'Single Bed', price: 4456, type: 'AC | Non-AC Room | Dormitory', description: 'Carpooling offers a commuter option that may work better than other methods of transportation, and compared to other options, carpooling may better fit your schedule.' },
          { id: 2, name: 'Double Bed', price: 6500, type: 'AC Room | Premium', description: 'Luxury accommodation with premium amenities and services.' }
        ],
        contact: {
          name: 'Aditya Kumar',
          phone: '+91-7865433267',
          address: 'Lucknow, Uttar Pradesh'
        },
        showOnAds: false,
        showOnTop5: false,
        rating: 4.5,
        totalBookings: 127,
        joinedDate: 'Jan 2023'
      });
    }
  }, []);

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

  const handleAddNewPackage = () => {
    setSelectedPackage(null);
    setPackageForm({
      name: '',
      price: '',
      type: '',
      description: '',
      enabled: true,
      showOnAds: false,
      showOnTop5: false
    });
    setShowPackageForm(true);
  };

  const handleSavePackage = () => {
    if (!packageForm.name || !packageForm.price) {
      alert('Please fill required fields');
      return;
    }
    
    console.log('Package saved:', packageForm);
    setShowPackageForm(false);
  };

  const handleImageUpload = () => {
    setImageForm({
      title: '',
      subTitle: '',
      description: '',
      enabled: true,
      adsFromDate: '',
      adsToDate: '',
      showOnAds: false,
      showOnTop5: false
    });
    setShowImageUpload(true);
  };

  const handleSaveImage = () => {
    console.log('Image saved:', imageForm);
    setShowImageUpload(false);
  };

  const handleCloseTab = () => {
    window.close();
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading service data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
          <div
                className={`flex-1 p-8 ${
                  isSidebarOpen ? "ml-64" : "ml-20"
                } transition-all duration-300`}
              >
                <Sidebar
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCloseTab}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md border border-gray-300 hover:border-gray-400 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Close</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{service.name}</h1>
                <p className="text-sm text-gray-500">{service.category} • {service.location}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{service.rating}</span>
                <span>•</span>
                <span>{service.totalBookings} bookings</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View as</span>
                <button className="flex items-center">
                  <ToggleRight className="text-blue-500" size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['overview', 'packages', 'images', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Service Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Service Details</h2>
                  <button className="text-blue-600 hover:text-blue-700">
                    <Edit size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Service Type</label>
                    <p className="text-base text-gray-900">{service.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                    <p className="text-base text-gray-900">{service.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Joined</label>
                    <p className="text-base text-gray-900">{service.joinedDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Packages Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Packages</h2>
                  <button
                    onClick={handleAddNewPackage}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Package</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.packages && service.packages.map((pkg, index) => (
                    <div
                      key={index}
                      onClick={() => handlePackageClick(pkg)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600">{pkg.name}</h3>
                        <span className="text-lg font-bold text-blue-600">₹{pkg.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{pkg.type}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{pkg.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Images</h2>
                  <button
                    onClick={handleImageUpload}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Upload size={16} />
                    <span>Upload Image</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      onClick={handleImageUpload}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors"
                    >
                      <Camera size={24} />
                      <span className="text-xs mt-1">Upload</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Settings */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                    <p className="text-base text-gray-900">{service.contact.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-base text-gray-900">{service.contact.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <p className="text-base text-gray-900">{service.contact.address}</p>
                  </div>
                </div>
              </div>

              {/* Visibility Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Visibility Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-900">Show on Ads</label>
                      <p className="text-sm text-gray-500">Display in advertisement section</p>
                    </div>
                    <button className="flex items-center">
                      {service.showOnAds ? 
                        <ToggleRight className="text-green-500" size={24} /> : 
                        <ToggleLeft className="text-gray-400" size={24} />
                      }
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-900">Show in Top 5</label>
                      <p className="text-sm text-gray-500">Feature in top recommendations</p>
                    </div>
                    <button className="flex items-center">
                      {service.showOnTop5 ? 
                        <ToggleRight className="text-green-500" size={24} /> : 
                        <ToggleLeft className="text-gray-400" size={24} />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Packages</span>
                    <span className="font-medium">{service.packages?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="font-medium">{service.totalBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium">{service.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content would go here */}
        {activeTab === 'packages' && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Package Management</h3>
            <p className="text-gray-600">Detailed package management interface would be here</p>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Image Gallery</h3>
            <p className="text-gray-600">Image management interface would be here</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Service Settings</h3>
            <p className="text-gray-600">Advanced settings interface would be here</p>
          </div>
        )}
      </main>

      {/* Package Form Modal */}
      {showPackageForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedPackage ? 'Edit Package' : 'Add New Package'}
              </h3>
              <button
                onClick={() => setShowPackageForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between">
                <label className="text-base font-medium text-gray-900">Package Status</label>
                <button 
                  onClick={() => setPackageForm(prev => ({...prev, enabled: !prev.enabled}))}
                  className="flex items-center"
                >
                  {packageForm.enabled ? 
                    <ToggleRight className="text-green-500" size={24} /> : 
                    <ToggleLeft className="text-gray-400" size={24} />
                  }
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                  <input
                    type="text"
                    placeholder="Enter package name"
                    value={packageForm.name}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={packageForm.price}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
                <input
                  type="text"
                  placeholder="AC | Non-AC Room | Dormitory"
                  value={packageForm.type}
                  onChange={(e) => setPackageForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Enter package description"
                  value={packageForm.description}
                  onChange={(e) => setPackageForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                />
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Visibility Options</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Show on Ads</span>
                    <button 
                      onClick={() => setPackageForm(prev => ({...prev, showOnAds: !prev.showOnAds}))}
                      className="flex items-center"
                    >
                      {packageForm.showOnAds ? 
                        <ToggleRight className="text-green-500" size={20} /> : 
                        <ToggleLeft className="text-gray-400" size={20} />
                      }
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Show in Top 5</span>
                    <button 
                      onClick={() => setPackageForm(prev => ({...prev, showOnTop5: !prev.showOnTop5}))}
                      className="flex items-center"
                    >
                      {packageForm.showOnTop5 ? 
                        <ToggleRight className="text-green-500" size={20} /> : 
                        <ToggleLeft className="text-gray-400" size={20} />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPackageForm(false)}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePackage}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                {selectedPackage ? 'Update Package' : 'Save Package'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Upload Image</h3>
              <button
                onClick={() => setShowImageUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between">
                <label className="text-base font-medium text-gray-900">Image Status</label>
                <button 
                  onClick={() => setImageForm(prev => ({...prev, enabled: !prev.enabled}))}
                  className="flex items-center"
                >
                  {imageForm.enabled ? 
                    <ToggleRight className="text-green-500" size={24} /> : 
                    <ToggleLeft className="text-gray-400" size={24} />
                  }
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={imageForm.title}
                  onChange={(e) => setImageForm(prev => ({...prev, title: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Title</label>
                <input
                  type="text"
                  value={imageForm.subTitle}
                  onChange={(e) => setImageForm(prev => ({...prev, subTitle: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={imageForm.description}
                  onChange={(e) => setImageForm(prev => ({...prev, description: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <button className="text-blue-600 hover:text-blue-500 font-medium">
                    Choose file to upload
                  </button>
                  <p className="mt-1 text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowImageUpload(false)}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveImage}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ViewAsPage;