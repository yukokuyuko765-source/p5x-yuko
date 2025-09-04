import React, { useState } from "react";
import DraggableAvatar from "./DraggableAvatar";
import characterData from "../../data/characterData.json";

interface Character {
  id: string;
  name: string;
  image: string;
  role: string;
}

interface CharacterSlotProps {
  selectedCharacterId: string;
  isInvestigationSlot?: boolean;
  initialPosition?: string;
  currentPosition?: string;
  onCharacterSelect: (characterId: string, position: string) => void;
}

const CharacterSlot: React.FC<CharacterSlotProps> = ({
  selectedCharacterId,
  isInvestigationSlot = false,
  initialPosition = "",
  currentPosition,
  onCharacterSelect,
}) => {
  const [selectedPosition, setSelectedPosition] =
    useState<string>(initialPosition);

  // currentPositionが変更された時にselectedPositionを更新
  React.useEffect(() => {
    if (currentPosition && currentPosition !== selectedPosition) {
      setSelectedPosition(currentPosition);
    }
  }, [currentPosition, selectedPosition]);

  const handleCharacterSelect = (characterId: string) => {
    onCharacterSelect(characterId, selectedPosition);
  };

  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position);
    if (selectedCharacterId) {
      onCharacterSelect(selectedCharacterId, position);
    }
  };

  return (
    <div className="space-y-2">
      {/* セレクトボックス */}
      <select
        value={selectedCharacterId}
        onChange={(e) => handleCharacterSelect(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      >
        <option value="">選択してください</option>
        {characterData
          .filter((character: Character) => {
            // 解明スロットの場合は解明ロールのみ表示
            if (isInvestigationSlot) {
              return character.role === "解明";
            }
            // その他の場合は解明ロール以外を表示
            return character.role !== "解明";
          })
          .map((character: Character) => (
            <option key={character.id} value={character.id}>
              {character.name}
            </option>
          ))}
      </select>

      {/* ドラッグ可能なアバター表示 */}
      <DraggableAvatar characterId={selectedCharacterId} />
    </div>
  );
};

export default CharacterSlot;
