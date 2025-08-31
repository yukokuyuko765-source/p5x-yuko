import React, { useState } from "react";
import { NumericFormat } from "react-number-format";

const EnemyDefenseEstimator: React.FC = () => {
  // 状態管理
  const [weaponLimitBreak, setWeaponLimitBreak] = useState<number>(0);
  const [defenseReductionNoDebuff, setDefenseReductionNoDebuff] =
    useState<number>(0);
  const [defenseReductionWithDebuff, setDefenseReductionWithDebuff] =
    useState<number>(0);
  const [totalDebuffPercentage, setTotalDebuffPercentage] = useState<number>(0);

  // 1. 武器凸数から出力値を取得
  const getWeaponOutput = (limitBreak: number): number => {
    const outputs = [13, 20, 20, 27, 27, 34, 34];
    return outputs[limitBreak] || 13;
  };

  // 2. 防御力の計算
  const calculateDefense = (): number => {
    const weaponOutput = getWeaponOutput(weaponLimitBreak);
    return (defenseReductionNoDebuff / weaponOutput) * 100;
  };

  // 3. 3番目の計算結果
  const calculateThirdResult = (): number => {
    const weaponOutput = getWeaponOutput(weaponLimitBreak);
    return (defenseReductionWithDebuff / weaponOutput) * 100;
  };

  // 4. 追加防御係数の計算
  const calculateAdditionalDefenseCoeff = (): number => {
    const defense = calculateDefense();
    const thirdResult = calculateThirdResult();
    const denominator = defense - thirdResult;

    if (denominator === 0) return 0;

    return totalDebuffPercentage * (defense / denominator) - 100;
  };

  // 計算結果
  const defense = calculateDefense();
  const additionalDefenseCoeff = calculateAdditionalDefenseCoeff();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            敵防御力推定支援ツール
          </h2>
          <p className="text-lg text-gray-700 mb-3">
            YUKIの武器、罪業還土の効果である救世の鎖は、絶対判決を使用した「瞬間」の敵の防御力を元に計算した分、相手の防御力を下げます。
          </p>
          <p className="text-lg text-gray-700">
            この効果を利用して、敵の防御力を推定するためのツールです。
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 入力セクション */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                入力値
              </h3>

              {/* 1. 武器凸数 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Q1. YUKIの武器、罪業還土の改造回数はいくつですか？
                </label>
                <select
                  value={weaponLimitBreak}
                  onChange={(e) => setWeaponLimitBreak(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </div>

              {/* 2. 防御力減算値（デバフなし） */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Q2.
                  防御デバフのかかってない敵に対して絶対判決を撃った時、どれだけの防御力が減算されましたか？
                </label>
                <NumericFormat
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={defenseReductionNoDebuff}
                  onValueChange={(values) =>
                    setDefenseReductionNoDebuff(Number(values.value) || 0)
                  }
                  placeholder="0"
                />
              </div>

              {/* 3. 防御力減算値（デバフあり） */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Q3.
                  防御デバフがかかった敵に対して絶対判決を撃った時、どれだけの防御力が減算されましたか？
                </label>
                <NumericFormat
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={defenseReductionWithDebuff}
                  onValueChange={(values) =>
                    setDefenseReductionWithDebuff(Number(values.value) || 0)
                  }
                  placeholder="0"
                />
              </div>

              {/* 4. 防御デバフ割合の合計 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Q4. Q3時点での防御デバフ割合の合計は何%でしたか？
                </label>
                <NumericFormat
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={totalDebuffPercentage}
                  onValueChange={(values) =>
                    setTotalDebuffPercentage(Number(values.value) || 0)
                  }
                  suffix="%"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* 結果セクション */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                計算結果
              </h3>

              {/* 防御力 */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-blue-600 mb-2">防御力</h4>
                <div className="text-2xl font-bold text-blue-800">
                  {defense.toFixed(1)}
                </div>
              </div>

              {/* デバフ時の防御力 */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-purple-600 mb-2">
                  デバフ時の防御力
                </h4>
                <div className="text-2xl font-semibold text-purple-800">
                  {calculateThirdResult().toFixed(1)}
                </div>
              </div>

              {/* 追加防御係数 */}
              <div>
                <h4 className="text-lg font-bold text-green-600 mb-2">
                  追加防御係数
                </h4>
                <div className="text-2xl font-bold text-green-800">
                  {additionalDefenseCoeff.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnemyDefenseEstimator;
