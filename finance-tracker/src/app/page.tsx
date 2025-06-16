'use client'
import Image from "next/image";
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        {/* Header */}
        <Header />
        {/* Balance Display */}
        <BalanceDisplay balance={2410} />
        {/* Action Buttons */}
        <ActionButtons onAddIncomeClick={() => setIsAddIncomeModalOpen(true)} onAddExpenseClick={() => setIsAddExpenseModalOpen(true)} />
        {/* Monthly Navigation (Placeholder) */}
        <MonthlyNavigation />
        {/* Summary (Placeholder) */}
        <Summary income={1500} expenses={320} />
        {/* Chart (Placeholder) */}
        <Chart />
        {/* Transactions List (Placeholder) */}
        <TransactionsList />
      </div>
      {/* Add Income Modal */}
      <AddIncomeModal isOpen={isAddIncomeModalOpen} onClose={() => setIsAddIncomeModalOpen(false)} />
      {/* Add Expense Modal */}
      <AddExpenseModal isOpen={isAddExpenseModalOpen} onClose={() => setIsAddExpenseModalOpen(false)} />
    </div>
  );
}
