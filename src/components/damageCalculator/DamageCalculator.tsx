import React, { useState } from "react";
import AttackPowerControls from "./AttackPowerControls";
import CRTControls from "./CRTControls";
import AttackMultiplierControls from "./AttackMultiplierControls";
import EnemyDefenseControls from "./EnemyDefenseControls";
import EnemyDefenseChart from "./EnemyDefenseChart";
import SkillCoeffControls from "./SkillCoeffControls";
import WeaknessCoeffControls from "./WeaknessCoeffControls";
import FinalAttackMultiplierControls from "./FinalAttackMultiplierControls";
import OtherCoeffControls from "./OtherCoeffControls";
import RandomCoeffControls from "./RandomCoeffControls";
import CalculationResult from "./CalculationResult";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { DamageCalculatorProps } from "../../types";
import {
  allyDamageBuffs as allyBuffsData,
  enemyDamageDebuffs as enemyDebuffsData,
  attributeMultipliers as attributeMultsData,
} from "../../data/attackMultiplierData";

const DamageCalculator: React.FC<DamageCalculatorProps> = () => {
  const [attackPower, setAttackPower] = useState<number>(1000);
  const [attackMultiplierStat, setAttackMultiplierStat] = useState<number>(0);
  const [allyDamageBuffs, setAllyDamageBuffs] = useState<string[]>([]);
  const [enemyDamageDebuffs, setEnemyDamageDebuffs] = useState<string[]>([]);
  const [attributeMultipliers, setAttributeMultipliers] = useState<string[]>(
    []
  );
  const [defense, setDefense] = useState<number>(300);
  const [additionalDefenseCoeff, setAdditionalDefenseCoeff] =
    useState<number>(10);
  const [penetration, setPenetration] = useState<number>(0);

  const [defenseDebuff, setDefenseDebuff] = useState<number>(0);

  const [windStrike, setWindStrike] = useState<boolean>(false);
  const [selectedEnemy, setSelectedEnemy] = useState<string>("");
  const [skillCoeff, setSkillCoeff] = useState<number>(1.0);
  const [weaknessCoeff, setWeaknessCoeff] = useState<number>(1.0);
  const [finalAttackMultiplier, setFinalAttackMultiplier] =
    useState<number>(100);
  const [otherCoeff, setOtherCoeff] = useState<number>(100);

  const [crtRate, setCrtRate] = useState<number>(50);
  const [crtMultiplier, setCrtMultiplier] = useState<number>(150);

  // CRT期待値の計算関数
  const calculateCRTExpectation = (
    rate: number,
    multiplier: number
  ): number => {
    return (rate * multiplier + (100 - rate) * 100) / 100;
  };

  // 攻撃倍率の計算
  const calculateAttackMultiplier = (): number => {
    const allyTotal = allyDamageBuffs.reduce((total, id) => {
      const buff = allyBuffsData.find((b) => b.id === id);
      return total + (buff?.value || 0);
    }, 0);

    const enemyTotal = enemyDamageDebuffs.reduce((total, id) => {
      const debuff = enemyDebuffsData.find((d) => d.id === id);
      return total + (debuff?.value || 0);
    }, 0);

    const attributeTotal = attributeMultipliers.reduce((total, id) => {
      const attr = attributeMultsData.find((a) => a.id === id);
      return total + (attr?.value || 0);
    }, 0);

    return 100 + attackMultiplierStat + allyTotal + enemyTotal + attributeTotal;
  };

  // 敵防御力の計算
  const calculateEnemyDefense = (): number => {
    const totalDefenseDebuff = defenseDebuff;
    let defenseCoeff = 100 + additionalDefenseCoeff;

    // 貫通による防御係数の減算
    defenseCoeff = (defenseCoeff * (100 - penetration)) / 100;

    // 防御率デバフによる減算
    defenseCoeff = defenseCoeff - totalDefenseDebuff;

    // 風襲状態異常の場合は防御係数に0.88をかける
    if (windStrike) {
      defenseCoeff *= 0.88;
    }

    // 防御係数が負の数の場合は0として扱う
    defenseCoeff = Math.max(0, defenseCoeff);

    const numerator = (defense * defenseCoeff) / 100;
    const denominator = numerator + 1400;
    return 100 - (numerator / denominator) * 100;
  };

  // 現在の期待値
  const currentExpectation = calculateCRTExpectation(crtRate, crtMultiplier);
  const currentAttackMultiplier = calculateAttackMultiplier();
  const currentEnemyDefense = calculateEnemyDefense();

  // キーボードショートカット
  useKeyboardShortcuts(
    attackPower,
    setAttackPower,
    attackMultiplierStat,
    setAttackMultiplierStat,
    crtRate,
    setCrtRate,
    crtMultiplier,
    setCrtMultiplier
  );

  return (
    <div className="max-w-[95vw] mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* ダッシュボードレイアウト */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* 左半分: 小さなコントロール群 */}
        <div className="lg:w-1/3 p-6">
          {/* 計算結果ブロック */}
          <div className="mb-8">
            <CalculationResult
              attackPower={attackPower}
              attackMultiplier={currentAttackMultiplier}
              enemyDefense={currentEnemyDefense}
              skillCoeff={skillCoeff}
              weaknessCoeff={weaknessCoeff}
              finalAttackMultiplier={finalAttackMultiplier}
              otherCoeff={otherCoeff}
              crtRate={crtRate}
              crtMultiplier={crtMultiplier}
              currentExpectation={currentExpectation}
            />
          </div>

          {/* 攻撃力コントロール */}
          <AttackPowerControls
            attackPower={attackPower}
            setAttackPower={setAttackPower}
          />

          {/* 攻撃倍率コントロール */}
          <AttackMultiplierControls
            attackMultiplierStat={attackMultiplierStat}
            setAttackMultiplierStat={setAttackMultiplierStat}
            allyDamageBuffs={allyDamageBuffs}
            setAllyDamageBuffs={setAllyDamageBuffs}
            enemyDamageDebuffs={enemyDamageDebuffs}
            setEnemyDamageDebuffs={setEnemyDamageDebuffs}
            attributeMultipliers={attributeMultipliers}
            setAttributeMultipliers={setAttributeMultipliers}
          />

          {/* CRT期待値コントロール */}
          <CRTControls
            crtRate={crtRate}
            setCrtRate={setCrtRate}
            crtMultiplier={crtMultiplier}
            setCrtMultiplier={setCrtMultiplier}
            currentExpectation={currentExpectation}
          />

          {/* スキル係数コントロール */}
          <SkillCoeffControls
            skillCoeff={skillCoeff}
            setSkillCoeff={setSkillCoeff}
          />

          {/* 弱点係数コントロール */}
          <WeaknessCoeffControls
            weaknessCoeff={weaknessCoeff}
            setWeaknessCoeff={setWeaknessCoeff}
          />

          {/* 最終攻撃倍率コントロール */}
          <FinalAttackMultiplierControls
            finalAttackMultiplier={finalAttackMultiplier}
            setFinalAttackMultiplier={setFinalAttackMultiplier}
          />

          {/* その他係数コントロール */}
          <OtherCoeffControls
            otherCoeff={otherCoeff}
            setOtherCoeff={setOtherCoeff}
          />
        </div>

        {/* 右半分: 敵防御力計算ブロック */}
        <div className="lg:w-2/3 p-6">
          {/* 敵防御力計算コントロール */}
          <EnemyDefenseControls
            defense={defense}
            setDefense={setDefense}
            additionalDefenseCoeff={additionalDefenseCoeff}
            setAdditionalDefenseCoeff={setAdditionalDefenseCoeff}
            penetration={penetration}
            setPenetration={setPenetration}
            defenseDebuff={defenseDebuff}
            setDefenseDebuff={setDefenseDebuff}
            windStrike={windStrike}
            setWindStrike={setWindStrike}
            selectedEnemy={selectedEnemy}
            setSelectedEnemy={setSelectedEnemy}
          />

          {/* 計算式 */}
          <div className="mt-6 p-6 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              計算式
            </h3>
            <div className="text-sm text-gray-700 font-mono space-y-1">
              <div>
                結果 ={" "}
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                  攻撃力計算
                </span>{" "}
                ×{" "}
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  攻撃倍率+計算
                </span>{" "}
                ×{" "}
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  敵防御力計算
                </span>{" "}
                ×{" "}
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  CRT期待値
                </span>{" "}
                ×
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  スキル係数
                </span>{" "}
                ×{" "}
                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded">
                  弱点係数
                </span>{" "}
                ×{" "}
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                  最終攻撃倍率+
                </span>{" "}
                ×{" "}
                <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded">
                  その他係数
                </span>{" "}
                ×
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  {"ランダム範囲係数(95~105%)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageCalculator;
