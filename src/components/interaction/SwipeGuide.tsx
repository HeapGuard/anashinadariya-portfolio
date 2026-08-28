import { FaBehance } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export function SwipeGuide({ visible }: { visible: boolean }) {
  const isPhone = useMediaQuery("(pointer: coarse) and (max-width: 760px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  if (!visible || !isPhone || reducedMotion) return null;
  return <div className="swipe-guide" aria-hidden="true"><span><FiX /> ВПРАВО — ЗАКРЫТЬ</span><span>ВЛЕВО — <FaBehance /></span></div>;
}
