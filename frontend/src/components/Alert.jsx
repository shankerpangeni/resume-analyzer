import React, { useEffect } from 'react';

const Alert = ({ isSuccess, successMsg, failedMsg, onClose }) => {
  useEffect(() => {
    // Automatically close the alert after 3 seconds
    const timeout = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);

    // Cleanup the timeout on unmount
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className={`${
        isSuccess ? 'bg-green-700' : 'bg-red-800'
      } text-white text-xl font-medium absolute top-5 left-1/2 transform -translate-x-1/2 text-center px-4 py-2 rounded-lg shadow-lg w-[250px]`}
    >
      <p>{isSuccess ? successMsg : failedMsg}</p>
    </div>
  );
};

export default Alert;
