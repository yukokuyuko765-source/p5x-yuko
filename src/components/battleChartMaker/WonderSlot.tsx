import React, { useState, useEffect } from "react";
import DraggableAvatar from "./DraggableAvatar";

interface WonderSlotProps {
  onPersonaChange: (personas: string[]) => void;
  onCharacterSelect?: (characterId: string, position: string) => void;
  currentPosition?: string;
}

const WonderSlot: React.FC<WonderSlotProps> = ({
  onPersonaChange,
  onCharacterSelect,
  currentPosition = "1st",
}) => {
  const [persona1, setPersona1] = useState<string>("");
  const [persona2, setPersona2] = useState<string>("");
  const [persona3, setPersona3] = useState<string>("");
  // 初期化時にデフォルト値を設定
  React.useEffect(() => {
    onPersonaChange([
      persona1 || "ペルソナ1",
      persona2 || "ペルソナ2",
      persona3 || "ペルソナ3",
    ]);
    // 初期化時にキャラクター選択を通知
    onCharacterSelect?.("wonder", currentPosition);
  }, [currentPosition]);

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
        <div className="flex-1 space-y-0.5">
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
    </div>
  );
};

export default WonderSlot;
