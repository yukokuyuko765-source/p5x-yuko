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
    <div className="p-6 bg-pink-50 rounded-xl border border-pink-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-pink-800">弱点係数</h3>
        <div className="font-semibold text-pink-600">
          = {(weaknessCoeff * 100).toFixed(0)}%
        </div>
      </div>

      <div>
        <div className="grid grid-cols-3 gap-4">
          {weaknessOptions.map((option) => (
            <label
              key={option.value}
              className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                weaknessCoeff === option.value
                  ? "border-pink-500 bg-pink-100"
                  : "border-pink-300 bg-white hover:bg-pink-50"
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
              <div className="font-semibold text-pink-800 text-lg">
                {option.label}
              </div>
              <div className="text-sm text-pink-600 mt-1">
                {option.description}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeaknessCoeffControls;
