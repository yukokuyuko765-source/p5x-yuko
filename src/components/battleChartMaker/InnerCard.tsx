import React from "react";
import characterData from "../../data/characterData.json";

interface Character {
  id: string;
  name: string;
  image: string;
  role: string;
}

interface InnerCardData {
  id: string; // ユニークIDを追加
  characterId: string;
  option: string;
  persona?: string;
  note: string;
}

interface InnerCardProps {
  data: InnerCardData;
  personas: string[];
  onUpdate: (data: InnerCardData) => void;
  onDelete: () => void;
}

const InnerCard: React.FC<InnerCardProps> = ({
  data,
  personas,
  onUpdate,
  onDelete,
}) => {
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

  const updateField = (field: keyof InnerCardData, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 border">
      <div className="flex items-center space-x-3">
        {/* アバター */}
        <div className="w-8 h-8 rounded-full border overflow-hidden flex-shrink-0">
          <img
            src={getCharacterImage(data.characterId)}
            alt={getCharacterName(data.characterId)}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>

        {/* キャラクター名 */}
        <span className="text-sm font-medium text-gray-800 min-w-0 flex-1">
          {getCharacterName(data.characterId)}
        </span>

        {/* オプション */}
        <div className="flex items-center space-x-2">
          {getCharacterName(data.characterId) === "WONDER" ? (
            <>
              {/* ペルソナ選択 */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">ペルソナ:</span>
                {["1", "2", "3"].map((persona) => {
                  const personaIndex = parseInt(persona) - 1;
                  const personaName =
                    personas[personaIndex] || `ペルソナ${persona}`;
                  return (
                    <label
                      key={persona}
                      className="flex items-center space-x-1"
                    >
                      <input
                        type="radio"
                        name={`persona-${data.id}-${persona}`}
                        value={persona}
                        checked={data.persona === persona}
                        onChange={(e) => updateField("persona", e.target.value)}
                        className="text-blue-500"
                      />
                      <span className="text-xs text-gray-700">
                        {personaName}
                      </span>
                    </label>
                  );
                })}
                <span className="text-xs text-blue-600 font-medium ml-1">
                  {data.persona && personas[parseInt(data.persona) - 1]
                    ? personas[parseInt(data.persona) - 1]
                    : `ペルソナ${data.persona}`}
                </span>
              </div>
              {/* 行動選択 */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">行動:</span>
                {["S1", "S2", "S3", "HL"].map((option) => (
                  <label key={option} className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name={`option-${data.id}-${option}`}
                      value={option}
                      checked={data.option === option}
                      onChange={(e) => updateField("option", e.target.value)}
                      className="text-blue-500"
                    />
                    <span className="text-xs text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <>
              <span className="text-xs text-gray-600">行動:</span>
              {["S1", "S2", "S3", "HL"].map((option) => (
                <label key={option} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name={`option-${data.id}-${option}`}
                    value={option}
                    checked={data.option === option}
                    onChange={(e) => updateField("option", e.target.value)}
                    className="text-blue-500"
                  />
                  <span className="text-xs text-gray-700">{option}</span>
                </label>
              ))}
            </>
          )}
        </div>

        {/* 備考 */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="備考を入力..."
            value={data.note}
            onChange={(e) => updateField("note", e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* 削除ボタン */}
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 flex-shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InnerCard;
