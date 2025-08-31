import React, { useState } from "react";
import { Sidebar } from "./index";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* サイドバー */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* メインコンテンツ */}
      <div className="lg:ml-64">
        {/* ヘッダー */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">P5X Tools</h1>
            <div className="w-10"></div> {/* 中央揃えのためのスペーサー */}
          </div>
        </header>

        {/* コンテンツエリア */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
