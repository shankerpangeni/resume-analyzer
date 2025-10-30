import React, { useEffect } from 'react'
import Herosection from '../components/Herosection'
import Navbar from '../components/Navbar.jsx'
import Jobsection from '../components/Jobsection.jsx'

const Home = () => {
  
  return (
    <div className='flex flex-col items-center min-h-screen py-3 gap-5 bg-gray-200'>
        
        <Navbar />
        <Herosection />
        
        
      


    </div>
  )
}

export default Home
