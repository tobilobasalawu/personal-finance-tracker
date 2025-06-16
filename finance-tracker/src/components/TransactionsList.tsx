import React from 'react';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

const TransactionsList = () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      name: 'Freelance Payment',
      amount: 1200,
      type: 'income',
      date: '25 Jan, 2022',
    },
    {
      id: '2',
      name: 'Groceries',
      amount: 150,
      type: 'expense',
      date: '24 Jan, 2022',
    },
    {
      id: '3',
      name: 'Salary',
      amount: 2500,
      type: 'income',
      date: '20 Jan, 2022',
    },
    {
      id: '4',
      name: 'Electricity Bill',
      amount: 80,
      type: 'expense',
      date: '18 Jan, 2022',
    },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Transactions</h2>
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
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
            </div>
            <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
              {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsList; 