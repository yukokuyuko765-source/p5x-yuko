import React from "react";
import { NumericFormat } from "react-number-format";
import { EnemyDefenseConfig } from "../../utils/damageOptimization";
import enemyData from "../../data/enemyData.json";
import defenseDebuffData from "../../data/defenseDebuffData.json";

interface EnemyDefenseSettingsProps {
  selectedEnemyId: string;
  setSelectedEnemyId: React.Dispatch<React.SetStateAction<string>>;
  enemyDefense: EnemyDefenseConfig;
  setEnemyDefense: React.Dispatch<React.SetStateAction<EnemyDefenseConfig>>;
  defenseDebuffCheckboxes: Record<string, number>;
  setDefenseDebuffCheckboxes: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  totalDefenseDebuff: number;
}

const EnemyDefenseSettings: React.FC<EnemyDefenseSettingsProps> = ({
  selectedEnemyId,
  setSelectedEnemyId,
  enemyDefense,
  setEnemyDefense,
  defenseDebuffCheckboxes,
  setDefenseDebuffCheckboxes,
  totalDefenseDebuff,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <h2 className="text-sm font-semibold text-gray-800 mb-2">敵防御力設定</h2>
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            敵選択
          </label>
          <select
            value={selectedEnemyId}
            onChange={(e) => setSelectedEnemyId(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">敵を選択してください</option>
            {enemyData.enemies.map((enemy) => (
              <option key={enemy.id} value={enemy.id}>
                {enemy.name} (防御力: {enemy.def})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            敵防御力
          </label>
          <NumericFormat
            value={enemyDefense.baseDefense}
            onValueChange={(values) =>
              setEnemyDefense({
                ...enemyDefense,
                baseDefense: values.floatValue || 0,
              })
            }
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            追加防御係数
          </label>
          <NumericFormat
            value={enemyDefense.additionalDefenseCoeff}
            onValueChange={(values) =>
              setEnemyDefense({
                ...enemyDefense,
                additionalDefenseCoeff: values.floatValue || 0,
              })
            }
            suffix="%"
            decimalScale={2}
            fixedDecimalScale={false}
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            貫通
          </label>
          <NumericFormat
            value={enemyDefense.penetration}
            onValueChange={(values) =>
              setEnemyDefense({
                ...enemyDefense,
                penetration: values.floatValue || 0,
              })
            }
            suffix="%"
            decimalScale={2}
            fixedDecimalScale={false}
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            防御デバフ
          </label>
          <NumericFormat
            value={enemyDefense.defenseDebuff}
            onValueChange={(values) =>
              setEnemyDefense({
                ...enemyDefense,
                defenseDebuff: values.floatValue || 0,
              })
            }
            suffix="%"
            decimalScale={2}
            fixedDecimalScale={false}
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <div className="space-y-1">
            {defenseDebuffData.defenseDebuffs.map((debuff) => (
              <div key={debuff.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={defenseDebuffCheckboxes[debuff.id] > 0}
                  onChange={(e) =>
                    setDefenseDebuffCheckboxes({
                      ...defenseDebuffCheckboxes,
                      [debuff.id]: e.target.checked ? debuff.value : 0,
                    })
                  }
                  className="mr-1"
                />
                <span className="text-xs text-gray-600">
                  {debuff.name} ({debuff.value}%)
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 p-2 bg-red-50 rounded border">
            <div className="text-xs font-medium text-red-800">
              合計: {totalDefenseDebuff}%
            </div>
          </div>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={enemyDefense.isWindAttack}
              onChange={(e) =>
                setEnemyDefense({
                  ...enemyDefense,
                  isWindAttack: e.target.checked,
                })
              }
              className="mr-2"
            />
            <span className="text-xs text-gray-700">風襲時</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default EnemyDefenseSettings;
