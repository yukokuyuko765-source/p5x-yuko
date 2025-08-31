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
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { DamageCalculatorProps } from "../types";
import {
  allyDamageBuffs as allyBuffsData,
  enemyDamageDebuffs as enemyDebuffsData,
  attributeMultipliers as attributeMultsData,
} from "../data/attackMultiplierData";

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
  const [randomCoeffEnabled, setRandomCoeffEnabled] = useState<boolean>(false);
  const [randomCoeffMin, setRandomCoeffMin] = useState<number>(95);
  const [randomCoeffMax, setRandomCoeffMax] = useState<number>(105);
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
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white p-8 text-center">
        <h1 className="text-4xl font-light mb-2">ダメージ計算ツール</h1>
        <p className="text-xl opacity-90">
          パラメータを調整してダメージを計算してください
        </p>
      </div>

      {/* コンテンツ */}
      <div className="p-8">
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

        {/* ランダム係数コントロール */}
        <RandomCoeffControls
          randomCoeffEnabled={randomCoeffEnabled}
          setRandomCoeffEnabled={setRandomCoeffEnabled}
          randomCoeffMin={randomCoeffMin}
          setRandomCoeffMin={setRandomCoeffMin}
          randomCoeffMax={randomCoeffMax}
          setRandomCoeffMax={setRandomCoeffMax}
        />
      </div>

      {/* 計算結果ブロック */}
      <CalculationResult
        attackPower={attackPower}
        attackMultiplier={currentAttackMultiplier}
        enemyDefense={currentEnemyDefense}
        skillCoeff={skillCoeff}
        weaknessCoeff={weaknessCoeff}
        finalAttackMultiplier={finalAttackMultiplier}
        otherCoeff={otherCoeff}
        randomCoeffEnabled={randomCoeffEnabled}
        randomCoeffMin={randomCoeffMin}
        randomCoeffMax={randomCoeffMax}
        crtRate={crtRate}
        crtMultiplier={crtMultiplier}
        currentExpectation={currentExpectation}
      />

      {/* 権利表記・利用規約 */}
      <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-600 mb-2">
            本ツールは非営利のファン制作物であり、ゲームの公式コンテンツではありません。
          </p>
          <p className="text-xs text-gray-500 mb-2">
            ゲームのコンテンツと素材の商標と著作権は SEGA・ATLUS・Perfect World
            Games に帰属します。
          </p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>
              <strong>利用条件:</strong> 個人の学習・研究目的でのみ使用可能
            </p>
            <p>
              <strong>制限事項:</strong> 商用利用・営利目的での使用は禁止
            </p>
            <p>
              <strong>免責事項:</strong>{" "}
              計算結果の正確性については保証いたしません
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageCalculator;
