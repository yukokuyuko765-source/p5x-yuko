/**
 * ダメージ最適化に関する計算関数をまとめたユーティリティ
 */

// 攻撃力計算用の型
export interface AttackPowerConfig {
  characterBaseAttack: number; // キャラ基礎値
  weaponAttack: number; // 武器攻撃力
  attackBuff: number; // バフ
  attackConstant: number; // 定数
}

// 攻撃倍率+計算用の型
export interface AttackMultiplierConfig {
  baseMultiplier: number; // 100（基本値）
  attackMultiplierPlus: number; // 攻撃倍率+
  attributeAttackMultiplierPlus: number; // 属性攻撃倍率+
  damageIncreaseRate: number; // 与ダメージ上昇率
  enemyDamageIncreaseRate: number; // 敵被ダメージ上昇率
}

// 敵防御力計算用の型
export interface EnemyDefenseConfig {
  baseDefense: number; // 敵防御力
  additionalDefenseCoeff: number; // 追加防御係数
  penetration: number; // 貫通
  defenseDebuff: number; // 防御デバフ
  isWindAttack: boolean; // 風襲時かどうか
}

// クリティカル期待値計算用の型
export interface CriticalConfig {
  criticalRate: number; // クリティカル発生率
  criticalMultiplier: number; // クリティカル倍率
}

// 弱点係数計算用の型
export type WeaknessType = "weak" | "normal" | "resist";

// 弱点係数計算用の型
export interface WeaknessConfig {
  weaknessType: WeaknessType; // 弱点タイプ
}

// ランダム係数計算用の型
export interface RandomCoeffConfig {
  minRandomCoeff: number; // 最小ランダム係数
  maxRandomCoeff: number; // 最大ランダム係数
}

// ダメージ計算の設定型
export interface DamageCalculationConfig {
  characterId: string;
  skillId: string;
  enemyId: string;
  attackPower: AttackPowerConfig; // 攻撃力計算用の設定
  attackMultiplier: AttackMultiplierConfig; // 攻撃倍率+計算用の設定
  enemyDefense: EnemyDefenseConfig; // 敵防御力計算用の設定
  critical: CriticalConfig; // クリティカル期待値計算用の設定
  weakness: WeaknessConfig; // 弱点係数計算用の設定
  randomCoeff: RandomCoeffConfig; // ランダム係数計算用の設定
  skillCoeff: number;
  finalAttackMultiplier: number;
  otherCoeff: number;
}

// 最適化結果の型
export interface OptimizationResult {
  maxDamage: number;
  optimalConfig: DamageCalculationConfig;
  recommendations: string[];
}

/**
 * 攻撃力計算関数
 * ((キャラ基礎値 + 武器攻撃力) × バフ + 定数)
 */
export const calculateAttackPower = (config: AttackPowerConfig): number => {
  const { characterBaseAttack, weaponAttack, attackBuff, attackConstant } =
    config;
  return (characterBaseAttack + weaponAttack) * attackBuff + attackConstant;
};

/**
 * キャラ基礎攻撃力算出関数
 * 攻撃力計算結果からキャラ基礎攻撃力を逆算
 * キャラ基礎攻撃力 = (攻撃力計算結果 - 攻撃定数) ÷ 攻撃バフ - 武器攻撃力
 */
export const calculateCharacterBaseAttack = (
  targetAttackPower: number,
  weaponAttack: number,
  attackBuff: number,
  attackConstant: number
): number => {
  // 攻撃バフが0の場合はエラーを避けるため1を返す
  if (attackBuff === 0) {
    return 1;
  }

  return (targetAttackPower - attackConstant) / attackBuff - weaponAttack;
};

/**
 * 攻撃倍率+計算関数
 * 100% + 攻撃倍率+ + 属性攻撃倍率+ + 与ダメージ上昇率 + 敵被ダメージ上昇率
 */
export const calculateAttackMultiplier = (
  config: AttackMultiplierConfig
): number => {
  const {
    baseMultiplier = 100,
    attackMultiplierPlus,
    attributeAttackMultiplierPlus,
    damageIncreaseRate,
    enemyDamageIncreaseRate,
  } = config;
  return (
    (baseMultiplier +
      attackMultiplierPlus +
      attributeAttackMultiplierPlus +
      damageIncreaseRate +
      enemyDamageIncreaseRate) /
    100
  );
};

/**
 * 敵防御力計算関数
 * 1 - {敵防御力 * [(100% + 追加防御係数) * (100% - 貫通) - 防御デバフ] * (風襲時88%)} / {敵防御力 * [(100% + 追加防御係数) * (100% - 貫通) - 防御デバフ] * (風襲時88%) + 1400}
 */
export const calculateEnemyDefense = (config: EnemyDefenseConfig): number => {
  const {
    baseDefense,
    additionalDefenseCoeff,
    penetration,
    defenseDebuff,
    isWindAttack,
  } = config;

  // 風襲時の係数
  const windCoeff = isWindAttack ? 0.88 : 1.0;

  // 分子: 敵防御力 * [(100% + 追加防御係数) * (100% - 貫通) - 防御デバフ] * (風襲時88%)
  const numerator =
    baseDefense *
    ((1 + additionalDefenseCoeff) * (1 - penetration) - defenseDebuff) *
    windCoeff;

  // 分母: 分子 + 1400
  const denominator = numerator + 1400;

  // 最終結果: 1 - 分子 / 分母
  return 1 - numerator / denominator;
};

/**
 * クリティカル期待値計算関数
 * クリティカル発生率 * (クリティカル倍率 - 100%) （ただしクリティカル発生率は100%以上は切り捨て）
 */
export const calculateCriticalExpectation = (
  config: CriticalConfig
): number => {
  const { criticalRate, criticalMultiplier } = config;

  // クリティカル発生率を100%で切り捨て
  const cappedCriticalRate = Math.min(criticalRate, 100);

  // クリティカル期待値計算
  return (cappedCriticalRate / 100) * (criticalMultiplier - 100);
};

/**
 * 弱点係数計算関数
 * 弱点なら1.2、通常なら1.0、耐性なら0.5
 */
export const calculateWeaknessCoeff = (config: WeaknessConfig): number => {
  const { weaknessType } = config;

  switch (weaknessType) {
    case "weak":
      return 1.2;
    case "normal":
      return 1.0;
    case "resist":
      return 0.5;
    default:
      return 1.0;
  }
};

/**
 * ランダム係数計算関数
 * 0.95～1.05の範囲でランダムに決定
 */
export const calculateRandomCoeff = (config: RandomCoeffConfig): number => {
  const { minRandomCoeff, maxRandomCoeff } = config;

  // 指定された範囲でランダムな値を生成
  return Math.random() * (maxRandomCoeff - minRandomCoeff) + minRandomCoeff;
};

/**
 * ランダム係数の期待値計算関数
 * 最適化時は期待値を使用
 */
export const calculateRandomCoeffExpectation = (
  config: RandomCoeffConfig
): number => {
  const { minRandomCoeff, maxRandomCoeff } = config;

  // 期待値は最小値と最大値の平均
  return (minRandomCoeff + maxRandomCoeff) / 2;
};

/**
 * ダメージ計算の基本関数
 */
export const calculateDamage = (config: DamageCalculationConfig): number => {
  const {
    attackPower,
    skillCoeff,
    attackMultiplier,
    finalAttackMultiplier,
    weakness,
    randomCoeff,
    otherCoeff,
    critical,
    enemyDefense,
  } = config;

  // 攻撃力計算
  const calculatedAttackPower = calculateAttackPower(attackPower);

  // 攻撃倍率+計算
  const calculatedAttackMultiplier =
    calculateAttackMultiplier(attackMultiplier);

  // 敵防御力計算
  const calculatedEnemyDefense = calculateEnemyDefense(enemyDefense);

  // クリティカル期待値計算
  const calculatedCriticalExpectation = calculateCriticalExpectation(critical);

  // 弱点係数計算
  const calculatedWeaknessCoeff = calculateWeaknessCoeff(weakness);

  // ランダム係数計算（期待値を使用）
  const calculatedRandomCoeff = calculateRandomCoeffExpectation(randomCoeff);

  // 基本ダメージ計算式
  const baseDamage = calculatedAttackPower * skillCoeff;
  const multiplierDamage =
    baseDamage * calculatedAttackMultiplier * finalAttackMultiplier;
  const weaknessDamage = multiplierDamage * calculatedWeaknessCoeff;
  const randomDamage = weaknessDamage * calculatedRandomCoeff;
  const otherDamage = randomDamage * otherCoeff;
  const crtDamage = otherDamage * calculatedCriticalExpectation;

  // 防御力による減算（敵防御力は係数として適用）
  const finalDamage = Math.max(1, crtDamage * calculatedEnemyDefense);

  return Math.floor(finalDamage);
};

/**
 * 最適化用の基本ダメージ係数計算関数
 * 攻撃力計算 * 攻撃倍率+計算 * 敵防御力計算 * クリティカル期待値計算
 * この値を比較して最適化の材料にします
 */
export const calculateOptimizationFactor = (
  config: DamageCalculationConfig
): number => {
  const { attackPower, attackMultiplier, enemyDefense, critical } = config;

  // 攻撃力計算
  const calculatedAttackPower = calculateAttackPower(attackPower);

  // 攻撃倍率+計算
  const calculatedAttackMultiplier =
    calculateAttackMultiplier(attackMultiplier);

  // 敵防御力計算
  const calculatedEnemyDefense = calculateEnemyDefense(enemyDefense);

  // クリティカル期待値計算
  const calculatedCriticalExpectation = calculateCriticalExpectation(critical);

  // 最適化用の基本ダメージ係数
  return (
    calculatedAttackPower *
    calculatedAttackMultiplier *
    calculatedEnemyDefense *
    calculatedCriticalExpectation
  );
};
