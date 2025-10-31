import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Jobdetails from './pages/Jobdetails.jsx';


const App = () => {
  const router = createBrowserRouter([{
    path: '/login',
    element: <Login />
  },
  {path: '/signup',
   element: <Signup />
  },
  {path: '/',
   element: <Home />
  },
  {
    path: '/job/:id',
    element: <Jobdetails />
  }

])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
