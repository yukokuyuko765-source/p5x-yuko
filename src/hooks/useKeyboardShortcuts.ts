import { useEffect } from "react";

export const useKeyboardShortcuts = (
  crtRate: number,
  setCrtRate: (value: number) => void,
  crtMultiplier: number,
  setCrtMultiplier: (value: number) => void
): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const step = e.shiftKey ? 10 : 1; // Shiftキーを押しながらで10刻み

      switch (e.key) {
        case "ArrowLeft":
          if (e.ctrlKey) {
            setCrtRate((prev) => Math.max(0, prev - step));
          } else {
            setCrtMultiplier((prev) => Math.max(0, prev - step));
          }
          break;
        case "ArrowRight":
          if (e.ctrlKey) {
            setCrtRate((prev) => Math.min(100, prev + step));
          } else {
            setCrtMultiplier((prev) => Math.min(500, prev + step));
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setCrtRate, setCrtMultiplier]);

  // ダブルクリックでリセット
  useEffect(() => {
    const handleDoubleClick = (): void => {
      setCrtRate(50);
      setCrtMultiplier(150);
    };

    document.addEventListener("dblclick", handleDoubleClick);
    return () => document.removeEventListener("dblclick", handleDoubleClick);
  }, [setCrtRate, setCrtMultiplier]);
};
