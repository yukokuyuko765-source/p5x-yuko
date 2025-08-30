import React from "react";

interface WeaknessCoeffControlsProps {
  weaknessCoeff: number;
  setWeaknessCoeff: (value: number) => void;
}

const WeaknessCoeffControls: React.FC<WeaknessCoeffControlsProps> = ({
  weaknessCoeff,
  setWeaknessCoeff,
}) => {
  const weaknessOptions = [
    { value: 1.2, label: "弱点", description: "120%" },
    { value: 1.0, label: "通常", description: "100%" },
    { value: 0.5, label: "耐性", description: "50%" },
  ];

  return (
    <div className="mb-8 p-6 bg-orange-50 rounded-xl border border-orange-200">
      <h3 className="text-xl font-semibold text-orange-800 mb-4">
        弱点係数設定
      </h3>

      <div className="mb-6">
        <label className="font-semibold mb-3 text-orange-700 text-lg block">
          弱点係数
        </label>
        <div className="grid grid-cols-3 gap-4">
          {weaknessOptions.map((option) => (
            <label
              key={option.value}
              className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                weaknessCoeff === option.value
                  ? "border-orange-500 bg-orange-100"
                  : "border-orange-300 bg-white hover:bg-orange-50"
              }`}
            >
              <input
                type="radio"
                name="weaknessCoeff"
                value={option.value}
                checked={weaknessCoeff === option.value}
                onChange={(e) => setWeaknessCoeff(parseFloat(e.target.value))}
                className="sr-only"
              />
              <div className="font-semibold text-orange-800 text-lg">
                {option.label}
              </div>
              <div className="text-sm text-orange-600 mt-1">
                {option.description}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 計算結果表示 */}
      <div className="mt-4 p-3 bg-orange-100 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-orange-800">
            弱点係数 = {(weaknessCoeff * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeaknessCoeffControls;
