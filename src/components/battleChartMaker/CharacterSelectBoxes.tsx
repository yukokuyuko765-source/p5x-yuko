import React, { useState } from "react";
import CharacterSlot from "./CharacterSlot";

const CharacterSelectBoxes: React.FC = () => {
  const [selectedCharacter1, setSelectedCharacter1] = useState<string>("");
  const [selectedCharacter2, setSelectedCharacter2] = useState<string>("");
  const [selectedCharacter3, setSelectedCharacter3] = useState<string>("");
  const [selectedCharacter4, setSelectedCharacter4] = useState<string>("");
  const [selectedCharacter5, setSelectedCharacter5] = useState<string>("");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        キャラクター選択
      </h3>
      <p className="text-gray-600 mb-6">
        戦闘に参加するキャラクターを選択してください
      </p>

      {/* キャラクタースロット */}
      <div className="grid grid-cols-5 gap-4">
        <CharacterSlot
          selectedCharacterId={selectedCharacter1}
          onCharacterSelect={setSelectedCharacter1}
        />
        <CharacterSlot
          selectedCharacterId={selectedCharacter2}
          onCharacterSelect={setSelectedCharacter2}
        />
        <CharacterSlot
          selectedCharacterId={selectedCharacter3}
          onCharacterSelect={setSelectedCharacter3}
        />
        <CharacterSlot
          selectedCharacterId={selectedCharacter4}
          onCharacterSelect={setSelectedCharacter4}
        />
        <CharacterSlot
          selectedCharacterId={selectedCharacter5}
          isInvestigationSlot={true}
          onCharacterSelect={setSelectedCharacter5}
        />
      </div>
    </div>
  );
};

export default CharacterSelectBoxes;
