// グローバル変数
let chart;
let paramA = 50;
let paramB = 150;

// DOM要素の取得
const paramASlider = document.getElementById("paramA");
const paramBSlider = document.getElementById("paramB");
const paramAInput = document.getElementById("paramAInput");
const paramBInput = document.getElementById("paramBInput");
const valueADisplay = document.getElementById("valueA");
const valueBDisplay = document.getElementById("valueB");
const currentFormula = document.getElementById("currentFormula");

// 初期化
document.addEventListener("DOMContentLoaded", function () {
  initializeChart();
  setupEventListeners();
  updateDisplay();
});

// イベントリスナーの設定
function setupEventListeners() {
  // スライダーのイベント
  paramASlider.addEventListener("input", function () {
    paramA = parseInt(this.value);
    paramAInput.value = paramA;
    updateDisplay();
    updateChart();
  });

  paramBSlider.addEventListener("input", function () {
    paramB = parseInt(this.value);
    paramBInput.value = paramB;
    updateDisplay();
    updateChart();
  });

  // テキストボックスのイベント
  paramAInput.addEventListener("input", function () {
    let value = parseInt(this.value);
    if (isNaN(value)) return;

    // 範囲制限
    value = Math.max(0, Math.min(100, value));
    paramA = value;
    paramASlider.value = value;
    this.value = value;
    updateDisplay();
    updateChart();
  });

  paramBInput.addEventListener("input", function () {
    let value = parseInt(this.value);
    if (isNaN(value)) return;

    // 範囲制限
    value = Math.max(0, Math.min(500, value));
    paramB = value;
    paramBSlider.value = value;
    this.value = value;
    updateDisplay();
    updateChart();
  });

  // Enterキーでフォーカスを外す
  paramAInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      this.blur();
    }
  });

  paramBInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      this.blur();
    }
  });
}

// 表示の更新
function updateDisplay() {
  valueADisplay.textContent = paramA + "%";
  valueBDisplay.textContent = paramB + "%";

  const result = calculateY(paramA, paramB);
  currentFormula.textContent = `CRT期待値 = ${paramA}% × ${paramB}% + ${
    100 - paramA
  }% × 100% = ${result.toFixed(1)}%`;
}

// CRT期待値の計算関数
function calculateY(a, b) {
  return (a * b + (100 - a) * 100) / 100;
}

// グラフデータの生成
function generateChartData() {
  const data = [];
  const labels = [];

  // CRT倍率の値を0%から500%まで生成
  for (let b = 0; b <= 500; b += 5) {
    labels.push(b + "%");
    data.push(calculateY(paramA, b));
  }

  return { labels, data };
}

// グラフの初期化
function initializeChart() {
  const ctx = document.getElementById("myChart").getContext("2d");
  const chartData = generateChartData();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label:
            "CRT期待値 = CRT発生率% × CRT倍率% + (100% - CRT発生率%) × 100%",
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
    },
    options: {
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
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (context) {
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
            callback: function (value) {
              return value.toFixed(0) + "%";
            },
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      elements: {
        point: {
          hoverRadius: 6,
        },
      },
    },
  });
}

// 現在の点のデータを生成
function generateCurrentPointData() {
  const data = new Array(101).fill(null); // 0%から500%まで5%刻みなので101個
  const bIndex = Math.round(paramB / 5); // CRT倍率の値をインデックスに変換
  if (bIndex >= 0 && bIndex < data.length) {
    data[bIndex] = calculateY(paramA, paramB);
  }
  return data;
}

// グラフの更新
function updateChart() {
  const chartData = generateChartData();

  chart.data.labels = chartData.labels;
  chart.data.datasets[0].data = chartData.data;
  chart.data.datasets[1].data = generateCurrentPointData();

  chart.update("none"); // アニメーションなしで更新
}

// 追加の機能: キーボードショートカット
document.addEventListener("keydown", function (e) {
  const step = e.shiftKey ? 10 : 1; // Shiftキーを押しながらで10刻み

  switch (e.key) {
    case "ArrowLeft":
      if (e.ctrlKey) {
        paramA = Math.max(0, paramA - step);
        paramASlider.value = paramA;
        paramAInput.value = paramA;
      } else {
        paramB = Math.max(0, paramB - step);
        paramBSlider.value = paramB;
        paramBInput.value = paramB;
      }
      updateDisplay();
      updateChart();
      break;
    case "ArrowRight":
      if (e.ctrlKey) {
        paramA = Math.min(100, paramA + step);
        paramASlider.value = paramA;
        paramAInput.value = paramA;
      } else {
        paramB = Math.min(500, paramB + step);
        paramBSlider.value = paramB;
        paramBInput.value = paramB;
      }
      updateDisplay();
      updateChart();
      break;
  }
});

// 追加の機能: ダブルクリックでリセット
document.addEventListener("dblclick", function () {
  paramA = 50;
  paramB = 150;
  paramASlider.value = paramA;
  paramBSlider.value = paramB;
  paramAInput.value = paramA;
  paramBInput.value = paramB;
  updateDisplay();
  updateChart();
});

// ウィンドウリサイズ時の対応
window.addEventListener("resize", function () {
  if (chart) {
    chart.resize();
  }
});
