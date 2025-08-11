import React, { useEffect, useState } from 'react';
import Sidebar from '../Component/Sidebar';
import { useAddpercentagecutMutation, useGetpercentagecutQuery } from '../Redux/Api';

const SelectPercentage = () => {
  const [debitPercentage, setDebitPercentage] = useState("");
  const [creditPercentage, setCreditPercentage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [percentageApi] = useAddpercentagecutMutation();
  const { data, error } = useGetpercentagecutQuery();

  const handleDebitChange = (e) => {
    // Allow any numeric input including decimals
    const value = e.target.value;
    if (value === '' || !isNaN(parseFloat(value))) {
      setDebitPercentage(value);
    }
  };

  console.log(data, "percentage data");

  useEffect(() => {
    setCreditPercentage(data?.percentage?.percentage)
    setDebitPercentage(data?.percentage?.debitpercentage)
  }, [data])

  const handleCreditChange = (e) => {
    // Allow any numeric input including decimals
    const value = e.target.value;
    if (value === '' || !isNaN(parseFloat(value))) {
      setCreditPercentage(value);
    }
  };

  const submitpercentage = async () => {
    try {
      const postdata = {
        percentage: parseFloat(creditPercentage),
        debitpercentage: parseFloat(debitPercentage)
      }
      const { data, error } = await percentageApi(postdata)
      console.log(data, error);
      if (data) {
        alert("percentage udpdated succesfully");
      }
    }
    catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='flex'>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={`flex-1 p-8 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Fee Percentage Configuration</h2>
          
          {/* Debit Percentage Input */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="debitPercentage" className="text-gray-700 font-medium">
                Debit Cut Percentage
              </label>
              <span className="text-blue-600 font-bold">{debitPercentage}%</span>
            </div>
            <input
              type="text"
              id="debitPercentage"
              value={debitPercentage ?? ""}
              onChange={handleDebitChange}
              placeholder="Enter debit percentage"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Credit Percentage Input */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="creditPercentage" className="text-gray-700 font-medium">
                Credit Cut Percentage
              </label>
              <span className="text-green-600 font-bold">{creditPercentage}%</span>
            </div>
            <input
              type="text"
              id="creditPercentage"
              value={creditPercentage ?? ""}
              onChange={handleCreditChange}
              placeholder="Enter credit percentage"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          {/* Save Button */}
          <button 
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            onClick={() => submitpercentage()}
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPercentage;