import React from 'react';

interface SummaryProps {
  income: number;
  expenses: number;
}

const Summary: React.FC<SummaryProps> = ({ income, expenses }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg flex-1 mr-2">
        <div className="text-green-600 p-2 bg-green-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-500">Income</p>
          <p className="text-lg font-semibold text-green-700">₹{income}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 bg-red-50 p-3 rounded-lg flex-1 ml-2">
        <div className="text-red-600 p-2 bg-red-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-500">Expenses</p>
          <p className="text-lg font-semibold text-red-700">₹{expenses}</p>
        </div>
      </div>
    </div>
  );
};

export default Summary; 