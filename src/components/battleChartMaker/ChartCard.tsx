import React, { useState } from "react";
import InnerCard from "./InnerCard";

interface InnerCardData {
  id: string;
  characterId: string;
  option: string;
  persona?: string;
  note: string;
}

interface ChartCardProps {
  id: string;
  onDelete?: (id: string) => void;
  personas?: string[];
}

const ChartCard: React.FC<ChartCardProps> = ({
  id,
  onDelete,
  personas = [],
}) => {
  const [innerCards, setInnerCards] = useState<InnerCardData[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [title, setTitle] = useState<string>(`ターン ${id}`);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);

    // ドロップ位置を検出
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const cardHeight = rect.height / (innerCards.length + 1);
    const index = Math.floor(y / cardHeight);
    setDragOverIndex(Math.min(index, innerCards.length));
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragOverIndex(null);

    const characterId = e.dataTransfer.getData("characterId");
    if (characterId) {
      const newInnerCard: InnerCardData = {
        id: `card-${Date.now()}`,
        characterId,
        option: "S1",
        persona: characterId === "wonder" ? "1" : undefined,
        note: "",
      };

      // 検出された位置に挿入
      if (dragOverIndex !== null) {
        const newCards = [...innerCards];
        newCards.splice(dragOverIndex, 0, newInnerCard);
        setInnerCards(newCards);
      } else {
        // フォールバック: 末尾に追加
        setInnerCards([...innerCards, newInnerCard]);
      }
    }
  };

  const updateInnerCard = (index: number, data: InnerCardData) => {
    const updatedCards = [...innerCards];
    updatedCards[index] = data;
    setInnerCards(updatedCards);
  };

  const removeInnerCard = (index: number) => {
    setInnerCards(innerCards.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isDragOver ? "border-blue-400 bg-blue-50" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm font-medium text-gray-800 bg-transparent border border-gray-200 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 px-2 py-1 min-w-0 hover:bg-gray-50 focus:bg-gray-50 rounded transition-colors duration-200 cursor-text"
            placeholder="タイトルを入力..."
          />
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
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
        )}
      </div>

      {!isCollapsed && (
        <div className="space-y-3">
          {innerCards.length === 0 ? (
            <div className="text-xs text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded">
              アバターをドラッグ&ドロップしてください
            </div>
          ) : (
            <div className="space-y-3">
              {innerCards.map((innerCard, index) => (
                <React.Fragment key={index}>
                  {/* ドラッグオーバー時の挿入位置インジケーター */}
                  {dragOverIndex === index && (
                    <div className="h-1 bg-blue-500 rounded-full mx-2"></div>
                  )}
                  <InnerCard
                    data={innerCard}
                    personas={personas}
                    onUpdate={(data) => updateInnerCard(index, data)}
                    onDelete={() => removeInnerCard(index)}
                  />
                </React.Fragment>
              ))}
              {/* 最後の位置への挿入インジケーター */}
              {dragOverIndex === innerCards.length && (
                <div className="h-1 bg-blue-500 rounded-full mx-2"></div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
