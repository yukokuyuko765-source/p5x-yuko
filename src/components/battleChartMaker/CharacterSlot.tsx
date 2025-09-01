import React from "react";
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
  onCharacterSelect: (characterId: string) => void;
}

const CharacterSlot: React.FC<CharacterSlotProps> = ({
  selectedCharacterId,
  isInvestigationSlot = false,
  onCharacterSelect,
}) => {
  const getCharacterImage = (characterId: string): string => {
    const character = characterData.find(
      (char: Character) => char.id === characterId
    );
    if (character) {
      try {
        // 画像のインポートを試行
        return new URL(
          `../../assets/images/${character.image}`,
          import.meta.url
        ).href;
      } catch {
        return "";
      }
    }
    return "";
  };

  const getCharacterName = (characterId: string): string => {
    const character = characterData.find(
      (char: Character) => char.id === characterId
    );
    return character ? character.name : "";
  };

  const getCharacterRole = (characterId: string): string => {
    const character = characterData.find(
      (char: Character) => char.id === characterId
    );
    return character ? character.role : "";
  };

  return (
    <div className="space-y-2">
      {/* セレクトボックス */}
      <select
        value={selectedCharacterId}
        onChange={(e) => onCharacterSelect(e.target.value)}
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

      {/* アバター表示 */}
      <div className="text-center">
        {selectedCharacterId ? (
          <div className="space-y-2">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full border-2 border-gray-300 overflow-hidden">
              <img
                src={getCharacterImage(selectedCharacterId)}
                alt={getCharacterName(selectedCharacterId)}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
            <p className="text-sm font-medium text-gray-800">
              {getCharacterRole(selectedCharacterId)}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-xs">未選択</span>
            </div>
            <p className="text-sm font-medium text-gray-800">
              {isInvestigationSlot ? "解明" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSlot;
