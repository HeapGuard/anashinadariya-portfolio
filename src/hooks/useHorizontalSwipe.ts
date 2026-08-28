import { type PointerEvent as ReactPointerEvent, useCallback, useRef, useState } from "react";

export type SwipeDirection = "close" | "behance";

type SwipeOptions = {
  enabled: boolean;
  onComplete: (direction: SwipeDirection) => void;
  edge?: "none" | "both";
  excludedSelector?: string;
  thresholdRatio?: number;
};

type SwipeStart = { x: number; y: number; intent: "horizontal" | "vertical" | null };

export function useHorizontalSwipe({ enabled, onComplete, edge = "none", excludedSelector = "a, button", thresholdRatio = 0.3 }: SwipeOptions) {
  const start = useRef<SwipeStart | null>(null);
  const options = useRef({ enabled, onComplete, edge, excludedSelector, thresholdRatio });
  options.current = { enabled, onComplete, edge, excludedSelector, thresholdRatio };
  const [offset, setOffset] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<SwipeDirection | null>(null);
  const [isReady, setIsReady] = useState(false);

  const reset = useCallback(() => {
    start.current = null;
    setOffset(0);
    setProgress(0);
    setDirection(null);
    setIsReady(false);
  }, []);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const current = options.current;
    if (!current.enabled || event.pointerType === "mouse" || !event.isPrimary) return;
    const fromLeft = event.clientX <= 32;
    const fromRight = event.clientX >= window.innerWidth - 32;
    if (current.edge === "both" && !fromLeft && !fromRight) return;
    const target = event.target as HTMLElement;
    if (target.closest(current.excludedSelector)) return;
    start.current = { x: event.clientX, y: event.clientY, intent: null };
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const swipe = start.current;
    if (!swipe || swipe.intent === "vertical") return;
    const offsetX = event.clientX - swipe.x;
    const offsetY = event.clientY - swipe.y;
    if (!swipe.intent) {
      if (Math.abs(offsetY) > Math.abs(offsetX) + 6) {
        swipe.intent = "vertical";
        return;
      }
      if (Math.abs(offsetX) < 8) return;
      swipe.intent = "horizontal";
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    const threshold = window.innerWidth * options.current.thresholdRatio;
    const nextDirection = offsetX > 0 ? "close" : "behance";
    setOffset(offsetX);
    setProgress(Math.min(Math.abs(offsetX) / threshold, 1));
    setDirection(nextDirection);
    setIsReady(Math.abs(offsetX) >= threshold);
  }, []);

  const onPointerUp = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const swipe = start.current;
    start.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!swipe || swipe.intent !== "horizontal") return;
    const threshold = window.innerWidth * options.current.thresholdRatio;
    if (Math.abs(event.clientX - swipe.x) < threshold) {
      reset();
      return;
    }
    options.current.onComplete(event.clientX - swipe.x > 0 ? "close" : "behance");
  }, [reset]);

  return { offset, progress, direction, isReady, reset, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: reset } };
}
