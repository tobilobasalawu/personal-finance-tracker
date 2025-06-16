import React from 'react';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm transform transition-all duration-300 ease-out sm:scale-100 opacity-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-100 rounded-full p-4 mb-3">
            {/* Money icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Income</h2>
        </div>
        <div className="mb-4">
          <label htmlFor="transaction-name" className="sr-only">Transaction name</label>
          <input
            type="text"
            id="transaction-name"
            placeholder="Transaction name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="sr-only">Amount</label>
          <input
            type="number"
            id="amount"
            placeholder="Amount"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800"
          />
        </div>
        <div className="mb-6 flex items-center">
          <label htmlFor="date" className="sr-only">Date</label>
          <input
            type="date"
            id="date"
            defaultValue="2022-01-10" // Example default value
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800 mr-2"
          />
          {/* Calendar icon - using a placeholder as type="date" often provides its own calendar icon */}
        </div>
        <button
          className="bg-blue-600 text-white px-5 py-3 rounded-full w-full font-semibold text-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
          onClick={onClose}
        >
          Add income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeModal; 