import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const data = {
    labels: ['01', '02', '03', '04', '05', '06'],
    datasets: [
      {
        label: 'Balance',
        data: [1500, 2800, 1800, 2500, 1200, 2200],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

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
        enabled: false,
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
            return '₹' + value;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <Line data={data} options={options} />
    </div>
  );
};

export default Chart; 