import React from 'react';

const Jobcard = ({ job }) => {
  if (!job) return null;

  return (
    <div className="flex flex-col justify-between bg-white rounded-2xl shadow-lg p-5 gap-4 transform hover:scale-105 transition-transform duration-300 h-full">

      {/* Job Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-950 truncate">{job.title}</h2>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {job.skillsRequired?.map((skill, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Job Info */}
      <div className="flex flex-col gap-1 mt-2 text-gray-700 text-sm">
        <span><span className="font-semibold text-gray-900">Company:</span> {job.company}</span>
        <span><span className="font-semibold text-gray-900">Location:</span> {job.location}</span>
        <span><span className="font-semibold text-gray-900">Type:</span> {job.jobType}</span>
        <span><span className="font-semibold text-gray-900">Salary:</span> {job.salaryRange || 'Not Disclosed'}</span>
      </div>

      {/* View Details Button */}
      <div className="mt-auto flex justify-center">
        <button className=" cursor-pointer w-full py-3 bg-blue-950 text-white font-semibold rounded-xl shadow-mdtransition">
          View More Details
        </button>
      </div>

    </div>
  );
};

export default Jobcard;
