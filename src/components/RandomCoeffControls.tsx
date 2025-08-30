import React from "react";

interface RandomCoeffControlsProps {
  randomCoeffEnabled: boolean;
  setRandomCoeffEnabled: (value: boolean) => void;
  randomCoeffMin: number;
  setRandomCoeffMin: (value: number) => void;
  randomCoeffMax: number;
  setRandomCoeffMax: (value: number) => void;
}

const RandomCoeffControls: React.FC<RandomCoeffControlsProps> = ({
  randomCoeffEnabled,
  setRandomCoeffEnabled,
  randomCoeffMin,
  setRandomCoeffMin,
  randomCoeffMax,
  setRandomCoeffMax,
}) => {
  const handleMinChange = (value: string): void => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(100, numValue));
      setRandomCoeffMin(clampedValue);
    }
  };

  const handleMaxChange = (value: string): void => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(200, numValue));
      setRandomCoeffMax(clampedValue);
    }
  };

  return (
    <div className="mb-8 p-6 bg-indigo-50 rounded-xl border border-indigo-200">
      <h3 className="text-xl font-semibold text-indigo-800 mb-4">
        ランダム係数設定
      </h3>

      {/* 有効/無効トグル */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={randomCoeffEnabled}
            onChange={(e) => setRandomCoeffEnabled(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
          />
          <span className="font-semibold text-indigo-700 text-lg">
            ランダム係数を有効にする
          </span>
        </label>
      </div>

      {randomCoeffEnabled && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 下限値 */}
            <div>
              <label className="font-semibold mb-3 text-indigo-700 text-lg block">
                下限値 (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-24 px-3 py-2 border-2 border-indigo-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  min="0"
                  max="100"
                  value={randomCoeffMin}
                  onChange={(e) => handleMinChange(e.target.value)}
                  step="0.1"
                  placeholder="0-100"
                />
                <span className="font-semibold text-indigo-700 text-sm">%</span>
              </div>
            </div>

            {/* 上限値 */}
            <div>
              <label className="font-semibold mb-3 text-indigo-700 text-lg block">
                上限値 (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-24 px-3 py-2 border-2 border-indigo-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  min="0"
                  max="200"
                  value={randomCoeffMax}
                  onChange={(e) => handleMaxChange(e.target.value)}
                  step="0.1"
                  placeholder="0-200"
                />
                <span className="font-semibold text-indigo-700 text-sm">%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 計算結果表示 */}
      <div className="mt-4 p-3 bg-indigo-100 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-indigo-800">
            ランダム係数 ={" "}
            {randomCoeffEnabled
              ? `${randomCoeffMin.toFixed(1)}% ～ ${randomCoeffMax.toFixed(1)}%`
              : "100% (無効)"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomCoeffControls;
