import React from "react";

const EnemyDefenseEstimator: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          敵防御力推定支援ツール
        </h1>
        <p className="text-lg text-gray-600">
          敵の防御力を推定するための支援ツール
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">開発中...</h2>
        <p className="text-gray-600">
          このツールは現在開発中です。近日公開予定です。
        </p>
      </div>
    </div>
  );
};

export default EnemyDefenseEstimator;
