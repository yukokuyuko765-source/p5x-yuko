import React from "react";
import CharacterSelectBoxes from "./CharacterSelectBoxes";
import CardManager from "./CardManager";

const BattleChartMaker: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* キャラクター選択セクション */}
      <CharacterSelectBoxes />

      {/* カード管理セクション */}
      <CardManager />
    </div>
  );
};

export default BattleChartMaker;
