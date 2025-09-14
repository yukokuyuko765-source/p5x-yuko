/**
 * ダメージ最適化に関する計算関数をまとめたユーティリティ
 */

// ダメージ最適化の設定型
export interface DamageOptimizationConfig {
  characterId: string;
  skillId: string;
  enemyId: string;
  attackPower: number;
  skillCoeff: number;
  attackMultiplier: number;
  finalAttackMultiplier: number;
  weaknessCoeff: number;
  randomCoeff: number;
  otherCoeff: number;
  crt: number;
  enemyDefense: number;
}

// 最適化結果の型
export interface OptimizationResult {
  maxDamage: number;
  optimalConfig: DamageOptimizationConfig;
  recommendations: string[];
}

/**
 * ダメージ計算の基本関数
 */
export const calculateDamage = (config: DamageOptimizationConfig): number => {
  const {
    attackPower,
    skillCoeff,
    attackMultiplier,
    finalAttackMultiplier,
    weaknessCoeff,
    randomCoeff,
    otherCoeff,
    crt,
    enemyDefense,
  } = config;

  // 基本ダメージ計算式
  const baseDamage = attackPower * skillCoeff;
  const multiplierDamage =
    baseDamage * attackMultiplier * finalAttackMultiplier;
  const weaknessDamage = multiplierDamage * weaknessCoeff;
  const randomDamage = weaknessDamage * randomCoeff;
  const otherDamage = randomDamage * otherCoeff;
  const crtDamage = otherDamage * (1 + crt);

  // 防御力による減算
  const finalDamage = Math.max(1, crtDamage - enemyDefense);

  return Math.floor(finalDamage);
};

/**
 * ダメージ最適化のメイン関数
 */
export const optimizeDamage = (
  baseConfig: DamageOptimizationConfig,
  constraints: {
    maxAttackPower?: number;
    maxSkillCoeff?: number;
    maxAttackMultiplier?: number;
    maxFinalAttackMultiplier?: number;
    maxWeaknessCoeff?: number;
    maxRandomCoeff?: number;
    maxOtherCoeff?: number;
    maxCrt?: number;
  } = {}
): OptimizationResult => {
  let maxDamage = 0;
  let optimalConfig = { ...baseConfig };
  const recommendations: string[] = [];

  // 各パラメータの最適化（簡易版）
  const optimizedConfig = { ...baseConfig };

  // 攻撃力の最適化
  if (constraints.maxAttackPower) {
    optimizedConfig.attackPower = constraints.maxAttackPower;
    recommendations.push(`攻撃力を最大値 ${constraints.maxAttackPower} に設定`);
  }

  // スキル係数の最適化
  if (constraints.maxSkillCoeff) {
    optimizedConfig.skillCoeff = constraints.maxSkillCoeff;
    recommendations.push(
      `スキル係数を最大値 ${constraints.maxSkillCoeff} に設定`
    );
  }

  // 攻撃倍率の最適化
  if (constraints.maxAttackMultiplier) {
    optimizedConfig.attackMultiplier = constraints.maxAttackMultiplier;
    recommendations.push(
      `攻撃倍率を最大値 ${constraints.maxAttackMultiplier} に設定`
    );
  }

  // 最終攻撃倍率の最適化
  if (constraints.maxFinalAttackMultiplier) {
    optimizedConfig.finalAttackMultiplier =
      constraints.maxFinalAttackMultiplier;
    recommendations.push(
      `最終攻撃倍率を最大値 ${constraints.maxFinalAttackMultiplier} に設定`
    );
  }

  // 弱点係数の最適化
  if (constraints.maxWeaknessCoeff) {
    optimizedConfig.weaknessCoeff = constraints.maxWeaknessCoeff;
    recommendations.push(
      `弱点係数を最大値 ${constraints.maxWeaknessCoeff} に設定`
    );
  }

  // ランダム係数の最適化
  if (constraints.maxRandomCoeff) {
    optimizedConfig.randomCoeff = constraints.maxRandomCoeff;
    recommendations.push(
      `ランダム係数を最大値 ${constraints.maxRandomCoeff} に設定`
    );
  }

  // その他係数の最適化
  if (constraints.maxOtherCoeff) {
    optimizedConfig.otherCoeff = constraints.maxOtherCoeff;
    recommendations.push(
      `その他係数を最大値 ${constraints.maxOtherCoeff} に設定`
    );
  }

  // クリティカル率の最適化
  if (constraints.maxCrt) {
    optimizedConfig.crt = constraints.maxCrt;
    recommendations.push(`クリティカル率を最大値 ${constraints.maxCrt} に設定`);
  }

  maxDamage = calculateDamage(optimizedConfig);
  optimalConfig = optimizedConfig;

  return {
    maxDamage,
    optimalConfig,
    recommendations,
  };
};

/**
 * 複数の設定を比較して最適なものを選択
 */
export const compareConfigurations = (
  configs: DamageOptimizationConfig[]
): OptimizationResult => {
  let bestConfig = configs[0];
  let maxDamage = calculateDamage(bestConfig);

  for (const config of configs) {
    const damage = calculateDamage(config);
    if (damage > maxDamage) {
      maxDamage = damage;
      bestConfig = config;
    }
  }

  return {
    maxDamage,
    optimalConfig: bestConfig,
    recommendations: [`設定 ${configs.indexOf(bestConfig) + 1} が最適です`],
  };
};

/**
 * ダメージ計算の詳細分析
 */
export const analyzeDamageBreakdown = (config: DamageOptimizationConfig) => {
  const {
    attackPower,
    skillCoeff,
    attackMultiplier,
    finalAttackMultiplier,
    weaknessCoeff,
    randomCoeff,
    otherCoeff,
    crt,
    enemyDefense,
  } = config;

  const baseDamage = attackPower * skillCoeff;
  const multiplierDamage =
    baseDamage * attackMultiplier * finalAttackMultiplier;
  const weaknessDamage = multiplierDamage * weaknessCoeff;
  const randomDamage = weaknessDamage * randomCoeff;
  const otherDamage = randomDamage * otherCoeff;
  const crtDamage = otherDamage * (1 + crt);
  const finalDamage = Math.max(1, crtDamage - enemyDefense);

  return {
    baseDamage: Math.floor(baseDamage),
    multiplierDamage: Math.floor(multiplierDamage),
    weaknessDamage: Math.floor(weaknessDamage),
    randomDamage: Math.floor(randomDamage),
    otherDamage: Math.floor(otherDamage),
    crtDamage: Math.floor(crtDamage),
    finalDamage: Math.floor(finalDamage),
    defenseReduction: Math.floor(crtDamage - finalDamage),
  };
};
