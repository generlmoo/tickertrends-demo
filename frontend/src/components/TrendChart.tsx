import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { TrendPoint } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface TrendChartProps {
  term: string;
  series: TrendPoint[];
}

const TrendChart: React.FC<TrendChartProps> = ({ term, series }) => {
  if (!term) {
    return null;
  }

  const chartData = {
    labels: series.map((item) => item.date),
    datasets: [
      {
        label: `Momentum for "${term}"`,
        data: series.map((item) => item.value),
        borderColor: '#2dd4ff',
        backgroundColor: 'rgba(45, 212, 255, 0.25)',
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0b1524',
        borderColor: '#2dd4ff',
        borderWidth: 1,
        padding: 12,
      },
      title: {
        display: true,
        text: `Timeseries for ${term}`,
        color: '#e0f7ff',
        font: { size: 16, weight: '600' },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9fd9ff' },
        grid: { color: 'rgba(77, 148, 255, 0.1)' },
      },
      y: {
        ticks: { color: '#9fd9ff' },
        grid: { color: 'rgba(77, 148, 255, 0.1)' },
      },
    },
  } as const;

  return (
    <div className="panel chart-panel">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendChart;