import {
  AttackPowerConfig,
  AttackMultiplierConfig,
  EnemyDefenseConfig,
  CriticalConfig,
} from "../../utils/damageOptimization";

// パターン管理用の型
export interface PatternData {
  id: string;
  name: string;
  nonCombatAttackPower: {
    targetAttackPower: number;
    weaponAttack: number;
    attackBuff: number;
    attackConstant: number;
  };
  attackPower: AttackPowerConfig;
  combatBonus: {
    combatBuff: number;
    combatConstant: number;
  };
  attackMultiplier: AttackMultiplierConfig;
  selectedEnemyId: string;
  enemyDefense: EnemyDefenseConfig;
  critical: CriticalConfig;
  combatBuffCheckboxes: Record<string, number>;
  damageIncreaseCheckboxes: Record<string, number>;
  enemyDamageIncreaseCheckboxes: Record<string, number>;
  attributeAttackMultiplierCheckboxes: Record<string, number>;
  defenseDebuffCheckboxes: Record<string, number>;
  criticalRateCheckboxes: Record<string, number>;
  criticalMultiplierCheckboxes: Record<string, number>;
  optimizationFactor: number;
}
