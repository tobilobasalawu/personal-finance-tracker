'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { incomeCategories, expenseCategories } from '../../lib/categories';
import { Doughnut } from 'react-chartjs-2';
import Link from 'next/link';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface CategoryAnalysis {
  category: string;
  total: number;
  count: number;
}

export default function Analytics() {
  const [incomeAnalysis, setIncomeAnalysis] = useState<CategoryAnalysis[]>([]);
  const [expenseAnalysis, setExpenseAnalysis] = useState<CategoryAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      let query = supabase
        .from('transactions')
        .select('amount, type, category, date');

      if (selectedMonth) {
        const [monthName, year] = selectedMonth.split(' ');
        const monthNumber = (new Date(Date.parse(monthName + " 1, 2000")).getMonth() + 1).toString().padStart(2, '0');
        const startDate = `${year}-${monthNumber}-01`;
        const endDate = `${year}-${monthNumber}-${new Date(parseInt(year), parseInt(monthNumber), 0).getDate()}`;
        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching analytics:', error);
        return;
      }

      // Process income data
      const incomeData = data.filter(t => t.type === 'income');
      const incomeByCategory = incomeData.reduce((acc: { [key: string]: CategoryAnalysis }, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = { category: curr.category, total: 0, count: 0 };
        }
        acc[curr.category].total += parseFloat(curr.amount);
        acc[curr.category].count += 1;
        return acc;
      }, {});

      // Process expense data
      const expenseData = data.filter(t => t.type === 'expense');
      const expenseByCategory = expenseData.reduce((acc: { [key: string]: CategoryAnalysis }, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = { category: curr.category, total: 0, count: 0 };
        }
        acc[curr.category].total += parseFloat(curr.amount);
        acc[curr.category].count += 1;
        return acc;
      }, {});

      setIncomeAnalysis(Object.values(incomeByCategory));
      setExpenseAnalysis(Object.values(expenseByCategory));
      setLoading(false);
    };

    fetchAnalytics();
  }, [selectedMonth]);

  const getCategoryName = (categoryId: string, type: 'income' | 'expense') => {
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  const getCategoryIcon = (categoryId: string, type: 'income' | 'expense') => {
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    return categories.find(cat => cat.id === categoryId)?.icon || '💰';
  };

  const incomeChartData = {
    labels: incomeAnalysis.map(item => getCategoryName(item.category, 'income')),
    datasets: [
      {
        data: incomeAnalysis.map(item => item.total),
        backgroundColor: [
          '#4CAF50',
          '#8BC34A',
          '#CDDC39',
          '#FFEB3B',
          '#FFC107',
        ],
        borderWidth: 1,
      },
    ],
  };

  const expenseChartData = {
    labels: expenseAnalysis.map(item => getCategoryName(item.category, 'expense')),
    datasets: [
      {
        data: expenseAnalysis.map(item => item.total),
        backgroundColor: [
          '#F44336',
          '#E91E63',
          '#9C27B0',
          '#673AB7',
          '#3F51B5',
          '#2196F3',
          '#03A9F4',
          '#00BCD4',
          '#009688',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#000000',
          font: {
            size: 14
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 sm:mb-6">
          <Link 
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ← Back to Home
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-black text-center sm:text-left">Financial Analytics</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Income Analysis */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Income Sources</h2>
            <div className="h-48 sm:h-64">
              <Doughnut data={incomeChartData} options={chartOptions} />
            </div>
            <div className="mt-3 sm:mt-4 space-y-2">
              {incomeAnalysis.map((item) => (
                <div key={item.category} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg sm:text-xl mr-2">{getCategoryIcon(item.category, 'income')}</span>
                    <span className="font-medium text-black text-sm sm:text-base">{getCategoryName(item.category, 'income')}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 text-sm sm:text-base">£{item.total.toFixed(2)}</p>
                    <p className="text-xs sm:text-sm text-black">{item.count} transactions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Analysis */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Expense Categories</h2>
            <div className="h-48 sm:h-64">
              <Doughnut data={expenseChartData} options={chartOptions} />
            </div>
            <div className="mt-3 sm:mt-4 space-y-2">
              {expenseAnalysis.map((item) => (
                <div key={item.category} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg sm:text-xl mr-2">{getCategoryIcon(item.category, 'expense')}</span>
                    <span className="font-medium text-black text-sm sm:text-base">{getCategoryName(item.category, 'expense')}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600 text-sm sm:text-base">£{item.total.toFixed(2)}</p>
                    <p className="text-xs sm:text-sm text-black">{item.count} transactions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 