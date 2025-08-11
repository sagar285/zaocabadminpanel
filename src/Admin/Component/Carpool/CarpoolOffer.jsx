import React, { useState } from 'react';
import { 
  Car, MapPin, Clock, Calendar, Users, DollarSign, 
  Plus, Search, Filter, Eye, Edit, Trash2, Upload, X,
  Star, Phone, MessageCircle, Navigation, Image
} from 'lucide-react';
import Sidebar from '../Sidebar';

const CarpoolOffer = () => {
  const [showLeftForm, setShowLeftForm] = useState(false);
  const [showMiddleForm, setShowMiddleForm] = useState(false);
  const [showRightForm, setShowRightForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [formData, setFormData] = useState({
    orderNumber: '',
    from: '',
    to: '',
    date: '',
    time: '',
    seats: 1,
    price: '',
    carModel: '',
    description: '',
    preferences: ''
  });

  // Sample carpool offers data
  const [offers] = useState([
    {
      id: 1,
      sn: "CP001",
      driver: "Sarah Johnson",
      rating: 4.8,
      from: "Downtown Bhopal",
      to: "Indore",
      date: "2025-06-05",
      time: "08:00",
      seats: 3,
      price: "400",
      car: "Honda City",
      preferences: "Non-smoking, Music allowed",
      verified: true,
      title: "Comfortable Ride to Indore",
      subTitle: "AC car with music system"
    },
    {
      id: 2,
      sn: "CP002", 
      driver: "Raj Patel",
      rating: 4.9,
      from: "New Market",
      to: "Jabalpur",
      date: "2025-06-04",
      time: "14:30",
      seats: 2,
      price: "350",
      car: "Maruti Swift",
      preferences: "No pets, AC available",
      verified: true,
      title: "Swift Journey to Jabalpur",
      subTitle: "Experienced driver, safe travel"
    },
    {
      id: 3,
      sn: "CP003",
      driver: "Priya Sharma",
      rating: 4.7,
      from: "MP Nagar",
      to: "Ujjain",
      date: "2025-06-06",
      time: "09:15",
      seats: 1,
      price: "200",
      car: "Hyundai i20",
      preferences: "Female passengers preferred",
      verified: false,
      title: "Safe Ride to Ujjain",
      subTitle: "Women-friendly travel option"
    }
  ]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

          const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  

  const handleAdd = () => {
    setSelectedItem(null);
    setShowLeftForm(true);
    setShowMiddleForm(false);
    setShowRightForm(false);
    setFormData({
      orderNumber: '',
      from: '',
      to: '',
      date: '',
      time: '',
      seats: 1,
      price: '',
      carModel: '',
      description: '',
      preferences: ''
    });
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowLeftForm(true);
    setShowMiddleForm(false);
    setShowRightForm(false);
    setFormData({
      orderNumber: item.sn,
      from: item.from,
      to: item.to,
      date: item.date,
      time: item.time,
      seats: item.seats,
      price: item.price,
      carModel: item.car,
      description: item.title,
      preferences: item.preferences
    });
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowRightForm(true);
    setShowLeftForm(false);
    setShowMiddleForm(false);
    setFormData({
      orderNumber: item.sn,
      from: item.from,
      to: item.to,
      date: item.date,
      time: item.time,
      seats: item.seats,
      price: item.price,
      carModel: item.car,
      description: item.title,
      preferences: item.preferences
    });
  };

  const handleUpload = (item) => {
    setSelectedItem(item);
    setShowMiddleForm(true);
    setShowLeftForm(false);
    setShowRightForm(false);
  };

  const getGridCols = () => {
    const formCount = [showLeftForm, showMiddleForm, showRightForm].filter(Boolean).length;
    if (formCount === 1) return 'md:grid-cols-1 max-w-2xl mx-auto';
    if (formCount === 2) return 'md:grid-cols-2';
    return 'md:grid-cols-3';
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.from.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         offer.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.driver.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'verified') return matchesSearch && offer.verified;
    if (selectedFilter === 'today') return matchesSearch && offer.date === '2025-06-03';
    return matchesSearch;
  });

  const ImageUploadBox = ({ label, onClick }) => (
    <div 
      onClick={onClick}
      className="border-2 border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all duration-200"
    >
      <div className="text-center">
        <Image className="w-6 h-6 mx-auto text-gray-400 mb-1" />
        <span className="text-xs text-gray-500">{label || 'Image'}</span>
      </div>
    </div>
  );

  const VideoUploadBox = ({ label, onClick }) => (
    <div 
      onClick={onClick}
      className="border-2 border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
    >
      <div className="text-center">
        <div className="w-6 h-6 mx-auto bg-gray-400 rounded mb-1"></div>
        <span className="text-xs text-gray-500">{label || 'Video'}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">

  <Sidebar
                                isSidebarOpen={isSidebarOpen}
                                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                              />        
  <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'} p-6`}>
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Car className="w-8 h-8 mr-3 text-green-600" />
                Carpool Offers
              </h1>
              <p className="text-gray-600 mt-2">Manage and browse carpool offers</p>
            </div>
            <button 
              onClick={handleAdd}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Offer
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location or driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Offers</option>
              <option value="verified">Verified Drivers</option>
              <option value="today">Today's Rides</option>
            </select>
            
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 mr-2 text-gray-600" />
              More Filters
            </button>
          </div>
        </div>

        {/* Three Panel Forms */}
        {(showLeftForm || showMiddleForm || showRightForm) && (
          <div className={`grid grid-cols-1 ${getGridCols()} gap-6 animate-fadeIn mb-6`}>
            
            {/* Left Form - Add/Edit Carpool Offer */}
            {showLeftForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 animate-slideIn">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Edit className="w-5 h-5 mr-2 text-green-600" />
                    {selectedItem ? 'Edit Carpool Offer' : 'Add New Carpool Offer'}
                  </h3>
                  <button 
                    onClick={() => setShowLeftForm(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Offer Number"
                      value={formData.orderNumber}
                      onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Car Model"
                      value={formData.carModel}
                      onChange={(e) => handleInputChange('carModel', e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="From Location"
                      value={formData.from}
                      onChange={(e) => handleInputChange('from', e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      type="text"
                      placeholder="To Location"
                      value={formData.to}
                      onChange={(e) => handleInputChange('to', e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="date"
                      placeholder="Date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      type="time"
                      placeholder="Time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <select
                      value={formData.seats}
                      onChange={(e) => handleInputChange('seats', e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value={1}>1 Seat</option>
                      <option value={2}>2 Seats</option>
                      <option value={3}>3 Seats</option>
                      <option value={4}>4 Seats</option>
                    </select>
                  </div>
                  
                  <input
                    type="number"
                    placeholder="Price per person (₹)"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  
                  <textarea
                    placeholder="Trip Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  
                  <input
                    type="text"
                    placeholder="Preferences (e.g., Non-smoking, Music allowed)"
                    value={formData.preferences}
                    onChange={(e) => handleInputChange('preferences', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  
                  {/* Upload Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                      <Image className="w-4 h-4 mr-2" />
                      Car & Route Images
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <ImageUploadBox label="CAR IMAGE" />
                      <ImageUploadBox label="ROUTE MAP" />
                      <ImageUploadBox label="DRIVER PHOTO" />
                      <ImageUploadBox label="LICENSE" />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <span className="text-blue-600 text-sm font-medium">Contact Info • Social Media • GPS Tracking</span>
                  </div>
                  
                  <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold w-full transition-all duration-200 shadow-md hover:shadow-lg">
                    {selectedItem ? 'UPDATE OFFER' : 'CREATE OFFER'}
                  </button>
                </div>
              </div>
            )}

            {/* Middle Form - Upload/Edit Media */}
            {showMiddleForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 animate-slideIn">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-blue-600" />
                    Upload / Edit Carpool Media
                  </h3>
                  <button 
                    onClick={() => setShowMiddleForm(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Media Title"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  
                  <textarea
                    placeholder="Media Description"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Car & Journey Media</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <ImageUploadBox label="CAR EXTERIOR" />
                      <VideoUploadBox label="CAR INTERIOR" />
                      <ImageUploadBox label="ROUTE VIDEO" />
                      <VideoUploadBox label="TESTIMONIAL" />
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                    <span className="text-amber-700 text-sm font-medium">Social Sharing • YouTube Links • Gallery</span>
                  </div>
                  
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold w-full transition-all duration-200 shadow-md hover:shadow-lg">
                    SAVE MEDIA
                  </button>
                </div>
              </div>
            )}

            {/* Right Form - View/Preview */}
            {showRightForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 animate-slideIn">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-purple-600" />
                    Preview / View Offer Details
                  </h3>
                  <button 
                    onClick={() => setShowRightForm(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex space-x-3">
                      <span className="bg-gray-200 px-3 py-1 rounded-md text-sm font-medium">
                        {formData.orderNumber || 'CP001'}
                      </span>
                      <span className="bg-gray-200 px-3 py-1 rounded-md text-sm font-medium">
                        {formData.carModel || 'Honda City'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">Last Updated: Today</span>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-gray-800">{formData.description || 'Comfortable Ride to Destination'}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">From:</span>
                        <div className="font-medium text-gray-800">{formData.from || 'Pick-up Location'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">To:</span>
                        <div className="font-medium text-gray-800">{formData.to || 'Drop-off Location'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Date & Time:</span>
                        <div className="font-medium text-gray-800">{formData.date || '2025-06-05'} at {formData.time || '08:00'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <div className="font-medium text-green-600">₹{formData.price || '400'} per person</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Available Seats:</span>
                      <span className="font-medium text-gray-800 ml-2">{formData.seats || '3'} seats</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {formData.preferences || 'Non-smoking, music allowed, comfortable AC car with experienced driver.'}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Media Gallery</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg h-20 flex items-center justify-center">
                        <span className="text-green-700 text-xs font-semibold">CAR IMAGE</span>
                      </div>
                      <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-20 flex items-center justify-center">
                        <span className="text-blue-700 text-xs font-semibold">ROUTE MAP</span>
                      </div>
                      <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg h-20 flex items-center justify-center">
                        <span className="text-green-700 text-xs font-semibold">DRIVER PHOTO</span>
                      </div>
                      <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-20 flex items-center justify-center">
                        <span className="text-blue-700 text-xs font-semibold">TESTIMONIAL</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-center text-xs border-t pt-4">
                    <div>
                      <div className="font-semibold text-gray-800">Contact</div>
                      <div className="text-gray-500">Driver</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">GPS</div>
                      <div className="text-gray-500">Tracking</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Share</div>
                      <div className="text-gray-500">Social</div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                    <span className="text-purple-600 text-sm font-medium">Contact Info • GPS Tracking • Social Sharing</span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleEdit(selectedItem)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-semibold flex-1 transition-all duration-200"
                    >
                      EDIT
                    </button>
                    <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold flex-1 transition-all duration-200">
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        )}

        {/* Offers List */}
        <div className="space-y-4">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-semibold text-lg">
                        {offer.driver.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 flex items-center">
                        {offer.driver}
                        {offer.verified && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                        )}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{offer.rating}</span>
                        <span className="text-sm text-gray-500">• {offer.car}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">₹{offer.price}</div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">{offer.from}</div>
                      <div className="text-xs text-gray-500">From</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">{offer.to}</div>
                      <div className="text-xs text-gray-500">To</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">{offer.date} at {offer.time}</div>
                      <div className="text-xs text-gray-500">Departure</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{offer.seats} seats available</span>
                    </div>
                    <div className="text-sm text-gray-500">{offer.preferences}</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleView(offer)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEdit(offer)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Offer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleUpload(offer)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Upload Media"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No offers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or create a new carpool offer!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarpoolOffer;