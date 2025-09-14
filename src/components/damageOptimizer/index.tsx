import React, { useState, useEffect, useCallback } from "react";
import {
  calculateOptimizationFactor,
  calculateCharacterBaseAttack,
  DamageCalculationConfig,
  AttackPowerConfig,
  AttackMultiplierConfig,
  EnemyDefenseConfig,
  CriticalConfig,
} from "../../utils/damageOptimization";
import { PatternData } from "./types";
import enemyData from "../../data/enemyData.json";
import combatBuffData from "../../data/combatBuffData.json";
import damageIncreaseData from "../../data/damageIncreaseData.json";
import enemyDamageIncreaseData from "../../data/enemyDamageIncreaseData.json";
import attributeAttackMultiplierData from "../../data/attributeAttackMultiplierData.json";
import defenseDebuffData from "../../data/defenseDebuffData.json";
import criticalRateData from "../../data/criticalRateData.json";
import criticalMultiplierData from "../../data/criticalMultiplierData.json";

// コンポーネントのインポート
import NonCombatAttackPowerSettings from "./NonCombatAttackPowerSettings";
import AttackPowerSettings from "./AttackPowerSettings";
import AttackMultiplierSettings from "./AttackMultiplierSettings";
import EnemyDefenseSettings from "./EnemyDefenseSettings";
import CriticalSettings from "./CriticalSettings";
import CalculationResults from "./CalculationResults";
import PatternInput from "./PatternInput";

const DamageOptimizer: React.FC = () => {
  // 攻撃力設定
  const [attackPower, setAttackPower] = useState<AttackPowerConfig>({
    characterBaseAttack: 0, // 非戦闘時攻撃力設定から自動反映
    weaponAttack: 0, // 非戦闘時攻撃力設定から自動反映
    attackBuff: 0, // 非戦闘時攻撃力設定から自動反映
    attackConstant: 0, // 非戦闘時攻撃力設定から自動反映
  });

  // 非戦闘時攻撃力設定
  const [nonCombatAttackPower, setNonCombatAttackPower] = useState({
    targetAttackPower: 0,
    weaponAttack: 0,
    attackBuff: 0,
    attackConstant: 0,
  });

  // 戦闘時追加設定
  const [combatBonus, setCombatBonus] = useState({
    combatBuff: 0, // 戦闘時バフ
    combatConstant: 0, // 戦闘時攻撃定数
  });

  // 攻撃倍率+設定
  const [attackMultiplier, setAttackMultiplier] =
    useState<AttackMultiplierConfig>({
      baseMultiplier: 100,
      attackMultiplierPlus: 0,
      attributeAttackMultiplierPlus: 0,
      damageIncreaseRate: 0,
      enemyDamageIncreaseRate: 0,
    });

  // 敵防御力設定
  const [selectedEnemyId, setSelectedEnemyId] = useState<string>("");
  const [enemyDefense, setEnemyDefense] = useState<EnemyDefenseConfig>({
    baseDefense: 0,
    additionalDefenseCoeff: 0,
    penetration: 0,
    defenseDebuff: 0,
    isWindAttack: false,
  });

  // クリティカル設定
  const [critical, setCritical] = useState<CriticalConfig>({
    criticalRate: 5,
    criticalMultiplier: 150,
  });

  // 最適化係数
  const [optimizationFactor, setOptimizationFactor] = useState<number>(0);

  // パターン管理
  const [patterns, setPatterns] = useState<PatternData[]>([]);
  const [nextPatternId, setNextPatternId] = useState<number>(1);

  // 戦闘時バフのチェックボックス用の状態（JSONから動的に作成）
  const [combatBuffCheckboxes, setCombatBuffCheckboxes] = useState<
    Record<string, number>
  >(
    combatBuffData.combatBuffs.reduce((acc, buff) => {
      acc[buff.id] = 0;
      return acc;
    }, {} as Record<string, number>)
  );

  // 与ダメージ上昇率のチェックボックス用の状態
  const [damageIncreaseCheckboxes, setDamageIncreaseCheckboxes] = useState<
    Record<string, number>
  >(
    damageIncreaseData.damageIncreases.reduce((acc, damage) => {
      acc[damage.id] = 0;
      return acc;
    }, {} as Record<string, number>)
  );

  // 敵被ダメージ上昇率のチェックボックス用の状態
  const [enemyDamageIncreaseCheckboxes, setEnemyDamageIncreaseCheckboxes] =
    useState<Record<string, number>>(
      enemyDamageIncreaseData.enemyDamageIncreases.reduce((acc, enemy) => {
        acc[enemy.id] = 0;
        return acc;
      }, {} as Record<string, number>)
    );

  // 属性攻撃倍率+のチェックボックス用の状態
  const [
    attributeAttackMultiplierCheckboxes,
    setAttributeAttackMultiplierCheckboxes,
  ] = useState<Record<string, number>>(
    attributeAttackMultiplierData.attributeAttackMultipliers.reduce(
      (acc, attr) => {
        acc[attr.id] = 0;
        return acc;
      },
      {} as Record<string, number>
    )
  );

  // 防御デバフのチェックボックス用の状態
  const [defenseDebuffCheckboxes, setDefenseDebuffCheckboxes] = useState<
    Record<string, number>
  >(
    defenseDebuffData.defenseDebuffs.reduce((acc, debuff) => {
      acc[debuff.id] = 0;
      return acc;
    }, {} as Record<string, number>)
  );

  // クリティカル発生率のチェックボックス用の状態
  const [criticalRateCheckboxes, setCriticalRateCheckboxes] = useState<
    Record<string, number>
  >(
    criticalRateData.criticalRates.reduce((acc, crit) => {
      acc[crit.id] = 0;
      return acc;
    }, {} as Record<string, number>)
  );

  // クリティカル倍率のチェックボックス用の状態
  const [criticalMultiplierCheckboxes, setCriticalMultiplierCheckboxes] =
    useState<Record<string, number>>(
      criticalMultiplierData.criticalMultipliers.reduce((acc, mult) => {
        acc[mult.id] = 0;
        return acc;
      }, {} as Record<string, number>)
    );

  // 戦闘時バフの合計値を計算（チェックボックス + 手動入力）
  const totalCombatBuff =
    Object.values(combatBuffCheckboxes).reduce((sum, value) => sum + value, 0) +
    combatBonus.combatBuff;

  // 与ダメージ上昇率の合計値を計算（チェックボックス + 手動入力）
  const totalDamageIncrease =
    Object.values(damageIncreaseCheckboxes).reduce(
      (sum, value) => sum + value,
      0
    ) + attackMultiplier.damageIncreaseRate;

  // 敵被ダメージ上昇率の合計値を計算（チェックボックス + 手動入力）
  const totalEnemyDamageIncrease =
    Object.values(enemyDamageIncreaseCheckboxes).reduce(
      (sum, value) => sum + value,
      0
    ) + attackMultiplier.enemyDamageIncreaseRate;

  // 属性攻撃倍率+の合計値を計算（チェックボックス + 手動入力）
  const totalAttributeAttackMultiplier =
    Object.values(attributeAttackMultiplierCheckboxes).reduce(
      (sum, value) => sum + value,
      0
    ) + attackMultiplier.attributeAttackMultiplierPlus;

  // 防御デバフの合計値を計算（チェックボックス + 手動入力）
  const totalDefenseDebuff =
    Object.values(defenseDebuffCheckboxes).reduce(
      (sum, value) => sum + value,
      0
    ) + enemyDefense.defenseDebuff;

  // クリティカル発生率の合計値を計算（チェックボックス + 手動入力）
  const totalCriticalRate =
    Object.values(criticalRateCheckboxes).reduce(
      (sum, value) => sum + value,
      0
    ) + critical.criticalRate;

  // クリティカル倍率の合計値を計算（チェックボックス + 手動入力）
  const totalCriticalMultiplier =
    Object.values(criticalMultiplierCheckboxes).reduce(
      (sum, value) => sum + value,
      0
    ) + critical.criticalMultiplier;

  // 非戦闘時攻撃力設定が変更されたときに自動計算
  useEffect(() => {
    const characterBaseAttack = calculateCharacterBaseAttack(
      nonCombatAttackPower.targetAttackPower,
      nonCombatAttackPower.weaponAttack,
      nonCombatAttackPower.attackBuff,
      nonCombatAttackPower.attackConstant
    );
    setAttackPower({
      characterBaseAttack:
        characterBaseAttack !== 0 ? Math.round(characterBaseAttack) : 0,
      weaponAttack: nonCombatAttackPower.weaponAttack,
      attackBuff: nonCombatAttackPower.attackBuff,
      attackConstant: nonCombatAttackPower.attackConstant,
    });
  }, [nonCombatAttackPower]);

  // 敵選択が変更されたときに自動設定
  useEffect(() => {
    if (selectedEnemyId) {
      const selectedEnemy = enemyData.enemies.find(
        (enemy) => enemy.id === selectedEnemyId
      );
      if (selectedEnemy) {
        setEnemyDefense((prev) => ({
          ...prev,
          baseDefense: selectedEnemy.def,
          additionalDefenseCoeff: selectedEnemy.additional_def_coeff,
        }));
      }
    }
  }, [selectedEnemyId]);

  // 計算されたキャラ基礎攻撃力を取得
  const calculatedCharacterBaseAttack = calculateCharacterBaseAttack(
    nonCombatAttackPower.targetAttackPower,
    nonCombatAttackPower.weaponAttack,
    nonCombatAttackPower.attackBuff,
    nonCombatAttackPower.attackConstant
  );

  // パターン追加機能
  const addPattern = () => {
    const newPattern: PatternData = {
      id: `pattern-${nextPatternId}`,
      name: `パターン ${nextPatternId}`,
      nonCombatAttackPower: { ...nonCombatAttackPower },
      attackPower: { ...attackPower },
      combatBonus: { ...combatBonus },
      attackMultiplier: { ...attackMultiplier },
      selectedEnemyId,
      enemyDefense: { ...enemyDefense },
      critical: { ...critical },
      combatBuffCheckboxes: { ...combatBuffCheckboxes },
      damageIncreaseCheckboxes: { ...damageIncreaseCheckboxes },
      enemyDamageIncreaseCheckboxes: { ...enemyDamageIncreaseCheckboxes },
      attributeAttackMultiplierCheckboxes: {
        ...attributeAttackMultiplierCheckboxes,
      },
      defenseDebuffCheckboxes: { ...defenseDebuffCheckboxes },
      criticalRateCheckboxes: { ...criticalRateCheckboxes },
      criticalMultiplierCheckboxes: { ...criticalMultiplierCheckboxes },
      optimizationFactor,
    };

    setPatterns([...patterns, newPattern]);
    setNextPatternId(nextPatternId + 1);
  };

  // パターン削除機能
  const removePattern = useCallback((id: string) => {
    setPatterns((prevPatterns) =>
      prevPatterns.filter((pattern) => pattern.id !== id)
    );
  }, []);

  // パターン更新機能
  const updatePattern = useCallback((updatedPattern: PatternData) => {
    setPatterns((prevPatterns) =>
      prevPatterns.map((pattern) =>
        pattern.id === updatedPattern.id ? updatedPattern : pattern
      )
    );
  }, []);

  // 最適化係数の自動計算
  useEffect(() => {
    const config: DamageCalculationConfig = {
      characterId: "",
      skillId: "",
      enemyId: "",
      attackPower: {
        ...attackPower,
        characterBaseAttack:
          calculatedCharacterBaseAttack !== 0
            ? Math.round(calculatedCharacterBaseAttack)
            : 0,
        weaponAttack: nonCombatAttackPower.weaponAttack,
        attackBuff: nonCombatAttackPower.attackBuff + totalCombatBuff,
        attackConstant:
          nonCombatAttackPower.attackConstant + combatBonus.combatConstant,
      },
      attackMultiplier: {
        ...attackMultiplier,
        attributeAttackMultiplierPlus: totalAttributeAttackMultiplier,
        damageIncreaseRate: totalDamageIncrease,
        enemyDamageIncreaseRate: totalEnemyDamageIncrease,
      },
      enemyDefense: {
        ...enemyDefense,
        defenseDebuff: totalDefenseDebuff,
      },
      critical: {
        ...critical,
        criticalRate: totalCriticalRate,
        criticalMultiplier: totalCriticalMultiplier,
      },
      weakness: { weaknessType: "normal" },
      randomCoeff: { minRandomCoeff: 0.95, maxRandomCoeff: 1.05 },
      skillCoeff: 1.0,
      finalAttackMultiplier: 1.0,
      otherCoeff: 1.0,
    };

    const factor = calculateOptimizationFactor(config);
    setOptimizationFactor(factor);
  }, [
    calculatedCharacterBaseAttack,
    nonCombatAttackPower,
    combatBonus,
    totalCombatBuff,
    totalAttributeAttackMultiplier,
    totalDamageIncrease,
    totalEnemyDamageIncrease,
    totalDefenseDebuff,
    totalCriticalRate,
    totalCriticalMultiplier,
    attackMultiplier,
    enemyDefense,
    critical,
  ]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          ダメージ係数比較ツール
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-6 gap-3">
          {/* 非戦闘時攻撃力設定 */}
          <NonCombatAttackPowerSettings
            nonCombatAttackPower={nonCombatAttackPower}
            setNonCombatAttackPower={setNonCombatAttackPower}
          />

          {/* 攻撃力設定 */}
          <AttackPowerSettings
            attackPower={attackPower}
            setAttackPower={setAttackPower}
            combatBonus={combatBonus}
            setCombatBonus={setCombatBonus}
            combatBuffCheckboxes={combatBuffCheckboxes}
            setCombatBuffCheckboxes={setCombatBuffCheckboxes}
            totalCombatBuff={totalCombatBuff}
          />

          {/* 攻撃倍率+設定 */}
          <AttackMultiplierSettings
            attackMultiplier={attackMultiplier}
            setAttackMultiplier={setAttackMultiplier}
            damageIncreaseCheckboxes={damageIncreaseCheckboxes}
            setDamageIncreaseCheckboxes={setDamageIncreaseCheckboxes}
            enemyDamageIncreaseCheckboxes={enemyDamageIncreaseCheckboxes}
            setEnemyDamageIncreaseCheckboxes={setEnemyDamageIncreaseCheckboxes}
            attributeAttackMultiplierCheckboxes={
              attributeAttackMultiplierCheckboxes
            }
            setAttributeAttackMultiplierCheckboxes={
              setAttributeAttackMultiplierCheckboxes
            }
            totalDamageIncrease={totalDamageIncrease}
            totalEnemyDamageIncrease={totalEnemyDamageIncrease}
            totalAttributeAttackMultiplier={totalAttributeAttackMultiplier}
          />

          {/* 敵防御力設定 */}
          <EnemyDefenseSettings
            selectedEnemyId={selectedEnemyId}
            setSelectedEnemyId={setSelectedEnemyId}
            enemyDefense={enemyDefense}
            setEnemyDefense={setEnemyDefense}
            defenseDebuffCheckboxes={defenseDebuffCheckboxes}
            setDefenseDebuffCheckboxes={setDefenseDebuffCheckboxes}
            totalDefenseDebuff={totalDefenseDebuff}
          />

          {/* クリティカル設定 */}
          <CriticalSettings
            critical={critical}
            setCritical={setCritical}
            criticalRateCheckboxes={criticalRateCheckboxes}
            setCriticalRateCheckboxes={setCriticalRateCheckboxes}
            criticalMultiplierCheckboxes={criticalMultiplierCheckboxes}
            setCriticalMultiplierCheckboxes={setCriticalMultiplierCheckboxes}
            totalCriticalRate={totalCriticalRate}
            totalCriticalMultiplier={totalCriticalMultiplier}
          />

          {/* 計算結果と詳細計算結果 */}
          <CalculationResults
            optimizationFactor={optimizationFactor}
            attackPower={attackPower}
            attackMultiplier={attackMultiplier}
            enemyDefense={enemyDefense}
            critical={critical}
            totalCombatBuff={totalCombatBuff}
            totalAttributeAttackMultiplier={totalAttributeAttackMultiplier}
            totalDamageIncrease={totalDamageIncrease}
            totalEnemyDamageIncrease={totalEnemyDamageIncrease}
            totalDefenseDebuff={totalDefenseDebuff}
            totalCriticalRate={totalCriticalRate}
            totalCriticalMultiplier={totalCriticalMultiplier}
          />
        </div>

        {/* パターン追加ボタン */}
        <div className="mt-6 text-right">
          <button
            onClick={addPattern}
            className="font-medium py-2 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-0 transform active:translate-y-1 active:shadow-inner"
          >
            パターンを追加
          </button>
        </div>

        {/* パターン比較 */}
        {patterns.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              パターン比較
            </h2>
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <PatternInput
                  key={pattern.id}
                  pattern={pattern}
                  onUpdatePattern={updatePattern}
                  onRemovePattern={removePattern}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DamageOptimizer;
