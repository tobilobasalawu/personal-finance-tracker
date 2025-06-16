import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SummaryProps {
  refreshTrigger: boolean;
}

const Summary: React.FC<SummaryProps> = ({ refreshTrigger }) => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('transactions').select('amount, type');

      if (error) {
        console.error('Error fetching summary data:', error);
        setIncome(0);
        setExpenses(0);
      } else {
        let totalIncome = 0;
        let totalExpenses = 0;

        data.forEach((transaction) => {
          if (transaction.type === 'income') {
            totalIncome += parseFloat(transaction.amount);
          } else if (transaction.type === 'expense') {
            totalExpenses += parseFloat(transaction.amount);
          }
        });

        setIncome(totalIncome);
        setExpenses(totalExpenses);
      }
      setLoading(false);
    };

    fetchSummaryData();
  }, [refreshTrigger]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading summary...</div>;
  }

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
          <p className="text-lg font-semibold text-green-700">£{income.toFixed(2)}</p>
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
          <p className="text-lg font-semibold text-red-700">£{expenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Summary; 