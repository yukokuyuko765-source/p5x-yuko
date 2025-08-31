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
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

interface EnemyDefenseChartProps {
  defense: number;
  additionalDefenseCoeff: number;
  penetration: number;
  windStrike: boolean;
  defenseDebuff: number;
}

const EnemyDefenseChart: React.FC<EnemyDefenseChartProps> = ({
  defense,
  additionalDefenseCoeff,
  penetration,
  windStrike,
  defenseDebuff,
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
      pointRadius: 0, // 点を非表示
      pointHoverRadius: 0, // ホバー時の点も非表示
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
          backgroundColor: colors[index]
            .replace("rgb", "rgba")
            .replace(")", ", 0.1)"),
          borderDash: [5, 5],
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 0,
        });
      }
    });

    // 現在の防御率デバフ値での敵防御力計算値を正確に計算
    const currentDefenseDebuffValue = defenseDebuff;
    const currentEnemyDefense = (() => {
      let defenseCoeff = 100 + additionalDefenseCoeff;
      defenseCoeff = (defenseCoeff * (100 - penetration)) / 100;
      defenseCoeff = defenseCoeff - currentDefenseDebuffValue;

      if (windStrike) {
        defenseCoeff *= 0.88;
      }

      defenseCoeff = Math.max(0, defenseCoeff);

      const numerator = (defense * defenseCoeff) / 100;
      const denominator = numerator + 1400;
      return 100 - (numerator / denominator) * 100;
    })();

    // 現在の貫通値でのみ垂線を表示
    // 黒い点は表示しない

    return {
      chartData: {
        labels: defenseDebuffValues,
        datasets,
      },
      currentDefenseDebuffValue,
      currentEnemyDefense,
    };
  };

  const { chartData, currentDefenseDebuffValue, currentEnemyDefense } =
    generateChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
      annotation: {
        annotations: {
          // 現在の貫通値が0%または50%でない場合のみ垂線を表示
          // 縦線（横軸への垂線）
          verticalLine: {
            type: "line" as const,
            xMin: currentDefenseDebuffValue,
            xMax: currentDefenseDebuffValue,
            yMin: 0,
            yMax: currentEnemyDefense,
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 2,
            borderDash: [5, 5],
          },
          // 横線（縦軸への垂線）
          horizontalLine: {
            type: "line" as const,
            xMin: 0,
            xMax: currentDefenseDebuffValue,
            yMin: currentEnemyDefense,
            yMax: currentEnemyDefense,
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 2,
            borderDash: [5, 5],
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear" as const,
        title: {
          display: true,
          text: `防御率デバフ (%) = ${defenseDebuff.toFixed(1)}`,
          font: {
            size: 14,
            weight: "bold" as const,
          },
        },
        min: 0,
        max: 300,
        ticks: {
          maxTicksLimit: 10,
          callback: (value: any) => `${value}%`,
        },
      },
      y: {
        type: "linear" as const,
        title: {
          display: true,
          text: `敵防御力計算 (%) = ${currentEnemyDefense.toFixed(1)}`,
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
    <div className="bg-white p-6 rounded-lg" style={{ height: "400px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default EnemyDefenseChart;
