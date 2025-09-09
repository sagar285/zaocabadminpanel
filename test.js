// services/subscriptionApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }), // adjust if your backend prefix is different
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    // ✅ Create
    createSubscription: builder.mutation({
      query: (data) => ({
        url: "/subscription",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    // ✅ Get all
    getSubscriptions: builder.query({
      query: () => ({
        url: "/subscription",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    // ✅ Get one by ID
    getSubscriptionById: builder.query({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Subscription", id }],
    }),

    // ✅ Update
    updateSubscription: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subscription/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Subscription", id },
        "Subscription",
      ],
    }),

    // ✅ Delete
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionApi;
