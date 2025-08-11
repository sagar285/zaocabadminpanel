import React, { useState } from 'react';
import { Search, Phone, Mail, MessageCircle, Clock, MapPin, CreditCard, User, Car, Shield, AlertCircle, CheckCircle, ArrowRight, Star, Download } from 'lucide-react';
import Sidebar from '../Component/Sidebar';

const ZaoCabSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  

  const supportCategories = [
    {
      id: 'booking',
      title: 'Booking & Rides',
      icon: <Car className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Help with bookings, cancellations, and ride issues'
    },
    {
      id: 'payment',
      title: 'Payment & Billing',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'Payment methods, bills, and refunds'
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: <User className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'Profile settings, account management'
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-red-500',
      description: 'Safety features, emergency help'
    },
    {
      id: 'driver',
      title: 'Driver Partner',
      icon: <Car className="w-6 h-6" />,
      color: 'bg-orange-500',
      description: 'For drivers: earnings, trips, requirements'
    },
    {
      id: 'technical',
      title: 'Technical Issues',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-gray-500',
      description: 'App problems, bugs, technical support'
    }
  ];

  const faqs = [
    {
      category: 'booking',
      question: 'How do I book a ride on ZaoCab?',
      answer: 'Open the ZaoCab app, enter your pickup and drop locations, select your preferred vehicle type, and tap "Book Now". You can track your driver in real-time once your ride is confirmed.'
    },
    {
      category: 'booking',
      question: 'Can I cancel my ride?',
      answer: 'Yes, you can cancel your ride before the driver arrives. Go to "My Rides" and select cancel. Note that cancellation charges may apply if cancelled after the driver has started coming to your location.'
    },
    {
      category: 'booking',
      question: 'How do I schedule a ride for later?',
      answer: 'While booking, tap on "Schedule Ride" and select your preferred date and time. ZaoCab will automatically assign a driver 15-30 minutes before your scheduled time.'
    },
    {
      category: 'payment',
      question: 'What payment methods are accepted?',
      answer: 'ZaoCab accepts cash, debit/credit cards, UPI, digital wallets like Paytm, PhonePe, and ZaoCab wallet. You can add multiple payment methods in the app.'
    },
    {
   category: 'payment',
      question: 'How do I get a refund?',
      answer: 'If youre eligible for a refund, it will be automatically processed to your original payment method within 5-7 business days. You can also contact our support team for assistance.'
    },
    


   {
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to "Profile" in the app menu, tap "Edit Profile", update your information, and save changes. You can update your name, phone number, email, and photo.'
    },
    {
      category: 'safety',
      question: 'What safety features does ZaoCab offer?',
      answer: 'ZaoCab offers 24/7 support, ride tracking, driver verification, emergency button, trip sharing with contacts, and ride recording for your safety.'
    },
    {
      category: 'driver',
      question: 'How do I become a ZaoCab driver?',
      answer: 'Download the ZaoCab Driver app, complete registration with required documents (license, vehicle papers, Aadhar), pass background verification, and start earning.'
    },
    {
      category: 'technical',
      question: 'The app is not working properly, what should I do?',
      answer: 'Try restarting the app, check your internet connection, and ensure you have the latest version installed. If issues persist, contact our technical support team.'
    }
  ];

  const contactOptions = [
    {
      title: '24/7 Phone Support',
      description: 'Call us anytime for immediate assistance',
      icon: <Phone className="w-6 h-6" />,
      action: '+91-9876543213',
      color: 'bg-blue-500',
      available: '24/7 Available'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: <MessageCircle className="w-6 h-6" />,
      action: 'Start Chat',
      color: 'bg-green-500',
      available: 'Online Now'
    },
    {
      title: 'Email Support',
      description: 'Send us your detailed query',
      icon: <Mail className="w-6 h-6" />,
      action: 'support@zaocab.com',
      color: 'bg-purple-500',
      available: 'Response in 2-4 hours'
    },
    {
      title: 'Emergency Help',
      description: 'For immediate safety concerns',
      icon: <AlertCircle className="w-6 h-6" />,
      action: 'Emergency: 100',
      color: 'bg-red-500',
      available: 'Police: 100 | Medical: 102'
    }
  ];

  const quickActions = [
    { title: 'Track My Ride', icon: <MapPin className="w-5 h-5" />, description: 'See real-time location of your ride' },
    { title: 'Trip History', icon: <Clock className="w-5 h-5" />, description: 'View all your past rides and receipts' },
    { title: 'Lost Item', icon: <AlertCircle className="w-5 h-5" />, description: 'Report something left in the vehicle' },
    { title: 'Rate Driver', icon: <Star className="w-5 h-5" />, description: 'Rate and review your trip experience' },
    { title: 'Download Invoice', icon: <Download className="w-5 h-5" />, description: 'Get tax invoice for your rides' },
    { title: 'Safety Report', icon: <Shield className="w-5 h-5" />, description: 'Report safety incidents or concerns' }
  ];

  const filteredFaqs = faqs.filter(faq => 
    (selectedCategory === 'all' || faq.category === selectedCategory) &&
    (searchQuery === '' || 
     faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen max-w-max  bg-gray-50">

      <Sidebar
                                isSidebarOpen={isSidebarOpen}
                                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                              />
      {/* Header */}
  <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'} p-6`}>
        <div className="max-w-4xl  px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">ZaoCab Support Center</h1>
            <p className="text-xl opacity-90 mb-8">How can we help you today?</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help topics, FAQs, or solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Contact Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Get Immediate Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className={`${option.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  {option.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                <p className="font-medium text-blue-600 mb-2">{option.action}</p>
                <p className="text-xs text-green-600">{option.available}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer flex items-center">
                <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Support Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportCategories.map((category) => (
              <div 
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer ${
                  selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className={`${category.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            ))}
          </div>
          
          {/* Clear Filter */}
          {selectedCategory !== 'all' && (
            <div className="text-center mt-4">
              <button 
                onClick={() => setSelectedCategory('all')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Categories
              </button>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Frequently Asked Questions
            {filteredFaqs.length > 0 && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({filteredFaqs.length} results)
              </span>
            )}
          </h2>
          
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No FAQs found for your search. Try different keywords or browse categories above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full text-left p-6 hover:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 pr-4">{faq.question}</h3>
                      <div className={`transform transition-transform ${expandedFaq === index ? 'rotate-90' : ''}`}>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <div className="border-t pt-4">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* App Download Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Download ZaoCab App</h2>
          <p className="text-lg opacity-90 mb-6">Get the latest features and book rides on the go</p>
          <div className="flex justify-center space-x-4">
            <div className="bg-black rounded-lg px-6 py-3 cursor-pointer hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📱</div>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </div>
            </div>
            <div className="bg-black rounded-lg px-6 py-3 cursor-pointer hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📱</div>
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-4">Still need help? Our support team is available 24/7</p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600">Terms of Service</a>
            <a href="#" className="hover:text-blue-600">Refund Policy</a>
            <a href="#" className="hover:text-blue-600">Safety Guidelines</a>
          </div>
          <p className="mt-4 text-sm">© 2024 ZaoCab. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};

export default ZaoCabSupport;