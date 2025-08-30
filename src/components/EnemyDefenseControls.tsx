import React from "react";
import {
  penetrationOptions,
  defenseDebuffOptions,
  DefenseOption,
} from "../data/enemyDefenseData";
import enemyData from "../data/enemyData.json";
import { Enemy } from "../types";

interface EnemyDefenseControlsProps {
  defense: number;
  setDefense: (value: number) => void;
  additionalDefenseCoeff: number;
  setAdditionalDefenseCoeff: (value: number) => void;
  penetration: number;
  setPenetration: (value: number) => void;
  penetrationBuffs: string[];
  setPenetrationBuffs: (value: string[]) => void;
  defenseDebuff: number;
  setDefenseDebuff: (value: number) => void;
  defenseDebuffs: string[];
  setDefenseDebuffs: (value: string[]) => void;
  windStrike: boolean;
  setWindStrike: (value: boolean) => void;
  selectedEnemy: string;
  setSelectedEnemy: (value: string) => void;
}

const EnemyDefenseControls: React.FC<EnemyDefenseControlsProps> = ({
  defense,
  setDefense,
  additionalDefenseCoeff,
  setAdditionalDefenseCoeff,
  penetration,
  setPenetration,
  penetrationBuffs,
  setPenetrationBuffs,
  defenseDebuff,
  setDefenseDebuff,
  defenseDebuffs,
  setDefenseDebuffs,
  windStrike,
  setWindStrike,
  selectedEnemy,
  setSelectedEnemy,
}) => {
  const handleDefenseChange = (value: string): void => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(2000, numValue));
      setDefense(clampedValue);
    }
  };

  const handleAdditionalDefenseCoeffChange = (value: string): void => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(200, numValue));
      setAdditionalDefenseCoeff(clampedValue);
    }
  };

  const handlePenetrationChange = (value: string): void => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(100, numValue));
      setPenetration(clampedValue);
    }
  };

  const handleDefenseDebuffChange = (value: string): void => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(100, numValue));
      setDefenseDebuff(clampedValue);
    }
  };

  const handleEnemyChange = (enemyId: string): void => {
    const enemy = enemyData.enemies.find((e: Enemy) => e.id === enemyId);
    if (enemy) {
      setDefense(enemy.def);
      setAdditionalDefenseCoeff(enemy.additional_def_coeff);
      setSelectedEnemy(enemyId);
    }
  };

  const handleBuffToggle = (
    buffId: string,
    currentBuffs: string[],
    setBuffs: (value: string[]) => void
  ): void => {
    if (currentBuffs.includes(buffId)) {
      setBuffs(currentBuffs.filter((id) => id !== buffId));
    } else {
      setBuffs([...currentBuffs, buffId]);
    }
  };

  const calculateTotalValue = (
    selectedIds: string[],
    options: DefenseOption[]
  ): number => {
    return selectedIds.reduce((total, id) => {
      const option = options.find((opt) => opt.id === id);
      return total + (option?.value || 0);
    }, 0);
  };

  const penetrationTotal = calculateTotalValue(
    penetrationBuffs,
    penetrationOptions
  );
  const defenseDebuffTotal = calculateTotalValue(
    defenseDebuffs,
    defenseDebuffOptions
  );
  const totalDefenseDebuff = defenseDebuff + defenseDebuffTotal;

  // 防御係数の計算
  const calculateDefenseCoeff = (): number => {
    const totalPenetration = penetration + penetrationTotal;
    let defenseCoeff =
      ((100 + additionalDefenseCoeff) * (100 - totalPenetration)) / 100 -
      totalDefenseDebuff;

    // 風襲状態異常の場合は防御係数に0.88をかける
    if (windStrike) {
      defenseCoeff *= 0.88;
    }

    return defenseCoeff;
  };

  // 敵防御力の計算
  const calculateEnemyDefense = (): number => {
    const defenseCoeff = calculateDefenseCoeff();
    const numerator = (defense * defenseCoeff) / 100;
    const denominator = numerator + 1400;
    return 100 - (numerator / denominator) * 100;
  };

  const currentDefenseCoeff = calculateDefenseCoeff();
  const currentEnemyDefense = calculateEnemyDefense();

  return (
    <div className="mb-8 p-6 bg-green-50 rounded-xl border border-green-200">
      <h3 className="text-xl font-semibold text-green-800 mb-4">
        敵防御力計算設定
      </h3>

      {/* 敵選択 */}
      <div className="mb-6">
        <label className="font-semibold mb-3 text-green-700 text-lg block">
          敵選択
        </label>
        <select
          value={selectedEnemy}
          onChange={(e) => handleEnemyChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-green-300 rounded-lg text-lg font-semibold text-green-800 bg-white outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-100"
        >
          <option value="">敵を選択してください</option>
          {enemyData.enemies.map((enemy: Enemy) => (
            <option key={enemy.id} value={enemy.id}>
              {enemy.name} - {enemy.stage} v{enemy.version} (HP:{" "}
              {enemy.hp.toLocaleString()})
            </option>
          ))}
        </select>
        {selectedEnemy && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-700">
              <div>
                <strong>期間:</strong>{" "}
                {new Date(
                  enemyData.enemies.find((e: Enemy) => e.id === selectedEnemy)
                    ?.start_at || ""
                ).toLocaleDateString("ja-JP")}{" "}
                ～{" "}
                {new Date(
                  enemyData.enemies.find((e: Enemy) => e.id === selectedEnemy)
                    ?.end_at || ""
                ).toLocaleDateString("ja-JP")}
              </div>
              <div>
                <strong>防御力:</strong>{" "}
                {
                  enemyData.enemies.find((e: Enemy) => e.id === selectedEnemy)
                    ?.def
                }
              </div>
              <div>
                <strong>追加防御係数:</strong>{" "}
                {
                  enemyData.enemies.find((e: Enemy) => e.id === selectedEnemy)
                    ?.additional_def_coeff
                }
                %
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 防御力設定 */}
        <div className="space-y-4">
          <div>
            <label className="font-semibold mb-3 text-green-700 text-lg block">
              防御力
            </label>
            <div className="flex items-center gap-4 mb-3">
              <input
                type="range"
                className="slider"
                min="0"
                max="2000"
                value={defense}
                onChange={(e) => setDefense(parseInt(e.target.value))}
                step="10"
              />
              <div className="min-w-[80px] px-3 py-2 bg-green-500 text-white rounded-lg text-center font-semibold text-sm">
                {defense}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-24 px-3 py-2 border-2 border-green-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-100"
                min="0"
                max="2000"
                value={defense}
                onChange={(e) => handleDefenseChange(e.target.value)}
                step="10"
                placeholder="0-2000"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold mb-3 text-green-700 text-lg block">
              追加防御係数 (%)
            </label>
            <div className="flex items-center gap-4 mb-3">
              <input
                type="range"
                className="slider"
                min="0"
                max="200"
                value={additionalDefenseCoeff}
                onChange={(e) =>
                  setAdditionalDefenseCoeff(parseInt(e.target.value))
                }
                step="5"
              />
              <div className="min-w-[80px] px-3 py-2 bg-green-500 text-white rounded-lg text-center font-semibold text-sm">
                {additionalDefenseCoeff}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-24 px-3 py-2 border-2 border-green-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-100"
                min="0"
                max="200"
                value={additionalDefenseCoeff}
                onChange={(e) =>
                  handleAdditionalDefenseCoeffChange(e.target.value)
                }
                step="5"
                placeholder="0-200"
              />
              <span className="font-semibold text-green-700 text-sm">%</span>
            </div>
          </div>
        </div>

        {/* 貫通設定 */}
        <div className="space-y-4">
          <div>
            <label className="font-semibold mb-3 text-green-700 text-lg block">
              貫通 (%)
            </label>
            <div className="flex items-center gap-4 mb-3">
              <input
                type="range"
                className="slider"
                min="0"
                max="100"
                value={penetration}
                onChange={(e) => setPenetration(parseInt(e.target.value))}
                step="5"
              />
              <div className="min-w-[80px] px-3 py-2 bg-green-500 text-white rounded-lg text-center font-semibold text-sm">
                {penetration}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-24 px-3 py-2 border-2 border-green-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-100"
                min="0"
                max="100"
                value={penetration}
                onChange={(e) => handlePenetrationChange(e.target.value)}
                step="5"
                placeholder="0-100"
              />
              <span className="font-semibold text-green-700 text-sm">%</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-green-700">
              貫通強化 (合計: {penetrationTotal}%)
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {penetrationOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={penetrationBuffs.includes(option.id)}
                    onChange={() =>
                      handleBuffToggle(
                        option.id,
                        penetrationBuffs,
                        setPenetrationBuffs
                      )
                    }
                    className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-green-800">
                    {option.name} (+{option.value}%)
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 防御率デバフ */}
      <div className="mt-6">
        <h4 className="font-semibold mb-3 text-green-700">
          防御率デバフ (合計: {totalDefenseDebuff}%)
        </h4>

        {/* 防御率デバフ基本値 */}
        <div className="mb-4">
          <label className="font-semibold mb-3 text-green-700 text-lg block">
            防御率デバフ基本値 (%)
          </label>
          <div className="flex items-center gap-4 mb-3">
            <input
              type="range"
              className="slider"
              min="0"
              max="100"
              value={defenseDebuff}
              onChange={(e) => setDefenseDebuff(parseInt(e.target.value))}
              step="5"
            />
            <div className="min-w-[80px] px-3 py-2 bg-green-500 text-white rounded-lg text-center font-semibold text-sm">
              {defenseDebuff}%
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-24 px-3 py-2 border-2 border-green-300 rounded-lg text-sm font-semibold text-center outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-100"
              min="0"
              max="100"
              value={defenseDebuff}
              onChange={(e) => handleDefenseDebuffChange(e.target.value)}
              step="5"
              placeholder="0-100"
            />
            <span className="font-semibold text-green-700 text-sm">%</span>
          </div>
        </div>

        {/* 防御率デバフ強化 */}
        <div>
          <h5 className="font-semibold mb-3 text-green-700">
            防御率デバフ強化 (合計: {defenseDebuffTotal}%)
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {defenseDebuffOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 cursor-pointer p-2 rounded border border-green-200 hover:bg-green-50"
              >
                <input
                  type="checkbox"
                  checked={defenseDebuffs.includes(option.id)}
                  onChange={() =>
                    handleBuffToggle(
                      option.id,
                      defenseDebuffs,
                      setDefenseDebuffs
                    )
                  }
                  className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-green-800">
                  {option.name} (+{option.value}%)
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 状態異常 */}
        <div className="mt-4">
          <h4 className="font-semibold mb-3 text-green-700">状態異常</h4>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={windStrike}
              onChange={(e) => setWindStrike(e.target.checked)}
              className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-green-800 font-semibold">
              風襲 (防御係数 × 0.88)
            </span>
          </div>
        </div>
      </div>

      {/* 計算結果表示 */}
      <div className="mt-6 p-4 bg-green-100 rounded-lg">
        <div className="text-center space-y-2">
          <div className="text-lg font-bold text-green-800">
            防御係数 = (100% + {additionalDefenseCoeff}%) × (100% -{" "}
            {penetration + penetrationTotal}%) - {totalDefenseDebuff}%
            {windStrike && " × 0.88"} = {currentDefenseCoeff.toFixed(1)}%
          </div>
          <div className="text-lg font-bold text-green-800">
            敵防御力計算 = 100% - (({defense} × {currentDefenseCoeff.toFixed(1)}
            %) / ({defense} × {currentDefenseCoeff.toFixed(1)}% + 1400)) ={" "}
            {currentEnemyDefense.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnemyDefenseControls;
