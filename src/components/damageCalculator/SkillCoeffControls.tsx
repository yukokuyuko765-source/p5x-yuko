import React from "react";
import { NumericFormat } from "react-number-format";

interface SkillCoeffControlsProps {
  skillCoeff: number;
  setSkillCoeff: (value: number) => void;
}

const SkillCoeffControls: React.FC<SkillCoeffControlsProps> = ({
  skillCoeff,
  setSkillCoeff,
}) => {
  const handleSkillCoeffChange = (value: string): void => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(300, numValue));
      setSkillCoeff(clampedValue / 100);
    }
  };

  return (
    <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-orange-800">スキル係数</h3>
        <div className="flex items-center gap-2">
          <NumericFormat
            className="w-32 px-3 py-2 border-2 border-orange-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            value={(skillCoeff * 100).toFixed(1)}
            onValueChange={(values) => handleSkillCoeffChange(values.value)}
            suffix="%"
            placeholder="0.0-300.0"
          />
        </div>
      </div>
    </div>
  );
};

export default SkillCoeffControls;
