import React from "react";

interface CalculationResultProps {
  attackPower: number;
  attackMultiplier: number;
  enemyDefense: number;
  skillCoeff: number;
  weaknessCoeff: number;
  finalAttackMultiplier: number;
  otherCoeff: number;
  randomCoeffEnabled: boolean;
  randomCoeffMin: number;
  randomCoeffMax: number;
  crtRate: number;
  crtMultiplier: number;
  currentExpectation: number;
}

const CalculationResult: React.FC<CalculationResultProps> = ({
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
  // ダメージ計算
  const calculateDamage = (randomCoeff: number = 100): number => {
    const baseDamage =
      attackPower * (attackMultiplier / 100) * (enemyDefense / 100);
    const skillDamage = baseDamage * skillCoeff;
    const weaknessDamage = skillDamage * weaknessCoeff;
    const finalDamage = weaknessDamage * (finalAttackMultiplier / 100);
    const otherDamage = finalDamage * (otherCoeff / 100);
    const randomDamage = otherDamage * (randomCoeff / 100);
    const crtDamage = randomDamage * (currentExpectation / 100);

    return crtDamage;
  };

  const minDamage = calculateDamage(randomCoeffMin);
  const maxDamage = calculateDamage(randomCoeffMax);
  const avgDamage = randomCoeffEnabled
    ? calculateDamage((randomCoeffMin + randomCoeffMax) / 2)
    : calculateDamage(100);

  return (
    <div className="mt-8 p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 shadow-lg">
      <h2 className="text-3xl font-bold text-yellow-800 mb-6 text-center">
        ダメージ計算結果
      </h2>

      {/* 計算式 */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-yellow-300">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">計算式</h3>
        <div className="text-sm text-gray-700 font-mono space-y-1">
          <div>結果 = A × B × C × D × E × F × G × H × I</div>
          <div>
            結果 = {attackPower.toLocaleString()} × {attackMultiplier}% ×{" "}
            {enemyDefense.toFixed(1)}% × {(skillCoeff * 100).toFixed(1)}% ×{" "}
            {(weaknessCoeff * 100).toFixed(0)}% ×{" "}
            {finalAttackMultiplier.toFixed(1)}% × {otherCoeff.toFixed(1)}% ×{" "}
            {randomCoeffEnabled
              ? `${randomCoeffMin.toFixed(1)}% ～ ${randomCoeffMax.toFixed(1)}%`
              : "100%"}{" "}
            × {currentExpectation.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* ダメージ結果 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 最小ダメージ */}
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">
            最小ダメージ
          </h4>
          <div className="text-2xl font-bold text-blue-600">
            {randomCoeffEnabled
              ? minDamage.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })
              : "N/A"}
          </div>
          {randomCoeffEnabled && (
            <div className="text-sm text-blue-600 mt-1">
              (ランダム係数: {randomCoeffMin.toFixed(1)}%)
            </div>
          )}
        </div>

        {/* 平均ダメージ */}
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-2">
            平均ダメージ
          </h4>
          <div className="text-2xl font-bold text-green-600">
            {avgDamage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-green-600 mt-1">
            (ランダム係数:{" "}
            {randomCoeffEnabled
              ? `${((randomCoeffMin + randomCoeffMax) / 2).toFixed(1)}%`
              : "100%"}
            )
          </div>
        </div>

        {/* 最大ダメージ */}
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="text-lg font-semibold text-red-800 mb-2">
            最大ダメージ
          </h4>
          <div className="text-2xl font-bold text-red-600">
            {randomCoeffEnabled
              ? maxDamage.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })
              : "N/A"}
          </div>
          {randomCoeffEnabled && (
            <div className="text-sm text-red-600 mt-1">
              (ランダム係数: {randomCoeffMax.toFixed(1)}%)
            </div>
          )}
        </div>
      </div>

      {/* ダメージ範囲 */}
      {randomCoeffEnabled && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-lg font-semibold text-purple-800 mb-2 text-center">
            ダメージ範囲
          </h4>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">
              {minDamage.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              ～{" "}
              {maxDamage.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="text-sm text-purple-600 mt-1">
              変動幅:{" "}
              {(maxDamage - minDamage).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              ({((maxDamage / minDamage) * 100 - 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculationResult;
