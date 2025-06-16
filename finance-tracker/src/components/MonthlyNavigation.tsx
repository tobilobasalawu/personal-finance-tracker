import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface MonthlyNavigationProps {
  refreshTrigger: boolean;
  selectedMonth: string | null;
  onSelectMonth: (month: string) => void;
}

const MonthlyNavigation: React.FC<MonthlyNavigationProps> = ({ refreshTrigger, selectedMonth, onSelectMonth }) => {
  const [months, setMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonths = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('date')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching months:', error);
        setMonths([]);
      } else {
        const uniqueMonths = new Set<string>();
        data.forEach((transaction) => {
          const date = new Date(transaction.date);
          const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          uniqueMonths.add(monthYear);
        });

        const sortedMonths = Array.from(uniqueMonths).sort((a, b) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateB.getTime() - dateA.getTime();
        });

        setMonths(sortedMonths);

        // Set initial selected month if not already set or if data refreshed
        if (sortedMonths.length > 0 && !selectedMonth) {
          onSelectMonth(sortedMonths[0]);
        }
      }
      setLoading(false);
    };

    fetchMonths();
  }, [refreshTrigger, onSelectMonth, selectedMonth]); // Fetch months when refreshTrigger, onSelectMonth, or selectedMonth changes

  if (loading) {
    return <div className="text-center text-gray-500">Loading months...</div>;
  }

  if (months.length === 0) {
    return <div className="text-center text-gray-500">No months to display. Add some transactions!</div>;
  }

  return (
    <div className="flex justify-between items-center bg-gray-50 rounded-full p-1 mb-6 text-sm">
      {months.map((month) => (
        <span
          key={month}
          className={`px-4 py-2 rounded-full cursor-pointer ${selectedMonth === month ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-gray-600 font-medium'}`}
          onClick={() => onSelectMonth(month)}
        >
          {month}
        </span>
      ))}
    </div>
  );
};

export default MonthlyNavigation; 