'use client'
import Header from '../components/Header';
import BalanceDisplay from '../components/BalanceDisplay';
import ActionButtons from '../components/ActionButtons';
import MonthlyNavigation from '../components/MonthlyNavigation';
import Summary from '../components/Summary';
import Chart from '../components/Chart';
import TransactionsList from '../components/TransactionsList';
import AddIncomeModal from '../components/AddIncomeModal';
import AddExpenseModal from '../components/AddExpenseModal';
import React, { useState } from 'react';

export default function Home() {
  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [refreshTransactions, setRefreshTransactions] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const handleTransactionAdded = () => {
    setRefreshTransactions(prev => !prev);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        {/* Header */}
        <Header />
        {/* Balance Display */}
        <BalanceDisplay refreshTrigger={refreshTransactions} />
        {/* Action Buttons */}
        <ActionButtons
          onAddIncomeClick={() => setIsAddIncomeModalOpen(true)}
          onAddExpenseClick={() => setIsAddExpenseModalOpen(true)}
        />
        {/* Monthly Navigation (Placeholder) */}
        <MonthlyNavigation
          refreshTrigger={refreshTransactions}
          selectedMonth={selectedMonth}
          onSelectMonth={handleMonthSelect}
        />
        {/* Summary (Placeholder) */}
        <Summary refreshTrigger={refreshTransactions} />
        {/* Chart (Placeholder) */}
        <Chart refreshTrigger={refreshTransactions} selectedMonth={selectedMonth} />
        {/* Transactions List (Placeholder) */}
        <TransactionsList refreshTrigger={refreshTransactions} selectedMonth={selectedMonth} />
      </div>
      {/* Add Income Modal */}
      <AddIncomeModal
        isOpen={isAddIncomeModalOpen}
        onClose={() => setIsAddIncomeModalOpen(false)}
        onAddIncome={handleTransactionAdded}
      />
      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        onAddExpense={handleTransactionAdded}
      />
    </div>
  );
}
