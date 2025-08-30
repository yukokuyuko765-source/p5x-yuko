import React, { useState } from "react";
import CRTChart from "./CRTChart";
import ParameterControls from "./ParameterControls";
import FormulaDisplay from "./FormulaDisplay";
import InfoPanel from "./InfoPanel";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { ChartData, CRTExpectationCalculatorProps } from "../types";

const CRTExpectationCalculator: React.FC<CRTExpectationCalculatorProps> = () => {
  const [crtRate, setCrtRate] = useState<number>(50);
  const [crtMultiplier, setCrtMultiplier] = useState<number>(150);

  // CRT期待値の計算関数
  const calculateCRTExpectation = (rate: number, multiplier: number): number => {
    return (rate * multiplier + (100 - rate) * 100) / 100;
  };

  // グラフデータの生成
  const generateChartData = (): ChartData => {
    const data: number[] = [];
    const labels: string[] = [];

    // CRT倍率の値を150%から300%まで生成
    for (let b = 150; b <= 300; b += 2) {
      labels.push(b + "%");
      data.push(calculateCRTExpectation(crtRate, b));
    }

    return { labels, data };
  };

  // 現在の期待値
  const currentExpectation = calculateCRTExpectation(crtRate, crtMultiplier);

  // キーボードショートカット
  useKeyboardShortcuts(crtRate, setCrtRate, crtMultiplier, setCrtMultiplier);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white p-8 text-center">
        <h1 className="text-4xl font-light mb-2">
          CRT期待値 = CRT発生率% × CRT倍率% + (100% - CRT発生率%) × 100%
        </h1>
        <p className="text-xl opacity-90">
          CRT発生率とCRT倍率を調整してグラフの変化を確認してください
        </p>
      </div>

      {/* コンテンツ */}
      <div className="p-8">
        {/* パラメータコントロール */}
        <ParameterControls
          crtRate={crtRate}
          setCrtRate={setCrtRate}
          crtMultiplier={crtMultiplier}
          setCrtMultiplier={setCrtMultiplier}
        />

        {/* 計算式表示 */}
        <FormulaDisplay
          crtRate={crtRate}
          crtMultiplier={crtMultiplier}
          currentExpectation={currentExpectation}
        />

        {/* グラフ */}
        <CRTChart
          chartData={generateChartData()}
          crtRate={crtRate}
          crtMultiplier={crtMultiplier}
          currentExpectation={currentExpectation}
        />

        {/* 情報パネル */}
        <InfoPanel />
      </div>
    </div>
  );
};

export default CRTExpectationCalculator;
