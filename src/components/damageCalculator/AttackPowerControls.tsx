import React from "react";
import { NumericFormat } from "react-number-format";

interface AttackPowerControlsProps {
  attackPower: number;
  setAttackPower: React.Dispatch<React.SetStateAction<number>>;
}

const AttackPowerControls: React.FC<AttackPowerControlsProps> = ({
  attackPower,
  setAttackPower,
}) => {
  const handleInputChange = (values: any): void => {
    const numValue = parseInt(values.value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(100, Math.min(10000, numValue));
      setAttackPower(clampedValue);
    }
  };
  return (
    <div className="p-6 bg-red-50 rounded-xl border border-red-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-red-800">攻撃力</h3>
        <div className="flex items-center gap-2">
          <NumericFormat
            className="w-32 px-3 py-2 border-2 border-red-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-100"
            value={attackPower}
            onValueChange={handleInputChange}
            thousandSeparator=","
            placeholder="100-10000"
          />
        </div>
      </div>
    </div>
  );
};

export default AttackPowerControls;
