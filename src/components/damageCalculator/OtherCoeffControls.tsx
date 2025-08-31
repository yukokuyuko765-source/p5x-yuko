import React from "react";
import { NumericFormat } from "react-number-format";

interface OtherCoeffControlsProps {
  otherCoeff: number;
  setOtherCoeff: (value: number) => void;
}

const OtherCoeffControls: React.FC<OtherCoeffControlsProps> = ({
  otherCoeff,
  setOtherCoeff,
}) => {
  const handleOtherCoeffChange = (value: string): void => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(1000, numValue));
      setOtherCoeff(clampedValue);
    }
  };

  return (
    <div className="mb-6 p-6 bg-teal-50 rounded-xl border border-teal-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-teal-800">その他係数</h3>
        <div className="flex items-center gap-2">
          <NumericFormat
            className="w-32 px-3 py-2 border-2 border-teal-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            value={otherCoeff}
            onValueChange={(values) => handleOtherCoeffChange(values.value)}
            suffix="%"
            placeholder="0.0-1000.0"
          />
        </div>
      </div>
    </div>
  );
};

export default OtherCoeffControls;
