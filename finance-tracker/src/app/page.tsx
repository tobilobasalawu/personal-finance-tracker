'use client'
import BalanceDisplay from '../components/BalanceDisplay';
import ActionButtons from '../components/ActionButtons';
import MonthlyNavigation from '../components/MonthlyNavigation';
import Summary from '../components/Summary';
import Chart from '../components/Chart';
import TransactionsList from '../components/TransactionsList';
import AddIncomeModal from '../components/AddIncomeModal';
import AddExpenseModal from '../components/AddExpenseModal';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../components/../lib/supabase';

export default function Home() {
  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [refreshTransactions, setRefreshTransactions] = useState(false);
  // const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [budgetPeriod, setBudgetPeriod] = useState<{ startDate: string; endDate: string } | null>(null);

  const handleTransactionAdded = () => {
    setRefreshTransactions(prev => !prev);
  };

  // const handleMonthSelect = (month: string) => {
  //   setSelectedMonth(month);
  // };

  useEffect(() => {
    const fetchBudgetPeriod = async () => {
      const { data, error } = await supabase
        .from('budget')
        .select('start_date, end_date')
        .limit(1)
        .single();
      if (data && data.start_date && data.end_date) {
        setBudgetPeriod({ startDate: data.start_date, endDate: data.end_date });
      }
    };
    fetchBudgetPeriod();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main content container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cash Wallet</h1>
          <Link 
            href="/budget-planner" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Budget
          </Link>
          
          <Link 
            href="/analytics" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Analytics
          </Link>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Balance and Actions */}
          <div className="lg:col-span-1 space-y-6">
            <BalanceDisplay refreshTrigger={refreshTransactions} />
            <ActionButtons
              onAddIncomeClick={() => setIsAddIncomeModalOpen(true)}
              onAddExpenseClick={() => setIsAddExpenseModalOpen(true)}
            />
          </div>

          {/* Middle column - Summary and Chart */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* <MonthlyNavigation
                refreshTrigger={refreshTransactions}
                selectedMonth={selectedMonth}
                onSelectMonth={handleMonthSelect}
              /> */}
              <Summary refreshTrigger={refreshTransactions} />
              <Chart refreshTrigger={refreshTransactions} />
            </div>
          </div>

          {/* Bottom section - Transactions List (full width) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <TransactionsList 
                refreshTrigger={refreshTransactions} 
                startDate={budgetPeriod?.startDate || null} 
                endDate={budgetPeriod?.endDate || null} 
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddIncomeModal
        isOpen={isAddIncomeModalOpen}
        onClose={() => setIsAddIncomeModalOpen(false)}
        onAddIncome={handleTransactionAdded}
      />
      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        onAddExpense={handleTransactionAdded}
      />
    </div>
  );
}
