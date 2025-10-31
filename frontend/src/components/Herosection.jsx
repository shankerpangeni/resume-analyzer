import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Jobsection from './Jobsection.jsx';

const Herosection = () => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/job/all`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        if (res.data.success) {
          setAllJobs(res.data.jobs);
        } else {
          setError(res.data.message || 'Failed to fetch jobs.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // 📁 Trigger file picker
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // 📄 Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const shortName =
        file.name.length > 9 ? file.name.slice(0, 9) + '...pdf' : file.name;
      setFileName(shortName);
    } else {
      setFileName('');
    }
  };

  // 🔍 Upload resume and get recommended jobs
  const handleRecommendation = async () => {
    if (!fileInputRef.current.files[0]) {
      return alert('Please upload a PDF first!');
    }

    setLoading(true);
    setError(null);
    setRecommendedJobs([]);

    try {
      const formData = new FormData();
      formData.append('resume', fileInputRef.current.files[0]);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/resume/upload`, // backend endpoint
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setRecommendedJobs(res.data.recommendedJobs);
      } else {
        setError(res.data.message || 'Failed to get recommendations.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Error uploading resume.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-[90%] md:w-[85%] lg:w-[60%] min-h-auto p-2 gap-6">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-xl sm:text-2xl lg:text-3xl text-blue-950 font-bold">
          Resume Analyzer
        </h1>
        <span className="text-sm sm:text-2xl lg:text-3xl text-black font-medium">
          Upload Resume PDF to Get Job Recommendations
        </span>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />

        <div className="flex flex-row items-center gap-3">
          <button
            className="bg-blue-950 text-white md:font-bold px-3 md:px-8 py-4 text-md sm:text-lg font-medium lg:text-3xl rounded-xl cursor-pointer hover:bg-red-900"
            onClick={handleButtonClick}
          >
            {fileName ? fileName : 'Upload PDF'}
          </button>

          <button
            className={`${
              fileName ? 'block' : 'hidden'
            } ${loading ? 'bg-red-600' : 'bg-green-700'} text-white md:font-bold px-3 md:px-8 py-4 text-md sm:text-lg font-medium lg:text-3xl rounded-xl cursor-pointer hover:bg-red-900 `}
            onClick={handleRecommendation}
          >
            {loading ? 'Analyzing...' : 'Get Recommendations'}
          </button>
        </div>

        <span className="text-gray-600 text-base">*Files should be in PDF</span>
        {loading && <p className="text-blue-700">Loading...</p>}
        {error && <p className="text-red-700">{error}</p>}
      </div>

      {/* 🔹 Recommended Jobs */}
      {recommendedJobs.length > 0 && (
        <div className="w-full mt-8">
          <h2 className="text-2xl text-blue-950 font-semibold mb-4">
            
          </h2>
          <Jobsection jobs={recommendedJobs} name="Recommended Jobs for You" />
        </div>
      )}

      {/* 🔹 All Jobs */}
      <div className="w-full mt-8">

        <Jobsection jobs={allJobs} name="Top Jobs" />
      </div>
    </div>
  );
};

export default Herosection;
