import React, { useState } from "react";
import CRTChart from "./CRTChart";
import ParameterControls from "./ParameterControls";
import AttackMultiplierControls from "./AttackMultiplierControls";
import EnemyDefenseControls from "./EnemyDefenseControls";
import FormulaDisplay from "./FormulaDisplay";
import InfoPanel from "./InfoPanel";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { ChartData, CRTExpectationCalculatorProps } from "../types";
import {
  allyDamageBuffs as allyBuffsData,
  enemyDamageDebuffs as enemyDebuffsData,
  attributeMultipliers as attributeMultsData,
} from "../data/attackMultiplierData";
import {
  defensePresets,
  penetrationOptions as penetrationOptionsData,
  defenseDebuffOptions as defenseDebuffOptionsData,
} from "../data/enemyDefenseData";

const CRTExpectationCalculator: React.FC<
  CRTExpectationCalculatorProps
> = () => {
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
  const [penetrationBuffs, setPenetrationBuffs] = useState<string[]>([]);
  const [defenseDebuff, setDefenseDebuff] = useState<number>(0);
  const [defenseDebuffs, setDefenseDebuffs] = useState<string[]>([]);
  const [windStrike, setWindStrike] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("normal");
  const [crtRate, setCrtRate] = useState<number>(50);
  const [crtMultiplier, setCrtMultiplier] = useState<number>(150);

  // CRT期待値の計算関数
  const calculateCRTExpectation = (
    rate: number,
    multiplier: number
  ): number => {
    return (rate * multiplier + (100 - rate) * 100) / 100;
  };

  // グラフデータの生成
  const generateChartData = (): ChartData => {
    const data: number[] = [];
    const labels: string[] = [];

    // CRT倍率の値を150%から300%まで生成
    for (let b = 150; b <= 300; b += 2) {
      labels.push(b + "%");
      data.push(calculateCRTExpectation(crtRate, b));
    }

    return { labels, data };
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
    const penetrationTotal = penetrationBuffs.reduce((total, id) => {
      const option = penetrationOptionsData.find((opt) => opt.id === id);
      return total + (option?.value || 0);
    }, 0);

    const defenseDebuffTotal = defenseDebuffs.reduce((total, id) => {
      const option = defenseDebuffOptionsData.find((opt) => opt.id === id);
      return total + (option?.value || 0);
    }, 0);

    const totalPenetration = penetration + penetrationTotal;
    const totalDefenseDebuff = defenseDebuff + defenseDebuffTotal;
    let defenseCoeff =
      ((100 + additionalDefenseCoeff) * (100 - totalPenetration)) / 100 -
      totalDefenseDebuff;

    // 風襲状態異常の場合は防御係数に0.88をかける
    if (windStrike) {
      defenseCoeff *= 0.88;
    }
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
        <h1 className="text-4xl font-light mb-2">
          CRT期待値 = CRT発生率% × CRT倍率% + (100% - CRT発生率%) × 100%
        </h1>
        <p className="text-xl opacity-90">
          CRT発生率とCRT倍率を調整してグラフの変化を確認してください
        </p>
      </div>

      {/* コンテンツ */}
      <div className="p-8">
        {/* パラメータコントロール */}
        <ParameterControls
          attackPower={attackPower}
          setAttackPower={setAttackPower}
          crtRate={crtRate}
          setCrtRate={setCrtRate}
          crtMultiplier={crtMultiplier}
          setCrtMultiplier={setCrtMultiplier}
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
          penetrationBuffs={penetrationBuffs}
          setPenetrationBuffs={setPenetrationBuffs}
          defenseDebuff={defenseDebuff}
          setDefenseDebuff={setDefenseDebuff}
          defenseDebuffs={defenseDebuffs}
          setDefenseDebuffs={setDefenseDebuffs}
          windStrike={windStrike}
          setWindStrike={setWindStrike}
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
        />

        {/* 計算式表示 */}
        <FormulaDisplay
          attackPower={attackPower}
          attackMultiplier={currentAttackMultiplier}
          enemyDefense={currentEnemyDefense}
          crtRate={crtRate}
          crtMultiplier={crtMultiplier}
          currentExpectation={currentExpectation}
        />

        {/* グラフ */}
        <CRTChart
          chartData={generateChartData()}
          crtRate={crtRate}
          crtMultiplier={crtMultiplier}
          currentExpectation={currentExpectation}
        />

        {/* 情報パネル */}
        <InfoPanel />
      </div>
    </div>
  );
};

export default CRTExpectationCalculator;
