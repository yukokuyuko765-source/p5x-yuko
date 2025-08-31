import React from "react";

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
    <div className="mb-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
      <h3 className="text-xl font-semibold text-purple-800 mb-4">
        CRT期待値設定
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* CRT発生率 */}
        <div>
          <label className="font-semibold mb-3 text-purple-700 text-lg block">
            CRT発生率 (%)
          </label>
          <div className="flex items-center gap-4 mb-3">
            <input
              type="range"
              className="slider"
              min="0"
              max="100"
              value={crtRate}
              onChange={(e) => handleCrtRateChange(e.target.value)}
              step="1"
            />
            <div className="min-w-[60px] px-3 py-2 bg-purple-500 text-white rounded-lg text-center font-semibold text-sm">
              {crtRate}%
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              min="0"
              max="100"
              value={crtRate}
              onChange={(e) => handleCrtRateChange(e.target.value)}
              step="1"
              placeholder="0-100"
            />
            <span className="text-purple-600 font-medium">%</span>
          </div>
        </div>

        {/* CRT倍率 */}
        <div>
          <label className="font-semibold mb-3 text-purple-700 text-lg block">
            CRT倍率 (%)
          </label>
          <div className="flex items-center gap-4 mb-3">
            <input
              type="range"
              className="slider"
              min="150"
              max="300"
              value={crtMultiplier}
              onChange={(e) => handleCrtMultiplierChange(e.target.value)}
              step="1"
            />
            <div className="min-w-[60px] px-3 py-2 bg-purple-500 text-white rounded-lg text-center font-semibold text-sm">
              {crtMultiplier}%
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              min="150"
              max="300"
              value={crtMultiplier}
              onChange={(e) => handleCrtMultiplierChange(e.target.value)}
              step="1"
              placeholder="150-300"
            />
            <span className="text-purple-600 font-medium">%</span>
          </div>
        </div>
      </div>

      {/* CRT期待値計算表示 */}
      <div className="p-4 bg-white rounded-lg border border-purple-300">
        <h4 className="text-lg font-semibold text-purple-700 mb-2 text-center">
          現在のCRT期待値計算
        </h4>
        <div className="text-center text-lg font-mono text-purple-800">
          CRT期待値 = {crtRate}% × {crtMultiplier}% + {100 - crtRate}% × 100% ={" "}
          {currentExpectation.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default CRTControls;
