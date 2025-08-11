import React, { useState } from "react";
import {
  CreditCard,
  Building2,
  Tag,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock3
} from "lucide-react";

// Demo data to match the PDF design
const transactionData = {
  transactions: {
    amount: 10,
    balanceTransaction: 9.5,
    type: "DEBIT",
    status: "PENDING",
    description: "Withdraw via UPI",
    withdrawalDetails: {
      method: "UPI"
    }
  },
  upiAccountDetails: {
    upiHolderName: "DFGHJK",
    upiphoneNumber: "",
    upiId: "JHU"
  }
};

const Transaction = () => {
  const [status, setStatus] = useState("PENDING");
  const [showReasonTooltip, setShowReasonTooltip] = useState(false);
  
  const data = transactionData;
  const { transactions, upiAccountDetails } = data;

  const handleUpdateTransactionStatus = (newStatus) => {
    console.log(`Status updated from ${status} to ${newStatus}`);
    setStatus(newStatus);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header - Transfer Amount */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Transfer Amount</h2>
              <span className="px-4 py-2 rounded text-sm font-bold bg-yellow-300 text-black">
                {status}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 mb-1">Total</p>
                <p className="text-xl font-semibold">10</p>
              </div>
              <div className="text-2xl font-bold">|</div>
              <div>
                <p className="text-gray-500 mb-1">Platform fee</p>
                <p className="text-xl font-semibold">0.5</p>
              </div>
              <div className="text-2xl font-bold">|</div>
              <div>
                <p className="text-gray-500 mb-1">Transfer</p>
                <p className="text-xl font-semibold">9.5</p>
              </div>
            </div>
          </div>

          {/* Transaction Information */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold mb-4">Transaction Information</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-500 mb-1">Type</p>
                <p className="text-lg font-semibold">DEBIT</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Balance Transaction</p>
                <p className="text-lg font-semibold">9.5</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 mb-1">Method</p>
                <p className="text-lg font-semibold">UPI</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Description</p>
                <p className="text-lg font-semibold">Withdraw via UPI</p>
              </div>
            </div>
          </div>

          {/* UPI Account Details */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold mb-4">UPI Account Details</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-500 mb-1">UPI Holder Name</p>
                <p className="text-lg font-semibold">DFGHJK</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">UPI Number</p>
                <p className="text-lg font-semibold">{upiAccountDetails?.upiphoneNumber || "—"}</p>
              </div>
            </div>
            
            <div>
              <p className="text-gray-500 mb-1">UPI ID</p>
              <p className="text-lg font-semibold">JHU</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 flex justify-center items-center gap-4 relative">
            <button
              onClick={() => handleUpdateTransactionStatus("SUCCESS")}
              className="px-6 py-3 rounded text-white font-bold bg-green-500 hover:bg-green-600"
            >
              SUCCESS
            </button>
            
            <div className="text-2xl font-bold">|</div>
            
            <div className="relative">
              <button
                onClick={() => handleUpdateTransactionStatus("REJECT")}
                className="px-6 py-3 rounded text-white font-bold bg-red-600 hover:bg-red-700"
                onMouseEnter={() => setShowReasonTooltip(true)}
                onMouseLeave={() => setShowReasonTooltip(false)}
              >
                REJECT
              </button>
              
              {showReasonTooltip && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-orange-400 text-white px-4 py-2 rounded">
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-400 rotate-45"></div>
                  With reason
                </div>
              )}
            </div>
            
            <div className="text-2xl font-bold">|</div>
            
            <button
              onClick={() => handleUpdateTransactionStatus("ON HOLD")}
              className="px-6 py-3 rounded text-black font-bold bg-yellow-400 hover:bg-yellow-500"
            >
              ON HOLD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;