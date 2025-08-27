// packageApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const packageApi = createApi({
  reducerPath: "packageApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }), // adjust baseUrl if needed
  tagTypes: ["package"],
  endpoints: (builder) => ({
    
    // Get all packages
    getPackages: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/package",
        params: { page, limit },
      }),
      providesTags: ["package"],
    }),

    // Add new package
    addPackage: builder.mutation({
      query: (data) => ({
        url: "/package/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["package"],
    }),

    // Edit package
    editPackage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/package/edit?id=${id}`, // if backend expects id as query
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["package"],
    }),

    // Delete package
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/package/delete?id=${id}`, // if backend expects id as query
        method: "DELETE",
      }),
      invalidatesTags: ["package"],
    }),

  }),
});

export const {
  useGetPackagesQuery,
  useAddPackageMutation,
  useEditPackageMutation,
  useDeletePackageMutation,
} = packageApi;
