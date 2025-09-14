import React from "react";
import { NumericFormat } from "react-number-format";
import { CriticalConfig } from "../../utils/damageOptimization";
import criticalRateData from "../../data/criticalRateData.json";
import criticalMultiplierData from "../../data/criticalMultiplierData.json";

interface CriticalSettingsProps {
  critical: CriticalConfig;
  setCritical: React.Dispatch<React.SetStateAction<CriticalConfig>>;
  criticalRateCheckboxes: Record<string, number>;
  setCriticalRateCheckboxes: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  criticalMultiplierCheckboxes: Record<string, number>;
  setCriticalMultiplierCheckboxes: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  totalCriticalRate: number;
  totalCriticalMultiplier: number;
}

const CriticalSettings: React.FC<CriticalSettingsProps> = ({
  critical,
  setCritical,
  criticalRateCheckboxes,
  setCriticalRateCheckboxes,
  criticalMultiplierCheckboxes,
  setCriticalMultiplierCheckboxes,
  totalCriticalRate,
  totalCriticalMultiplier,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <h2 className="text-sm font-semibold text-gray-800 mb-2">
        クリティカル設定
      </h2>
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            クリティカル発生率 (%)
          </label>
          <NumericFormat
            value={critical.criticalRate}
            onValueChange={(values) =>
              setCritical({
                ...critical,
                criticalRate: values.floatValue || 0,
              })
            }
            suffix="%"
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <div className="space-y-1">
            {criticalRateData.criticalRates.map((crit) => (
              <div key={crit.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={criticalRateCheckboxes[crit.id] > 0}
                  onChange={(e) =>
                    setCriticalRateCheckboxes({
                      ...criticalRateCheckboxes,
                      [crit.id]: e.target.checked ? crit.value : 0,
                    })
                  }
                  className="mr-1"
                />
                <span className="text-xs text-gray-600">
                  {crit.name} ({crit.value}%)
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 p-2 bg-purple-50 rounded border">
            <div className="text-xs font-medium text-purple-800">
              合計: {totalCriticalRate}%
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            クリティカル倍率 (%)
          </label>
          <NumericFormat
            value={critical.criticalMultiplier}
            onValueChange={(values) =>
              setCritical({
                ...critical,
                criticalMultiplier: values.floatValue || 0,
              })
            }
            suffix="%"
            allowNegative={false}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <div className="space-y-1">
            {criticalMultiplierData.criticalMultipliers.map((mult) => (
              <div key={mult.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={criticalMultiplierCheckboxes[mult.id] > 0}
                  onChange={(e) =>
                    setCriticalMultiplierCheckboxes({
                      ...criticalMultiplierCheckboxes,
                      [mult.id]: e.target.checked ? mult.value : 0,
                    })
                  }
                  className="mr-1"
                />
                <span className="text-xs text-gray-600">
                  {mult.name} ({mult.value}%)
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 p-2 bg-indigo-50 rounded border">
            <div className="text-xs font-medium text-indigo-800">
              合計: {totalCriticalMultiplier}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalSettings;
