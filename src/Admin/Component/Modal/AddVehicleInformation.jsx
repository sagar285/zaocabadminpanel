import React from 'react'
import { useGetCategoriesQuery } from '../../Redux/Api';

const AddVehicleInformation = () => {
     const { data, error, loading } = useGetCategoriesQuery();
   
  return (
    <div>
      
    </div>
  )
}

export default AddVehicleInformation
