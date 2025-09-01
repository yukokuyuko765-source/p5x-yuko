import React, { useState } from "react";
import ChartCard from "./ChartCard";

interface CardManagerProps {
  personas?: string[];
}

const CardManager: React.FC<CardManagerProps> = ({ personas = [] }) => {
  const [cards, setCards] = useState<string[]>(["1"]);

  const addCard = () => {
    const newCardId = (cards.length + 1).toString();
    setCards([...cards, newCardId]);
  };

  const deleteCard = (cardId: string) => {
    if (cards.length > 1) {
      setCards(cards.filter((id) => id !== cardId));
    }
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
