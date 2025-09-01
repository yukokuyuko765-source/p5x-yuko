import React from "react";

interface PositionSelectProps {
  initialValue: string;
  onPositionChange?: (position: string) => void;
}

const PositionSelect: React.FC<PositionSelectProps> = ({
  initialValue,
  onPositionChange,
}) => {
  return (
    <select
      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      value={initialValue}
      onChange={(e) => onPositionChange?.(e.target.value)}
    >
      <option value="" disabled>
        行動順
      </option>
      <option value="1st">1st</option>
      <option value="2nd">2nd</option>
      <option value="3rd">3rd</option>
      <option value="4th">4th</option>
    </select>
  );
};

export default PositionSelect;
