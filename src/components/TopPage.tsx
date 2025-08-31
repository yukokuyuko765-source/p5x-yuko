import React from "react";
import { Link } from "react-router-dom";

const TopPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">P5X Tools</h1>
      </div>

      {/* ダメージ計算ツール */}
      <Link
        to="/damageCalculator"
        className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">ダメージ計算ツール</h2>
            <p className="text-sm">
              攻撃力、倍率、デバフ量、CRT期待値などを考慮したダメージ計算
            </p>
          </div>
          <div className="text-gray-400 ml-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>

      {/* 敵防御力推定支援ツール */}
      <Link
        to="/enemyDefenseEstimator"
        className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              敵防御力推定支援ツール
            </h2>
            <p className="text-sm">敵の防御力を推定するための支援ツール</p>
          </div>
          <div className="text-gray-400 ml-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>

      {/* 注意事項 */}
      <div className="mt-12 p-6 bg-amber-50 rounded-xl border border-amber-200">
        <h3 className="text-lg font-semibold text-amber-800 mb-3">
          ⚠️ 注意事項
        </h3>
        <ul className="text-sm text-amber-700 space-y-2 list-disc list-inside">
          <li>
            このツールは非公式のファン制作物です。SEGA・ATLUS・Perfect World
            Gamesとは一切関係ありません。
          </li>
          <li>
            計算結果の正確性については保証いたしません。ゲームの実際の仕様と異なる場合があります。
          </li>
          <li>
            このツールは研究・学習目的で作成されています。商用利用は禁止されています。
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopPage;
