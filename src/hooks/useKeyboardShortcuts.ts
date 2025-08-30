import { useEffect } from "react";

export const useKeyboardShortcuts = (
  attackPower: number,
  setAttackPower: React.Dispatch<React.SetStateAction<number>>,
  attackMultiplierStat: number,
  setAttackMultiplierStat: React.Dispatch<React.SetStateAction<number>>,
  crtRate: number,
  setCrtRate: React.Dispatch<React.SetStateAction<number>>,
  crtMultiplier: number,
  setCrtMultiplier: React.Dispatch<React.SetStateAction<number>>
): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const step = e.shiftKey ? 10 : 1; // Shiftキーを押しながらで10刻み

      switch (e.key) {
        case "ArrowLeft":
          if (e.ctrlKey && e.shiftKey) {
            setAttackPower((prev: number) => Math.max(100, prev - step * 100));
          } else if (e.ctrlKey) {
            setAttackMultiplierStat((prev: number) => Math.max(0, prev - step));
          } else {
            setCrtRate((prev: number) => Math.max(0, prev - step));
          }
          break;
        case "ArrowRight":
          if (e.ctrlKey && e.shiftKey) {
            setAttackPower((prev: number) =>
              Math.min(10000, prev + step * 100)
            );
          } else if (e.ctrlKey) {
            setAttackMultiplierStat((prev: number) =>
              Math.min(200, prev + step)
            );
          } else {
            setCrtRate((prev: number) => Math.min(100, prev + step));
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setAttackPower, setAttackMultiplierStat, setCrtRate, setCrtMultiplier]);

  // ダブルクリックでリセット
  useEffect(() => {
    const handleDoubleClick = (): void => {
      setAttackPower(1000);
      setAttackMultiplierStat(0);
      setCrtRate(50);
      setCrtMultiplier(150);
    };

    document.addEventListener("dblclick", handleDoubleClick);
    return () => document.removeEventListener("dblclick", handleDoubleClick);
  }, [setAttackPower, setAttackMultiplierStat, setCrtRate, setCrtMultiplier]);
};
