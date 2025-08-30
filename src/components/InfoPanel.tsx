import React from "react";
import { InfoPanelProps } from "../types";

const InfoPanel: React.FC<InfoPanelProps> = () => {
  return (
    <div className="mt-6 p-6 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
      <h4 className="text-lg font-semibold text-yellow-800 mb-3">
        グラフの説明
      </h4>
      <div className="space-y-2 text-yellow-800">
        <p>• 横軸: CRT倍率の値 (150% ～ 300%)</p>
        <p>• 縦軸: CRT期待値 (%)</p>
        <p>• 青い線: 現在のCRT発生率での期待値</p>
        <p>• 赤い点: 現在選択されているCRT倍率での期待値</p>
      </div>
    </div>
  );
};

export default InfoPanel;
