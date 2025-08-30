import React from "react";
import { ParameterControlsProps } from "../types";

const ParameterControls: React.FC<ParameterControlsProps> = ({
  crtRate,
  setCrtRate,
  crtMultiplier,
  setCrtMultiplier,
}) => {
  const handleRateChange = (value: string): void => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(100, numValue));
      setCrtRate(clampedValue);
    }
  };

  const handleMultiplierChange = (value: string): void => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(150, Math.min(300, numValue));
      setCrtMultiplier(clampedValue);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
      {/* CRT発生率 */}
      <div className="flex flex-col">
        <label className="font-semibold mb-3 text-gray-700 text-lg">
          CRT発生率 (%)
        </label>
        <div className="flex items-center gap-4 mb-3">
          <input
            type="range"
            className="slider"
            min="0"
            max="100"
            value={crtRate}
            onChange={(e) => setCrtRate(parseInt(e.target.value))}
            step="1"
          />
          <div className="min-w-[60px] px-3 py-2 bg-primary-500 text-white rounded-lg text-center font-semibold text-sm">
            {crtRate}%
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            min="0"
            max="100"
            value={crtRate}
            onChange={(e) => handleRateChange(e.target.value)}
            step="1"
            placeholder="0-100"
          />
          <span className="font-semibold text-gray-700 text-sm">%</span>
        </div>
      </div>

      {/* CRT倍率 */}
      <div className="flex flex-col">
        <label className="font-semibold mb-3 text-gray-700 text-lg">
          CRT倍率 (%)
        </label>
        <div className="flex items-center gap-4 mb-3">
          <input
            type="range"
            className="slider"
            min="150"
            max="300"
            value={crtMultiplier}
            onChange={(e) => setCrtMultiplier(parseInt(e.target.value))}
            step="1"
          />
          <div className="min-w-[60px] px-3 py-2 bg-primary-500 text-white rounded-lg text-center font-semibold text-sm">
            {crtMultiplier}%
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            min="150"
            max="300"
            value={crtMultiplier}
            onChange={(e) => handleMultiplierChange(e.target.value)}
            step="1"
            placeholder="150-300"
          />
          <span className="font-semibold text-gray-700 text-sm">%</span>
        </div>
      </div>
    </div>
  );
};

export default ParameterControls;
