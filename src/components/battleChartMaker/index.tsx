import React, { useState, useEffect } from "react";
import CharacterSelectBoxes from "./CharacterSelectBoxes";
import CardManager from "./CardManager";
import BattleChartTextCard from "./BattleChartTextCard";

const BattleChartMaker: React.FC = () => {
  const [personas, setPersonas] = useState<string[]>(["", "", ""]);
  const [chartCards, setChartCards] = useState<any[]>([]);
  const [chartTitle, setChartTitle] = useState<string>("");
  const [selectedCharacters, setSelectedCharacters] = useState<
    Array<{ id: string; position: string }>
  >([
    { id: "", position: "" },
    { id: "", position: "" },
    { id: "", position: "" },
    { id: "", position: "" },
    { id: "", position: "" },
  ]);

  // ChartCardのデータ更新を監視
  useEffect(() => {
    const chartCardsMap = new Map();

    const handleChartCardUpdate = (event: CustomEvent) => {
      const { cardId, cardData } = event.detail;
      chartCardsMap.set(cardId, cardData);

      // Mapから配列に変換
      const cardsArray = Array.from(chartCardsMap.values());
      setChartCards(cardsArray);
    };

    window.addEventListener(
      "chartCardUpdate",
      handleChartCardUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "chartCardUpdate",
        handleChartCardUpdate as EventListener
      );
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* キャラクター選択セクション */}
      <CharacterSelectBoxes
        onPersonaChange={setPersonas}
        onCharacterSelect={setSelectedCharacters}
      />

      {/* カード管理セクション */}
      <CardManager
        personas={personas}
        chartTitle={chartTitle}
        onChartTitleChange={setChartTitle}
      />

      {/* 戦闘チャートテキストカード */}
      <BattleChartTextCard
        chartCards={chartCards}
        personas={personas}
        selectedCharacters={selectedCharacters}
        chartTitle={chartTitle}
      />
    </div>
  );
};

export default BattleChartMaker;
