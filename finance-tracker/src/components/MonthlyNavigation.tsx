import React from 'react';

const MonthlyNavigation = () => {
  return (
    <div className="flex justify-between items-center bg-gray-50 rounded-full p-1 mb-6 text-sm">
      <span className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-sm">Jan 2022</span>
      <span className="px-4 py-2 text-gray-600 font-medium">Dec 2021</span>
      <span className="px-4 py-2 text-gray-600 font-medium">Nov 2021</span>
      <span className="px-4 py-2 text-gray-600 font-medium">Oct 2021</span>
    </div>
  );
};

export default MonthlyNavigation; 