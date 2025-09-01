import React from "react";

const BattleChartMaker: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            戦闘チャートメーカー
          </h2>
          <p className="text-lg text-gray-700 mb-3">
            戦闘の流れを視覚的に表現するチャートを作成するツールです。
          </p>
          <p className="text-lg text-gray-700">
            このツールは現在開発中です。今後、戦闘の進行を図表で表現する機能が追加される予定です。
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            開発予定機能
          </h3>
          <ul className="text-gray-700 space-y-2 list-disc list-inside">
            <li>戦闘フローの作成と編集</li>
            <li>条件分岐の設定</li>
            <li>戦闘結果の可視化</li>
            <li>チャートのエクスポート機能</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BattleChartMaker;
