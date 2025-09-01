import React from "react";

interface ChartCardProps {
  id: string;
  onDelete?: (id: string) => void;
}

const ChartCard: React.FC<ChartCardProps> = ({ id, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-sm font-medium text-gray-800">ターン #{id}</h4>
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="text-xs text-gray-500">
          カードの内容をここに記述します
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <span className="text-xs text-gray-500">準備中</span>
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
