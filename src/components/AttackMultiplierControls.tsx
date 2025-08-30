import React from "react";
import {
  allyDamageBuffs as allyBuffsData,
  enemyDamageDebuffs as enemyDebuffsData,
  attributeMultipliers as attributeMultsData,
  BuffOption,
} from "../data/attackMultiplierData";

interface AttackMultiplierControlsProps {
  attackMultiplierStat: number;
  setAttackMultiplierStat: (value: number) => void;
  allyDamageBuffs: string[];
  setAllyDamageBuffs: (value: string[]) => void;
  enemyDamageDebuffs: string[];
  setEnemyDamageDebuffs: (value: string[]) => void;
  attributeMultipliers: string[];
  setAttributeMultipliers: (value: string[]) => void;
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
  const handleStatChange = (value: string): void => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(200, numValue));
      setAttackMultiplierStat(clampedValue);
    }
  };

  const handleBuffToggle = (
    buffId: string,
    currentBuffs: string[],
    setBuffs: (value: string[]) => void
  ): void => {
    if (currentBuffs.includes(buffId)) {
      setBuffs(currentBuffs.filter((id) => id !== buffId));
    } else {
      setBuffs([...currentBuffs, buffId]);
    }
  };

  const calculateTotalValue = (
    selectedIds: string[],
    options: BuffOption[]
  ): number => {
    return selectedIds.reduce((total, id) => {
      const option = options.find((opt) => opt.id === id);
      return total + (option?.value || 0);
    }, 0);
  };

  const allyTotal = calculateTotalValue(allyDamageBuffs, allyBuffsData);
  const enemyTotal = calculateTotalValue(enemyDamageDebuffs, enemyDebuffsData);
  const attributeTotal = calculateTotalValue(
    attributeMultipliers,
    attributeMultsData
  );

  return (
    <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">攻撃倍率設定</h3>

      {/* 攻撃倍率ステータス */}
      <div className="mb-6">
        <label className="font-semibold mb-3 text-blue-700 text-lg block">
          攻撃倍率ステータス (%)
        </label>
        <div className="flex items-center gap-4 mb-3">
          <input
            type="range"
            className="slider"
            min="0"
            max="200"
            value={attackMultiplierStat}
            onChange={(e) => setAttackMultiplierStat(parseInt(e.target.value))}
            step="1"
          />
          <div className="min-w-[60px] px-3 py-2 bg-blue-500 text-white rounded-lg text-center font-semibold text-sm">
            {attackMultiplierStat}%
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-20 px-3 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            min="0"
            max="200"
            value={attackMultiplierStat}
            onChange={(e) => handleStatChange(e.target.value)}
            step="1"
            placeholder="0-200"
          />
          <span className="font-semibold text-blue-700 text-sm">%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 味方予ダメージ増バフ */}
        <div>
          <h4 className="font-semibold mb-3 text-blue-700">
            味方予ダメージ増バフ (合計: {allyTotal}%)
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {allyBuffsData.map((buff) => (
              <label
                key={buff.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={allyDamageBuffs.includes(buff.id)}
                  onChange={() =>
                    handleBuffToggle(
                      buff.id,
                      allyDamageBuffs,
                      setAllyDamageBuffs
                    )
                  }
                  className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-blue-800">
                  {buff.name} (+{buff.value}%)
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 敵被ダメージ増デバフ */}
        <div>
          <h4 className="font-semibold mb-3 text-blue-700">
            敵被ダメージ増デバフ (合計: {enemyTotal}%)
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {enemyDebuffsData.map((debuff) => (
              <label
                key={debuff.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={enemyDamageDebuffs.includes(debuff.id)}
                  onChange={() =>
                    handleBuffToggle(
                      debuff.id,
                      enemyDamageDebuffs,
                      setEnemyDamageDebuffs
                    )
                  }
                  className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-blue-800">
                  {debuff.name} (+{debuff.value}%)
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 属性倍率 */}
        <div>
          <h4 className="font-semibold mb-3 text-blue-700">
            属性倍率 (合計: {attributeTotal}%)
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {attributeMultsData.map((attr) => (
              <label
                key={attr.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={attributeMultipliers.includes(attr.id)}
                  onChange={() =>
                    handleBuffToggle(
                      attr.id,
                      attributeMultipliers,
                      setAttributeMultipliers
                    )
                  }
                  className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-blue-800">
                  {attr.name} (+{attr.value}%)
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 合計表示 */}
      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-800">
            攻撃倍率 = 100% + {attackMultiplierStat}% + {allyTotal}% +{" "}
            {enemyTotal}% + {attributeTotal}% ={" "}
            {100 +
              attackMultiplierStat +
              allyTotal +
              enemyTotal +
              attributeTotal}
            %
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackMultiplierControls;
