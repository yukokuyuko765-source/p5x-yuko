import React from "react";

interface AttackPowerControlsProps {
  attackPower: number;
  setAttackPower: React.Dispatch<React.SetStateAction<number>>;
}

const AttackPowerControls: React.FC<AttackPowerControlsProps> = ({
  attackPower,
  setAttackPower,
}) => {
  return (
    <div className="mb-8 p-6 bg-red-50 rounded-xl border border-red-200">
      <h3 className="text-xl font-semibold text-red-800 mb-4">攻撃力設定</h3>

      <div className="mb-6">
        <label className="font-semibold mb-3 text-red-700 text-lg block">
          攻撃力 (ポイント)
        </label>
        <div className="flex items-center gap-4 mb-3">
          <input
            type="range"
            className="slider"
            min="100"
            max="10000"
            value={attackPower}
            onChange={(e) => setAttackPower(Number(e.target.value))}
            step="1"
          />
          <div className="min-w-[80px] px-3 py-2 bg-red-500 text-white rounded-lg text-center font-semibold text-sm">
            {attackPower.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-24 px-3 py-2 border-2 border-red-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-100"
            min="100"
            max="10000"
            value={attackPower}
            onChange={(e) => setAttackPower(Number(e.target.value))}
            step="1"
            placeholder="100-10000"
          />
          <span className="text-red-600 font-medium">ポイント</span>
        </div>
      </div>
    </div>
  );
};

export default AttackPowerControls;
