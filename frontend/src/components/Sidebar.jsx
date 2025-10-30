// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    // Outer div for the backdrop and main sidebar container
    <div className={`fixed inset-0 z-40 transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* Backdrop (Click to close) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50" 
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar Content */}
      <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl p-6 flex flex-col space-y-6">
        
        {/* Close button (Optional, as backdrop handles close) */}
        <button onClick={closeSidebar} className="self-end text-blue-950 text-xl font-bold">
          &times;
        </button>
        
        {/* Sidebar Nav Links */}
        <ul className='flex flex-col space-y-4 text-xl font-medium'>
          <li className='cursor-pointer hover:text-blue-600' onClick={closeSidebar}>Home</li>
          <li className='cursor-pointer hover:text-blue-600' onClick={closeSidebar}>AboutUs</li>
          <li className='cursor-pointer hover:text-blue-600' onClick={closeSidebar}>Contact Us</li>
        </ul>

        {/* Login/Register Buttons for Sidebar */}
        <div className='flex flex-col space-y-2 mt-4 pt-4 border-t'>
          <Link to="/login" onClick={closeSidebar}>
            <button className='w-full bg-blue-950 text-white px-6 py-3 text-lg rounded-xl font-medium hover:bg-blue-700 transition-colors'>
              Login
            </button>
          </Link>
          <Link to="/signup" onClick={closeSidebar}>
            <button className='w-full text-blue-950 bg-white px-6 py-3 text-lg rounded-xl font-medium border border-blue-950 hover:bg-gray-100 transition-colors'>
              Register
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;