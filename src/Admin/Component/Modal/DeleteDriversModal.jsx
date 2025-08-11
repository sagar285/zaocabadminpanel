import React from 'react';
import { X } from 'lucide-react';

const DeleteModal = ({ open, handleClose, handleDelete }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this item? 
          This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={handleClose} 
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;