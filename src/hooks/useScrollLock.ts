import { useEffect, useRef } from "react";
export function useScrollLock(enabled: boolean, onEscape?: () => void) {
  const callback = useRef(onEscape); callback.current = onEscape;
  useEffect(() => { if (!enabled) return; const key = (event: KeyboardEvent) => { if (event.key === "Escape") callback.current?.(); if (["ArrowDown","ArrowUp","PageDown","PageUp","Home","End"," "].includes(event.key)) event.preventDefault(); }; const wheel = (event: WheelEvent) => event.preventDefault(); const touch = (event: TouchEvent) => { const target = event.target as Element | null; if (!target?.closest(".project-detail__gallery")) event.preventDefault(); }; window.addEventListener("keydown", key); window.addEventListener("wheel", wheel, { passive: false }); document.addEventListener("touchmove", touch, { passive: false }); return () => { window.removeEventListener("keydown", key); window.removeEventListener("wheel", wheel); document.removeEventListener("touchmove", touch); }; }, [enabled]);
}
