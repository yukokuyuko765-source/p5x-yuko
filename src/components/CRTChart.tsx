import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { CRTChartProps } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CRTChart: React.FC<CRTChartProps> = ({
  chartData,
  crtRate,
  crtMultiplier,
  currentExpectation,
}) => {
  // 現在の点のデータを生成
  const generateCurrentPointData = (): (number | null)[] => {
    const data = new Array(76).fill(null); // 150%から300%まで2%刻みなので76個
    const bIndex = Math.round((crtMultiplier - 150) / 2); // CRT倍率の値をインデックスに変換
    if (bIndex >= 0 && bIndex < data.length) {
      data[bIndex] = currentExpectation;
    }
    return data;
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "CRT期待値 = CRT発生率% × CRT倍率% + (100% - CRT発生率%) × 100%",
        data: chartData.data,
        borderColor: "#667eea",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        borderWidth: 3,
        fill: false,
        tension: 0.1,
      },
      {
        label: "現在の値",
        data: generateCurrentPointData(),
        borderColor: "#e74c3c",
        backgroundColor: "#e74c3c",
        borderWidth: 0,
        pointRadius: 8,
        pointHoverRadius: 12,
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "CRT期待値 = CRT発生率% × CRT倍率% + (100% - CRT発生率%) × 100% のグラフ",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#333",
      },
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function (context: any) {
            if (context.datasetIndex === 0) {
              return `CRT期待値 = ${context.parsed.y.toFixed(2)}%`;
            } else {
              return `現在の値: ${context.parsed.y.toFixed(2)}%`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "CRT倍率 (%)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          maxTicksLimit: 11,
        },
      },
      y: {
        title: {
          display: true,
          text: "CRT期待値 (%)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value: any) {
            return value.toFixed(0) + "%";
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    elements: {
      point: {
        hoverRadius: 6,
      },
    },
  };

  return (
    <div className="relative h-[500px] mt-6 bg-white rounded-xl p-6 border border-gray-200">
      <Line data={data} options={options} />
    </div>
  );
};

export default CRTChart;
