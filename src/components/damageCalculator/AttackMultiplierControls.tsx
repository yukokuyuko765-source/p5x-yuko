import React from "react";
import { NumericFormat } from "react-number-format";

interface AttackMultiplierControlsProps {
  attackMultiplierStat: number;
  setAttackMultiplierStat: (value: number) => void;
  allyDamageBuffs: number;
  setAllyDamageBuffs: (value: number) => void;
  enemyDamageDebuffs: number;
  setEnemyDamageDebuffs: (value: number) => void;
  attributeMultipliers: number;
  setAttributeMultipliers: (value: number) => void;
}

const AttackMultiplierControls: React.FC<AttackMultiplierControlsProps> = ({
  attackMultiplierStat,
  setAttackMultiplierStat,
  allyDamageBuffs,
  setAllyDamageBuffs,
  enemyDamageDebuffs,
  setEnemyDamageDebuffs,
  attributeMultipliers,
  setAttributeMultipliers,
}) => {
  const handleStatChange = (values: any): void => {
    const numValue = parseInt(values.value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(200, numValue));
      setAttackMultiplierStat(clampedValue);
    }
  };

  const allyTotal = allyDamageBuffs;
  const enemyTotal = enemyDamageDebuffs;
  const attributeTotal = attributeMultipliers;

  return (
    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-blue-800">攻撃倍率+計算</h3>
        <div className="font-semibold text-blue-600">
          ={" "}
          {100 + attackMultiplierStat + allyTotal + enemyTotal + attributeTotal}
          %
        </div>
      </div>

      {/* 攻撃倍率+ステータス */}
      <div className="flex items-center justify-between mb-3">
        <label className="font-semibold text-blue-700 text-lg whitespace-nowrap">
          攻撃倍率+
        </label>
        <div className="flex items-center gap-2">
          <NumericFormat
            className="w-24 px-3 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={attackMultiplierStat}
            onValueChange={handleStatChange}
            suffix="%"
            placeholder="0-200"
          />
        </div>
      </div>

      {/* 予ダメージ増バフ */}
      <div className="flex items-center justify-between mb-3">
        <label className="font-semibold text-blue-700 text-lg whitespace-nowrap">
          予ダメージ増バフ
        </label>
        <div className="flex items-center gap-2">
          <NumericFormat
            className="w-24 px-3 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={allyDamageBuffs}
            onValueChange={(values) =>
              setAllyDamageBuffs(parseInt(values.value) || 0)
            }
            suffix="%"
            placeholder="0"
          />
        </div>
      </div>

      {/* 被ダメージ増デバフ */}
      <div className="flex items-center justify-between mb-3">
        <label className="font-semibold text-blue-700 text-lg whitespace-nowrap">
          被ダメージ増デバフ
        </label>
        <div className="flex items-center gap-2">
          <NumericFormat
            className="w-24 px-3 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={enemyDamageDebuffs}
            onValueChange={(values) =>
              setEnemyDamageDebuffs(parseInt(values.value) || 0)
            }
            suffix="%"
            placeholder="0"
          />
        </div>
      </div>

      {/* 属性倍率 */}
      <div className="flex items-center justify-between">
        <label className="font-semibold text-blue-700 text-lg whitespace-nowrap">
          属性倍率
        </label>
        <div className="flex items-center gap-2">
          <NumericFormat
            className="w-24 px-3 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={attributeMultipliers}
            onValueChange={(values) =>
              setAttributeMultipliers(parseInt(values.value) || 0)
            }
            suffix="%"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
};

export default AttackMultiplierControls;
