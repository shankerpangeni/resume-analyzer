import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

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
  }])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
