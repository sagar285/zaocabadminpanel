import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Sidebar from '../Component/Sidebar';
import { useAddSubcategoryMutation, useGetSubCategoriesQuery } from '../Redux/Api';
import AddSubCategory from '../Component/AddSubCategory';


const SubCategory = () => {
    const 
    { categoryName } = useParams();
    console.log(categoryName);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [addSubcategory, setaddSubcategory] = useState(false);
    const {data,error} =useGetSubCategoriesQuery(categoryName);
    const [addSubcategoryApi] =useAddSubcategoryMutation();
   

    const onClose = ()=>{
        setaddSubcategory(false);
    }

    const onAddSubcategory =async (subcategory)=>{
        const postdata ={
            categoryName,
            subcategory
        }
         const {data,error} =await addSubcategoryApi(postdata)
         console.log(data,error,"response from addSubcategoryApi")
    }



  return (
    <div className="flex min-h-screen bg-gray-100">
   <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className={`flex-1 p-6 ${isSidebarOpen ? 'ml-64' : 'ml-20'} space-y-6`}>
      <div className="flex flex-row justify-between">
          <Link
            to="/"
            className="text-blue-500 hover:underline mb-4 inline-block"
          >
            &larr; Back to States
          </Link>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" 
            onClick={() => setaddSubcategory(true)}
          >
            Add Sub Category
          </button>
        </div>
      <div >
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
           Sub Category of  {categoryName}
          </h1>
          <div className="flex flex-wrap gap-4">
        
            {data?.subcategories.map((city, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded shadow hover:shadow-md transition w-48 text-center"
              >
                {city}
              </div>
            ))}
          </div>
        </div>
      </div>
      {addSubcategory && <AddSubCategory onClose={onClose} onAddSubcategory={onAddSubcategory}/>}
    </div>
  )
}

export default SubCategory
