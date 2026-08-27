export function haptic(pattern: number | number[] = 12) {
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches && "vibrate" in navigator) navigator.vibrate(pattern);
}
export function useHaptic() { return haptic; }
