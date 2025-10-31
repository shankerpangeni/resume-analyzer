import React, { use } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';

const Signup = () => {

    const[loading , setLoading] = useState(false);
    const[error , setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "SignUP | JobHunt"; // 👈 set tab title dynamically
        }, []);

    const [formData , setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        phoneNumber:"",
    });



    const handleChange = (e) => {

        setFormData({...formData , [e.target.name] : e.target.value } );
        
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setLoading(true);
        setError("");

        try {

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`, formData , {
                headers: {"Content-Type" : "application/json"},
                withCredentials: true,
            });

            if(res.data.success){
                alert('Register Successfully');
                navigate('/login');
            }
            else {
                setError( res.data.message || "Something went wrong");
            }

            


            
        } catch (error) {
            setError(error.response?.data?.message || "Request Failed.");
        }

        finally {
            setLoading(false);
        }
    }
  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-200'>

        <div className='flex flex-col bg-white w-[90%] sm:w-[80%] md:w-[60%] lg:w-[25%] border-2 border-blue-900 rounded-lg p-5 gap-3 shadow-lg'>

        <form onSubmit={handleSubmit} className='flex flex-col gap-3' >

            <div className="flex justify-center items-center ">
                <span className='text-3xl font-semibold text-blue-950'>Register</span>
            </div>

            <div className=" flex flex-col gap-2 ">

                <label htmlFor="fullname" className='text-xl'>FullName:</label>
                <input type="text" name="fullname" value={formData.fullname} 
                onChange={handleChange} className='border-2 border-solid rounded-lg p-2 w-full' placeholder='Enter your Full Name' required />

            </div>

            <div className=" flex flex-col gap-2 ">

                <label htmlFor="fullname" className='text-xl'>Email:</label>
                <input type="email" name="email" value={formData.email}
                onChange={handleChange} className='border-2 border-solid rounded-lg p-2 w-full' placeholder='Enter your email'  required/>

            </div>

            <div className=" flex flex-col gap-2 ">

                <label htmlFor="fullname" className='text-xl'>Password:</label>

                <input type="password" name='password' onChange={handleChange} value={formData.password} className='border-2 border-solid rounded-lg p-2 w-full' placeholder='Enter your password' required/>

            </div>


            <div className=" flex flex-col gap-2 ">

                <label htmlFor="fullname" className='text-xl'>Confirm Password:</label>

                <input type="password" className='border-2 border-solid rounded-lg p-2 w-full' placeholder='Confirm your password' required/>

            </div>


            <div className=" flex flex-col gap-2 ">

                <label htmlFor="fullname" className='text-xl'>Phone Number:</label>

                <input type="number" name='phoneNumber' onChange={handleChange} value={formData.phoneNumber} className='border-2 border-solid rounded-lg p-2 w-full' placeholder='Enter your phone Number'  required/>

            </div>

            <div className=" flex flex-col  ">

                
                <button  type="submit" className='bg-blue-950 text-white p-3 text-xl rounded-xl font-medium cursor-pointer hover:text-blue-950 hover:bg-white hover:border-2 hover:border-blue-950'>Register</button>

            </div>

            {error && 
            <div className="flex justify-center items-center ">
                <span className='text-base '>Already have an accout ? <Link to="/login" className="font-semibold text-blue-950 border-b cursor-pointer">Login</Link> </span>
            </div>
            }

        </form>
            <div className="flex justify-center items-center ">
                <span className='text-base '>Already have an accout ? <Link to="/login" className="font-semibold text-blue-950 border-b cursor-pointer">Login</Link> </span>
            </div>
        </div>
        

        


      
    </div>
  )
}

export default Signup
