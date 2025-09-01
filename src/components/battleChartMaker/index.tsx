import React, { useState } from "react";
import CharacterSelectBoxes from "./CharacterSelectBoxes";
import CardManager from "./CardManager";

const BattleChartMaker: React.FC = () => {
  const [personas, setPersonas] = useState<string[]>(["", "", ""]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* キャラクター選択セクション */}
      <CharacterSelectBoxes onPersonaChange={setPersonas} />

      {/* カード管理セクション */}
      <CardManager personas={personas} />
    </div>
  );
};

export default BattleChartMaker;
