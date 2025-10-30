import React, { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Alert from './Alert' // Example icons from lucide-react

// Import the Sidebar component (we'll define this next)
import Sidebar from './Sidebar';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  // 1. State to manage the sidebar's open/close status
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('Successfully Logged In');
  const [failedMsg, setFailedMsg] = useState('Failed to Login');

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    <Alert isSuccess={isSuccess} successMsg={successMsg} failedMsg={failedMsg}/>
},[])

  return (
    <>
      <div className='flex w-full  justify-between sm:justify-around p-4 max-h-20 items-center border-b border-gray-200 shadow-md'>
        
        {/* Logo Section */}
        <div className="left-section flex items-center">
          <span className='text-xl sm:text-2xl lg:text-3xl font-bold text-blue-950'>Resume </span>
          <span className='text-xl  sm:text-2xl lg:text-3xl font-bold text-orange-800'>Analyzer</span>
        </div>

        {/* Regular Nav Links (Hidden on small screens) */}
        <div className="hidden lg:flex justify-between items-center lg:gap-8">
          <div className="link-list">
            <ul className='flex lg:gap-8 lg:text-xl font-medium '>
              <li className='cursor-pointer hover:text-blue-600 transition-colors'>Home</li>
              <li className='cursor-pointer hover:text-blue-600 transition-colors'>AboutUs</li>
              <li className='cursor-pointer hover:text-blue-600 transition-colors'>Contact Us</li>
            </ul>
          </div>

          {/* Login/Register Buttons (Hidden on small screens) */}
          <div className='flex'>
            {isAuthenticated ? (

              <Link to="/login">
              <button className='bg-red-900 text-white px-6 py-3 lg:text-xl rounded-xl  font-medium cursor-pointer hover:text-blue-950 hover:bg-white border border-blue-950 transition-all'>
                Logout
              </button>
            </Link>

            ) : (
              <>
              <Link to="/login">
              <button className='bg-blue-950 text-white px-6 py-3 lg:text-xl rounded-xl rounded-r-none font-medium cursor-pointer hover:text-blue-950 hover:bg-white border border-blue-950 transition-all'>
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className='text-blue-950 bg-white px-6 py-3 lg:text-xl rounded-xl rounded-l-none font-medium cursor-pointer hover:text-white hover:bg-blue-950 border border-blue-950 transition-all'>
                Register
              </button>
            </Link>
              </>)  }
          </div>
        </div>

        {/* Hamburger/Close Icon (Visible only on small screens) */}
        <div className='lg:hidden cursor-pointer' onClick={toggleSidebar}>
          {isSidebarOpen ? (
            <X size={30} className='text-blue-950' /> // Close icon when open
          ) : (
            <Menu size={30} className='text-blue-950' /> // Menu icon when closed
          )}
        </div>
      </div>
      
      {/* 2. Render the Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={toggleSidebar} auth={isAuthenticated} />
    </>
  );
};

export default Navbar;