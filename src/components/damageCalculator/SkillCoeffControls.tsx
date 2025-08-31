import React from "react";

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
    <div className="mb-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
      <h3 className="text-xl font-semibold text-purple-800 mb-4">
        スキル係数設定
      </h3>

      <div className="mb-6">
        <label className="font-semibold mb-3 text-purple-700 text-lg block">
          スキル係数
        </label>
        <div className="flex items-center gap-4 mb-3">
          <input
            type="range"
            className="slider"
            min="0"
            max="300"
            value={skillCoeff * 100}
            onChange={(e) => setSkillCoeff(parseFloat(e.target.value) / 100)}
            step="1"
          />
          <div className="min-w-[80px] px-3 py-2 bg-purple-500 text-white rounded-lg text-center font-semibold text-sm">
            {(skillCoeff * 100).toFixed(1)}%
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-24 px-3 py-2 border-2 border-purple-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            min="0"
            max="300"
            value={(skillCoeff * 100).toFixed(1)}
            onChange={(e) => handleSkillCoeffChange(e.target.value)}
            step="0.1"
            placeholder="0.0-300.0"
          />
          <span className="font-semibold text-purple-700 text-sm">%</span>
        </div>
      </div>

      {/* 計算結果表示 */}
      <div className="mt-4 p-3 bg-purple-100 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-purple-800">
            スキル係数 = {(skillCoeff * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCoeffControls;
