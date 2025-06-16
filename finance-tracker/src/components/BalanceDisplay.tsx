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
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg mb-4 text-center shadow-md">
        <p className="text-4xl font-bold mb-1">Loading...</p>
        <p className="text-sm opacity-90">Available Balance</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg mb-4 text-center shadow-md">
      <p className="text-4xl font-bold mb-1">£{balance.toFixed(2)}</p>
      <p className="text-sm opacity-90">Available Balance</p>
    </div>
  );
};

export default BalanceDisplay; 