import React from 'react';

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg mb-4 text-center shadow-md">
      <p className="text-4xl font-bold mb-1">₹{balance}</p>
      <p className="text-sm opacity-90">Available Balance</p>
    </div>
  );
};

export default BalanceDisplay; 