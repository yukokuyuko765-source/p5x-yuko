import React, { useState } from "react";
import ChartCard from "./ChartCard";

interface CardManagerProps {
  personas?: string[];
}

interface InnerCardData {
  id: string;
  characterId: string;
  option: string;
  persona?: string;
  note: string;
}

const CardManager: React.FC<CardManagerProps> = ({ personas = [] }) => {
  const [cards, setCards] = useState<string[]>(["1"]);
  const [draggedInnerCard, setDraggedInnerCard] = useState<{
    cardId: string;
    innerCard: InnerCardData;
  } | null>(null);

  const addCard = () => {
    const newCardId = (cards.length + 1).toString();
    setCards([...cards, newCardId]);
  };

  const deleteCard = (cardId: string) => {
    if (cards.length > 1) {
      setCards(cards.filter((id) => id !== cardId));
    }
  };

  const handleInnerCardDragStart = (
    cardId: string,
    innerCard: InnerCardData
  ) => {
    setDraggedInnerCard({ cardId, innerCard });
  };

  const handleInnerCardDrop = (targetCardId: string, dropIndex: number) => {
    if (!draggedInnerCard) return;

    // 同じカード内での移動の場合は何もしない
    if (draggedInnerCard.cardId === targetCardId) return;

    // ChartCard間でのinnerCard移動を処理
    // 各ChartCardの状態を更新するために、カスタムイベントを発火
    const moveEvent = new CustomEvent("innerCardMove", {
      detail: {
        fromCardId: draggedInnerCard.cardId,
        toCardId: targetCardId,
        dropIndex: dropIndex,
        innerCard: draggedInnerCard.innerCard,
      },
    });
    window.dispatchEvent(moveEvent);

    setDraggedInnerCard(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">戦闘チャート</h3>

      <div className="space-y-4">
        {cards.map((cardId) => (
          <ChartCard
            key={cardId}
            id={cardId}
            personas={personas}
            onDelete={cards.length > 1 ? deleteCard : undefined}
            onInnerCardDragStart={handleInnerCardDragStart}
            onInnerCardDrop={handleInnerCardDrop}
            draggedInnerCard={draggedInnerCard}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={addCard}
          className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CardManager;
