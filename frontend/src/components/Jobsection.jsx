
import Jobcard from './Jobcard.jsx';
import { useState } from 'react';

const Jobsection = ({ jobs , name }) => {
    
    
    
  return (
    <div className='flex flex-col justify-center gap-4'>
      <div className="flex justify-center items-center">
        <span className='text-3xl font-semibold text-blue-950 border-b-2'>{name || 'Top Jobs'}</span>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4'>
        {jobs && jobs.map((job, index) => (
          <Jobcard key={index} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Jobsection;
