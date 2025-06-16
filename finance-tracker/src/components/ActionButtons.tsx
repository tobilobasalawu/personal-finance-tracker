import React from 'react';

interface ActionButtonsProps {
  onAddIncomeClick: () => void;
  onAddExpenseClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAddIncomeClick, onAddExpenseClick }) => {
  return (
    <div className="flex justify-around mb-6 space-x-4">
      <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-md text-base flex-1" onClick={onAddIncomeClick}>Add income</button>
      <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-semibold shadow-md text-base flex-1" onClick={onAddExpenseClick}>Add expense</button>
    </div>
  );
};

export default ActionButtons; 