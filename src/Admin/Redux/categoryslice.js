// src/app/categorySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  loading: false,
  error: null
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const newCategory = {
        id: Date.now(), // Simple ID generation
        ...action.payload,
        createdAt: new Date().toISOString()
      };
      state.categories.push(newCategory);
    },
    
    updateCategory: (state, action) => {
      const { id, ...updateData } = action.payload;
      const index = state.categories.findIndex(cat => cat.id === id);
      if (index !== -1) {
        state.categories[index] = {
          ...state.categories[index],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
      }
    },
    
    deleteCategory: (state, action) => {
      const id = action.payload;
      state.categories = state.categories.filter(cat => cat.id !== id);
    },
    
    clearAllCategories: (state) => {
      state.categories = [];
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  clearAllCategories,
  setLoading,
  setError,
  clearError
} = categorySlice.actions;

// Selectors
export const selectAllCategories = (state) => state.category.categories;
export const selectCategoryById = (state, id) => 
  state.category.categories.find(cat => cat.id === id);
export const selectCategoriesLoading = (state) => state.category.loading;
export const selectCategoriesError = (state) => state.category.error;
export const selectActiveCategoriesCount = (state) => 
  state.category.categories.filter(cat => cat.status === '1').length;

export default categorySlice.reducer;