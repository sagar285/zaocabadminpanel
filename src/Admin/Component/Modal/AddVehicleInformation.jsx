import React from 'react'
import { useGetCategoriesQuery } from '../../Redux/Api';

const AddVehicleInformation = () => {
     const { data, error, loading } = useGetCategoriesQuery();
     console.log(data,"AddVehicleInformation")
  return (
    <div>
      
    </div>
  )
}

export default AddVehicleInformation
