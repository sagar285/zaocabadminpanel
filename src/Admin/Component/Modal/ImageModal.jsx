import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageUrl, altText }) => {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
  }, [imageUrl, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-11/12 max-w-4xl max-h-[90vh] rounded-lg overflow-hidden bg-black/20">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          aria-label="Close image preview"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {loadError ? (
          <div className="flex flex-col items-center justify-center min-h-[240px] p-8 text-white text-center">
            <p className="text-lg font-medium mb-2">Image could not be loaded</p>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 underline break-all"
            >
              Open image in new tab
            </a>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={altText || 'Document image'}
            className="w-full max-h-[90vh] object-contain"
            onError={() => setLoadError(true)}
          />
        )}
      </div>
    </div>,
    document.body
  );
};

export default ImageModal;
