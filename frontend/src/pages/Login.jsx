import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch } from 'react-redux';


const Signup = () => {

    const [error ,setError] = useState(null);
    const [formError ,setFormError] = useState({
        email:'',
        password: '',
    });
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData , setFormData] = useState({
        email: '',
        password: ''
    });

    

    useEffect(() => {
        document.title = "Login | JobHunt"; // 👈 set tab title dynamically
        }, []);


    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const validate = () => {
        if(!formData.email){
            setFormError((prev) => ({...prev, email: 'Email is required'}));
            return false;
        }

        else if(!formData.password){
            setFormError((prev) => ({...prev, password: 'Password is required'}));
            return false;
        }

        else if(formData.password.length < 8){
            setFormError((prev) => ({...prev, password: 'Password must be at least 8 characters long'}));
            return false;
        }
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setLoading(true);
        setError("");
      try {
        
        const res = await axios.post('http://localhost:8000/api/v1/user/login' , formData , { headers : {
            "Content-Type" : "application/json"
        }, withCredentials: true});

        if(res.data.success){
            alert('Login Succesfully');
            navigate('/')

        }

        else if (res.data.error){
            setError(res.data.message || 'Login Failed');
        }

      } catch (error) {

        const message =
                error.response?.data?.message ||
                error.message ||
                "Login failed due to a network error.";
            setError(message);
        
      }

      finally{
        setLoading(false);
      }
        

       
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
                <input type="email" name='email' value={formData.email} onChange={handleChange} className='border-2 border-solid rounded-lg p-2 w-full' placeholder='Enter your email'  required/>

            </div>

            <div className=" flex flex-col gap-2 ">

                <label htmlFor="fullname" className='text-xl'>Password:</label>
                <input type="password" name='password' value={formData.password} onChange={handleChange} className='border-2 border-solid rounded-lg p-2 w-full' placeholder='Enter your password' required/>

            </div>


            

            <div className=" flex flex-col  ">

                
                <button  type="submit" className='bg-blue-950 text-white p-3 text-xl rounded-xl font-medium border-2 border-blue-950 cursor-pointer hover:text-blue-950 hover:bg-white hover:border-2 hover:border-blue-950'>Login</button>

            </div>

        </form>
            {error && <div className="flex justify-center items-center ">
                <span className='text-md  text-red-600'>{error}</span>
            </div>
            }
            <div className="flex justify-center items-center ">
                <span className='text-base '>Don't have an accout ? <Link to="/signup" className="font-semibold text-blue-950 border-b cursor-pointer">Register</Link> </span>
            </div>
        </div>
        

        


      
    </div>
  )
}

export default Signup
