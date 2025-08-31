import React from "react";
import { NumericFormat } from "react-number-format";

interface FinalAttackMultiplierControlsProps {
  finalAttackMultiplier: number;
  setFinalAttackMultiplier: (value: number) => void;
}

const FinalAttackMultiplierControls: React.FC<
  FinalAttackMultiplierControlsProps
> = ({ finalAttackMultiplier, setFinalAttackMultiplier }) => {
  const handleFinalAttackMultiplierChange = (value: string): void => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(1000, numValue));
      setFinalAttackMultiplier(clampedValue);
    }
  };

  return (
    <div className="mb-6 p-6 bg-indigo-50 rounded-xl border border-indigo-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-indigo-800">最終攻撃倍率+</h3>
        <div className="flex items-center gap-2">
          <NumericFormat
            className="w-32 px-3 py-2 border-2 border-indigo-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={finalAttackMultiplier}
            onValueChange={(values) =>
              handleFinalAttackMultiplierChange(values.value)
            }
            suffix="%"
            placeholder="0.0-1000.0"
          />
        </div>
      </div>
    </div>
  );
};

export default FinalAttackMultiplierControls;
