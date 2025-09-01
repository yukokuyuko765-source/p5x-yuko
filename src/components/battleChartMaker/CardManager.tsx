import React, { useState } from "react";
import ChartCard from "./ChartCard";

interface CardManagerProps {
  personas?: string[];
  chartTitle?: string;
  onChartTitleChange?: (title: string) => void;
}

interface InnerCardData {
  id: string;
  characterId: string;
  option: string;
  persona?: string;
  note: string;
}

const CardManager: React.FC<CardManagerProps> = ({
  personas = [],
  chartTitle: externalChartTitle,
  onChartTitleChange,
}) => {
  const [cards, setCards] = useState<Array<{ id: string; title: string }>>([
    { id: "1", title: "1" },
  ]);
  const [chartTitle, setChartTitle] = useState<string>("");
  const [draggedInnerCard, setDraggedInnerCard] = useState<{
    cardId: string;
    innerCard: InnerCardData;
  } | null>(null);

  const addCard = () => {
    // ユニークなIDを生成（現在の最大ID + 1ではなく、タイムスタンプベース）
    const newCardId = `card-${Date.now()}`;
    const newCardTitle = (cards.length + 1).toString();
    setCards([...cards, { id: newCardId, title: newCardTitle }]);
  };

  const deleteCard = (cardId: string) => {
    if (cards.length > 1) {
      setCards(cards.filter((card) => card.id !== cardId));
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

  const handleNoteCardDrop = (targetCardId: string, dropIndex: number) => {
    // noteカードをChartCardに追加するためのカスタムイベントを発火
    const noteEvent = new CustomEvent("noteCardAdd", {
      detail: {
        toCardId: targetCardId,
        dropIndex: dropIndex,
      },
    });
    window.dispatchEvent(noteEvent);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-semibold text-gray-800">戦闘チャート</h3>
          <input
            type="text"
            placeholder="チャートのタイトル"
            value={externalChartTitle || chartTitle}
            onChange={(e) => {
              const newTitle = e.target.value;
              setChartTitle(newTitle);
              onChartTitleChange?.(newTitle);
            }}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Noteカードのドラッグ開始エリア */}
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

      <div className="space-y-4">
        {cards.map((card) => (
          <ChartCard
            key={card.id}
            id={card.id}
            cardTitle={card.title}
            personas={personas}
            onDelete={cards.length > 1 ? deleteCard : undefined}
            onInnerCardDragStart={handleInnerCardDragStart}
            onInnerCardDrop={handleInnerCardDrop}
            draggedInnerCard={draggedInnerCard}
            onNoteCardDrop={handleNoteCardDrop}
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
