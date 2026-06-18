import { useEffect } from "react";
type KeyCombo = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
};
type UseKeyDownOptions = {
  enabled?: boolean;
};

export const useKeyDown = (
  callback: () => void,
  targetCombo: KeyCombo,
  options: UseKeyDownOptions = {},
) => {
  useEffect(() => {
    if (options.enabled === false) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const matchKey = e.key.toLowerCase() === targetCombo.key.toLowerCase();
      const matchCtrl = targetCombo.ctrlKey ? e.ctrlKey : !e.ctrlKey;
      const matchShift = targetCombo.shiftKey ? e.shiftKey : !e.shiftKey;
      const matchAlt = targetCombo.altKey ? e.altKey : !e.altKey;

      if (matchKey && matchCtrl && matchShift && matchAlt) {
        e.preventDefault();
        e.stopPropagation();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [
    callback,
    targetCombo.altKey,
    options.enabled,
    targetCombo.ctrlKey,
    targetCombo.key,
    targetCombo.shiftKey,
  ]);
};
