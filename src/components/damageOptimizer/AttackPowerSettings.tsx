import React from "react";
import { NumericFormat } from "react-number-format";
import { AttackPowerConfig } from "../../utils/damageOptimization";
import combatBuffData from "../../data/combatBuffData.json";

interface AttackPowerSettingsProps {
  attackPower: AttackPowerConfig;
  setAttackPower: React.Dispatch<React.SetStateAction<AttackPowerConfig>>;
  combatBonus: {
    combatBuff: number;
    combatConstant: number;
  };
  setCombatBonus: React.Dispatch<
    React.SetStateAction<{
      combatBuff: number;
      combatConstant: number;
    }>
  >;
  combatBuffCheckboxes: Record<string, number>;
  setCombatBuffCheckboxes: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  totalCombatBuff: number;
}

const AttackPowerSettings: React.FC<AttackPowerSettingsProps> = ({
  attackPower,
  setAttackPower,
  combatBonus,
  setCombatBonus,
  combatBuffCheckboxes,
  setCombatBuffCheckboxes,
  totalCombatBuff,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <h2 className="text-sm font-semibold text-gray-800 mb-2">攻撃力設定</h2>
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            キャラ基礎値
          </label>
          <div className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-600">
            {attackPower.characterBaseAttack.toLocaleString()}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            武器攻撃力
          </label>
          <div className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-600">
            {attackPower.weaponAttack.toLocaleString()}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            バフ率
          </label>
          <div className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-600">
            {attackPower.attackBuff}%
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            定数
          </label>
          <div className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-600">
            {attackPower.attackConstant.toLocaleString()}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            戦闘時バフ
          </label>
          <NumericFormat
            value={combatBonus.combatBuff}
            onValueChange={(values) =>
              setCombatBonus({
                ...combatBonus,
                combatBuff: values.floatValue || 0,
              })
            }
            suffix="%"
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <div className="space-y-1">
            {combatBuffData.combatBuffs.map((buff) => (
              <div key={buff.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={combatBuffCheckboxes[buff.id] > 0}
                  onChange={(e) =>
                    setCombatBuffCheckboxes({
                      ...combatBuffCheckboxes,
                      [buff.id]: e.target.checked ? buff.value : 0,
                    })
                  }
                  className="mr-1"
                />
                <span className="text-xs text-gray-600">
                  {buff.name} ({buff.value}%)
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 p-2 bg-blue-50 rounded border">
            <div className="text-xs font-medium text-blue-800">
              合計: {totalCombatBuff}%
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            戦闘時攻撃定数
          </label>
          <NumericFormat
            value={combatBonus.combatConstant}
            onValueChange={(values) =>
              setCombatBonus({
                ...combatBonus,
                combatConstant: values.floatValue || 0,
              })
            }
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AttackPowerSettings;
