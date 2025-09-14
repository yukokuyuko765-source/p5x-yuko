import React, { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
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
import combatBuffData from "../../data/combatBuffData.json";
import damageIncreaseData from "../../data/damageIncreaseData.json";
import enemyDamageIncreaseData from "../../data/enemyDamageIncreaseData.json";
import defenseDebuffData from "../../data/defenseDebuffData.json";
import criticalRateData from "../../data/criticalRateData.json";
import criticalMultiplierData from "../../data/criticalMultiplierData.json";

const DamageOptimizer: React.FC = () => {
  // 攻撃力設定
  const [attackPower, setAttackPower] = useState<AttackPowerConfig>({
    characterBaseAttack: 0, // 非戦闘時攻撃力設定から自動反映
    weaponAttack: 0, // 非戦闘時攻撃力設定から自動反映
    attackBuff: 0, // 非戦闘時攻撃力設定から自動反映
    attackConstant: 0, // 非戦闘時攻撃力設定から自動反映
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

  // 非戦闘時攻撃力設定（キャラ基礎攻撃力算出用）
  const [nonCombatAttackPower, setNonCombatAttackPower] = useState({
    targetAttackPower: 2000,
    weaponAttack: 500,
    attackBuff: 0,
    attackConstant: 0,
  });
  const [calculatedCharacterBaseAttack, setCalculatedCharacterBaseAttack] =
    useState<number>(0);

  // 最適化係数
  const [optimizationFactor, setOptimizationFactor] = useState<number>(0);

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
    setCalculatedCharacterBaseAttack(characterBaseAttack);
  }, [nonCombatAttackPower]);

  // 敵が選択されたときに敵防御力設定を更新
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
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
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
                  thousandSeparator=","
                  allowNegative={false}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  thousandSeparator=","
                  allowNegative={false}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  攻撃%(啓示と武器の%合計値)
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
                  decimalScale={2}
                  fixedDecimalScale={false}
                  allowNegative={false}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  攻撃定数(啓示と武器の定数による補強合計値)
                </label>
                <NumericFormat
                  value={nonCombatAttackPower.attackConstant}
                  onValueChange={(values) =>
                    setNonCombatAttackPower({
                      ...nonCombatAttackPower,
                      attackConstant: values.floatValue || 0,
                    })
                  }
                  thousandSeparator=","
                  allowNegative={false}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* 攻撃力設定 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              攻撃力設定
            </h2>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  キャラ基礎攻撃力
                </label>
                <div className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {calculatedCharacterBaseAttack !== 0
                    ? Math.round(calculatedCharacterBaseAttack).toLocaleString()
                    : "非戦闘時攻撃力設定で計算してください"}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  武器攻撃力
                </label>
                <div className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {nonCombatAttackPower.weaponAttack.toLocaleString()}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  非戦闘時攻撃バフ
                </label>
                <div className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {nonCombatAttackPower.attackBuff.toLocaleString()}%
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  非戦闘時攻撃定数
                </label>
                <div className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {nonCombatAttackPower.attackConstant.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
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
                  decimalScale={2}
                  fixedDecimalScale={false}
                  allowNegative={true}
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
                  thousandSeparator=","
                  allowNegative={true}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 攻撃倍率+設定 */}
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
                    <div
                      key={damage.id}
                      className="flex items-center space-x-2"
                    >
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

          {/* 敵防御力設定 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              敵防御力設定
            </h2>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  敵を選択
                </label>
                <select
                  value={selectedEnemyId}
                  onChange={(e) => setSelectedEnemyId(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">敵を選択してください</option>
                  {Array.from(
                    new Set(enemyData.enemies.map((enemy) => enemy.version))
                  )
                    .sort()
                    .map((version) => (
                      <optgroup key={version} label={`Version ${version}`}>
                        {enemyData.enemies
                          .filter((enemy) => enemy.version === version)
                          .map((enemy) => (
                            <option key={enemy.id} value={enemy.id}>
                              {enemy.name} ({enemy.stage}) - DEF: {enemy.def},
                              追加防御係数: {enemy.additional_def_coeff}%
                            </option>
                          ))}
                      </optgroup>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  敵基礎防御力
                </label>
                <NumericFormat
                  value={enemyDefense.baseDefense}
                  onValueChange={(values) =>
                    setEnemyDefense({
                      ...enemyDefense,
                      baseDefense: values.floatValue || 0,
                    })
                  }
                  thousandSeparator=","
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
                    <div
                      key={debuff.id}
                      className="flex items-center space-x-2"
                    >
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
                  <span className="text-xs font-medium text-gray-700">
                    風襲時（88%係数適用）
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* クリティカル設定 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              クリティカル設定
            </h2>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  クリティカル発生率 (%)
                </label>
                <NumericFormat
                  value={critical.criticalRate}
                  onValueChange={(values) =>
                    setCritical({
                      ...critical,
                      criticalRate: values.floatValue || 0,
                    })
                  }
                  suffix="%"
                  allowNegative={false}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="space-y-1">
                  {criticalRateData.criticalRates.map((crit) => (
                    <div key={crit.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={criticalRateCheckboxes[crit.id] > 0}
                        onChange={(e) =>
                          setCriticalRateCheckboxes({
                            ...criticalRateCheckboxes,
                            [crit.id]: e.target.checked ? crit.value : 0,
                          })
                        }
                        className="mr-1"
                      />
                      <span className="text-xs text-gray-600">
                        {crit.name} ({crit.value}%)
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-2 bg-purple-50 rounded border">
                  <div className="text-xs font-medium text-purple-800">
                    合計: {totalCriticalRate}%
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  クリティカル倍率 (%)
                </label>
                <NumericFormat
                  value={critical.criticalMultiplier}
                  onValueChange={(values) =>
                    setCritical({
                      ...critical,
                      criticalMultiplier: values.floatValue || 0,
                    })
                  }
                  suffix="%"
                  allowNegative={false}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="space-y-1">
                  {criticalMultiplierData.criticalMultipliers.map((mult) => (
                    <div key={mult.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={criticalMultiplierCheckboxes[mult.id] > 0}
                        onChange={(e) =>
                          setCriticalMultiplierCheckboxes({
                            ...criticalMultiplierCheckboxes,
                            [mult.id]: e.target.checked ? mult.value : 0,
                          })
                        }
                        className="mr-1"
                      />
                      <span className="text-xs text-gray-600">
                        {mult.name} ({mult.value}%)
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-2 bg-indigo-50 rounded border">
                  <div className="text-xs font-medium text-indigo-800">
                    合計: {totalCriticalMultiplier}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 計算結果と詳細計算結果 */}
          <div className="space-y-3">
            {/* 計算結果 */}
            <div className="bg-blue-50 rounded-lg p-3">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">
                計算結果
              </h2>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 mb-1">
                  {optimizationFactor.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 詳細計算結果 */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                詳細計算結果
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">攻撃力:</span>
                  <span className="font-medium">
                    {Math.round(
                      ((calculatedCharacterBaseAttack !== 0
                        ? Math.round(calculatedCharacterBaseAttack)
                        : 0) +
                        nonCombatAttackPower.weaponAttack) *
                        ((100 +
                          nonCombatAttackPower.attackBuff +
                          totalCombatBuff) /
                          100) +
                        (nonCombatAttackPower.attackConstant +
                          combatBonus.combatConstant)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">攻撃倍率+:</span>
                  <span className="font-medium">
                    {(
                      (100 +
                        attackMultiplier.attackMultiplierPlus +
                        attackMultiplier.attributeAttackMultiplierPlus +
                        totalDamageIncrease +
                        totalEnemyDamageIncrease) /
                      100
                    ).toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">敵防御力:</span>
                  <span className="font-medium">
                    {(() => {
                      const defenseMultiplier = Math.max(
                        0,
                        (1 + enemyDefense.additionalDefenseCoeff / 100) *
                          (1 - enemyDefense.penetration / 100) -
                          totalDefenseDebuff / 100
                      );
                      const numerator =
                        enemyDefense.baseDefense *
                        defenseMultiplier *
                        (enemyDefense.isWindAttack ? 0.88 : 1.0);
                      const denominator = numerator + 1400;
                      return (1 - numerator / denominator).toFixed(3);
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">クリティカル期待値:</span>
                  <span className="font-medium">
                    {(
                      1 +
                      (Math.min(totalCriticalRate, 100) / 100) *
                        ((totalCriticalMultiplier - 100) / 100)
                    ).toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageOptimizer;
