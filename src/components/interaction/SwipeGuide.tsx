import { FaBehance } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export function SwipeGuide({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return <div className="swipe-guide" aria-hidden="true"><span><FiX /> ВПРАВО — ЗАКРЫТЬ</span><span>ВЛЕВО — <FaBehance /></span></div>;
}
