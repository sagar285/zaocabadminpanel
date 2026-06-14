import React, { useState } from 'react';
import ImageModal from '../Modal/ImageModal';
import { resolveDocumentImageUrl } from '../../utils/documentImageUrl';

const DocumentImagePreview = ({ src, docType, label, className = '' }) => {
  const [selected, setSelected] = useState(null);
  const imageUrl = resolveDocumentImageUrl(src, docType);

  if (!imageUrl) {
    return (
      <div className="bg-orange-200 p-6 rounded flex items-center justify-center min-h-[120px] text-gray-600">
        {label || 'No image'}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setSelected({ url: imageUrl, alt: label || 'Document image' })
        }
        className={`bg-orange-200 p-2 rounded overflow-hidden min-h-[120px] w-full cursor-pointer hover:ring-2 hover:ring-blue-400 transition-shadow text-left ${className}`}
        aria-label={`View ${label || 'document'} image`}
      >
        <span className="block text-xs text-gray-600 mb-1">{label}</span>
        <img
          src={imageUrl}
          alt={label || 'Document'}
          className="w-full h-28 object-cover rounded pointer-events-none"
        />
      </button>

      <ImageModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        imageUrl={selected?.url}
        altText={selected?.alt}
      />
    </>
  );
};

export default DocumentImagePreview;
