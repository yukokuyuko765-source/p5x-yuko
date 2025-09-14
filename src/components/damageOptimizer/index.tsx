import React from "react";

const DamageOptimizer: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            ダメージ最適化ツール
          </h1>

          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              ダメージ最適化ツールの機能を実装中です...
            </div>
            <div className="mt-4 text-sm text-gray-400">
              このツールでは、キャラクターのスキルや装備を最適化して最大ダメージを計算します。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageOptimizer;
