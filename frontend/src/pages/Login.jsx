import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {

    const handleChange = (e) => {
        setInput(...form)
    }

    const handleSubmit =(e) =>{
        e.preventDefault();
    }
  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-200'>

        <div className='flex flex-col bg-white w-[90%] sm:w-[80%] md:w-[60%] lg:w-[25%] border-2 border-blue-900 rounded-lg p-4 gap-5 shadow-lg'>

        <form onSubmit={handleSubmit} className='flex flex-col gap-8' >

            <div className="flex justify-center items-center ">
                <span className='text-3xl font-semibold text-blue-950'>Login</span>
            </div>

            

            <div className=" flex flex-col gap-2 ">

                <label htmlFor="fullname" className='text-xl'>Email:</label>
                <input type="email" className='border-2 border-solid rounded-lg p-2 w-full' placeholder='Enter your email'  required/>

            </div>

            <div className=" flex flex-col gap-2 ">

                <label htmlFor="fullname" className='text-xl'>Password:</label>
                <input type="text" className='border-2 border-solid rounded-lg p-2 w-full' placeholder='Enter your password' required/>

            </div>


            

            <div className=" flex flex-col  ">

                
                <button  type="submit" className='bg-blue-950 text-white p-3 text-xl rounded-xl font-medium cursor-pointer hover:text-blue-950 hover:bg-white hover:border-2 hover:border-blue-950'>Login</button>

            </div>

        </form>
            <div className="flex justify-center items-center ">
                <span className='text-base '>Don't have an accout ? <Link to="/signup" className="font-semibold text-blue-950 border-b-1 cursor-pointer">Register</Link> </span>
            </div>
        </div>
        

        


      
    </div>
  )
}

export default Signup
