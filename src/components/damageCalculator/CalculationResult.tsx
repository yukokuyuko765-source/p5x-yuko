import React from "react";

interface CalculationResultProps {
  attackPower: number;
  attackMultiplier: number;
  enemyDefense: number;
  skillCoeff: number;
  weaknessCoeff: number;
  finalAttackMultiplier: number;
  otherCoeff: number;
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

  const minDamage = calculateDamage(95);
  const maxDamage = calculateDamage(105);
  const avgDamage = calculateDamage(100);

  return (
    <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300">
      <h3 className="text-xl font-semibold text-yellow-800 mb-4">
        ダメージ計算結果
      </h3>

      {/* ダメージ結果 */}
      <div className="text-center">
        <div className="text-4xl font-bold text-yellow-700 mb-2">
          {minDamage.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}{" "}
          ～{" "}
          {maxDamage.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </div>
      </div>
    </div>
  );
};

export default CalculationResult;
