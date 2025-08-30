import React from "react";

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
    <div className="mb-8 p-6 bg-red-50 rounded-xl border border-red-200">
      <h3 className="text-xl font-semibold text-red-800 mb-4">
        最終攻撃倍率設定
      </h3>

      <div className="mb-6">
        <label className="font-semibold mb-3 text-red-700 text-lg block">
          最終攻撃倍率 (%)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-32 px-3 py-2 border-2 border-red-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-100"
            min="0"
            max="1000"
            value={finalAttackMultiplier}
            onChange={(e) => handleFinalAttackMultiplierChange(e.target.value)}
            step="0.1"
            placeholder="0.0-1000.0"
          />
          <span className="font-semibold text-red-700 text-sm">%</span>
        </div>
      </div>

      {/* 計算結果表示 */}
      <div className="mt-4 p-3 bg-red-100 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-red-800">
            最終攻撃倍率 = {finalAttackMultiplier.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalAttackMultiplierControls;
