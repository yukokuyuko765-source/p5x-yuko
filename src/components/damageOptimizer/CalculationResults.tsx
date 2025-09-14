import React from "react";
import {
  AttackPowerConfig,
  AttackMultiplierConfig,
  EnemyDefenseConfig,
  CriticalConfig,
} from "../../utils/damageOptimization";

interface CalculationResultsProps {
  optimizationFactor: number;
  attackPower: AttackPowerConfig;
  attackMultiplier: AttackMultiplierConfig;
  enemyDefense: EnemyDefenseConfig;
  critical: CriticalConfig;
  totalCombatBuff: number;
  totalDamageIncrease: number;
  totalEnemyDamageIncrease: number;
  totalDefenseDebuff: number;
  totalCriticalRate: number;
  totalCriticalMultiplier: number;
}

const CalculationResults: React.FC<CalculationResultsProps> = ({
  optimizationFactor,
  attackPower,
  attackMultiplier,
  enemyDefense,
  critical,
  totalCombatBuff,
  totalDamageIncrease,
  totalEnemyDamageIncrease,
  totalDefenseDebuff,
  totalCriticalRate,
  totalCriticalMultiplier,
}) => {
  return (
    <div className="space-y-3">
      {/* 計算結果 */}
      <div className="bg-blue-50 rounded-lg p-3">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">計算結果</h2>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600 mb-1">
            {optimizationFactor.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 詳細計算結果 */}
      <div className="bg-gray-50 rounded-lg p-3">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">
          詳細計算結果
        </h2>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">攻撃力:</span>
            <span className="font-medium">
              {(
                (attackPower.characterBaseAttack + attackPower.weaponAttack) *
                  ((100 + attackPower.attackBuff + totalCombatBuff) / 100) +
                attackPower.attackConstant
              ).toFixed(0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">攻撃倍率+:</span>
            <span className="font-medium">
              {(
                (100 +
                  attackMultiplier.attackMultiplierPlus +
                  attackMultiplier.attributeAttackMultiplierPlus +
                  totalDamageIncrease +
                  totalEnemyDamageIncrease) /
                100
              ).toFixed(3)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">敵防御力:</span>
            <span className="font-medium">
              {(() => {
                const defenseMultiplier = Math.max(
                  0,
                  (1 + enemyDefense.additionalDefenseCoeff / 100) *
                    (1 - enemyDefense.penetration / 100) -
                    totalDefenseDebuff / 100
                );
                const numerator =
                  enemyDefense.baseDefense *
                  defenseMultiplier *
                  (enemyDefense.isWindAttack ? 0.88 : 1.0);
                const denominator = numerator + 1400;
                return (1 - numerator / denominator).toFixed(3);
              })()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">クリティカル期待値:</span>
            <span className="font-medium">
              {(
                1 +
                (Math.min(totalCriticalRate, 100) / 100) *
                  ((totalCriticalMultiplier - 100) / 100)
              ).toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationResults;
