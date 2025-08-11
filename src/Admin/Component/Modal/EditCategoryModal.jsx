import React, { useState, useEffect } from 'react';
import { DeleteIcon } from 'lucide-react';
import { baseUrl } from '../../Url/baseUrl';

const CategoryEditModal = ({ data, visible, closeModal, onConfirm }) => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [index, setIndex] = useState('');
  const [numberOfSheet, setNumberOfSheet] = useState(0);
  const [subcategories, setSubcategories] = useState([]);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  // Initialize state with existing data when modal opens
  useEffect(() => {
    if (data && visible) {
      setCategoryName(data?.categoryName || '');
      setDescription(data?.description || '');
      setIndex(data?.index || '');
      setNumberOfSheet(data?.NumberofSeats || 0);
      setSubcategories(data?.subcategory || []);
    }
  }, [data, visible]);

  const handleSubcategoryChange = (index, value) => {
    const newSubcategories = [...subcategories];
    newSubcategories[index] = value;
    setSubcategories(newSubcategories);
  };

  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, '']);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const updatedData = {
      categoryName,
      description,
      index,
      numberOfSheet,
      subcategories,
      logo: logoFile ,
      img: data?.categoryLogo,
      id:data?._id
    };
    onConfirm(updatedData);
    closeModal();
  };

    const url = `${baseUrl}/vehicleCategoryLogo/${data?.categoryLogo}`;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 h-4/5 w-full max-w-2xl rounded shadow-lg overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Index Number
            </label>
            <input
              type="text"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Sheets
            </label>
            <input
              type="number"
              value={numberOfSheet}
              min={0}
              onChange={(e) => setNumberOfSheet(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategories
            </label>
            {subcategories.map((sub, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={sub}
                  onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  onClick={() => setSubcategories(subcategories.filter((_, i) => i !== index))}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <DeleteIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddSubcategory}
              className="mt-2 bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
            >
              Add Subcategory
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
              <div className="mt-2">
                <img
                  src={logoPreview ? logoPreview : url}
                  alt="Logo Preview"
                  className="w-24 h-24 object-cover border rounded-md"
                />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            onClick={closeModal}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CategoryEditModal;