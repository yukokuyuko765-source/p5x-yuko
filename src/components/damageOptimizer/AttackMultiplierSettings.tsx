import React from "react";
import { NumericFormat } from "react-number-format";
import { AttackMultiplierConfig } from "../../utils/damageOptimization";
import damageIncreaseData from "../../data/damageIncreaseData.json";
import enemyDamageIncreaseData from "../../data/enemyDamageIncreaseData.json";

interface AttackMultiplierSettingsProps {
  attackMultiplier: AttackMultiplierConfig;
  setAttackMultiplier: React.Dispatch<
    React.SetStateAction<AttackMultiplierConfig>
  >;
  damageIncreaseCheckboxes: Record<string, number>;
  setDamageIncreaseCheckboxes: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  enemyDamageIncreaseCheckboxes: Record<string, number>;
  setEnemyDamageIncreaseCheckboxes: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  totalDamageIncrease: number;
  totalEnemyDamageIncrease: number;
}

const AttackMultiplierSettings: React.FC<AttackMultiplierSettingsProps> = ({
  attackMultiplier,
  setAttackMultiplier,
  damageIncreaseCheckboxes,
  setDamageIncreaseCheckboxes,
  enemyDamageIncreaseCheckboxes,
  setEnemyDamageIncreaseCheckboxes,
  totalDamageIncrease,
  totalEnemyDamageIncrease,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <h2 className="text-sm font-semibold text-gray-800 mb-2">
        攻撃倍率+設定
      </h2>
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            攻撃倍率+
          </label>
          <NumericFormat
            value={attackMultiplier.attackMultiplierPlus}
            onValueChange={(values) =>
              setAttackMultiplier({
                ...attackMultiplier,
                attackMultiplierPlus: values.floatValue || 0,
              })
            }
            suffix="%"
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            属性攻撃倍率+
          </label>
          <NumericFormat
            value={attackMultiplier.attributeAttackMultiplierPlus}
            onValueChange={(values) =>
              setAttackMultiplier({
                ...attackMultiplier,
                attributeAttackMultiplierPlus: values.floatValue || 0,
              })
            }
            suffix="%"
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            与ダメージ上昇率
          </label>
          <NumericFormat
            value={attackMultiplier.damageIncreaseRate}
            onValueChange={(values) =>
              setAttackMultiplier({
                ...attackMultiplier,
                damageIncreaseRate: values.floatValue || 0,
              })
            }
            suffix="%"
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <div className="space-y-1">
            {damageIncreaseData.damageIncreases.map((damage) => (
              <div key={damage.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={damageIncreaseCheckboxes[damage.id] > 0}
                  onChange={(e) =>
                    setDamageIncreaseCheckboxes({
                      ...damageIncreaseCheckboxes,
                      [damage.id]: e.target.checked ? damage.value : 0,
                    })
                  }
                  className="mr-1"
                />
                <span className="text-xs text-gray-600">
                  {damage.name} ({damage.value}%)
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 p-2 bg-green-50 rounded border">
            <div className="text-xs font-medium text-green-800">
              合計: {totalDamageIncrease}%
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            敵被ダメージ上昇率
          </label>
          <NumericFormat
            value={attackMultiplier.enemyDamageIncreaseRate}
            onValueChange={(values) =>
              setAttackMultiplier({
                ...attackMultiplier,
                enemyDamageIncreaseRate: values.floatValue || 0,
              })
            }
            suffix="%"
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <div className="space-y-1">
            {enemyDamageIncreaseData.enemyDamageIncreases.map((enemy) => (
              <div key={enemy.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={enemyDamageIncreaseCheckboxes[enemy.id] > 0}
                  onChange={(e) =>
                    setEnemyDamageIncreaseCheckboxes({
                      ...enemyDamageIncreaseCheckboxes,
                      [enemy.id]: e.target.checked ? enemy.value : 0,
                    })
                  }
                  className="mr-1"
                />
                <span className="text-xs text-gray-600">
                  {enemy.name} ({enemy.value}%)
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 p-2 bg-orange-50 rounded border">
            <div className="text-xs font-medium text-orange-800">
              合計: {totalEnemyDamageIncrease}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackMultiplierSettings;
