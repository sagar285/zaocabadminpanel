// src/features/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { data } from "autoprefixer";
// http://localhost:3000
// https://zaocabbackend.onrender.com
// https://api.zaocabs.in
// https://api.zaocabs.in/api'
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.zaocabs.in/api" }),
  tagTypes: ["user", "state", "category", "trip", "wallet", "Vehicle",'notification','feedback','carpoolSeat'],
  endpoints: (builder) => ({
    getDriver: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/driver/getAllDrivers",
      params: { page, limit },
      }),
    }),

    getDriverById: builder.query({
      query: (id) => ({
        url: `/driver/viewDriverInfo/${id}`,
      }),
    }),

    getTravelInfoById: builder.query({
      query: (id) => ({
        url: `/travel/getTravelInfo/${id}`,
      }),
    }),

    updateAadharStatus: builder.mutation({
      query: (data) => ({
        url: `/driver/updateAadharStatus`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user", "trip"],
    }),
    updateLicenseStatus: builder.mutation({
      query: (data) => ({
        url: `/driver/updateLicenseStatus`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user", "trip"],
    }),
    updatePoliceStatus: builder.mutation({
      query: (data) => ({
        url: `/driver/updatePoliceStatus`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user", "trip"],
    }),
    updateVehicleRcStatus: builder.mutation({
      query: (data) => ({
        url: `/driver/updateVehicleRcStatus`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user", "trip"],
    }),

    getStateAndCities: builder.query({
      query: () => ({
        url: "/state/get-all",
      }),
      providesTags: ["state"],
    }),

    addCityinState: builder.mutation({
      query: (data) => ({
        url: "/state/addcityinState",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["state"],
    }),

    getCategories: builder.query({
      query: () => ({
        url: "/category/getcategory",
      }),
      providesTags: ["category"],
    }),

    addCategory: builder.mutation({
      query: (data) => ({
        url: "/category/addCateogry",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),
    createVechileCategory:builder.mutation({
            query: (data) => ({
        url: "/category/createCategory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),


    


    getAllVehicleCategory:builder.query({
      query:()=>({

    
        url:'/category/getAllCategories'


      }),
      providesTags:["category"]
    }),




    deleteCategory:builder.mutation({
      query:(id)=>({
        url:`/category/deleteVechileCategories/${id}`,
        method:"DELETE"
      })
    })
,


editVechileCategory:builder.mutation({
  query:({id,data})=>({
      url:`/category/editVechileCategory/${id}`,
      method:"PUT",
      body:data,
  })
}),


    EditCategory: builder.mutation({
      query: ({id,data}) => ({
        url: `/category/editCateogry/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),
    getSubCategories: builder.query({
      query: (name) => ({
        url: `/category/getsubcategory/${name}`,
      }),
      providesTags: ["category"],
    }),

    addSubcategory: builder.mutation({
      query: (data) => ({
        url: "/category/addSubcategory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    addTripDetail: builder.mutation({
      query: (data) => ({
        url: "/trip/addTripDetailByAdmin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["trip"],
    }),

    addTripDetailInAdmin: builder.mutation({
      query: (data) => ({
        url: "/trip/addTripDetailByAdminInAdminTrip",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["trip"],
    }),

    getTrips: builder.query({
      query: () => ({
        url: "/trip/getAdminTrips",
      }),
      providesTags: ["trip"],
    }),
    getTripsAdminModel: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/trip/getAdminTripsFromAdminModel",
        params: { page, limit },
      }),
      providesTags: ["trip"],
    }),


    getAllTravel: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/travel/getAllTravelbyAdmin`,
        params: { page, limit }, // Pass pagination params
      }),
    }),

    getTripDetailsById: builder.query({
      query: (id) => ({
        url: `/trip/getTripDetailsById/${id}`,
      }),
      providesTags: ["trip"],
    }),

    getTripDetailsByIdFromAdminModel: builder.query({
      query: (id) => ({
        url: `/trip/getTripDetailsByIdFromAdminModel/${id}`,
      }),
      providesTags: ["trip"],
    }),

    updateTripwithStateCities: builder.mutation({
      query: (data) => ({
        url: `/trip/updateTripwithstateandCity/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["trip"],
    }),

    updateTripwithStateCitiesInAdminModel: builder.mutation({
      query: (data) => ({
        url: `/trip/updateTripwithstateandCityInAdminModel/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["trip"],
    }),

    addUserInfo: builder.mutation({
      query: (data) => ({
        url: "/user/adduserInfoByAdmin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    addUserProfilePicture: builder.mutation({
      query: (data) => ({
        url: "/user/uploadUserProfilePic",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    getUserTrips: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/trip/getTripsofuserByAdmin`,
        params: { page, limit }
      }),
      providesTags: ['trip'],
    }),

    getuserTripById: builder.query({
      query: (id) => ({
        url: `/trip/getUserTripByIdForAdmin/${id}`,
      }),
      providesTags: ["trip"],
    }),

    getAllCityofState: builder.query({
      query: (name) => ({
        url: `/state/get-all-city/${name}`,
      }),
      providesTags: ["state"],
    }),
    getCityofActiveState: builder.query({
      query: (data) => ({
        url: `/trip/get-city-active-state/${data?.id}/${data?.state}`,
      }),
      providesTags: ["state", "trip"],
    }),

    getCityofActiveStateFromAdminModel: builder.query({
      query: (data) => ({
        url: `/trip/get-city-active-state-admin-model/${data?.id}/${data?.state}`,
      }),
      providesTags: ["state", "trip"],
    }),

    updateCityofState: builder.mutation({
      query: (data) => ({
        url: `/trip/update-city-active-state`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["state", "trip"],
    }),

    updateCityofStateFromAdminModel: builder.mutation({
      query: (data) => ({
        url: `/trip/update-city-active-state-admin-model`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["state", "trip"],
    }),

    uploadAadharCard: builder.mutation({
      query: (data) => ({
        url: "/driver/upload-aadhar-card",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user", "trip"],
    }),
    uploadDriverLicense: builder.mutation({
      query: (data) => ({
        url: "/driver/upload-driver-license",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user", "trip"],
    }),
    uploadPoliceVerificationLicense: builder.mutation({
      query: (data) => ({
        url: "/driver/upload-police-verification",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user", "trip"],
    }),

    uploadVehicleRCLicense: builder.mutation({
      query: (data) => ({
        url: "/driver/upload-vehicle-rc",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user", "trip"],
    }),

    getWithdrawRequest: builder.query({
      query: () => ({
        url: "/wallet/getWithdrawRequestForAdmin",
      }),
      providesTags: ["wallet"],
    }),

    getTransactionInfo: builder.query({
      query: (id) => ({
        url: `/wallet/getTransaction/${id}`,
      }),
      providesTags: ["wallet"],
    }),

    updateTransactionStatus: builder.mutation({
      query: (data) => ({
        url: "/wallet/updateTransactionstatus",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["wallet"],
    }),
    EditTripDetail: builder.mutation({
      query: (data) => ({
        url: "/trip/EditTripDetailByAdminInAdminTrip",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["trip"],
    }),
    deleteTripByAdminInAdminTrip: builder.mutation({
      query: (id) => ({
        url: `/trip/deleteTripByAdminInAdminTrip/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["trip"],
    }),
    deleteCategoryByAdmin: builder.mutation({
      query: (id) => ({
        url: `/category/deleteCategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),

    updateCategoryByAdmin: builder.mutation({
      query: (data) => ({
        url: `/category/updateCategory`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    getVehicleById: builder.query({
      query: (id) => ({
        url: `/vehicle/getVehicleById/${id}`,
      }),
      providesTags: ["Vehicle"],
    }),

    updateSingleVehicleRcStatus: builder.mutation({
      query: (data) => ({
        url: `/vehicle/updateVehicleRcStatus`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Vehicle"],
    }),
    updateVehiclePermitStatus: builder.mutation({
      query: (data) => ({
        url: `/vehicle/updateVehiclePermitStatus`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Vehicle"],
    }),

    AdminsearchTrips: builder.query({
      query: (searchTerm) => ({
        url: "admin/trips/search",
        params: { search: searchTerm },
      }),
    }),
    UsersearchTrips: builder.query({
      query: (searchTerm) => ({
        url: "admin/userTrips/search",
        params: { search: searchTerm },
      }),
    }),

    CategorySearch: builder.query({
      query: (searchTerm) => ({
        url: "admin/searchCategory/search",
        params: { search: searchTerm },
      }),
    }),
    StateSearch: builder.query({
      query: (searchTerm) => ({
        url: "admin/searchState/search",
        params: { search: searchTerm },
      }),
    }),

    CityInState: builder.query({
      query: ({ name, searchTerm }) => ({
        url: `admin/searchCity/${name}`,
        params: {
          search: searchTerm,
        },
      }),
    }),

    VehicleSearch: builder.query({
      query: (searchTern) => ({
        url: "admin/searchVehicles/search",
        params: { search: searchTern },
      }),
    }),
    searchTravelDriver: builder.query({
      query: (searchTern) => ({
        url: "admin/searchTravelDriver/search",
        params: { search: searchTern },
      }),
    }),
   updateWalletAmount:builder.mutation({
    query: (data) => ({
    url: "/admin/updateWalletAmount",
    method: "PUT",
    body: data,
  })
  }),

   addwallet:builder.mutation({
    query: (data) => ({
    url: "/admin/addwallet",
    method: "POST",
    body: data,
  })
  }),

  getuserWalletInfo: builder.query({
    query: (id) => ({
      url: `/admin/getTransactionInfo/${id}`,
    }),
    providesTags: ["wallet"],
  }),


  DriverSearch: builder.query({
    query: (searchTern) => ({
      url: "admin/SearchDriver/search",
      params: { search: searchTern },
    }),
  }),
  TravelSearch: builder.query({
    query: (searchTern) => ({
      url: "admin/SearchTravels/search",
      params: { search: searchTern },
    }),
  }),

  CreateNotification: builder.mutation({
    query: (data) => ({
      url: "/notification/createNotification",
      method: "POST",
      body: data,
    }),
  }),
  CreateRoleNotification: builder.mutation({
    query: (data) => ({
      url: "/notification/notificationRoleBase",
      method: "POST",
      body: data,
    }),
  }),

  SingleUserNotification: builder.mutation({
    query: (data) => ({
      url: "/notification/scheduleSingleUserNotification",
      method: "POST",
      body: data,
    }),
  }),

  getNotification:builder.query({
    query: () => ({
      url: "/notification/getnotifications",
    }),
    providesTags: ["notification"],
  }),

  deletenotification:builder.mutation({
    query: (id) => ({
      url: `/notification/deletenotifications/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["notification"],
  }),

  verifiedDriverPersonalInfo: builder.mutation({
    query:(data)=>({
      url: "/admin/verifiedDriverPersonalInfo",
      method: "POST",
      body: data,
    })
  }),
  verifiedDocumentInfo: builder.mutation({
    query:(data)=>({
      url: "/admin/verifiedDocumentInfo",
      method: "POST",
      body: data,
    })
  }),
  verifiedVehicleInfo: builder.mutation({
    query:(data)=>({
      url: "/admin/verifiedVehicleInfo",
      method: "POST",
      body: data,
    })
  }),
  
  verifiedTravelPersonalInfo: builder.mutation({
    query:(data)=>({
      url: "/admin/verifiedTravelPersonalInfo",
      method: "POST",
      body: data,
    })
  }),

  updateVehicleInfo: builder.mutation({
    query: (data) => ({
      url: "/admin/updateVehicleInfo",
      method: "POST",
      body: data,
    })
  }),

  updateDriverInfo: builder.mutation({
    query: (data) => ({
      url: "/admin/updateDriverInfo",
      method: "POST",
      body: data,
    })
  }),
  updateTravelInfo: builder.mutation({
    query: (data) => ({
      url: "/admin/updateTravelInfo",
      method: "POST",
      body: data,
    })
  }),
  DeleteUser: builder.mutation({
    query: (data) => ({
      url: "/admin/deleteUser",
      method: "POST",
      body: data,
    })
  }),

  getDashboard: builder.query({
    query: () => ({
      url: "/admin/dashboard",
    }),
    providesTags: ["dashboard"],
  }),

  SuspendUser: builder.mutation({
    query: (data) => ({
      url: "/user/SuspendUser",
      method: "POST",
      body: data,
    })
  }),

  changeUserRole:builder.mutation({
    query: (data) => ({
      url: "/admin/changeUserRole",
      method: "POST",
      body: data,
    })
  }),

  getAllFeedback : builder.query({
    query: () => ({
      url: "/admin/getAllFeedback",
    }),
    providesTags: ["feedback"],
  }),

  getTripsByStatus: builder.query({
    query: ({ status, page = 1, limit = 10 }) => ({
      url: `/admin/getTrips/${status}?page=${page}&limit=${limit}`,
    }),
    providesTags: ["trip"],
  }),

  getVerifiedDrivers: builder.query({
    query: () => ({
      url: "/admin/getVerifiedDrivers",
    }),
  }),
  getVerifiedTravels: builder.query({
    query: () => ({
      url: "/admin/getVerifiedTravels",
    }),
  }),

  addpercentagecut:builder.mutation({
    query: (data) => ({
      url: "/wallet/addpercentagecut",
      method: "POST",
      body: data,
    })
  }),



  getpercentagecut:builder.query({
    query: () => ({
      url: "/wallet/getpercentagecut",
    }),
  }),
  createSeatConfig : builder.mutation({
    query:(data) => ({
      url:"/carpoolSeat/add-seat",
      method:"POST",
      body:data,
    }),
    invalidatesTags:["carpoolSeat"]
  }),

   getAllTransactions: builder.query({
      async queryFn() {
        return {
          data: [
            { id: 1, amount: 100, type: 'Credit', date: '2025-05-25' },
            { id: 2, amount: 200, type: 'Debit', date: '2025-05-26' },
          ],
        };
      },
    }),
      getPercentageTransactions: builder.query({
      async queryFn() {
        // Dummy transactions — internal use only
        const transactions = [
          { id: 1, amount: 100, type: 'Credit', date: '2025-05-25' },
          { id: 2, amount: 200, type: 'Debit', date: '2025-05-26' },
          { id: 3, amount: 150, type: 'Credit', date: '2025-05-27' },
        ];

        const total = transactions.length;
        const credit = transactions.filter(t => t.type === 'Credit');
        const debit = transactions.filter(t => t.type === 'Debit');

        const creditCount = credit.length;
        const debitCount = debit.length;

        const creditAmount = credit.reduce((sum, t) => sum + t.amount, 0);
        const debitAmount = debit.reduce((sum, t) => sum + t.amount, 0);
        const totalAmount = creditAmount + debitAmount;

        return {
          data: {
            totalTransactions: total,
            totalCredit: creditCount,
            totalDebit: debitCount,
            creditPercentage: total ? Math.round((creditCount / total) * 100) : 0,
            debitPercentage: total ? Math.round((debitCount / total) * 100) : 0,
            totalCreditAmount: creditAmount,
            totalDebitAmount: debitAmount,
            creditAmountPercentage: totalAmount ? Math.round((creditAmount / totalAmount) * 100) : 0,
            debitAmountPercentage: totalAmount ? Math.round((debitAmount / totalAmount) * 100) : 0,
          },
        };
      },
    }),


     ///Carpool quries

    addCarpoolBrandName:builder.mutation({
      query:(data)=>({
        url:"/carpool/addBrandName/",
        method:"POST",
        body:data,
      }),
          invalidatesTags:["carpoolBrand"]

    }),


    getAllCarpoolBrand: builder.query({
      query:()=>({
        url:"/carpool/getAllBrand"
      }),

    }),


    deleteCarpoolBrand:builder.mutation({
      query:(id)=>({
        url:`/carpool/deleteBrand/${id}`,
        method:"DELETE",
      })
    }),


  createCarpoolSeat:builder.mutation({

    query:(data)=>({
      url:'/carpool//add-seat',
      method:"POST",
      body:data
    })

  }),


  getallSeatCarpool:builder.query({
    query:(id)=>({
      url:'/carpool/getall-seat'
    })
  })
,




editCarpoolseat:builder.mutation({

  query:({id,data})=>({
    url:`/carpool/editCarpool/${id}`,
    method:"PUT",
    body:data,
  })
}),



//  deleteCarpoolBrand:builder.mutation({
//       query:(id)=>({
//         url:`/carpool/deleteBrand/${id}`,
//         method:"DELETE",
//       })
//     }),



deleteCarpoolseat:builder.mutation({
  query:(id)=>({
   url:`/carpool/deleteSeat/${id}`,
   method:"DELETE"
  })
}),


    updateCarpoolBrand:builder.mutation({
      query:(data)=>({
        url:`/carpool/updateBrand/${data.id}`,
        method:"PUT",
        body:data
      }),
      providesTags:["Update Brand"]
    }),

    addCarpoolVechile:builder.mutation({
      query:(data)=>({
        url:"/carpool/addVehicle",
        method:"POST",
        body:data
      })
    }),


    addCarpoolAddVechile:builder.mutation({
         query:(data)=>({
        url:"/carpool/addCarpool-vehicle",
        method:"POST",
        body:data
      }) 
    }),

    getAllCarpoolAddVechile:builder.query({
       query:()=>({
        url:'/carpool/getCarpool-addvehicle',

       }),
       providesTags:["Vehicle"]
    }),



    editCarpoolAddVechile:builder.mutation({
      query:({id,updateData})=>({
    
         url:`/carpool/editCarpool-addVehicle/${id}`,
         method:"PUT",
         body:updateData
      })
    }),


 deleteCarpoolAddVehicle:builder.mutation({
      query:(id)=>({
        url:`/carpool/deleteCarpool-add/${id}`,
        method:"DELETE"
      })
    }),


    getAllCarpoolVechile:builder.query({
       query:()=>({
        url:'/carpool/getvehicle',

       }),
       providesTags:["Vehicle"]
    }),

    editCarpoolVechile:builder.mutation({
      query:({id,updateData})=>({
    
         url:`/carpool/edit-vehicle/${id}`,
         method:"PUT",
         body:updateData
      })
    }),


    deleteCarpoolVehicle:builder.mutation({
      query:(id)=>({
        url:`/carpool/delete-vehicle/${id}`,
        method:"DELETE"
      })
    }),



   getVechilesByBrandName:builder.query({
    query:()=>({
      url:'/carpool/getVehiclesByBrandId/',

    }),
    providesTags:["Vehicle"]
   }),


   addCarpoolSeat:builder.mutation({
       query:(data)=>({
        url:"/carpoolSeat/addSeat",
        method:"POST",
        body:data
       })
   }),
  addCarpoolFuel:builder.mutation({
    query:(data)=>({
      url:"/carpool/addFuel",
      method:"POST",
      body:data,
    })
  }),
  getCarpoolFuel:builder.query({
    query:()=>({
      url:'/carpool/getAllFuels',
    }),
  }),
 updateCarpoolFuel: builder.mutation({
  query: ({ id, body }) => ({
    url: `/carpool/updateFuel/${id}`,
    method: "PUT",
    body: body,
  }),
  invalidatesTags:['CarpoolFuel']
}),
deleteCarpoolFuel: builder.mutation({
  query: (id) => ({
    url: `/carpool/deleteFuel/${id}`,
    method: "DELETE",
  }),
}),


addGeneralFuel:builder.mutation({
 
     query:(data)=>({
      url:"/generalFuelSeatYearColor/addFuel",
      method:"POST",
      body:data,
  })
}),

getAllGeneralFuel:builder.query({
  query:()=>({
      url:'/generalFuelSeatYearColor/getFuel',
      method:"GET"
    }),
}),

updateGeneralFuel:builder.mutation({
  query:({id,body})=>({
     url: `/generalFuelSeatYearColor/updateFuel/${id}`,
    method: "PUT",
    body: body,

  })
}),

deleteGeneralFuel:builder.mutation({
  query:(id)=>({
 query: (id) => ({
    url: `/generalFuelSeatYearColor/deleteFuel/${id}`,
    method: "DELETE",
  }),
  })
}),


///General Seat Management


addGeneralSeat:builder.mutation({
    query:(data)=>({
      url:"/generalFuelSeatYearColor/addSeat",
      method:"POST",
      body:data,
  })
})
,

getAllGenralSeat:builder.query({
  query:()=>({
url:'/generalFuelSeatYearColor/getAllSeat',
method:"GET",
  })
})
,

updateGeneralSeat:builder.mutation({
query:({id,data })=>({
  url:`/generalFuelSeatYearColor/updateSeat/${id}`,
  method:"PUT",
  body:data 

})
})
,

deleteGeneralSeat:builder.mutation({
query:({id})=>({
  url:`/generalFuelSeatYearColor/deleteSeat/${id}`,
  method:"DELETE"
})
}),


///General Color 
addGeneralColor:builder.mutation({
  query:(data)=>({
    url:'/generalFuelSeatYearColor/addColor',
    method:"POST",
    body:data
  })
}),


getAllGeneralColor:builder.query({
  query:()=>({
      url:'/generalFuelSeatYearColor/getAllColor',
      method:"GET"
  })
})

,

updateGeneralColor:builder.mutation({
  query:({id,data})=>({

    url:`/generalFuelSeatYearColor/updateColor/${id}`,
    method:'PUT',
    body:data
  })
}),

deleteGeneralColor:builder.mutation({
  query:({id})=>({
    url:`/generalFuelSeatYearColor/deleteColor/${id}`
  })
}),



///General Year management



addGeneralYear:builder.mutation({
  query:(data)=>({

    url:`/generalFuelSeatYearColor/addYear/`,
    method:"POST",
    body:data
  })
}),


getAllGeneralYear:builder.query({
  query:()=>({

    url:`/generalFuelSeatYearColor/getYear/`,
    method:"GET"
  })
}),


updateGeneralYear:builder.mutation({
  query:({id,data})=>({
    url:`/generalFuelSeatYearColor/updateYear/${id}`,
    method:"PUT",
    body:data
  })
}),


deleteGeneralYear:builder.mutation({
  query:(id)=>({

    url:`/generalFuelSeatYearColor/deleteYear/${id}`,
    method:"DELETE"

  })
})
,




  addCarpoolVechileColor:builder.mutation({
    query:(data)=>({
      url:'/carpool/addColors',
      method:"POST",
      body:data
    })
  }),

  getCarpoolColors:builder.query({
      query:()=>({
        url:"/carpool/getColors"
      })
    }),

   deleteCarpoolColor:builder.mutation({
     query:(id)=>({
      url:`/carpool/deleteColors/${id}`,
      method:"DELETE"
     }),
   }),




    addCarpoolYears:builder.mutation({
      query:(data)=>({
        url:'/carpool/addYears',
        method:"POST",
        body:data
      })
    }),


    getCarpoolYears:builder.query({
      query:()=>({
        url:'/carpool/getYears'
      })
    }),




    deleteCarpoolYear:builder.mutation({
      query:(id)=>({
        url:`/carpool/deleteYear/${id}`,
        method:"DELETE"
      })
    })
,

   updateCarpoolYear:builder.mutation({
    query:({id,data})=>({
     url:`/carpool/updateYear/${id}`,
     method:"PUT",
     body:data
    })
   }),


    getCarpoolSeats:builder.query({
      query:()=>({
        url:'/carpoolSeat/available-seats',
      })
    }),


    getAllCarpoolSeates:builder.query({
      query:()=>({
        url:'/carpool/getAllSeats/'
        
      })
    }),


/// Categoryaaaadvechile


createCategoryAddVechile:builder.mutation({
  query:(data)=>({
    url:'/category/createCategory-addVehcile',
    method:"POST",
    body:data
  })
}),


getCategoryAllVehicle:builder.query({
  query:()=>({
    url:'/category/getCategoryAddVechile',
    method:"GET"
  })
}),

getSingleCarpoolSeatConfig:builder.query({
  query:(id)=>({
    url:`/carpoolSeat/${id}`,
    method:"GET"
  })
}),


deleteCategoryAddVehicle:builder.mutation({
  query:(id)=>({
url:`/category/deleteCategoryAddVehicle/${id}`,
method:"DELETE"
  })
})
,

editCategoryAddVehicle:builder.mutation({
query:({id,updatedData })=>({
  url:`/category/editCategoryAddVehicle/${id}`,
  method:"PUT",
  body:updatedData
})
}),

UpdateSeatConfig:builder.mutation({
  query:(data)=>({
    url:`/carpoolSeat/update`,
    method:"POST",
    body:data
  })
}),


 deleteSeatConfig : builder.mutation({
  query:(data) =>({
    url:`/carpoolSeat/delete`,
    method:"DELETE",
    body:data
  })
 })
  }),
});
    
  


export const {
  useDeleteSeatConfigMutation,
  useUpdateSeatConfigMutation,
  useGetSingleCarpoolSeatConfigQuery,
  useCreateSeatConfigMutation,
  useGetpercentagecutQuery,
  useAddpercentagecutMutation,
  useGetVerifiedDriversQuery,
  useGetVerifiedTravelsQuery,
  useGetTripsByStatusQuery,
  useGetAllFeedbackQuery,
  useChangeUserRoleMutation,
  useSuspendUserMutation,
  useGetDashboardQuery,
  useCreateRoleNotificationMutation,
  useDeleteUserMutation,
  useUpdateTravelInfoMutation,
  useUpdateDriverInfoMutation,
  useSingleUserNotificationMutation,
  useUpdateVehicleInfoMutation,
  useUpdateCarpoolBrandMutation,
  useVerifiedDocumentInfoMutation,
  useVerifiedDriverPersonalInfoMutation,
  useVerifiedTravelPersonalInfoMutation,
  useVerifiedVehicleInfoMutation,
  useDeletenotificationMutation,
  useGetNotificationQuery,
  useCreateNotificationMutation,
  useEditCategoryMutation,
 useLazyDriverSearchQuery,
 useLazyTravelSearchQuery,
  useGetuserWalletInfoQuery,
  useAddwalletMutation,
  useAddGeneralFuelMutation,
  useGetAllGeneralFuelQuery,
  useUpdateGeneralFuelMutation,
  useDeleteGeneralFuelMutation,
  useAddGeneralSeatMutation,


useAddGeneralYearMutation,
useGetAllGeneralYearQuery,
useUpdateGeneralYearMutation,
useDeleteGeneralYearMutation,


  useAddGeneralColorMutation,
  useGetAllGeneralColorQuery,
  useUpdateGeneralColorMutation,
  useDeleteGeneralColorMutation,

  useGetAllGenralSeatQuery,
  useUpdateGeneralSeatMutation,
  useDeleteGeneralSeatMutation,
useUpdateWalletAmountMutation,
useCreateCategoryAddVechileMutation,
useGetCategoryAllVehicleQuery,
  useLazyVehicleSearchQuery,
  useLazySearchTravelDriverQuery,
  useLazyCityInStateQuery,
  useLazyStateSearchQuery,
  useCreateVechileCategoryMutation,
  useGetAllVehicleCategoryQuery,
  useLazyCategorySearchQuery,
  useLazyUsersearchTripsQuery,
  useLazyAdminsearchTripsQuery,
  useUpdateVehiclePermitStatusMutation,
  useUpdateSingleVehicleRcStatusMutation,
  useGetVehicleByIdQuery,
  useUpdateCategoryByAdminMutation,
  useDeleteCategoryByAdminMutation,
  useDeleteTripByAdminInAdminTripMutation,
  useEditTripDetailMutation,
  useUpdateTransactionStatusMutation,
  useGetTransactionInfoQuery,
  useGetWithdrawRequestQuery,
  useUploadVehicleRCLicenseMutation,
  useUploadPoliceVerificationLicenseMutation,
  useUploadDriverLicenseMutation,
  useUploadAadharCardMutation,
  useUpdateCityofStateFromAdminModelMutation,
  useGetCityofActiveStateFromAdminModelQuery,
  useUpdateTripwithStateCitiesInAdminModelMutation,
  useGetTripDetailsByIdFromAdminModelQuery,
  useGetTripsAdminModelQuery,
  useAddTripDetailInAdminMutation,
  useUpdateCityofStateMutation,
  useGetCityofActiveStateQuery,
  useCreateCarpoolSeatMutation,
  useGetallSeatCarpoolQuery,
  useEditCarpoolseatMutation,
  useDeleteCarpoolseatMutation,
  useGetAllCityofStateQuery,
  useGetuserTripByIdQuery,
  useGetUserTripsQuery,
  useGetTravelInfoByIdQuery,
  useAddUserProfilePictureMutation,
  useAddUserInfoMutation,
  useUpdateTripwithStateCitiesMutation,
  useGetTripDetailsByIdQuery,
  useGetAllTravelQuery,
  useGetTripsQuery,
  useAddTripDetailMutation,
  useAddSubcategoryMutation,
  useGetSubCategoriesQuery,
  useGetAllCarpoolSeatesQuery,
  useEditCategoryAddVehicleMutation,
  useAddCategoryMutation,
  useGetCategoriesQuery,
  useGetStateAndCitiesQuery,
  useGetDriverQuery,
  useGetDriverByIdQuery,
  useUpdateAadharStatusMutation,
  useUpdateLicenseStatusMutation,
  useUpdatePoliceStatusMutation,
  useUpdateVehicleRcStatusMutation,
  useAddCityinStateMutation,
  useDeleteCarpoolFuelMutation,
  useUpdateCarpoolFuelMutation,
  useDeleteCarpoolYearMutation,
  useUpdateCarpoolYearMutation,
  useDeleteCarpoolColorMutation,
  useDeleteCategoryAddVehicleMutation,
  useDeleteCategoryMutation,
  useEditVechileCategoryMutation,
  useEditCarpoolVechileMutation,
  useDeleteCarpoolVehicleMutation,
    useGetAllTransactionsQuery,
    useGetPercentageTransactionsQuery,
    useAddCarpoolBrandNameMutation,
    useGetAllCarpoolBrandQuery,
    useAddCarpoolVechileMutation,
    useGetAllCarpoolVechileQuery,
    useGetVechilesByBrandNameQuery,
    useAddCarpoolSeatMutation,
    useGetCarpoolFuelQuery,
    useAddCarpoolFuelMutation,
    useAddCarpoolVechileColorMutation,
    useGetCarpoolColorsQuery,
    useAddCarpoolYearsMutation,
    useGetCarpoolYearsQuery,
    useGetCarpoolSeatsQuery,
    useDeleteCarpoolBrandMutation,
    useAddCarpoolAddVechileMutation,
    useGetAllCarpoolAddVechileQuery,
    useEditCarpoolAddVechileMutation,
    useDeleteCarpoolAddVehicleMutation
} = apiSlice;
