// // src/app/store.js
// import { configureStore } from '@reduxjs/toolkit';
// import { apiSlice } from './Api';

// export const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(apiSlice.middleware),
// });




// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './Api';
import categoryReducer from './categoryslice'; // Add this import

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    category: categoryReducer, // Add category slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
}); 