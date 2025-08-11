import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const AddWalletModal = ({driverName, onAdd, openAddModal, setOpenAddModal }) => {

  const [amount, setAmount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(Number(amount));
    setAmount(0);
    setOpenAddModal(false);
  };

  return (
    <>
      {/* Trigger Button - Always visible */}
    

      {/* Modal - Only visible when openAddModal is true */}
      {openAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Wallet</h2>
              <button
                onClick={() => setOpenAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={driverName}
               disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter initial amount"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setOpenAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600"
                >
                  Add Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddWalletModal;