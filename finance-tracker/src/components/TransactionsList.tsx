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

interface BudgetCategory {
  id: number;
  budget_id: number;
  type: 'need' | 'want';
  category: string;
  amount: number;
}

interface TransactionsListProps {
  refreshTrigger: boolean;
  startDate: string | null;
  endDate: string | null;
}

const NEEDS_CATEGORY_MAP: Record<string, string> = {
  bills: 'Bills & Utilities',
  food: 'Food',
  transport: 'Transportation',
  parental: 'Parental',
  subscription: 'Subscription',
  'loan_payback': 'Loan Payback',
};
const WANTS_CATEGORY_MAP: Record<string, string> = {
  shopping: 'Clothes',
  entertainment: 'Eat Out',
};

const TransactionsList: React.FC<TransactionsListProps> = ({ refreshTrigger, startDate, endDate }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch transactions
      let query = supabase
        .from('transactions')
        .select('id, name, amount, type, date, category')
        .order('created_at', { ascending: false });
      if (startDate && endDate) {
        query = query.gte('date', startDate).lte('date', endDate);
      }
      const { data: txData, error: txError } = await query;
      if (txError) {
        setTransactions([]);
      } else {
        setTransactions(txData as Transaction[]);
      }
      // Fetch budget and categories
      const { data: budgetData } = await supabase.from('budget').select('id, income').limit(1).single();
      setBudget(budgetData);
      if (budgetData) {
        const { data: catData } = await supabase
          .from('budget_categories')
          .select('*')
          .eq('budget_id', budgetData.id);
        setBudgetCategories(catData || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [refreshTrigger, startDate, endDate]);

  // Sum spending by subcategory
  const subcategorySpending: Record<string, number> = {};
  transactions.forEach(tx => {
    if (tx.type === 'expense') {
      // Map to needs/wants subcategory
      let mapped = NEEDS_CATEGORY_MAP[tx.category] || WANTS_CATEGORY_MAP[tx.category];
      if (mapped) {
        subcategorySpending[mapped] = (subcategorySpending[mapped] || 0) + tx.amount;
      }
    }
  });

  // Prepare warnings
  const warnings: { category: string; spent: number; budget: number }[] = [];
  budgetCategories.forEach(cat => {
    const spent = subcategorySpending[cat.category] || 0;
    if (cat.amount > 0 && spent >= 0.8 * cat.amount) {
      warnings.push({ category: cat.category, spent, budget: cat.amount });
    }
  });

  // Savings warning
  let savingsWarning = null;
  if (budget && budget.income) {
    const savingsGoal = budget.income * 0.2;
    const totalExpenses = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
    const moneyLeft = budget.income - totalExpenses;
    if (moneyLeft < savingsGoal) {
      savingsWarning = {
        type: 'below',
        message: `You are below your savings goal! (Goal: £${savingsGoal.toFixed(2)}, Left: £${moneyLeft.toFixed(2)})`,
      };
    } else if (moneyLeft - savingsGoal <= 0.1 * savingsGoal) {
      savingsWarning = {
        type: 'close',
        message: `You are close to your savings goal! (Goal: £${savingsGoal.toFixed(2)}, Left: £${moneyLeft.toFixed(2)})`,
      };
    }
  }

  const getCategoryInfo = (type: 'income' | 'expense', categoryId: string): Category | undefined => {
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    return categories.find(cat => cat.id === categoryId);
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading transactions...</div>;
  }

  return (
    <div className="mt-4 sm:mt-6">
      <h2 className="text-base sm:text-lg text-black font-semibold mb-3 sm:mb-4">Transactions</h2>
      {warnings.length > 0 && (
        <div className="mb-4">
          {warnings.map(w => (
            <div key={w.category} className="bg-yellow-100 text-yellow-800 rounded px-3 py-2 mb-2">
              Warning: You have spent £{w.spent.toFixed(2)} of your £{w.budget.toFixed(2)} budget for <b>{w.category}</b>.
            </div>
          ))}
        </div>
      )}
      {savingsWarning && (
        <div className="mb-4 bg-yellow-100 text-yellow-800 rounded px-3 py-2">
          {savingsWarning.message}
        </div>
      )}
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
