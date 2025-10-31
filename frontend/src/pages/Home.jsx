import React, { useEffect } from 'react'
import Herosection from '../components/Herosection'
import Navbar from '../components/Navbar.jsx'

import Footer from '../components/Footer.jsx'

const Home = () => {
  useEffect(() => {
  document.title = "Home | JobHunt"; // 👈 set tab title dynamically
}, []);
  
  return (
    <div className='flex flex-col items-center min-h-screen py-3  gap-5 bg-gray-200'>
        
        <Navbar />
        <Herosection />
        <Footer />
        
        
      


    </div>
  )
}

export default Home
