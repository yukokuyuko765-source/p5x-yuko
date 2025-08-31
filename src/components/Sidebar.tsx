import React from "react";

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
          <h1 className="text-2xl font-bold">P5X Tools</h1>
        </div>

        {/* ナビゲーション */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                ダメージ計算ツール
              </a>
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
