import React, { useState, useEffect } from "react";
import {
  calculateOptimizationFactor,
  calculateCharacterBaseAttack,
  DamageCalculationConfig,
  AttackPowerConfig,
  AttackMultiplierConfig,
  EnemyDefenseConfig,
  CriticalConfig,
} from "../../utils/damageOptimization";
import enemyData from "../../data/enemyData.json";

// コンポーネントのインポート
import NonCombatAttackPowerSettings from "./NonCombatAttackPowerSettings";
import AttackPowerSettings from "./AttackPowerSettings";
import AttackMultiplierSettings from "./AttackMultiplierSettings";
import EnemyDefenseSettings from "./EnemyDefenseSettings";
import CriticalSettings from "./CriticalSettings";
import CalculationResults from "./CalculationResults";
import { PatternData } from "./types";

interface PatternInputProps {
  pattern: PatternData;
  onUpdatePattern: (updatedPattern: PatternData) => void;
  onRemovePattern: (id: string) => void;
}

const PatternInput: React.FC<PatternInputProps> = ({
  pattern,
  onUpdatePattern,
  onRemovePattern,
}) => {
  // 各設定の状態
  const [nonCombatAttackPower, setNonCombatAttackPower] = useState(
    pattern.nonCombatAttackPower
  );
  const [attackPower, setAttackPower] = useState<AttackPowerConfig>(
    pattern.attackPower
  );
  const [combatBonus, setCombatBonus] = useState(pattern.combatBonus);
  const [attackMultiplier, setAttackMultiplier] =
    useState<AttackMultiplierConfig>(pattern.attackMultiplier);
  const [selectedEnemyId, setSelectedEnemyId] = useState(
    pattern.selectedEnemyId
  );
  const [enemyDefense, setEnemyDefense] = useState<EnemyDefenseConfig>(
    pattern.enemyDefense
  );
  const [critical, setCritical] = useState<CriticalConfig>(pattern.critical);
  const [optimizationFactor, setOptimizationFactor] = useState(
    pattern.optimizationFactor
  );

  // チェックボックス用の状態
  const [combatBuffCheckboxes, setCombatBuffCheckboxes] = useState(
    pattern.combatBuffCheckboxes
  );
  const [damageIncreaseCheckboxes, setDamageIncreaseCheckboxes] = useState(
    pattern.damageIncreaseCheckboxes
  );
  const [enemyDamageIncreaseCheckboxes, setEnemyDamageIncreaseCheckboxes] =
    useState(pattern.enemyDamageIncreaseCheckboxes);
  const [defenseDebuffCheckboxes, setDefenseDebuffCheckboxes] = useState(
    pattern.defenseDebuffCheckboxes
  );
  const [criticalRateCheckboxes, setCriticalRateCheckboxes] = useState(
    pattern.criticalRateCheckboxes
  );
  const [criticalMultiplierCheckboxes, setCriticalMultiplierCheckboxes] =
    useState(pattern.criticalMultiplierCheckboxes);

  // 合計値の計算
  const totalCombatBuff =
    Object.values(combatBuffCheckboxes).reduce((sum, value) => sum + value, 0) +
    combatBonus.combatBuff;
  const totalDamageIncrease =
    Object.values(damageIncreaseCheckboxes).reduce(
      (sum, value) => sum + value,
      0
    ) + attackMultiplier.damageIncreaseRate;
  const totalEnemyDamageIncrease =
    Object.values(enemyDamageIncreaseCheckboxes).reduce(
      (sum, value) => sum + value,
      0
    ) + attackMultiplier.enemyDamageIncreaseRate;
  const totalDefenseDebuff =
    Object.values(defenseDebuffCheckboxes).reduce(
      (sum, value) => sum + value,
      0
    ) + enemyDefense.defenseDebuff;
  const totalCriticalRate =
    Object.values(criticalRateCheckboxes).reduce(
      (sum, value) => sum + value,
      0
    ) + critical.criticalRate;
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

  // 最適化係数の自動計算
  useEffect(() => {
    const config: DamageCalculationConfig = {
      characterId: "",
      skillId: "",
      enemyId: "",
      attackPower: {
        ...attackPower,
        characterBaseAttack: attackPower.characterBaseAttack,
        weaponAttack: nonCombatAttackPower.weaponAttack,
        attackBuff: nonCombatAttackPower.attackBuff + totalCombatBuff,
        attackConstant:
          nonCombatAttackPower.attackConstant + combatBonus.combatConstant,
      },
      attackMultiplier: {
        ...attackMultiplier,
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
    attackPower,
    nonCombatAttackPower,
    combatBonus,
    totalCombatBuff,
    totalDamageIncrease,
    totalEnemyDamageIncrease,
    totalDefenseDebuff,
    totalCriticalRate,
    totalCriticalMultiplier,
    attackMultiplier,
    enemyDefense,
    critical,
  ]);

  // パターン更新
  useEffect(() => {
    const updatedPattern: PatternData = {
      ...pattern,
      nonCombatAttackPower,
      attackPower,
      combatBonus,
      attackMultiplier,
      selectedEnemyId,
      enemyDefense,
      critical,
      combatBuffCheckboxes,
      damageIncreaseCheckboxes,
      enemyDamageIncreaseCheckboxes,
      defenseDebuffCheckboxes,
      criticalRateCheckboxes,
      criticalMultiplierCheckboxes,
      optimizationFactor,
    };
    onUpdatePattern(updatedPattern);
  }, [
    pattern,
    nonCombatAttackPower,
    attackPower,
    combatBonus,
    attackMultiplier,
    selectedEnemyId,
    enemyDefense,
    critical,
    combatBuffCheckboxes,
    damageIncreaseCheckboxes,
    enemyDamageIncreaseCheckboxes,
    defenseDebuffCheckboxes,
    criticalRateCheckboxes,
    criticalMultiplierCheckboxes,
    optimizationFactor,
    onUpdatePattern,
  ]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{pattern.name}</h3>
        <button
          onClick={() => onRemovePattern(pattern.id)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          削除
        </button>
      </div>

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
          totalDamageIncrease={totalDamageIncrease}
          totalEnemyDamageIncrease={totalEnemyDamageIncrease}
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
          totalDamageIncrease={totalDamageIncrease}
          totalEnemyDamageIncrease={totalEnemyDamageIncrease}
          totalDefenseDebuff={totalDefenseDebuff}
          totalCriticalRate={totalCriticalRate}
          totalCriticalMultiplier={totalCriticalMultiplier}
        />
      </div>
    </div>
  );
};

export default PatternInput;
