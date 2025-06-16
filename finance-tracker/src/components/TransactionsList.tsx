import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

interface TransactionsListProps {
  refreshTrigger: boolean;
  selectedMonth: string | null;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ refreshTrigger, selectedMonth }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    let query = supabase
      .from('transactions')
      .select('id, name, amount, type, date')
      .order('created_at', { ascending: false });

    if (selectedMonth) {
      const [monthName, year] = selectedMonth.split(' ');
      const monthNumber = (new Date(Date.parse(monthName + " 1, 2000")).getMonth() + 1).toString().padStart(2, '0');
      const startDate = `${year}-${monthNumber}-01`;
      const endDate = `${year}-${monthNumber}-${new Date(parseInt(year), parseInt(monthNumber), 0).getDate()}`;

      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } else {
      // Type assertion to ensure the data matches the Transaction interface
      setTransactions(data as Transaction[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger, selectedMonth]); // Re-fetch when refreshTrigger or selectedMonth changes

  if (loading) {
    return <div className="text-center text-gray-500">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-center text-gray-500">No transactions yet. Add some income or expenses!</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg text-black font-semibold mb-4">Transactions</h2>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {transaction.type === 'income' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">{transaction.name}</p>
                <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
              {transaction.type === 'income' ? '+' : '-'}£{transaction.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsList; 