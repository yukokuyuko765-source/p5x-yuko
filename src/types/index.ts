export interface ChartData {
  labels: string[];
  data: number[];
}

export interface CRTExpectationCalculatorProps {}

export interface ParameterControlsProps {
  crtRate: number;
  setCrtRate: (value: number) => void;
  crtMultiplier: number;
  setCrtMultiplier: (value: number) => void;
}

export interface FormulaDisplayProps {
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
