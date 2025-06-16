import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { incomeCategories, Category } from '../lib/categories';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIncome: () => void; // Callback to refresh transactions list
}

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose, onAddIncome }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Current date in YYYY-MM-DD format
  const [category, setCategory] = useState<string>(incomeCategories[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddIncome = async () => {
    if (!name || !amount || !date || !category) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);

    const { error: supabaseError } = await supabase.from('transactions').insert({
      name,
      amount,
      type: 'income',
      date,
      category,
    });

    setLoading(false);

    if (supabaseError) {
      console.error('Error adding income:', supabaseError);
      setError('Failed to add income. Please try again.');
    } else {
      // Clear form and close modal
      setName('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory(incomeCategories[0].id);
      onClose();
      onAddIncome(); // Trigger refresh in parent component
    }
  };

  if (!isOpen) return null;

  // Helper to format date for display
  const formatDateForDisplay = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString('en-US', options);
    const today = new Date().toLocaleDateString('en-US', options);
    return formatted === today ? `${formatted} (Today)` : formatted;
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-100 rounded-full p-4 mb-3 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M20 7H4V5H20V7ZM20 9H4C3.44772 9 3 9.44772 3 10V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V10C21 9.44772 20.5523 9 20 9ZM5 11V17H19V11H5ZM12 14C12 14.5523 11.5523 15 11 15H9C8.44772 15 8 14.5523 8 14V12C8 11.4477 8.44772 11 9 11H11C11.5523 11 12 11.4477 12 12V14ZM11 12H9V14H11V12Z" fill="#68D391"/>
              <path d="M11 12C11 11.4477 10.5523 11 10 11C9.44772 11 9 11.4477 9 12V14C9 14.5523 9.44772 15 10 15C10.5523 15 11 14.5523 11 14V12Z" fill="#38A169"/>
              <path d="M15 12C15 11.4477 14.5523 11 14 11C13.4477 11 13 11.4477 13 12V14C13 14.5523 13.4477 15 14 15C14.5523 15 15 14.5523 15 14V12Z" fill="#4299E1"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Income</h2>
        </div>
        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
        <div className="mb-4">
          <label htmlFor="transaction-name" className="sr-only">Transaction name</label>
          <input
            type="text"
            id="transaction-name"
            placeholder="Transaction name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="sr-only">Amount</label>
          <input
            type="number"
            id="amount"
            placeholder="Amount"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            id="category"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          >
            {incomeCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6 flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition duration-200 ease-in-out">
          <label htmlFor="date" className="sr-only">Date</label>
          <input
            type="text" // Changed to text to allow custom date formatting and placeholder
            id="date"
            placeholder="10 Jan, 2022 (Today)"
            value={formatDateForDisplay(date)}
            onFocus={(e) => e.target.type = 'date'} // Change to date type on focus
            onBlur={(e) => e.target.type = 'text'} // Change back to text on blur
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 bg-transparent outline-none text-gray-800"
            disabled={loading}
          />
          <button className="p-3 text-gray-600 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <button
          className="bg-blue-600 text-white px-5 py-3 rounded-full w-full font-semibold text-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
          onClick={handleAddIncome}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add income'}
        </button>
      </div>
    </div>
  );
};

export default AddIncomeModal; 