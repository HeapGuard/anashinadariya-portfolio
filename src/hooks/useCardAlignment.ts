import { useCallback, type RefObject } from "react";
import type { MotionValue } from "framer-motion";

export function useCardAlignment(stageRef: RefObject<HTMLDivElement | null>, progress: MotionValue<number>) {
  return useCallback((index: number, card: HTMLElement) => new Promise<boolean>((resolve) => {
    const stage = stageRef.current; if (!stage) return resolve(false);
    const settledProgress = index === 0 ? 0 : 0.36 + (index - 1) * 0.24;
    const viewport = window.visualViewport; let frame = 0; let stable = 0; let corrections = 0; let changed = false;
    const started = performance.now(); let lastChange = started;
    const mark = () => { changed = true; stable = 0; lastChange = performance.now(); };
    const target = () => { const height = viewport?.height ?? window.innerHeight; const start = window.scrollY + stage.getBoundingClientRect().top; return Math.round(start + (stage.offsetHeight - height) * settledProgress); };
    const clear = () => { cancelAnimationFrame(frame); viewport?.removeEventListener("resize", mark); viewport?.removeEventListener("scroll", mark); };
    const check = () => { const elapsed = performance.now() - started; const top = target(); if (changed || (elapsed > 1100 && Math.abs(window.scrollY - top) > 2)) { changed = false; corrections += 1; window.scrollTo({ top, behavior: "auto" }); } if (Math.abs(window.scrollY - top) > 2) { if (elapsed > 1900 && corrections >= 3) { clear(); resolve(false); } else frame = requestAnimationFrame(check); return; } progress.jump(settledProgress); const rect = card.getBoundingClientRect(); const aligned = performance.now() - lastChange >= 120 && Math.abs(rect.top) < 2 && Math.abs(rect.left) < 2; stable = aligned ? stable + 1 : 0; if (stable >= 2 || (elapsed > 1900 && corrections >= 3)) { clear(); resolve(stable >= 2); } else frame = requestAnimationFrame(check); };
    viewport?.addEventListener("resize", mark); viewport?.addEventListener("scroll", mark); window.scrollTo({ top: target(), behavior: "smooth" }); frame = requestAnimationFrame(check);
  }), [progress, stageRef]);
}
