import React from "react";
import { NumericFormat } from "react-number-format";

interface CRTControlsProps {
  crtRate: number;
  setCrtRate: React.Dispatch<React.SetStateAction<number>>;
  crtMultiplier: number;
  setCrtMultiplier: React.Dispatch<React.SetStateAction<number>>;
  currentExpectation: number;
}

const CRTControls: React.FC<CRTControlsProps> = ({
  crtRate,
  setCrtRate,
  crtMultiplier,
  setCrtMultiplier,
  currentExpectation,
}) => {
  const handleCrtRateChange = (value: string): void => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(100, numValue));
      setCrtRate(clampedValue);
    }
  };

  const handleCrtMultiplierChange = (value: string): void => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(150, Math.min(300, numValue));
      setCrtMultiplier(clampedValue);
    }
  };
  return (
    <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-purple-800">CRT期待値</h3>
        <div className="font-semibold text-purple-600">
          = {currentExpectation.toFixed(1)}%
        </div>
      </div>

      <div className="space-y-4">
        {/* CRT発生率 */}
        <div>
          <label className="font-semibold text-purple-700 text-lg block mb-2">
            CRT発生率
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              className="slider flex-1"
              min="0"
              max="100"
              value={crtRate}
              onChange={(e) => handleCrtRateChange(e.target.value)}
              step="1"
            />
            <NumericFormat
              className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              value={crtRate}
              onValueChange={(values) => handleCrtRateChange(values.value)}
              suffix="%"
              placeholder="0-100"
            />
          </div>
        </div>

        {/* CRT倍率 */}
        <div>
          <label className="font-semibold text-purple-700 text-lg block mb-2">
            CRT倍率
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              className="slider flex-1"
              min="150"
              max="300"
              value={crtMultiplier}
              onChange={(e) => handleCrtMultiplierChange(e.target.value)}
              step="1"
            />
            <NumericFormat
              className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              value={crtMultiplier}
              onValueChange={(values) =>
                handleCrtMultiplierChange(values.value)
              }
              suffix="%"
              placeholder="150-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRTControls;
