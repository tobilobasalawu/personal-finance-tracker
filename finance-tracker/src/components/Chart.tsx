import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { supabase } from '../lib/supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataset {
  label: string;
  data: number[];
  fill: boolean;
  backgroundColor: string;
  borderColor: string;
  tension: number;
  pointRadius: number;
}

interface ChartDataType {
  labels: string[];
  datasets: ChartDataset[];
}

interface ChartProps {
  refreshTrigger: boolean;
  selectedMonth: string | null;
}

const Chart: React.FC<ChartProps> = ({ refreshTrigger, selectedMonth }) => {
  const [chartData, setChartData] = useState<ChartDataType>({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      let query = supabase
        .from('transactions')
        .select('amount, type, date')
        .order('date', { ascending: true });

      if (selectedMonth) {
        const [monthName, year] = selectedMonth.split(' ');
        const monthNumber = (new Date(Date.parse(monthName + " 1, 2000")).getMonth() + 1).toString().padStart(2, '0');
        
        const startDate = `${year}-${monthNumber}-01`;
        const endDate = `${year}-${monthNumber}-${new Date(parseInt(year), parseInt(monthNumber), 0).getDate()}`;

        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching chart data:', error);
        setChartData({
          labels: [],
          datasets: [],
        });
      } else {
        console.log('Supabase data:', data);
        const dailyBalances: { [key: string]: number } = {};

        const allDatesInMonth: Date[] = [];
        if (selectedMonth) {
          const [monthName, year] = selectedMonth.split(' ');
          const monthIndex = new Date(Date.parse(monthName + " 1, 2000")).getMonth();
          const numDays = new Date(parseInt(year), monthIndex + 1, 0).getDate();
          for (let i = 1; i <= numDays; i++) {
            allDatesInMonth.push(new Date(parseInt(year), monthIndex, i));
          }
        } else {
          const uniqueDates = new Set<string>();
          data.forEach(transaction => {
            uniqueDates.add(new Date(transaction.date).toISOString().split('T')[0]);
          });
          Array.from(uniqueDates).sort().forEach(dateStr => allDatesInMonth.push(new Date(dateStr)));
        }

        allDatesInMonth.forEach(date => {
          const formattedDate = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
          dailyBalances[formattedDate] = 0; 
        });

        data.forEach((transaction) => {
          const transactionDate = new Date(transaction.date);
          const formattedDate = transactionDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
          const amount = parseFloat(String(transaction.amount));

          if (dailyBalances[formattedDate] === undefined) {
            dailyBalances[formattedDate] = 0; // Initialize if not already set
          }

          if (transaction.type === 'income') {
            dailyBalances[formattedDate] += amount;
          } else if (transaction.type === 'expense') {
            dailyBalances[formattedDate] -= amount;
          }
        });

        console.log('Daily Balances:', dailyBalances);

        const sortedDates = allDatesInMonth.sort((a, b) => a.getTime() - b.getTime());
        const labels = sortedDates.map(date => selectedMonth ? date.getDate().toString().padStart(2, '0') : date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }));

        let cumulativeBalance = 0;
        const dataPoints = sortedDates.map(date => {
          const formattedDate = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
          // Propagate cumulative balance for days without transactions
          if (dailyBalances[formattedDate] === undefined) {
            dailyBalances[formattedDate] = 0;
          }
          cumulativeBalance += dailyBalances[formattedDate];
          return cumulativeBalance;
        });

        console.log('Final Labels:', labels);
        console.log('Final Data Points:', dataPoints);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Balance',
              data: dataPoints,
              fill: true,
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              borderColor: 'rgba(59, 130, 246, 1)',
              tension: 0.4,
              pointRadius: 3,
            },
          ],
        });
      }
      setLoading(false);
    };

    fetchChartData();
  }, [refreshTrigger, selectedMonth]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#a0aec0',
        },
      },
      y: {
        grid: {
          borderDash: [8, 4],
          color: '#e2e8f0',
        },
        ticks: {
          color: '#a0aec0',
          callback: function (value: string | number) {
            return '£' + value;
          },
        },
      },
    },
  };

  if (loading) {
    return <div className="bg-white p-4 rounded-lg shadow-sm mb-6 text-center text-gray-500">Loading chart...</div>;
  }

  if (chartData.labels.length === 0) {
    return <div className="bg-white p-4 rounded-lg shadow-sm mb-6 text-center text-gray-500">No data to display chart.</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Chart; 