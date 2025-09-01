import React from "react";
import characterData from "../../data/characterData.json";

interface Character {
  id: string;
  name: string;
  image: string;
  role: string;
}

interface DraggableAvatarProps {
  characterId: string;
}

const DraggableAvatar: React.FC<DraggableAvatarProps> = ({ characterId }) => {
  const getCharacterImage = (characterId: string): string => {
    const character = characterData.find(
      (char: Character) => char.id === characterId
    );
    if (character) {
      try {
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

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("characterId", characterId);
    e.dataTransfer.effectAllowed = "copy";
  };

  if (!characterId) {
    return (
      <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
        <span className="text-gray-400 text-xs">未選択</span>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="cursor-grab active:cursor-grabbing"
    >
      <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full border-2 border-gray-300 overflow-hidden">
        <img
          src={getCharacterImage(characterId)}
          alt={getCharacterName(characterId)}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>
      <p className="text-sm font-medium text-gray-800 text-center mt-2">
        {getCharacterRole(characterId)}
      </p>
    </div>
  );
};

export default DraggableAvatar;
