import React, { useState, useEffect, useMemo, useCallback } from "react";
import { User, FileCheck, X, Clock, AlertTriangle, History, Car, Edit, Eye, Trash } from "lucide-react";
import Sidebar from "../Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import {useGetPassengerInfoQuery, useGetStateAndCitiesQuery, useUpdateAadharStatusMutation, useUpdateLicenseStatusMutation} from '../../Redux/Api'

// PersonalInfoTab Component - Updated with navigation logic
const PersonalInfoTab = ({
  isProfileVerified,
  setIsProfileVerified,
  data,
  handleOnClickReport,
  handleInputChange,
  selectedState,
  selectedCity,
  handleStateChange,
  handleCityChange,
  isSuspended,
  handleUnsuspend,
  handleSuspendClick,
  handleUpdate,
  showManageTripFields,
  handleManageTripToggle,
  formData,
  suspensionEndTime,
  countdown,
  suspensionReason,
  showSuspendModal,
  setShowSuspendModal,
  suspendReason,
  setSuspendReason,
  suspendType,
  setSuspendType,
  suspendDuration,
  setSuspendDuration,
  handleSuspendSubmit,
  showConfirmPermanent,
  setShowConfirmPermanent,
  handlePermanentSuspend,
  suspendReasons,
  durationOptions,
  hasChanges,
  cityData,
  handleClick,
  // Navigation handlers - updated
  handleFollowerClick,
  handleFollowingClick,
  handleMembershipClick,
  followersList,
  followingList,
  membershipList
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-6xl mx-auto">
      
      {/* Header section matching PDF */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your personal info passenger</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center">
              <span className={`text-sm ${isProfileVerified ? 'text-green-600' : 'text-gray-600'}`}>
                Verified profile [ 
              </span>
              <button 
                onClick={() => {
                  setIsProfileVerified(!isProfileVerified);
                  if (!isProfileVerified) {
                    alert("Passenger verified successfully");
                  }
                }}
                className={`mx-1 text-lg font-bold cursor-pointer ${
                  isProfileVerified ? 'text-green-500' : 'text-gray-400'
                }`}
              >
                ✓
              </button>
              <span className={`text-sm ${isProfileVerified ? 'text-green-600' : 'text-gray-600'}`}>
                ]
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Passenger Name */}
      <div className="mb-4">
        <h3 className="text-lg font-medium">{data?.firstName} {data?.lastName}</h3>
        <p className="text-gray-600 text-sm">Passenger</p>
      </div>
      
      {/* Top Status Bar - exact match to PDF */}
      <div className="grid grid-cols-6 gap-2 mb-6 text-xs">
        { 
        isProfileVerified === true?(
           <div className="bg-blue-500 text-white p-6 rounded text-center font-medium">
            <div className="text-l">Profile Verified </div>
          </div>
        )
        :(
          <div className="bg-yellow-400 text-black p-6 rounded text-center font-medium">
            <div className="text-l">Pending</div>
          </div>
        )
          }
          <div className="bg-orange-400 text-white p-2 rounded text-center font-medium">
            <div className="text-xs">Expire</div>
            <div className="text-lg font-bold">10</div>
          </div>
          <div className="bg-red-500 text-white p-2 rounded text-center font-medium">
            <div className="text-xs">Cancel</div>
            <div className="text-lg font-bold">15</div>
          </div>
          <div className="bg-green-500 text-white p-2 rounded text-center font-medium">
            <div className="text-xs">Complete</div>
            <div className="text-lg font-bold">28</div>
          </div>
          <div 
      className="bg-purple-500 text-white p-2 rounded text-center font-medium cursor-pointer hover:bg-purple-600 transition-colors" 
      onClick={handleClick}
    >
      <div className="text-xs">Other</div>
      <div className="text-lg font-bold">06</div>
    </div>
          <div className="bg-red-600 text-white p-2 rounded text-center font-medium">
            <div className="text-xs cursor-pointer"
            onClick={handleOnClickReport}
            >Report</div>
            <div className="text-lg font-bold">73</div>
          </div>
      </div>
      
      {/* Personal Information Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select 
            className="w-full p-3 border rounded-md bg-black text-white"
            value={data?.Gender}
            aria-readonly
            onChange={(e) => handleInputChange('gender', e.target.value)}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            value={data?.firstName}
            readOnly
            // onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter first name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            value={data?.lastName}
            readOnly
            // onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter last name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">D/O/B</label>
          <input 
            type="date" 
            className="w-full p-3 border rounded-md"
            value={data?.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Mobile Number</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            value={data?.phone}
            readOnly
            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
            placeholder="Enter mobile number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            className="w-full p-3 border rounded-md"
            placeholder="abc@gmail.com"
            value={data?.email}
            readOnly
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
        
        {/* State Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <select 
            className="w-full p-3 border rounded-md"
            value={data?.state}
            aria-readonly
            onChange={handleStateChange}
          >
            <option value="">Select State</option>
            {cityData && cityData?.state?.map((state) => (
              <option key={`state-${state._id}`} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* City Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <select 
            className="w-full p-3 border rounded-md"
            value={data?.city}
            aria-readonly
            onChange={handleCityChange}
            disabled={!selectedState}
          >
            <option value="">Select City</option>
            {selectedState && cityData?.state?.find(state => state.name === selectedState)?.cities?.map((city, index) => (
              <option key={`city-${selectedState}-${index}`} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        
        {/* <div>
          <label className="block text-sm font-medium mb-1">Pin</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            value={formData.pin}
            onChange={(e) => handleInputChange('pin', e.target.value)}
            placeholder="Enter PIN code"
          />
        </div> */}
      </div>
      
      {/* Address Field */}
      <div className="mb-6 mt-4">
        <label className="block text-sm font-medium mb-1">Address</label>
        <input 
          type="text" 
          className="w-full p-3 border rounded-md"
          value={data?.address}
          readOnly
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter address"
        />
      </div>

      {/* Action Buttons */}
      {/* <div className="grid grid-cols-6 gap-2 mb-4">
        <button className="bg-blue-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-600">
          Notification
        </button>
        <button className="bg-red-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-600">
          Delete Account
        </button>
        <button className="bg-orange-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-orange-600">
          Show Report
        </button>
        <button className="bg-purple-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-purple-600">
          Role Change
        </button>
        <button 
          onClick={isSuspended ? handleUnsuspend : handleSuspendClick}
          className="bg-yellow-500 text-black py-2 px-3 rounded text-sm font-medium hover:bg-yellow-600"
        >
          {isSuspended ? 'Unsuspend' : 'Suspended'}
        </button>
        
        Dynamic Update Button
        <button 
          onClick={handleUpdate}
          className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-200 ${
            hasChanges 
              ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer' 
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
          }`}
          disabled={!hasChanges}
        >
          Update
        </button>
      </div> */}

      {/* Navigation Fields Section - Updated to navigate to new pages */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-12">
        <div>
          <label className="block text-sm font-medium mb-1">Follower ({followersList.length})</label>
          <div 
            className="w-full p-3 border rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
            onClick={handleFollowerClick}
          >
            <span className="text-gray-700">View Followers</span>
            <svg 
              className="w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Following ({followingList.length})</label>
          <div 
            className="w-full p-3 border rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
            onClick={handleFollowingClick}
          >
            <span className="text-gray-700">View Following</span>
            <svg 
              className="w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Membership ({membershipList.length})</label>
          <div 
            className="w-full p-3 border rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
            onClick={handleMembershipClick}
          >
            <span className="text-gray-700">View Membership</span>
            <svg 
              className="w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">ManageTrip</label>
          <div 
            className="w-full p-3 border rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
            onClick={handleManageTripToggle}
          >
            <span className="text-gray-700">Manage Trip</span>
            <svg 
              className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${showManageTripFields ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div> */}

      {/* ManageTrip Expandable Fields */}
      {/* {showManageTripFields && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 mt-4 p-4 bg-gray-50 rounded-md border">
          <div>
            <label className="block text-sm font-medium mb-1">City Ride</label>
            <select 
              className="w-full p-3 border rounded-md"
              value={formData.cityRide}
              onChange={(e) => handleInputChange('cityRide', e.target.value)}
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Rental</label>
            <select 
              className="w-full p-3 border rounded-md"
              value={formData.rental}
              onChange={(e) => handleInputChange('rental', e.target.value)}
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">One Way Outstation</label>
            <select 
              className="w-full p-3 border rounded-md"
              value={formData.oneWayOutstation}
              onChange={(e) => handleInputChange('oneWayOutstation', e.target.value)}
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Outstation Round Trip</label>
            <select 
              className="w-full p-3 border rounded-md"
              value={formData.outstationRoundTrip}
              onChange={(e) => handleInputChange('outstationRoundTrip', e.target.value)}
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Carpool</label>
            <select 
              className="w-full p-3 border rounded-md"
              value={formData.carpool}
              onChange={(e) => handleInputChange('carpool', e.target.value)}
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>
      )} */}

      {/* Payment Details Section */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            placeholder="Payment Method"
            value={formData.paymentMethod}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bank Details / UPI</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            placeholder="Bank Name"
            value={formData.bankDetails}
            onChange={(e) => handleInputChange('bankDetails', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Account Number</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            placeholder="Account Number"
            value={formData.accountNumber}
            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">IFSC</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            placeholder="IFSC"
            value={formData.ifsc}
            onChange={(e) => handleInputChange('ifsc', e.target.value)}
          />
        </div> 
      </div> */}

      {/* Emergency Contact Section */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Emergency Contact</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            placeholder="Emergency Contact"
            value={formData.emergencyContact}
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">01</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            placeholder="01"
            value={formData.emergency01}
            onChange={(e) => handleInputChange('emergency01', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">02</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            placeholder="02"
            value={formData.emergency02}
            onChange={(e) => handleInputChange('emergency02', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">03</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            placeholder="03"
            value={formData.emergency03}
            onChange={(e) => handleInputChange('emergency03', e.target.value)}
          />
        </div>
      </div> */}

      {/* About You Section */}
      {/* <div className="mb-6">
        <label className="block text-sm font-medium mb-1">About you</label>
        <textarea 
          className="w-full p-3 border rounded-md h-24 resize-none bg-blue-50"
          placeholder="About you"
          value={formData.aboutYou}
          onChange={(e) => handleInputChange('aboutYou', e.target.value)}
        />
      </div> */}

      {/* Preferences Section */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <div className="flex items-center justify-between p-3 border rounded-md bg-white">
            <div>
              <div className="font-medium text-sm">Chattiness</div>
              <div className="text-blue-600 text-sm">I love chat</div>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between p-3 border rounded-md bg-white">
            <div>
              <div className="font-medium text-sm">Music</div>
              <div className="text-blue-600 text-sm">I love music</div>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between p-3 border rounded-md bg-white">
            <div>
              <div className="font-medium text-sm">Smoking</div>
              <div className="text-blue-600 text-sm">No smoking please</div>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between p-3 border rounded-md bg-white">
            <div>
              <div className="font-medium text-sm">Pets</div>
              <div className="text-blue-600 text-sm">Love pets</div>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </div>
      </div> */}

      {/* Suspension Cards - Shows when user is suspended */}
      {/* {isSuspended && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {suspensionEndTime ? (
            <div className="bg-white border-2 border-red-500 rounded-lg p-4">
              <div className="text-center">
                <div className="text-red-500 font-bold text-lg mb-2">!</div>
                <h3 className="text-red-600 font-semibold mb-2">Account Suspended</h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {countdown}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Your account has been temporarily suspended due to {suspensionReason.toLowerCase() || 'violation of our terms of service'}. Please contact support for more information
                </p>
                <button className="bg-red-500 text-white px-6 py-2 rounded text-sm font-medium">
                  Contact
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-red-500 rounded-lg p-4">
              <div className="text-center">
                <div className="text-red-500 font-bold text-lg mb-2">!</div>
                <h3 className="text-red-600 font-semibold mb-2">Account Suspended</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your account has been permanently suspended due to {suspensionReason.toLowerCase() || 'violation of our terms of service'}. Please contact support for more information
                </p>
                <button className="bg-red-500 text-white px-6 py-2 rounded text-sm font-medium">
                  Support
                </button>
              </div>
            </div>
          )}
        </div>
      )} */}

      {/* Verification Success Message */}
      {/* {isProfileVerified && (
        <div className="bg-orange-400 text-center p-3 rounded-md mb-4 text-white">
          Your profile has been verified
        </div>
      )} */}

      {/* Suspension Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Suspend Account</h3>
              <button 
                onClick={() => setShowSuspendModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Reason for Suspension</label>
                <select 
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="">Select a reason</option>
                  {suspendReasons.map((reason, index) => (
                    <option key={index} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Suspension Type</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      value="temporary" 
                      checked={suspendType === 'temporary'}
                      onChange={(e) => setSuspendType(e.target.value)}
                      className="mr-2"
                    />
                    <Clock size={16} className="mr-1" />
                    Temporary Suspension
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      value="permanent" 
                      checked={suspendType === 'permanent'}
                      onChange={(e) => setSuspendType(e.target.value)}
                      className="mr-2"
                    />
                    <AlertTriangle size={16} className="mr-1" />
                    Permanent Suspension
                  </label>
                </div>
              </div>
              
              {suspendType === 'temporary' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <select 
                    value={suspendDuration}
                    onChange={(e) => setSuspendDuration(e.target.value)}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select duration</option>
                    {durationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowSuspendModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSuspendSubmit}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  Suspend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmPermanent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Confirm Permanent Suspension</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to suspend this account permanently? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowConfirmPermanent(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePermanentSuspend}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  Suspend Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 


 // Vehicle Details Tab
  const VehicleDetailsTab = ({vehiclesList}) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Vehicle Details</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total Vehicles: <span className="font-semibold text-blue-600">{vehiclesList?.length}</span>
          </div>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Vehicle Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-700">Total Vehicles</h3>
          <p className="text-2xl font-bold text-blue-900">{vehiclesList?.length}</p>
        </div>
        {/* <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-700">Active Vehicles</h3>
          <p className="text-2xl font-bold text-green-900">
            {vehiclesList?.filter(v => v.status === 'Active').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-700">Inactive Vehicles</h3>
          <p className="text-2xl font-bold text-red-900">
            {vehiclesList?.filter(v => v.status === 'Inactive').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-700">Electric Vehicles</h3>
          <p className="text-2xl font-bold text-purple-900">
            {vehiclesList?.filter(v => v.fuel === 'Electric').length}
          </p>
        </div> */}
      </div>

      {/* Vehicle List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S. No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fuel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seat
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehiclesList?.map((vehicle, index) => (
              <tr key={vehicle?.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                    {
                      vehicle?.vehicleImages?.map((item)=>(
                        <img src={item}/>
                      ))
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{vehicle?.vehicleName}</div>
                    {/* <div className="text-sm text-gray-500">{vehicle?.modelYear}</div> */}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {vehicle?.modelYear}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {vehicle?.vehicleNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    vehicle?.fuel === 'Petrol' ? 'bg-blue-100 text-blue-800' :
                    vehicle?.fuel === 'Diesel' ? 'bg-yellow-100 text-yellow-800' :
                    vehicle?.fuel === 'Electric' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle?.fuel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle?.seat}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle?.dateTime}
                </td> */}
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    vehicle?.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle?.status}
                  </span>
                </td> */}
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                     <Edit size={14}/>
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Eye size={16}/>
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash  size={16}/>
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vehiclesList?.length === 0 && (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new vehicle.</p>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Add Vehicle
            </button>
          </div>
        </div>
      )}
    </div>
  );

const ViewPassenger = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   const { id } = useParams();
  const {data:passengerData,error:passengerError} =useGetPassengerInfoQuery(id);
  
  
 const [updateAadharStatus] = useUpdateAadharStatusMutation();
  const [updateDriverLicenseStatus] = useUpdateLicenseStatusMutation();



  console.log(passengerData,passengerError,"dkjfdhifkhdsjkdhs")
  
  // Mock data
  const [data] = useState({
    PassengerInfo: {
      firstName: "Akash Kumar",
      lastName: "Singh",
      phoneNumber: "9876543210",
      email: "akash.kumar@email.com",
      address: "123 Main Street, Sector 15",
      verified: true,
      userId: {
        profileImage: null,
        city: "Lucknow",
        state: "Uttar Pradesh"
      }
    },
    documents: {
      aadhar: {
        aadharNumber: "1234-5678-9012",
        aadharFront: null,
        aadharBack: null,
        aadharStatus: "Accepted"
      },
      verified: true,
      _id: "doc123"
    }
  });

  // Suspension state variables
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendType, setSuspendType] = useState('temporary');
  const [suspendDuration, setSuspendDuration] = useState('');
  const [showConfirmPermanent, setShowConfirmPermanent] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspensionEndTime, setSuspensionEndTime] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');

  // City/State related hooks
  const { data: cityData, isLoading, error } = useGetStateAndCitiesQuery();
  const [availableCities, setAvailableCities] = useState([]);

  // Navigation hook
  const navigate = useNavigate();

  // Verification state
  const [isProfileVerified, setIsProfileVerified] = useState(false);

  // Sample data for lists
  const [followersList] = useState([
    { id: 1, name: "Rahul Kumar", phone: "+91 9876543210", location: "Delhi", joinDate: "15 Jun 2024" },
    { id: 2, name: "Priya Sharma", phone: "+91 8765432109", location: "Mumbai", joinDate: "12 Jun 2024" },
    { id: 3, name: "Amit Singh", phone: "+91 7654321098", location: "Bangalore", joinDate: "10 Jun 2024" },
    { id: 4, name: "Sneha Patel", phone: "+91 6543210987", location: "Pune", joinDate: "08 Jun 2024" },
    { id: 5, name: "Vikash Gupta", phone: "+91 5432109876", location: "Chennai", joinDate: "05 Jun 2024" }
  ]);

  const [followingList] = useState([
    { id: 1, name: "Deepak Yadav", phone: "+91 9988776655", location: "Lucknow", joinDate: "20 Jun 2024" },
    { id: 2, name: "Anita Verma", phone: "+91 8877665544", location: "Jaipur", joinDate: "18 Jun 2024" },
    { id: 3, name: "Suresh Kumar", phone: "+91 7766554433", location: "Kolkata", joinDate: "16 Jun 2024" },
    { id: 4, name: "Kavita Singh", phone: "+91 6655443322", location: "Hyderabad", joinDate: "14 Jun 2024" }
  ]);

  const [membershipList] = useState([
    { id: 1, type: "Premium", startDate: "01 Jan 2024", endDate: "31 Dec 2024", status: "Active", amount: "₹2,999" },
    { id: 2, type: "Gold", startDate: "15 Mar 2023", endDate: "14 Mar 2024", status: "Expired", amount: "₹1,999" },
    { id: 3, type: "Silver", startDate: "10 Jun 2022", endDate: "09 Jun 2023", status: "Expired", amount: "₹999" }
  ]);

  // Sample vehicle data
  const [vehiclesList] = useState([
    { 
      id: 1, 
      name: "Maruti Swift", 
      number: "UP32AB1234", 
      fuel: "Petrol", 
      dateTime: "15 Jun 2024, 10:30 AM", 
      status: "Active",
      brand: "Maruti Suzuki",
      model: "Swift VXI",
      year: "2022"
    },
    { 
      id: 2, 
      name: "Honda City", 
      number: "UP32CD5678", 
      fuel: "Petrol", 
      dateTime: "10 Jun 2024, 02:15 PM", 
      status: "Active",
      brand: "Honda",
      model: "City ZX",
      year: "2023"
    },
    { 
      id: 3, 
      name: "Hyundai Creta", 
      number: "UP32EF9012", 
      fuel: "Diesel", 
      dateTime: "05 Jun 2024, 09:45 AM", 
      status: "Inactive",
      brand: "Hyundai",
      model: "Creta SX",
      year: "2021"
    },
    { 
      id: 4, 
      name: "Tata Nexon", 
      number: "UP32GH3456", 
      fuel: "Electric", 
      dateTime: "01 Jun 2024, 11:20 AM", 
      status: "Active",
      brand: "Tata",
      model: "Nexon EV",
      year: "2024"
    },
    { 
      id: 5, 
      name: "Toyota Innova", 
      number: "UP32IJ7890", 
      fuel: "Diesel", 
      dateTime: "28 May 2024, 03:30 PM", 
      status: "Active",
      brand: "Toyota",
      model: "Innova Crysta",
      year: "2020"
    }
  ]);

  // Initial form data को stable reference के साथ memoize करते हैं
  const initialFormData = useMemo(() => ({
    gender: "Male",
    firstName: data?.PassengerInfo?.firstName || "",
    lastName: data?.PassengerInfo?.lastName || "",
    email: data?.PassengerInfo?.email || "",
    dateOfBirth: "",
    mobileNumber: data?.PassengerInfo?.phoneNumber || "",
    state: data?.PassengerInfo?.userId?.state || "",
    city: data?.PassengerInfo?.userId?.city || "",
    pin: "",
    address: data?.PassengerInfo?.address || "",
    paymentMethod: "",
    bankDetails: "",
    accountNumber: "",
    ifsc: "",
    emergencyContact: "",
    emergency01: "",
    emergency02: "",
    emergency03: "",
    aboutYou: "",
    // ManageTrip fields
    cityRide: "inactive",
    rental: "inactive",
    oneWayOutstation: "inactive",
    outstationRoundTrip: "inactive",
    carpool: "inactive"
  }), [data]);

  // Current form data
  const [formData, setFormData] = useState(initialFormData);
  
  // State और city के लिए separate state variables
  const [selectedState, setSelectedState] = useState(data?.PassengerInfo?.userId?.state || "");
  const [selectedCity, setSelectedCity] = useState(data?.PassengerInfo?.userId?.city || "");

  // ManageTrip expand state
  const [showManageTripFields, setShowManageTripFields] = useState(false);

  // hasChanges को state नहीं, derived value बनाते हैं
  const hasChanges = useMemo(() => {
    const formChanged = Object.keys(formData).some(key => {
      return formData[key] !== initialFormData[key];
    });
    
    const stateChanged = selectedState !== (data?.PassengerInfo?.userId?.state || "");
    const cityChanged = selectedCity !== (data?.PassengerInfo?.userId?.city || "");
    
    return formChanged || stateChanged || cityChanged;
  }, [formData, selectedState, selectedCity, initialFormData, data]);

  // Initialize state and city from existing user data
  useEffect(() => {
    if (data?.PassengerInfo?.userId?.state && cityData && Array.isArray(cityData)) {
      const userState = data.PassengerInfo.userId.state;
      const stateObj = cityData.find(state => state.name === userState);

      if (stateObj) {
        setSelectedState(userState);
        setAvailableCities(stateObj.cities || []);
        
        if (data?.PassengerInfo?.userId?.city) {
          setSelectedCity(data.PassengerInfo.userId.city);
        }
      }
    }
  }, [data, cityData]);

  const suspendReasons = [
    "Violation of terms of service",
    "Inappropriate behavior with drivers",
    "Safety violations",
    "Multiple trip cancellations",
    "Payment issues",
    "Document verification issues",
    "Fraudulent activity",
    "Unprofessional conduct",
    "Other"
  ];

  const durationOptions = [
    { value: "1", label: "1 Hour" },
    { value: "6", label: "6 Hours" },
    { value: "24", label: "1 Day" },
    { value: "168", label: "1 Week" },
    { value: "720", label: "1 Month" }
  ];

  // Countdown timer effect
  useEffect(() => {
    if (suspensionEndTime && isSuspended) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = suspensionEndTime - now;

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          let countdownText = '';
          
          if (days > 0) {
            countdownText = `${days} DAY ${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes ${seconds.toString().padStart(2, '0')} seconds`;
          } else if (hours > 0) {
            countdownText = `${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes ${seconds.toString().padStart(2, '0')} seconds`;
          } else if (minutes > 0) {
            countdownText = `${minutes.toString().padStart(2, '0')} minutes ${seconds.toString().padStart(2, '0')} seconds`;
          } else {
            countdownText = `${seconds.toString().padStart(2, '0')} seconds`;
          }
          
          setCountdown(countdownText);
        } else {
          setCountdown('');
          setIsSuspended(false);
          setSuspensionEndTime(null);
          setSuspensionReason('');
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [suspensionEndTime, isSuspended]);

  // Handle input changes को useCallback से optimize करते हैं
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle state change को useCallback से optimize करते हैं
  const handleStateChange = useCallback((e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    setSelectedCity(""); 
    
    setFormData(prev => ({
      ...prev,
      state: stateName,
      city: ""
    }));
    
    if (stateName && cityData && Array.isArray(cityData)) {
      const stateObj = cityData.find(state => state.name === stateName);
      setAvailableCities(stateObj ? stateObj.cities : []);
    } else {
      setAvailableCities([]);
    }
  }, [cityData]);

  // Handle city change को useCallback से optimize करते हैं
  const handleCityChange = useCallback((e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    
    setFormData(prev => ({
      ...prev,
      city: cityName
    }));
  }, []);

  // Handle ManageTrip changes
  const handleManageTripToggle = useCallback(() => {
    setShowManageTripFields(prev => !prev);
  }, []);

  // Updated navigation handlers - now navigate to new pages
  const handleFollowerClick = useCallback(() => {
    navigate('/passenger/followers-list', {
      state: {
        followersList: followersList,
        passengerName: `${data.PassengerInfo.firstName} ${data.PassengerInfo.lastName}`
      }
    });
  }, [navigate, followersList, data]);

  const handleFollowingClick = useCallback(() => {
    navigate('/passenger/following-list', {
      state: {
        followingList: followingList,
        passengerName: `${data.PassengerInfo.firstName} ${data.PassengerInfo.lastName}`
      }
    });
  }, [navigate, followingList, data]);

  const handleMembershipClick = useCallback(() => {
    navigate('/passenger/membership-list', {
      state: {
        membershipList: membershipList,
        passengerName: `${data.PassengerInfo.firstName} ${data.PassengerInfo.lastName}`
      }
    });
  }, [navigate, membershipList, data]);

  // Other handlers
  const handleSuspendClick = useCallback(() => {
    setShowSuspendModal(true);
  }, []);

  const handleSuspendSubmit = useCallback(() => {
    if (!suspendReason) {
      alert('Please select a reason for suspension');
      return;
    }

    if (suspendType === 'temporary') {
      if (!suspendDuration) {
        alert('Please select suspension duration');
        return;
      }
      
      const hours = parseInt(suspendDuration);
      const endTime = new Date().getTime() + (hours * 60 * 60 * 1000);
      setSuspensionEndTime(endTime);
      setIsSuspended(true);
      setSuspensionReason(suspendReason);
      setShowSuspendModal(false);
      alert('Passenger suspended temporarily');
      
      setSuspendReason('');
      setSuspendDuration('');
    } else {
      setShowConfirmPermanent(true);
    }
  }, [suspendReason, suspendType, suspendDuration]);

  const handlePermanentSuspend = useCallback(() => {
    setIsSuspended(true);
    setSuspensionEndTime(null);
    setSuspensionReason(suspendReason);
    setShowSuspendModal(false);
    setShowConfirmPermanent(false);
    alert('Passenger suspended permanently');
    setSuspendReason('');
  }, [suspendReason]);

  const handleUnsuspend = useCallback(() => {
    setIsSuspended(false);
    setSuspensionEndTime(null);
    setCountdown('');
    setSuspensionReason('');
    alert('Passenger unsuspended successfully');
  }, []);

  const handleStatusChange = useCallback((docType, status, docId) => {
    console.log(`Updating ${docType} status to ${status} for doc ${docId}`);
    alert(`Document ${status.toLowerCase()} successfully`);
  }, []);

  // Handle form update
  const handleUpdate = useCallback(() => {
    if (hasChanges) {
      console.log('Updating passenger data:', {
        formData,
        selectedState,
        selectedCity,
        manageTripData: {
          cityRide: formData.cityRide,
          rental: formData.rental,
          oneWayOutstation: formData.oneWayOutstation,
          outstationRoundTrip: formData.outstationRoundTrip,
          carpool: formData.carpool
        }
      });
      alert('Passenger information updated successfully!');
    }
  }, [hasChanges, formData, selectedState, selectedCity]);

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "documents", label: "Documents", icon: FileCheck },
    // { id: "travel", label: "Travel History", icon: History },
    { id: "vehicles", label: "Vehicle Details", icon: Car },
  ];

  const handleClick = useCallback(() => {
    navigate('/other-services/view-as?serviceId=1&serviceName=Dinesh%20Kumar&category=Driver');
  }, [navigate]);

  const handleOnClickReport = useCallback((event) => {
    console.log(event);
    const id = event.nativeEvent.pointerId;
    console.log(id);
    
    navigate(`/report-list/${id}`, {
      state: {
        passengerData: data,
        passengerInfo: {
          id: id,
          name: `${data.PassengerInfo.firstName} ${data.PassengerInfo.lastName}`,
          phone: data.PassengerInfo.phoneNumber,
          email: data.PassengerInfo.email,
          city: data.PassengerInfo.userId.city,
          state: data.PassengerInfo.userId.state,
          verified: data.PassengerInfo.verified,
          documentStatus: data.documents.aadhar.aadharStatus
        }
      }
    });
  }, [navigate, data]);

  // Show loading or error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-4">Loading states and cities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-4 text-red-500">Error loading data: {error.message}</div>
      </div>
    );
  }

  // Documents Tab
  const DocumentsTab = ({documents}) => 
  {
     
    const DrivingLicenseStatusUpdate =async(status,docId)=>{
      const payload = {
        documentId: docId,
        status: status,
      };
      const {data,error} = await updateDriverLicenseStatus(payload);
      if(data){
        alert("status updated succesfully")
      }
 
    }
    const aadharStatusUpdate = async(status,docId)=>{
      const payload = {
        documentId: docId,
        status: status,
      };
      const {data,error} = await updateAadharStatus(data);
      if(data){
        alert("status updated succesfully")
      }
    }

    return(
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">DOCUMENT</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aadhar Card Section */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-lg font-medium">Aadhar Card</h3>
              <p className="text-gray-500">{documents?.aadhar?.aadharStatus}</p>
            </div>
            {/* <button className="bg-yellow-400 text-black px-4 py-1 rounded font-medium">
              UPLOAD
            </button> */}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-orange-200 p-6 rounded flex items-center justify-center text-white">
              <span>Front</span>
              <img src={documents?.aadhar?.aadharFront} style={{objectFit:"cover"}}/>
            </div>
            <div className="bg-orange-200 p-6 rounded flex items-center justify-center text-white">
              <span>Back</span>
              <img src={documents?.aadhar?.aadharBack} style={{objectFit:"cover"}}/>
            </div>
          </div>
           
          <div className="text-center mb-4">
            <p className="font-medium">Aadhar Number</p>
            <p className="text-lg">{documents?.aadhar?.aadharNumber || "9 8 7 6 - 5 4 3 2 - 1 9 8 7"}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              className={`py-2 rounded font-medium ${
                data?.documents?.aadhar?.aadharStatus === "Accepted" 
                  ? "bg-green-500 text-white" 
                  : "border border-green-500 text-green-500"
              }`}
              onClick={() => aadharStatusUpdate("Accepted", documents?._id)}
            >
              VERIFIED
            </button>
            <button 
              className={`py-2 rounded font-medium ${
                data?.documents?.aadhar?.aadharStatus === "Rejected" 
                  ? "bg-red-500 text-white" 
                  : "border border-red-500 text-red-600"
              }`}
              onClick={() => aadharStatusUpdate("Rejected",documents?._id)}
            >
              REJECT
            </button>
          </div>
        </div>

        {/* License Section */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-lg font-medium">License Verification</h3>
              <p className="text-gray-500">{documents?.drivingLicense?.drivingStatus}</p>
            </div>
            {/* <button className="bg-yellow-400 text-black px-4 py-1 rounded font-medium">
              UPLOAD
            </button> */}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-orange-200 p-6 rounded flex items-center justify-center text-white">
              {/* <span>Front</span> */}
              <img src={documents?.drivingLicense?.licenseFront}/>
            </div>
            <div className="bg-orange-200 p-6 rounded flex items-center justify-center text-white">
              <span>Back</span>
              <img src={documents?.drivingLicense?.licenseBack}/>
            </div>
          </div>
          
          <div className="text-center mb-4">
            <p className="font-medium">License Number</p>
            <p className="text-lg">{documents?.drivingLicense?.licenseNumber || "DL-0420110012345"}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              className={`py-2 rounded font-medium ${
                documents?.drivingLicense?.drivingStatus === "Accepted" 
                  ? "bg-green-500 text-white" 
                  : "border border-green-500 text-green-500"
              }`}
              onClick={() => DrivingLicenseStatusUpdate( "Accepted",documents?._id)}
            >
              VERIFIED
            </button>
            <button 
              className={`py-2 rounded font-medium ${
                documents?.drivingLicense?.drivingStatus === "Rejected" 
                  ? "bg-red-500 text-white" 
                  : "border border-red-500 text-red-600"
              }`}
              onClick={() => DrivingLicenseStatusUpdate("Rejected", documents?._id)}
            >
              REJECT
            </button>
          </div>
        </div>

        {/* Profile Image Section */}
        {/* <div className="bg-gray-100 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-lg font-medium">Profile Image</h3>
              <p className="text-gray-500">Pending</p>
            </div>
            <button className="bg-yellow-400 text-black px-4 py-1 rounded font-medium">
              UPLOAD
            </button>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="bg-orange-200 p-6 w-32 h-32 rounded flex items-center justify-center text-white">
              <span>Image</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-12">
            <button className="border border-green-500 text-green-500 py-2 rounded font-medium">
              VERIFIED
            </button>
            <button className="border border-red-500 text-red-600 py-2 rounded font-medium">
              REJECT
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
  }
  // Travel History Tab
  const TravelHistoryTab = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Travel History</h2>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">Lucknow to Delhi</h3>
              <p className="text-gray-500 text-sm">Driver: Amit Kumar</p>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Completed</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div>Date: 15 Jun 2024</div>
            <div>Amount: ₹450</div>
            <div>Rating: ⭐ 4.8</div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">Delhi to Gurgaon</h3>
              <p className="text-gray-500 text-sm">Driver: Rajesh Singh</p>
            </div>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Cancelled</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div>Date: 10 Jun 2024</div>
            <div>Amount: ₹280</div>
            <div>Rating: -</div>
          </div>
        </div>
      </div>
    </div>
  );

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
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Passenger Verification
              </h1>
              <p className="text-gray-600 mt-2">
                Review and verify passenger information and documents
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center px-4 py-2 rounded-md flex-1 ${
                    activeTab === id
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </button>
              ))}
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
              {activeTab === "personal" && (
                <PersonalInfoTab
                  vehiclesList={vehiclesList}
                  isProfileVerified={isProfileVerified}
                  setIsProfileVerified={setIsProfileVerified}
                  data={passengerData?.personalInfo}
                  handleOnClickReport={handleOnClickReport}
                  handleInputChange={handleInputChange}
                  selectedState={selectedState}
                  selectedCity={selectedCity}
                  handleStateChange={handleStateChange}
                  handleCityChange={handleCityChange}
                  isSuspended={isSuspended}
                  handleUnsuspend={handleUnsuspend}
                  handleSuspendClick={handleSuspendClick}
                  handleUpdate={handleUpdate}
                  showManageTripFields={showManageTripFields}
                  handleManageTripToggle={handleManageTripToggle}
                  formData={formData}
                  suspensionEndTime={suspensionEndTime}
                  countdown={countdown}
                  suspensionReason={suspensionReason}
                  showSuspendModal={showSuspendModal}
                  setShowSuspendModal={setShowSuspendModal}
                  suspendReason={suspendReason}
                  setSuspendReason={setSuspendReason}
                  suspendType={suspendType}
                  setSuspendType={setSuspendType}
                  suspendDuration={suspendDuration}
                  setSuspendDuration={setSuspendDuration}
                  handleSuspendSubmit={handleSuspendSubmit}
                  showConfirmPermanent={showConfirmPermanent}
                  setShowConfirmPermanent={setShowConfirmPermanent}
                  handlePermanentSuspend={handlePermanentSuspend}
                  suspendReasons={suspendReasons}
                  durationOptions={durationOptions}
                  hasChanges={hasChanges}
                  cityData={cityData}
                  handleClick={handleClick}
                  handleFollowerClick={handleFollowerClick}
                  handleFollowingClick={handleFollowingClick}
                  handleMembershipClick={handleMembershipClick}
                  followersList={followersList}
                  followingList={followingList}
                  membershipList={membershipList}
                />
              
              )}

              {activeTab === "documents" && <DocumentsTab documents={passengerData?.Documents} />}
              {/* {activeTab === "travel" && <TravelHistoryTab />} */}
              {activeTab === "vehicles" && <VehicleDetailsTab 
              vehiclesList={passengerData?.Vehicles}
              />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPassenger;