import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { incomeCategories, expenseCategories, Category } from '../lib/categories';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

interface TransactionsListProps {
  refreshTrigger: boolean;
  selectedMonth: string | null;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ refreshTrigger, selectedMonth }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      let query = supabase
        .from('transactions')
        .select('id, name, amount, type, date, category')
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
        setTransactions(data as Transaction[]);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [refreshTrigger, selectedMonth]);

  const getCategoryInfo = (type: 'income' | 'expense', categoryId: string): Category | undefined => {
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    return categories.find(cat => cat.id === categoryId);
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-center text-gray-500">No transactions yet. Add some income or expenses!</div>;
  }

  return (
    <div className="mt-4 sm:mt-6">
      <h2 className="text-base sm:text-lg text-black font-semibold mb-3 sm:mb-4">Transactions</h2>
      <div className="space-y-2 sm:space-y-3">
        {transactions.map((transaction) => {
          const categoryInfo = getCategoryInfo(transaction.type, transaction.category);
          return (
            <div key={transaction.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
                <div className={`p-1.5 sm:p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {categoryInfo?.icon || (transaction.type === 'income' ? '💰' : '💸')}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm sm:text-base">{transaction.name}</p>
                  <div className="flex flex-wrap items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                    <p className="text-gray-500">{new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    <span className="text-gray-400">•</span>
                    <p className="text-gray-500">{categoryInfo?.name || 'Uncategorized'}</p>
                  </div>
                </div>
              </div>
              <p className={`font-semibold text-base sm:text-lg ${transaction.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                {transaction.type === 'income' ? '+' : '-'}£{transaction.amount.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionsList; 