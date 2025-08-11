import React from 'react';
import { X } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageUrl, altText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-11/12 max-w-4xl max-h-[90vh] rounded-lg overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        
        {/* Image */}
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default ImageModal;