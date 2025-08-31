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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EnemyDefenseChartProps {
  defense: number;
  additionalDefenseCoeff: number;
  penetration: number;
  windStrike: boolean;
}

const EnemyDefenseChart: React.FC<EnemyDefenseChartProps> = ({
  defense,
  additionalDefenseCoeff,
  penetration,
  windStrike,
}) => {
  // グラフデータの生成
  const generateChartData = () => {
    const defenseDebuffValues = Array.from({ length: 61 }, (_, i) => i * 5); // 0% から 300% まで5%刻み
    const datasets = [];

    // 現在の貫通値でデータセットを作成
    const currentData = defenseDebuffValues.map((defenseDebuff) => {
      let defenseCoeff = 100 + additionalDefenseCoeff;
      defenseCoeff = (defenseCoeff * (100 - penetration)) / 100;
      defenseCoeff = defenseCoeff - defenseDebuff;

      if (windStrike) {
        defenseCoeff *= 0.88;
      }

      defenseCoeff = Math.max(0, defenseCoeff);

      const numerator = (defense * defenseCoeff) / 100;
      const denominator = numerator + 1400;
      return 100 - (numerator / denominator) * 100;
    });

    datasets.push({
      label: `貫通 ${penetration.toFixed(1)}%${windStrike ? " + 風襲" : ""}`,
      data: currentData,
      borderColor: "rgb(34, 197, 94)",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      tension: 0.1,
    });

    // 参考用のデータセット（貫通0%、50%）
    const referencePenetrations = [0, 50];
    const colors = ["rgb(239, 68, 68)", "rgb(245, 158, 11)"];

    referencePenetrations.forEach((refPen, index) => {
      if (refPen !== penetration) {
        const refData = defenseDebuffValues.map((defenseDebuff) => {
          let defenseCoeff = 100 + additionalDefenseCoeff;
          defenseCoeff = (defenseCoeff * (100 - refPen)) / 100;
          defenseCoeff = defenseCoeff - defenseDebuff;

          if (windStrike) {
            defenseCoeff *= 0.88;
          }

          defenseCoeff = Math.max(0, defenseCoeff);

          const numerator = (defense * defenseCoeff) / 100;
          const denominator = numerator + 1400;
          return 100 - (numerator / denominator) * 100;
        });

        datasets.push({
          label: `貫通 ${refPen}%${windStrike ? " + 風襲" : ""}`,
          data: refData,
          borderColor: colors[index],
          backgroundColor: `${colors[index]}20`,
          borderDash: [5, 5],
          tension: 0.1,
        });
      }
    });

    return {
      labels: defenseDebuffValues.map((value) => `${value}%`),
      datasets,
    };
  };

  const chartData = generateChartData();

  const options = {
    responsive: true,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "敵防御力計算 vs 防御率デバフ",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          title: (context: any) => `防御率デバフ: ${context[0].label}`,
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "防御率デバフ (%)",
          font: {
            size: 14,
            weight: "bold" as const,
          },
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: "敵防御力計算 (%)",
          font: {
            size: 14,
            weight: "bold" as const,
          },
        },
        min: 0,
        max: 100,
        ticks: {
          callback: (value: any) => `${value}%`,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <div className="mb-8 p-6 bg-green-50 rounded-xl border border-green-200">
      <h3 className="text-xl font-semibold text-green-800 mb-4">
        敵防御力計算グラフ
      </h3>
      <div className="bg-white p-4 rounded-lg">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 text-sm text-green-700">
        <p>• 実線: 現在の貫通値 ({penetration.toFixed(1)}%)</p>
        <p>• 破線: 参考用の貫通値 (0%, 50%)</p>
        <p>• 横軸: 防御率デバフ (0% ～ 300%)</p>
        <p>• 縦軸: 敵防御力計算結果 (0% ～ 100%)</p>
      </div>
    </div>
  );
};

export default EnemyDefenseChart;
