import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  return (
    <>
      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* サイドバー */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary-600 to-purple-700 text-white transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ヘッダー */}
        <div className="p-6 border-b border-white/20">
          <Link
            to="/"
            className="block hover:opacity-80 transition-opacity duration-200"
          >
            <h1 className="text-2xl font-bold cursor-pointer">P5X Tools</h1>
          </Link>
        </div>

        {/* ナビゲーション */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/damageCalculator"
                className="block px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                ダメージ計算ツール
              </Link>
            </li>
            <li>
              <Link
                to="/enemyDefenseEstimator"
                className="block px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                敵防御力推定支援ツール
              </Link>
            </li>
          </ul>
        </nav>

        {/* フッター */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <div className="text-xs text-white/60 space-y-2">
            <p>ゲームのコンテンツと素材の商標と著作権は、</p>
            <p>SEGA・ATLUS・Perfect World Games に帰属します。</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
