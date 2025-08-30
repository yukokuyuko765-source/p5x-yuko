import React from "react";
import { FormulaDisplayProps } from "../types";

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  attackPower,
  attackMultiplier,
  enemyDefense,
  skillCoeff,
  weaknessCoeff,
  finalAttackMultiplier,
  otherCoeff,
  randomCoeffEnabled,
  randomCoeffMin,
  randomCoeffMax,
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
        攻撃力: {attackPower.toLocaleString()} | 攻撃倍率: {attackMultiplier}% |
        敵防御力計算: {enemyDefense.toFixed(1)}% | スキル係数:{" "}
        {(skillCoeff * 100).toFixed(1)}% | 弱点係数:{" "}
        {(weaknessCoeff * 100).toFixed(0)}% | 最終攻撃倍率:{" "}
        {finalAttackMultiplier.toFixed(1)}% | その他係数:{" "}
        {otherCoeff.toFixed(1)}% | ランダム係数:{" "}
        {randomCoeffEnabled
          ? `${randomCoeffMin.toFixed(1)}% ～ ${randomCoeffMax.toFixed(1)}%`
          : "100% (無効)"}{" "}
        | CRT期待値 = {crtRate}% × {crtMultiplier}% + {100 - crtRate}% × 100% ={" "}
        {currentExpectation.toFixed(1)}%
      </div>
    </div>
  );
};

export default FormulaDisplay;
