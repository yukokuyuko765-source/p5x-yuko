export interface ChartData {
  labels: string[];
  data: number[];
}

export interface DamageCalculatorProps {}

export interface Enemy {
  id: string;
  version: string;
  stage: string;
  start_at: string;
  end_at: string;
  name: string;
  hp: number;
  def: number;
  additional_def_coeff: number;
}

export interface EnemyData {
  enemies: Enemy[];
}
