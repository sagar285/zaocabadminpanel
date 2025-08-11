import React,{useState} from 'react'
import Sidebar from '../Component/Sidebar'

const NoFound = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div>
        <Sidebar
           isSidebarOpen={isSidebarOpen} 
           toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
      <h2 className='flex justify-center self-center'>SORYY, WE ARE WORKING ON THIS PAGE , VERY SOON AVAILABLE</h2>
    </div>
  )
}

export default NoFound
