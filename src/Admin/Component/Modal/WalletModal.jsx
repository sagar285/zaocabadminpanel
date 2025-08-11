import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";

const WalletModal = ({ driverName, currentAmount, onUpdate, openWalletModal, setOpenWalletModal }) => {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState('credit');

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = transactionType === 'credit' ? Number(amount) : Number(amount);
    onUpdate(finalAmount,transactionType, description);
    setDescription('');
    setAmount(0);
    setOpenWalletModal(false);
  };

  return (
    <>
      {/* Trigger Button - Always visible */}
     

      {/* Modal - Only visible when openWalletModal is true */}
      {openWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Update Wallet Balance</h2>
              <button
                onClick={() => setOpenWalletModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Transaction Type Tabs */}
              <div className="flex rounded-md overflow-hidden border border-gray-300">
                <button
                  type="button"
                  onClick={() => setTransactionType('credit')}
                  className={`flex-1 px-4 py-2 ${
                    transactionType === 'credit'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Credit
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('debit')}
                  className={`flex-1 px-4 py-2 ${
                    transactionType === 'debit'
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Debit
                </button>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver Name
                </label>
                <input
                  type="text"
                  value={driverName}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Amount
                </label>
                <input
                  type="text"
                  value={currentAmount}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter transaction description"
                  rows="3"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setOpenWalletModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md text-white ${
                    transactionType === 'credit'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Update Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletModal;