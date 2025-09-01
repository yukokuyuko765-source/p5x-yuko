import React, { useState } from "react";
import DraggableAvatar from "./DraggableAvatar";
import PositionSelect from "./PositionSelect";

interface WonderSlotProps {
  onPersonaChange: (personas: string[]) => void;
}

const WonderSlot: React.FC<WonderSlotProps> = ({ onPersonaChange }) => {
  const [persona1, setPersona1] = useState<string>("");
  const [persona2, setPersona2] = useState<string>("");
  const [persona3, setPersona3] = useState<string>("");

  const handlePersona1Change = (value: string) => {
    setPersona1(value);
    onPersonaChange([value, persona2, persona3]);
  };

  const handlePersona2Change = (value: string) => {
    setPersona2(value);
    onPersonaChange([persona1, value, persona3]);
  };

  const handlePersona3Change = (value: string) => {
    setPersona3(value);
    onPersonaChange([persona1, persona2, value]);
  };

  return (
    <div className="space-y-2">
      {/* 固定表示（wonder） */}
      <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600">
        WONDER
      </div>

      {/* アバターとペルソナ入力フィールドを横並び */}
      <div className="flex items-center space-x-3">
        {/* ドラッグ可能なアバター表示 */}
        <DraggableAvatar characterId="wonder" />

        {/* ペルソナ入力フィールド */}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            placeholder="ペルソナ1"
            value={persona1}
            onChange={(e) => handlePersona1Change(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="ペルソナ2"
            value={persona2}
            onChange={(e) => handlePersona2Change(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="ペルソナ3"
            value={persona3}
            onChange={(e) => handlePersona3Change(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* ポジション選択セレクトボックス */}
      <PositionSelect initialValue="1st" />
    </div>
  );
};

export default WonderSlot;
