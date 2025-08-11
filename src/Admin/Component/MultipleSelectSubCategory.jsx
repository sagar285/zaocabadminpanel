import React, { useState } from 'react';
import { Check } from "lucide-react";

const MultiSelectSubCategory = ({ 
  selectedSubCategories = [], 
  subcategories = [],
  disabled = false,
  onChange = () => {},
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubcategory = (subcategory) => {
    const updatedSelection = selectedSubCategories.includes(subcategory)
      ? selectedSubCategories.filter(item => item !== subcategory)
      : [...selectedSubCategories, subcategory];
    onChange(updatedSelection);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2 text-left bg-white/90 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
      >
        {selectedSubCategories.length === 0 ? (
          <span className="text-gray-500">Select</span>
        ) : (
          <span className="truncate">
            {selectedSubCategories.join(', ')}
          </span>
        )}
      </button>
      
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-gray-200 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {subcategories.map((subcategory) => (
            <div
              key={subcategory}
              onClick={() => toggleSubcategory(subcategory)}
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-white"
            >
              <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${
                selectedSubCategories.includes(subcategory) 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-300'
              }`}>
                {selectedSubCategories.includes(subcategory) && (
                  <Check className="w-3 h-3 text-black" />
                )}
              </div>
              {subcategory}
            </div>
          ))}
        </div>
      )}
      
      {/* {selectedSubCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSubCategories.map((selected) => (
            <span
              key={selected}
              className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800"
            >
              {selected}
              <button
                type="button"
                onClick={() => toggleSubcategory(selected)}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default MultiSelectSubCategory;
