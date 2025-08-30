import React from "react";
import { FormulaDisplayProps } from "../types";

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  crtRate,
  crtMultiplier,
  currentExpectation,
}) => {
  return (
    <div className="text-center my-6 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
      <h3 className="text-xl font-semibold text-blue-700 mb-3">
        現在のCRT期待値計算
      </h3>
      <div className="text-2xl font-bold text-gray-800 font-mono">
        CRT期待値 = {crtRate}% × {crtMultiplier}% + {100 - crtRate}% × 100% ={" "}
        {currentExpectation.toFixed(1)}%
      </div>
    </div>
  );
};

export default FormulaDisplay;
