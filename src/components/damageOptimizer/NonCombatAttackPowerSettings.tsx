import React from "react";
import { NumericFormat } from "react-number-format";

interface NonCombatAttackPowerSettingsProps {
  nonCombatAttackPower: {
    targetAttackPower: number;
    weaponAttack: number;
    attackBuff: number;
    attackConstant: number;
  };
  setNonCombatAttackPower: React.Dispatch<
    React.SetStateAction<{
      targetAttackPower: number;
      weaponAttack: number;
      attackBuff: number;
      attackConstant: number;
    }>
  >;
}

const NonCombatAttackPowerSettings: React.FC<
  NonCombatAttackPowerSettingsProps
> = ({ nonCombatAttackPower, setNonCombatAttackPower }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <h2 className="text-sm font-semibold text-gray-800 mb-2">
        非戦闘時攻撃力設定
      </h2>
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            ステータス画面攻撃力
          </label>
          <NumericFormat
            value={nonCombatAttackPower.targetAttackPower}
            onValueChange={(values) =>
              setNonCombatAttackPower({
                ...nonCombatAttackPower,
                targetAttackPower: values.floatValue || 0,
              })
            }
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            武器攻撃力
          </label>
          <NumericFormat
            value={nonCombatAttackPower.weaponAttack}
            onValueChange={(values) =>
              setNonCombatAttackPower({
                ...nonCombatAttackPower,
                weaponAttack: values.floatValue || 0,
              })
            }
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            攻撃%(啓示と武器%合計)
          </label>
          <NumericFormat
            value={nonCombatAttackPower.attackBuff}
            onValueChange={(values) =>
              setNonCombatAttackPower({
                ...nonCombatAttackPower,
                attackBuff: values.floatValue || 0,
              })
            }
            suffix="%"
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            攻撃定数(啓示と武器合計)
          </label>
          <NumericFormat
            value={nonCombatAttackPower.attackConstant}
            onValueChange={(values) =>
              setNonCombatAttackPower({
                ...nonCombatAttackPower,
                attackConstant: values.floatValue || 0,
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

export default NonCombatAttackPowerSettings;
