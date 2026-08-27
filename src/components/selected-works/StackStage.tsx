import { createContext, type ReactNode, useContext, useRef, useState } from "react";
import { motion, type MotionValue, useScroll, useSpring } from "framer-motion";
import { useCardAlignment } from "../../hooks/useCardAlignment";

export type StackContextValue = { progress: MotionValue<number>; pulse: () => void; snapTo: (index: number, card: HTMLElement) => Promise<boolean> };
export const StackContext = createContext<StackContextValue | null>(null);

export function StackStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 210, damping: 32, mass: 0.3 });
  const [isFlashing, setIsFlashing] = useState(false);
  const snapTo = useCardAlignment(ref, smoothProgress);
  const pulse = () => { setIsFlashing(true); window.setTimeout(() => setIsFlashing(false), 720); };
  return <div className={`project-stack-stage ${isFlashing ? "project-stack-stage--flash" : ""}`} ref={ref}><div className="project-stack-stage__pin"><StackContext.Provider value={{ progress: smoothProgress, pulse, snapTo }}>{children}</StackContext.Provider></div></div>;
}

export function useStackContext() { const context = useContext(StackContext); if (!context) throw new Error("StackProject must be rendered inside StackStage"); return context; }
