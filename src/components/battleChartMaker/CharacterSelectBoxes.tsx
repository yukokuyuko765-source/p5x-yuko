import React, { useState } from "react";
import CharacterSlot from "./CharacterSlot";
import WonderSlot from "./WonderSlot";

interface CharacterSelectBoxesProps {
  onPersonaChange: (personas: string[]) => void;
  onCharacterSelect?: (
    characters: Array<{ id: string; position: string }>
  ) => void;
}

const CharacterSelectBoxes: React.FC<CharacterSelectBoxesProps> = ({
  onPersonaChange,
  onCharacterSelect,
}) => {
  const [selectedCharacter2, setSelectedCharacter2] = useState<{
    id: string;
    position: string;
  }>({ id: "", position: "" });
  const [selectedCharacter3, setSelectedCharacter3] = useState<{
    id: string;
    position: string;
  }>({ id: "", position: "" });
  const [selectedCharacter4, setSelectedCharacter4] = useState<{
    id: string;
    position: string;
  }>({ id: "", position: "" });
  const [selectedCharacter5, setSelectedCharacter5] = useState<{
    id: string;
    position: string;
  }>({ id: "", position: "" });

  // 選択されたキャラクター情報を親コンポーネントに渡す
  React.useEffect(() => {
    if (onCharacterSelect) {
      const characters = [
        { id: "wonder", position: "1st" },
        selectedCharacter2,
        selectedCharacter3,
        selectedCharacter4,
        selectedCharacter5,
      ];
      onCharacterSelect(characters);
    }
  }, [
    selectedCharacter2,
    selectedCharacter3,
    selectedCharacter4,
    selectedCharacter5,
    onCharacterSelect,
  ]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">怪盗選択</h3>

      {/* キャラクタースロット */}
      <div className="grid grid-cols-5 gap-4">
        <WonderSlot
          onPersonaChange={onPersonaChange}
          onCharacterSelect={(id, position) => {
            // WONDERの場合は常に1番目のスロットとして扱う
            const updatedCharacters = [
              { id, position },
              selectedCharacter2,
              selectedCharacter3,
              selectedCharacter4,
              selectedCharacter5,
            ];
            onCharacterSelect?.(updatedCharacters);
          }}
        />
        <CharacterSlot
          selectedCharacterId={selectedCharacter2.id}
          onCharacterSelect={(id, position) =>
            setSelectedCharacter2({ id, position })
          }
          initialPosition="2nd"
        />
        <CharacterSlot
          selectedCharacterId={selectedCharacter3.id}
          onCharacterSelect={(id, position) =>
            setSelectedCharacter3({ id, position })
          }
          initialPosition="3rd"
        />
        <CharacterSlot
          selectedCharacterId={selectedCharacter4.id}
          onCharacterSelect={(id, position) =>
            setSelectedCharacter4({ id, position })
          }
          initialPosition="4th"
        />
        <CharacterSlot
          selectedCharacterId={selectedCharacter5.id}
          isInvestigationSlot={true}
          onCharacterSelect={(id, position) =>
            setSelectedCharacter5({ id, position })
          }
        />
      </div>

      {/* Noteカードのドラッグ開始エリア */}
      <div className="mt-4 flex justify-end">
        <div
          className="bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-2 cursor-move hover:bg-blue-100 transition-colors duration-200"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("noteCard", "true");
          }}
        >
          <span className="text-sm text-blue-700 font-medium">
            このブロックをドロップしてNoteを追加
          </span>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelectBoxes;
