import React from "react";
import CharacterSelectBoxes from "./CharacterSelectBoxes";

const BattleChartMaker: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            戦闘チャートメーカー
          </h2>
          <p className="text-lg text-gray-700">
            戦闘の流れを視覚的に表現するチャートを作成するツールです。
          </p>
        </div>

        {/* キャラクター選択セクション */}
        <CharacterSelectBoxes />
      </div>
    </div>
  );
};

export default BattleChartMaker;
