import React, { useState } from 'react';
import { Eye, Edit, Trash2, Star, Upload, X, Plus } from 'lucide-react';
import Sidebar from '../Sidebar';

const DriverReview = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [editingItem, setEditingItem] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Star rating popup state
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [ratingPopupPosition, setRatingPopupPosition] = useState({ x: 0, y: 0 });
  const [currentRatingItem, setCurrentRatingItem] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    status: '1',
    orderNumber: '',
    title: '',
    key: '',
    icon: null
  });

  // Sample data - updated to show blank stars by default
  const [reviewData, setReviewData] = useState([
    {
      id: 1,
      sn: '01',
      orderNo: '1',
      title: 'Outstanding',
      key: 'Good Driver | Neat & Clean cabs | Driver Ja',
      status: 'Active',
      stars: 0, // Default to 0 stars (blank)
      color: 'green'
    },
    {
      id: 2,
      sn: '02', 
      orderNo: '2',
      title: 'Good',
      key: '',
      status: 'Active',
      stars: 0, // Default to 0 stars (blank)
      color: 'green'
    },
    {
      id: 3,
      sn: '03',
      orderNo: '3', 
      title: 'Okay',
      key: '',
      status: 'Deactive',
      stars: 0, // Default to 0 stars (blank)
      color: 'red'
    },
    {
      id: 4,
      sn: '04',
      orderNo: '4',
      title: 'Disappointing', 
      key: '',
      status: 'Active',
      stars: 0, // Default to 0 stars (blank)
      color: 'green'
    },
    {
      id: 5,
      sn: '05',
      orderNo: '5',
      title: 'Very disappointing',
      key: '',
      status: 'Deactive', 
      stars: 0, // Default to 0 stars (blank)
      color: 'red'
    }
  ]);

  const renderStars = (count, isClickable = false, itemId = null) => {
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      const isFilled = i < count;
      stars.push(
        <Star
          key={i}
          size={16}
          className={`${
            isFilled 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300 hover:text-yellow-200'
          } ${isClickable ? 'cursor-pointer transition-colors' : ''}`}
          onClick={isClickable ? () => handleStarClick(i + 1, itemId) : undefined}
          onMouseEnter={isClickable ? () => setHoverRating(i + 1) : undefined}
          onMouseLeave={isClickable ? () => setHoverRating(0) : undefined}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const renderInteractiveStars = (item) => {
    return (
      <div 
        className="relative cursor-pointer"
        onMouseEnter={(e) => handleStarHover(e, item)}
        onMouseLeave={handleStarLeave}
      >
        {renderStars(item.stars)}
      </div>
    );
  };

  const handleStarHover = (e, item) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRatingPopupPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setCurrentRatingItem(item);
    setTempRating(item.stars);
    setShowRatingPopup(true);
  };

  const handleStarLeave = () => {
    // Add a small delay to allow moving to the popup
    setTimeout(() => {
      if (!document.querySelector('.rating-popup:hover')) {
        setShowRatingPopup(false);
        setCurrentRatingItem(null);
        setHoverRating(0);
      }
    }, 100);
  };

  const handleStarClick = (rating, itemId) => {
    setReviewData(prevData => 
      prevData.map(item => 
        item.id === itemId 
          ? { ...item, stars: rating }
          : item
      )
    );
    setShowRatingPopup(false);
    setCurrentRatingItem(null);
  };

  const getRowColor = (status, stars) => {
    if (status === 'Deactive') return 'bg-red-100';
    if (stars >= 4) return 'bg-green-100';
    if (stars >= 3) return 'bg-yellow-100';
    if (stars >= 1) return 'bg-orange-100';
    return 'bg-gray-50'; // For unrated (0 stars)
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      status: '1',
      orderNumber: '',
      title: '',
      key: '',
      icon: null
    });
    setShowAddModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      status: item.status === 'Active' ? '1' : '0',
      orderNumber: item.orderNo,
      title: item.title,
      key: item.key,
      icon: null
    });
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (editingItem) {
      // Update existing item
      setReviewData(reviewData.map(item => 
        item.id === editingItem.id 
          ? {
              ...item,
              orderNo: formData.orderNumber,
              title: formData.title,
              key: formData.key,
              status: formData.status === '1' ? 'Active' : 'Deactive'
            }
          : item
      ));
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        sn: String(reviewData.length + 1).padStart(2, '0'),
        orderNo: formData.orderNumber,
        title: formData.title,
        key: formData.key,
        status: formData.status === '1' ? 'Active' : 'Deactive',
        stars: 0, // Default to 0 stars for new items
        color: formData.status === '1' ? 'green' : 'red'
      };
      setReviewData([...reviewData, newItem]);
    }
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviewData(reviewData.filter(item => item.id !== id));
    }
  };

  const filteredData = reviewData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'} p-6`}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="bg-gray-100 p-4 border-b">
            <h1 className="text-2xl font-bold text-gray-800">Driver Review List</h1>
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
                <span>Add New</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">S N</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Order No.</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Icon</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Key</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, showEntries).map((item) => (
                  <tr key={item.id} className={`${getRowColor(item.status, item.stars)} border-b`}>
                    <td className="px-4 py-3 border text-sm font-medium">{item.sn}</td>
                    <td className="px-4 py-3 border text-sm">{item.orderNo}</td>
                    <td className="px-4 py-3 border">
                      {renderInteractiveStars(item)}
                    </td>
                    <td className="px-4 py-3 border text-sm font-medium">{item.title}</td>
                    <td className="px-4 py-3 border text-sm">{item.key}</td>
                    <td className="px-4 py-3 border">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === 'Active' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
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

        {/* Star Rating Popup */}
        {showRatingPopup && currentRatingItem && (
          <div 
            className="fixed z-50 rating-popup"
            style={{
              left: ratingPopupPosition.x - 100,
              top: ratingPopupPosition.y - 80,
            }}
            onMouseEnter={() => setShowRatingPopup(true)}
            onMouseLeave={() => {
              setShowRatingPopup(false);
              setCurrentRatingItem(null);
              setHoverRating(0);
            }}
          >
            <div className="bg-white rounded-lg shadow-lg border p-4 min-w-[200px]">
              <div className="text-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Rate Driver</h3>
                <p className="text-xs text-gray-500">{currentRatingItem.title}</p>
              </div>
              
              <div className="flex justify-center space-x-1 mb-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    size={20}
                    className={`cursor-pointer transition-colors ${
                      rating <= (hoverRating || tempRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                    onMouseEnter={() => setHoverRating(rating)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleStarClick(rating, currentRatingItem.id)}
                  />
                ))}
              </div>
              
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-2">
                  {hoverRating || tempRating === 1 && "Very Disappointing"}
                  {hoverRating || tempRating === 2 && "Disappointing"}
                  {hoverRating || tempRating === 3 && "Okay"}
                  {hoverRating || tempRating === 4 && "Good"}
                  {hoverRating || tempRating === 5 && "Outstanding"}
                </div>
                
                <button
                  onClick={() => {
                    setShowRatingPopup(false);
                    setCurrentRatingItem(null);
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            {/* Arrow pointing down */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{ top: '100%' }}
            >
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingItem ? 'Edit Driver Review' : 'Add Driver'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status (1= Active, 0= Deactive)
                  </label>
                  <input
                    type="text"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Number
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Key"
                      value={formData.key}
                      onChange={(e) => setFormData({...formData, key: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Plus className="absolute right-3 top-2.5 text-blue-500 cursor-pointer" size={16} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Icon
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
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

export default DriverReview;