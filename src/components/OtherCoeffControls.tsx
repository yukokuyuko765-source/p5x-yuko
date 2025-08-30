import React from "react";

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
    <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        その他係数設定
      </h3>

      <div className="mb-6">
        <label className="font-semibold mb-3 text-gray-700 text-lg block">
          その他係数 (%)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-32 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
            min="0"
            max="1000"
            value={otherCoeff}
            onChange={(e) => handleOtherCoeffChange(e.target.value)}
            step="0.1"
            placeholder="0.0-1000.0"
          />
          <span className="font-semibold text-gray-700 text-sm">%</span>
        </div>
      </div>

      {/* 計算結果表示 */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800">
            その他係数 = {otherCoeff.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherCoeffControls;
