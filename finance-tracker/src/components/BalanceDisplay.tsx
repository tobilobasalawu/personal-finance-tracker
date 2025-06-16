import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface BalanceDisplayProps {
  refreshTrigger: boolean;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ refreshTrigger }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('transactions').select('amount, type');

      if (error) {
        console.error('Error fetching balance:', error);
        setBalance(0);
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

        setBalance(totalIncome - totalExpenses);
      }
      setLoading(false);
    };

    fetchBalance();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-blue-400 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-blue-400 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 sm:p-6 rounded-xl shadow-lg">
      <p className="text-sm sm:text-base font-medium opacity-90 mb-1">Available Balance</p>
      <p className="text-3xl sm:text-4xl font-bold">£{balance.toFixed(2)}</p>
      <div className="mt-2 flex items-center text-xs sm:text-sm opacity-90">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Updated just now
      </div>
    </div>
  );
};

export default BalanceDisplay; 