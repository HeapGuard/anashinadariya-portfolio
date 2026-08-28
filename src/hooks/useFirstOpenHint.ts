import { useEffect, useState } from "react";

const shownHints = new Set<string>();

export function useFirstOpenHint(key: string, active: boolean, duration = 1800) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!active || shownHints.has(key)) return;
    shownHints.add(key);
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timer);
  }, [active, duration, key]);
  return visible;
}
