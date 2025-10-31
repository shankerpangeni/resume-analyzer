import React from 'react'
import { useParams } from 'react-router-dom';
import Navbar from './../components/Navbar';
import {useEffect} from 'react';

const Jobdetails = () => {
    const {id} = useParams();
    useEffect(() => {
      document.title = "JobDetails| JobHunt"; // 👈 set tab title dynamically
    }, []);
  return (
    <div>

        <Navbar />

        This is job details page for job id: {id}
      
    </div>
  )
}

export default Jobdetails;
