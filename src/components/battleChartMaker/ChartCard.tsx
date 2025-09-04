import React, { useState } from "react";
import InnerCard from "./InnerCard";

interface InnerCardData {
  id: string;
  characterId: string;
  option: string;
  persona?: string;
  note: string;
}

interface ChartCardProps {
  id: string;
  cardTitle: string;
  onDelete?: (id: string) => void;
  personas?: string[];
  selectedCharacters?: Array<{ id: string; position: string }>;
  onInnerCardDragStart?: (cardId: string, innerCard: InnerCardData) => void;
  onInnerCardDrop?: (targetCardId: string, dropIndex: number) => void;
  draggedInnerCard?: {
    cardId: string;
    innerCard: InnerCardData;
  } | null;
  onNoteCardDrop?: (targetCardId: string, dropIndex: number) => void;
}

const ChartCard: React.FC<ChartCardProps> = ({
  id,
  cardTitle,
  onDelete,
  personas = [],
  selectedCharacters = [],
  onInnerCardDragStart,
  onInnerCardDrop,
  draggedInnerCard,
  onNoteCardDrop,
}) => {
  const [innerCards, setInnerCards] = useState<InnerCardData[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(`ターン ${cardTitle}`);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // キャラクター選択時に、選択されたキャラクターのpositionに応じた順番でInnerCardを自動挿入・削除
  React.useEffect(() => {
    if (selectedCharacters.length > 0) {
      // positionの順番でソート（1st, 2nd, 3rd, 4th, 5th）
      const sortedCharacters = [...selectedCharacters].sort((a, b) => {
        const positionOrder = {
          "1st": 1,
          "2nd": 2,
          "3rd": 3,
          "4th": 4,
          "5th": 5,
        };
        return (
          positionOrder[a.position as keyof typeof positionOrder] -
          positionOrder[b.position as keyof typeof positionOrder]
        );
      });

      // 空のIDでないキャラクターのみをフィルタリング
      const validCharacters = sortedCharacters.filter((char) => char.id !== "");

      // 新しく作成されたChartCardの場合は、完全に新しいInnerCardセットを作成
      if (innerCards.length === 0) {
        const newInnerCards: InnerCardData[] = validCharacters.map((char) => ({
          id: `card-${Date.now()}-${char.id}`,
          characterId: char.id,
          option: "S1",
          persona: char.id === "wonder" ? "1" : undefined,
          note: "",
        }));
        setInnerCards(newInnerCards);
      } else {
        // 既存のChartCardの場合は、差分のみを処理
        const existingCharacterIds = innerCards.map((card) => card.characterId);
        const newCharacters = validCharacters.filter(
          (char) => !existingCharacterIds.includes(char.id)
        );
        const removedCharacters = existingCharacterIds.filter(
          (id) =>
            !validCharacters.some((char) => char.id === id) && id !== "note"
        );

        // 削除されたキャラクターのInnerCardを削除
        if (removedCharacters.length > 0) {
          setInnerCards((prev) =>
            prev.filter((card) => !removedCharacters.includes(card.characterId))
          );
        }

        // 新しく追加されたキャラクターのInnerCardを挿入
        if (newCharacters.length > 0) {
          // 新しく追加されたキャラクターのInnerCardを作成
          const newInnerCards: InnerCardData[] = newCharacters.map((char) => ({
            id: `card-${Date.now()}-${char.id}`,
            characterId: char.id,
            option: "S1",
            persona: char.id === "wonder" ? "1" : undefined,
            note: "",
          }));

          // 既存のInnerCardに新しく追加されたキャラクターを挿入
          setInnerCards((prev) => {
            const updatedCards = [...prev];

            // 新しく追加されたキャラクターを適切な位置に挿入
            newCharacters.forEach((char, index) => {
              const insertIndex = sortedCharacters.findIndex(
                (c) => c.id === char.id
              );
              const newCard = newInnerCards[index];

              // 既存のカードの位置を考慮して挿入位置を決定
              let actualInsertIndex = 0;
              for (let i = 0; i < insertIndex; i++) {
                const prevChar = sortedCharacters[i];
                if (existingCharacterIds.includes(prevChar.id)) {
                  actualInsertIndex++;
                }
              }

              updatedCards.splice(actualInsertIndex, 0, newCard);
            });

            return updatedCards;
          });
        }
      }
    }
  }, [selectedCharacters]);

  // ChartCard間でのinnerCard移動をリッスン
  React.useEffect(() => {
    const handleInnerCardMove = (event: CustomEvent) => {
      const { fromCardId, toCardId, dropIndex, innerCard } = event.detail;

      // このChartCardが移動元の場合、innerCardを削除
      if (fromCardId === id) {
        setInnerCards((prev) =>
          prev.filter((card) => card.id !== innerCard.id)
        );
      }

      // このChartCardが移動先の場合、innerCardを追加
      if (toCardId === id) {
        const newInnerCard = { ...innerCard, id: `card-${Date.now()}` };
        setInnerCards((prev) => {
          const newCards = [...prev];
          newCards.splice(dropIndex, 0, newInnerCard);
          return newCards;
        });
      }
    };

    // noteカードの追加をリッスン
    const handleNoteCardAdd = (event: CustomEvent) => {
      const { toCardId, dropIndex } = event.detail;

      // このChartCardが対象の場合、noteカードを追加
      if (toCardId === id) {
        const newNoteCard: InnerCardData = {
          id: `note-${Date.now()}`,
          characterId: "note",
          option: "",
          persona: undefined,
          note: "",
        };

        setInnerCards((prev) => {
          const newCards = [...prev];
          newCards.splice(dropIndex, 0, newInnerCard);
          return newCards;
        });
      }
    };

    window.addEventListener(
      "innerCardMove",
      handleInnerCardMove as EventListener
    );

    window.addEventListener("noteCardAdd", handleNoteCardAdd as EventListener);

    return () => {
      window.removeEventListener(
        "innerCardMove",
        handleInnerCardMove as EventListener
      );
      window.removeEventListener(
        "noteCardAdd",
        handleNoteCardAdd as EventListener
      );
    };
  }, [id]);

  // データ更新時にカスタムイベントを発火
  React.useEffect(() => {
    const chartCardData = {
      id,
      title,
      innerCards,
    };

    const updateEvent = new CustomEvent("chartCardUpdate", {
      detail: {
        cardId: id,
        cardData: chartCardData,
      },
    });
    window.dispatchEvent(updateEvent);
  }, [id, title, innerCards]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);

    // ドロップ位置を検出
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const cardHeight = rect.height / (innerCards.length + 1);
    const index = Math.floor(y / cardHeight);
    setDragOverIndex(Math.min(index, innerCards.length));
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // ドラッグが終了したら状態をリセット
    setIsDragOver(false);
    setDragOverIndex(null);
    setDraggedCardId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const characterId = e.dataTransfer.getData("characterId");
    const innerCardId = e.dataTransfer.getData("innerCardId");
    const noteCard = e.dataTransfer.getData("noteCard");

    console.log("handleDrop実行:", {
      characterId,
      innerCardId,
      noteCard,
      dragOverIndex,
    });

    if (characterId) {
      // 新しいキャラクターをドロップ
      const newInnerCard: InnerCardData = {
        id: `card-${Date.now()}`,
        characterId,
        option: "S1",
        persona: characterId === "wonder" ? "1" : undefined,
        note: "",
      };

      // 検出された位置に挿入
      if (dragOverIndex !== null) {
        const newCards = [...innerCards];
        newCards.splice(dragOverIndex, 0, newInnerCard);
        setInnerCards(newCards);
      } else {
        // フォールバック: 末尾に追加
        setInnerCards([...innerCards, newInnerCard]);
      }
    } else if (innerCardId && draggedCardId) {
      // 同じChartCard内でのinnerCardの位置を入れ替え
      const draggedIndex = innerCards.findIndex(
        (card) => card.id === draggedCardId
      );
      if (draggedIndex !== -1 && dragOverIndex !== null) {
        try {
          const newCards = [...innerCards];
          const draggedCard = { ...newCards[draggedIndex] }; // オブジェクトをコピー

          // ドラッグされたカードを削除した後のインデックスを調整
          const adjustedDropIndex =
            draggedIndex < dragOverIndex ? dragOverIndex - 1 : dragOverIndex;

          // 元の位置から削除
          newCards.splice(draggedIndex, 1);
          // 新しい位置に挿入
          newCards.splice(adjustedDropIndex, 0, draggedCard);

          setInnerCards(newCards);
        } catch (error) {
          console.error(
            "InnerCardの位置入れ替えでエラーが発生しました:",
            error
          );
        }
      }
    } else if (draggedInnerCard && draggedInnerCard.cardId !== id) {
      // 他のChartCardからinnerCardを移動
      if (dragOverIndex !== null && onInnerCardDrop) {
        onInnerCardDrop(id, dragOverIndex);
      }
    } else if (e.dataTransfer.getData("noteCard") === "true") {
      // noteカードをドロップ
      console.log("Noteカードがドロップされました", {
        dragOverIndex,
        innerCardsLength: innerCards.length,
        dataTransfer: e.dataTransfer.getData("noteCard"),
      });

      const newNoteCard: InnerCardData = {
        id: `note-${Date.now()}`,
        characterId: "note",
        option: "",
        persona: undefined,
        note: "",
      };

      console.log("新しいNoteカードを作成:", newNoteCard);

      // 検出された位置に挿入、または末尾に追加
      if (dragOverIndex !== null) {
        const newCards = [...innerCards];
        newCards.splice(dragOverIndex, 0, newNoteCard);
        console.log("指定位置に挿入:", newCards);
        setInnerCards(newCards);
      } else {
        // フォールバック: 末尾に追加
        const newCards = [...innerCards, newNoteCard];
        console.log("末尾に追加:", newCards);
        setInnerCards(newCards);
      }
    }

    // ドロップ処理が完了したら状態をリセット
    setDraggedCardId(null);
    setDragOverIndex(null);
  };

  const updateInnerCard = (index: number, data: InnerCardData) => {
    const updatedCards = [...innerCards];
    updatedCards[index] = { ...data }; // オブジェクトをコピー
    setInnerCards(updatedCards);
  };

  const removeInnerCard = (index: number) => {
    setInnerCards(innerCards.filter((_, i) => i !== index));
  };

  const copyInnerCard = (data: InnerCardData) => {
    const newInnerCard: InnerCardData = {
      ...data,
      id: `card-${Date.now()}`,
      // noteや備考欄の内容もコピー
    };

    // コピー元のカードの直後に挿入
    const currentIndex = innerCards.findIndex((card) => card.id === data.id);
    if (currentIndex !== -1) {
      const newCards = [...innerCards];
      newCards.splice(currentIndex + 1, 0, newInnerCard);
      setInnerCards(newCards);
    }
  };

  const handleInnerCardDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData("innerCardId", cardId);

    // ChartCard間移動のための処理
    if (onInnerCardDragStart) {
      const innerCard = innerCards.find((card) => card.id === cardId);
      if (innerCard) {
        onInnerCardDragStart(id, innerCard);
      }
    }
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isDragOver ? "border-blue-400 bg-blue-50" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              const newTitle = e.target.value;
              setTitle(newTitle);

              // chartCardUpdateイベントを発火
              const updateEvent = new CustomEvent("chartCardUpdate", {
                detail: {
                  cardId: id,
                  cardData: {
                    id: id,
                    title: newTitle,
                    innerCards: innerCards,
                  },
                },
              });
              window.dispatchEvent(updateEvent);
            }}
            className="text-sm font-medium text-gray-800 bg-transparent border border-gray-200 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 px-2 py-1 min-w-0 hover:bg-gray-50 focus:bg-gray-50 rounded transition-colors duration-200 cursor-text"
            placeholder="タイトルを入力..."
          />
        </div>
        {onDelete && (
          <button
            onClick={() => {
              // chartCardDeleteイベントを発火
              const deleteEvent = new CustomEvent("chartCardDelete", {
                detail: { cardId: id },
              });
              window.dispatchEvent(deleteEvent);

              // 親コンポーネントの削除処理を実行
              onDelete(id);
            }}
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

      {!isCollapsed && (
        <div className="space-y-3">
          {innerCards.length === 0 ? (
            <div className="text-xs text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded">
              アバターをドラッグ&ドロップしてください
            </div>
          ) : (
            <div className="space-y-3">
              {innerCards.map((innerCard, index) => (
                <React.Fragment key={index}>
                  {/* ドラッグオーバー時の挿入位置インジケーター */}
                  {dragOverIndex === index && (
                    <div className="h-1 bg-blue-500 rounded-full mx-2"></div>
                  )}
                  <InnerCard
                    data={innerCard}
                    personas={personas}
                    onUpdate={(data) => updateInnerCard(index, data)}
                    onDelete={() => removeInnerCard(index)}
                    onCopy={copyInnerCard}
                    onDragStart={handleInnerCardDragStart}
                    isDragging={draggedCardId === innerCard.id}
                  />
                </React.Fragment>
              ))}
              {/* 最後の位置への挿入インジケーター */}
              {dragOverIndex === innerCards.length && (
                <div className="h-1 bg-blue-500 rounded-full mx-2"></div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
