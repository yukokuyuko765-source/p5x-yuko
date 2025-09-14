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
        attackBuff: nonCombatAttackPower.attackBuff + combatBonus.combatBuff,
        attackConstant:
          nonCombatAttackPower.attackConstant + combatBonus.combatConstant,
      },
      attackMultiplier,
      enemyDefense,
      critical,
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
    attackMultiplier,
    enemyDefense,
    critical,
  ]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        ダメージ最適化ツール
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 入力エリア */}
        <div className="space-y-6">
          {/* 非戦闘時攻撃力設定 */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              非戦闘時攻撃力設定
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* 攻撃力設定 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              攻撃力設定
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  キャラ基礎攻撃力
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {calculatedCharacterBaseAttack !== 0
                    ? Math.round(calculatedCharacterBaseAttack).toLocaleString()
                    : "非戦闘時攻撃力設定で計算してください"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  武器攻撃力
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {nonCombatAttackPower.weaponAttack.toLocaleString()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  非戦闘時攻撃バフ
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {nonCombatAttackPower.attackBuff.toLocaleString()}%
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  非戦闘時攻撃定数
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {nonCombatAttackPower.attackConstant.toLocaleString()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 攻撃倍率+設定 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              攻撃倍率+設定
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 敵防御力設定 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              敵防御力設定
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                敵を選択
              </label>
              <select
                value={selectedEnemyId}
                onChange={(e) => setSelectedEnemyId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
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
                  <span className="text-sm font-medium text-gray-700">
                    風襲時（88%係数適用）
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* クリティカル設定 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              クリティカル設定
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 結果表示エリア */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              計算結果
            </h2>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {optimizationFactor.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">最適化係数</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageOptimizer;
