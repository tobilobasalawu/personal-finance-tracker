import React from 'react';

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-4 px-4 py-3 bg-gray-800 text-white rounded-t-lg">
      <button className="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-lg font-semibold">Cash wallet</h1>
      <button className="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v.01M12 12v.01M12 18v.01" />
        </svg>
      </button>
    </div>
  );
};

export default Header; 