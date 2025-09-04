import React, { useEffect, useState } from "react";
import characterData from "../../data/characterData.json";

interface InnerCardData {
  id: string;
  characterId: string;
  option: string;
  persona?: string;
  note: string;
}

interface ChartCardData {
  id: string;
  title: string;
  innerCards: InnerCardData[];
}

interface BattleChartTextCardProps {
  chartCards?: ChartCardData[];
  personas: string[];
  selectedCharacters?: Array<{ id: string; position: string }>;
  chartTitle?: string;
}

const BattleChartTextCard: React.FC<BattleChartTextCardProps> = ({
  chartCards = [],
  personas,
  selectedCharacters = [],
  chartTitle = "戦闘チャート",
}) => {
  const [markdownText, setMarkdownText] = useState<string>("");

  // チャートカードのデータからMarkdownテキストを生成
  useEffect(() => {
    if (chartCards.length === 0) {
      setMarkdownText("");
      return;
    }

    let markdown = `# ${chartTitle || "戦闘チャート"}\n\n`;

    // 選択された怪盗の情報を追加
    markdown += "## 怪盗\n";

    // 解明ロール以外のキャラクターをpositionの昇順でソート
    const nonInvestigationCharacters = selectedCharacters.filter(
      (character) => {
        if (character.id === "wonder") return true;
        const characterInfo = characterData.find(
          (char: any) => char.id === character.id
        );
        return characterInfo && characterInfo.role !== "解明";
      }
    );

    const sortedCharacters = nonInvestigationCharacters.sort((a, b) => {
      const positionOrder = {
        "1st": 1,
        "2nd": 2,
        "3rd": 3,
        "4th": 4,
      };
      return (
        (positionOrder[a.position as keyof typeof positionOrder] || 0) -
        (positionOrder[b.position as keyof typeof positionOrder] || 0)
      );
    });

    // 解明ロールのキャラクターを取得
    const investigationCharacters = selectedCharacters.filter((character) => {
      if (character.id === "wonder") return false;
      const characterInfo = characterData.find(
        (char: any) => char.id === character.id
      );
      return characterInfo && characterInfo.role === "解明";
    });

    // 通常のキャラクターを表示
    sortedCharacters.forEach((character) => {
      if (character.id === "wonder") {
        // WONDERの場合はペルソナ名も表示
        const personaNames = personas
          .map((p, index) => (p.trim() !== "" ? p : `ペルソナ${index + 1}`))
          .join(", ");
        markdown += `- **${character.position}**: WONDER (${personaNames})\n`;
      } else if (character.id) {
        const characterInfo = characterData.find(
          (char: any) => char.id === character.id
        );
        const characterName = characterInfo
          ? characterInfo.name
          : character.id.toLocaleUpperCase();
        markdown += `- **${character.position}**: ${characterName}\n`;
      }
    });

    // 解明ロールのキャラクターを最後に表示
    investigationCharacters.forEach((character) => {
      const characterInfo = characterData.find(
        (char: any) => char.id === character.id
      );
      if (characterInfo) {
        markdown += `- **解明**: ${characterInfo.name}\n`;
      }
    });
    markdown += "\n";
    markdown += "## チャート\n";

    chartCards.forEach((card, index) => {
      markdown += `### ${card.title || `ターン ${index + 1}`}\n`;

      card.innerCards.forEach((innerCard) => {
        if (innerCard.characterId === "wonder") {
          const personaIndex = innerCard.persona
            ? parseInt(innerCard.persona) - 1
            : 0;
          const personaName =
            personas[personaIndex] || `ペルソナ${innerCard.persona || 1}`;
          markdown += `- **WONDER**: ${personaName} - ${innerCard.option}${
            innerCard.note ? ` - ${innerCard.note}` : ""
          }\n`;
        } else if (innerCard.characterId === "note") {
          markdown += `- **📝 Note**: ${innerCard.note}\n`;
        } else {
          // キャラクター名を取得
          const characterName = `${innerCard.characterId.toLocaleUpperCase()}`;
          markdown += `- **${characterName}**: ${innerCard.option}${
            innerCard.note ? ` - ${innerCard.note}` : ""
          }\n`;
        }
      });

      markdown += "\n";
    });

    setMarkdownText(markdown);
  }, [chartCards, personas, selectedCharacters, chartTitle]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(markdownText);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          戦闘チャートテキスト
        </h4>
        <button
          onClick={handleCopyToClipboard}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          クリップボードにコピー
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-300 p-4">
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
            {markdownText}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default BattleChartTextCard;
