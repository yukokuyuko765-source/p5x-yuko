export interface ChartData {
  labels: string[];
  data: number[];
}

export interface CRTExpectationCalculatorProps {}

export interface DamageCalculatorProps {}

export interface ParameterControlsProps {
  attackPower: number;
  setAttackPower: (value: number) => void;
  crtRate: number;
  setCrtRate: (value: number) => void;
  crtMultiplier: number;
  setCrtMultiplier: (value: number) => void;
}

export interface FormulaDisplayProps {
  attackPower: number;
  attackMultiplier: number;
  crtRate: number;
  crtMultiplier: number;
  currentExpectation: number;
}

export interface CRTChartProps {
  chartData: ChartData;
  crtRate: number;
  crtMultiplier: number;
  currentExpectation: number;
}

export interface InfoPanelProps {}
