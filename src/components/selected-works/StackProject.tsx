import { createPortal } from "react-dom";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { FaBehance } from "react-icons/fa";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { behanceUrl, type ProjectDetail } from "../../data/portfolio";
import { haptic } from "../../hooks/useHaptic";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useStackContext } from "./StackStage";

type StackProjectProps = { children: ReactNode; className: string; detail: ProjectDetail; index: number; labelledBy: string; };

export function StackProject({ children, className, detail, index, labelledBy }: StackProjectProps) {
  const stack = useStackContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isAlignmentLocked, setIsAlignmentLocked] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [detailExit, setDetailExit] = useState<"left" | "right" | null>(null);
  const [detailExpanded, setDetailExpanded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const isMobile = useMediaQuery("(max-width: 760px)");
  const [dragOffset, setDragOffset] = useState(0);
  const [dragRotate, setDragRotate] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"close" | "behance" | null>(null);
  const [swipeReady, setSwipeReady] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const detailOpenTimer = useRef<number | null>(null);
  const detailExpandTimer = useRef<number | null>(null);
  const detailCollapseTimer = useRef<number | null>(null);
  const detailExitTimer = useRef<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const detailSwipeStart = useRef<{ x: number; y: number; intent: "horizontal" | "vertical" | null } | null>(null);
  const galleryImages = detail.images.slice(0, 5);

  const entryStart = 0.18 + (index - 1) * 0.24;
  const entryEnd = entryStart + 0.18;
  // Cards are taken from alternating lower corners, like sheets laid onto a table.
  const cornerX = index % 2 === 0 ? "-42vw" : "42vw";
  const hiddenCardY = isMobile ? "105vh" : "118vh";
  const timeline = index === 0 ? [0, 1] : [0, entryStart, entryEnd, 1];
  const x = useTransform(stack.progress, timeline, index === 0 ? ["0vw", "0vw"] : [cornerX, cornerX, "0vw", "0vw"]);
  const y = useTransform(stack.progress, timeline, index === 0 ? ["0vh", "0vh"] : [hiddenCardY, hiddenCardY, "0vh", "0vh"]);
  const rotate = useTransform(stack.progress, timeline, index === 0 ? ["0deg", "0deg"] : [index % 2 ? "7deg" : "-7deg", index % 2 ? "7deg" : "-7deg", "0deg", "0deg"]);
  const scale = useTransform(stack.progress, timeline, index === 0 ? [1, 1] : [0.9, 0.9, 1, 1]);
  const openDetail = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    stack.pulse();
    haptic([10, 35, 14]);
    const card = cardRef.current;
    if (!card) {
      setIsOpening(false);
      return;
    }
    stack.snapTo(index, card).then((isAligned) => {
      setIsOpening(false);
      if (!isAligned) return;
      setIsAlignmentLocked(true);
      setIsOpen(true);
      detailExpandTimer.current = window.setTimeout(() => setDetailExpanded(true), 500);
    });
  };
  const finishClose = () => {
    if (detailExpandTimer.current) window.clearTimeout(detailExpandTimer.current);
    if (detailCollapseTimer.current) window.clearTimeout(detailCollapseTimer.current);
    if (detailExitTimer.current) window.clearTimeout(detailExitTimer.current);
    setFullscreenImage(null);
    setIsOpen(false);
    setIsOpening(false);
    setDetailExit(null);
    setDetailExpanded(false);
    setActiveSlide(0);
    setDragOffset(0);
    setDragRotate(0);
    setSwipeDirection(null);
    setSwipeReady(false);
    setSwipeProgress(0);
  };
  const closeDetail = (direction: "left" | "right" = "left") => {
    setDragOffset(0);
    setDragRotate(0);
    setSwipeDirection(null);
    setSwipeReady(false);
    const exit = () => {
      setDetailExit(direction);
      detailExitTimer.current = window.setTimeout(finishClose, 340);
    };
    if (detailExpanded) {
      setDetailExpanded(false);
      detailCollapseTimer.current = window.setTimeout(exit, 280);
    } else {
      exit();
    }
    stack.pulse();
    haptic(12);
  };
  const openBehance = () => {
    haptic([14, 40, 18]);
    closeDetail("right");
    window.setTimeout(() => window.location.assign(behanceUrl), 520);
  };
  const updateDetailSwipe = (offset: number) => {
    const threshold = window.innerWidth * 0.3;
    setDragOffset(offset);
    setDragRotate(Math.max(-6, Math.min(6, (offset / window.innerWidth) * 9)));
    setSwipeDirection(offset === 0 ? null : offset < 0 ? "close" : "behance");
    setSwipeReady(Math.abs(offset) >= threshold);
    setSwipeProgress(Math.min(Math.abs(offset) / threshold, 1));
  };
  const finishDetailSwipe = (offset: number) => {
    if (Math.abs(offset) < window.innerWidth * 0.3) {
      setDragOffset(0);
      setDragRotate(0);
      setSwipeDirection(null);
      setSwipeReady(false);
      setSwipeProgress(0);
      return;
    }
    if (offset < 0) closeDetail("left");
    else openBehance();
  };
  const startDetailDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (!isMobile || !detailExpanded || !event.isPrimary) return;
    const target = event.target as HTMLElement;
    if (target.closest(".project-detail__gallery, button, a")) return;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    detailSwipeStart.current = { x: event.clientX, y: event.clientY, intent: null };
  };
  const moveDetailDrag = (event: React.PointerEvent<HTMLElement>) => {
    const swipe = detailSwipeStart.current;
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
    }
    event.preventDefault();
    updateDetailSwipe(offsetX);
  };
  const endDetailDrag = (event: React.PointerEvent<HTMLElement>) => {
    const swipe = detailSwipeStart.current;
    detailSwipeStart.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!swipe || swipe.intent !== "horizontal") return;
    finishDetailSwipe(event.clientX - swipe.x);
  };
  const cancelDetailDrag = () => {
    detailSwipeStart.current = null;
    setDragOffset(0);
    setDragRotate(0);
    setSwipeDirection(null);
    setSwipeReady(false);
    setSwipeProgress(0);
  };
  const goToSlide = (slideIndex: number) => {
    const nextIndex = Math.max(0, Math.min(slideIndex, galleryImages.length - 1));
    galleryRef.current?.scrollTo({ left: galleryRef.current.clientWidth * nextIndex, behavior: "smooth" });
    setActiveSlide(nextIndex);
  };
  const updateActiveSlide = () => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    setActiveSlide(Math.round(gallery.scrollLeft / gallery.clientWidth));
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (fullscreenImage) setFullscreenImage(null);
        else closeDetail("left");
        return;
      }
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) event.preventDefault();
    };
    const preventWheelScroll = (event: WheelEvent) => event.preventDefault();
    const preventIosPagePan = (event: TouchEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(".project-detail__gallery")) return;
      event.preventDefault();
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", preventWheelScroll, { passive: false });
    if (window.matchMedia("(pointer: coarse)").matches) {
      document.addEventListener("touchmove", preventIosPagePan, { passive: false });
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", preventWheelScroll);
      document.removeEventListener("touchmove", preventIosPagePan);
    };
  }, [fullscreenImage, isOpen]);

  useEffect(() => {
    if (isOpen || isOpening || !isAlignmentLocked) return;
    const releaseAlignment = () => setIsAlignmentLocked(false);
    const releaseAlignmentOnKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) releaseAlignment();
    };
    window.addEventListener("wheel", releaseAlignment, { passive: true, once: true });
    window.addEventListener("touchmove", releaseAlignment, { passive: true, once: true });
    window.addEventListener("keydown", releaseAlignmentOnKey);
    return () => {
      window.removeEventListener("wheel", releaseAlignment);
      window.removeEventListener("touchmove", releaseAlignment);
      window.removeEventListener("keydown", releaseAlignmentOnKey);
    };
  }, [isAlignmentLocked, isOpen, isOpening]);

  return (
    <div className="project-stack-slot">
      <motion.article
        ref={cardRef}
        className={`project ${className} ${isOpen ? "project--detail-open" : ""}`}
        aria-labelledby={labelledBy}
        style={isOpen || isAlignmentLocked
          ? { x: 0, y: 0, rotate: 0, scale: 1, zIndex: index + 1 }
          : { x, y, rotate, scale, zIndex: index + 1 }}
      >
        {children}
        <button className="project__more" type="button" onClick={isOpen ? () => closeDetail() : openDetail} aria-expanded={isOpen} aria-busy={isOpening}>
          {isOpening ? "ВЫРАВНИВАЕМ…" : isOpen ? "СВЕРНУТЬ −" : "О ПРОЕКТЕ +"}
        </button>
        {fullscreenImage && createPortal(
          <motion.div className="case-image-viewer" role="dialog" aria-modal="true" aria-label="Просмотр изображения" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFullscreenImage(null)}>
            <button className="case-image-viewer__close" type="button" onClick={() => setFullscreenImage(null)}>ЗАКРЫТЬ ×</button>
            <img src={fullscreenImage} alt="Изображение проекта в полном размере" />
          </motion.div>,
          document.body,
        )}
      </motion.article>
      {isOpen && cardRef.current && createPortal(
        <AnimatePresence>
          <div className="project-detail-layer">
            {isMobile && detailExpanded && swipeDirection && (
              <div className={`project-swipe-hint project-swipe-hint--${swipeDirection} ${swipeReady ? "project-swipe-hint--ready" : ""}`} style={{ opacity: 0.18 + swipeProgress * 0.74 }} aria-hidden="true">
                {swipeDirection === "close" ? <span>×</span> : <FaBehance />}
              </div>
            )}
            <motion.aside
              className={`project-detail ${className} ${detailExpanded ? "project-detail--expanded" : ""}`}
              aria-label="Подробности проекта"
              layout
              onPointerDown={startDetailDrag}
              onPointerMove={moveDetailDrag}
              onPointerUp={endDetailDrag}
              onPointerCancel={cancelDetailDrag}
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              animate={detailExit ? { opacity: 0, x: detailExit === "left" ? "-18%" : "18%", y: "18%", rotate: detailExit === "left" ? -10 : 10, scale: 0.94 } : { opacity: 1, x: dragOffset, y: 0, rotate: dragRotate, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: detailExit ? 0.34 : 0.28, ease: [0.2, 0.75, 0.2, 1] }}
              style={{ transformOrigin: "center bottom" }}
            >
              <p className="project-detail__eyebrow">[ PROJECT NOTES / 2026 ]</p>
              <div className="project-detail__gallery-wrap">
                <button className="project-detail__gallery-nav project-detail__gallery-nav--prev" type="button" onClick={() => goToSlide(activeSlide - 1)} disabled={activeSlide === 0} aria-label="Предыдущее изображение">←</button>
                <div ref={galleryRef} className="project-detail__gallery" aria-label="Галерея проекта" onScroll={updateActiveSlide} onPointerDown={(event) => event.stopPropagation()} onPointerMove={(event) => event.stopPropagation()} onPointerUp={(event) => event.stopPropagation()}>
                  {galleryImages.map((image, imageIndex) => (
                    <button key={image} type="button" onClick={() => { setFullscreenImage(image); haptic(16); }} aria-label={`Открыть изображение ${imageIndex + 1} на весь экран`}>
                      <img src={image} alt="Фрагмент проекта" />
                      <span>{String(imageIndex + 1).padStart(2, "0")}</span>
                    </button>
                  ))}
                </div>
                <button className="project-detail__gallery-nav project-detail__gallery-nav--next" type="button" onClick={() => goToSlide(activeSlide + 1)} disabled={activeSlide === galleryImages.length - 1} aria-label="Следующее изображение">→</button>
              </div>
              <div className="project-detail__pagination" aria-label="Навигация по галерее">
                {galleryImages.map((image, imageIndex) => <button key={image} type="button" className={imageIndex === activeSlide ? "is-active" : ""} onClick={() => goToSlide(imageIndex)} aria-label={`Показать изображение ${imageIndex + 1}`} />)}
              </div>
              <p className="project-detail__copy">{detail.description}</p>
              <ul className="project-detail__tags">
                {detail.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <div className="project-detail__actions">
                <button className="project-detail__close" type="button" onClick={() => closeDetail("left")}>← ЗАКРЫТЬ</button>
                <a href={behanceUrl} target="_blank" rel="noreferrer" onClick={() => haptic([14, 40, 18])}>BEHANCE ↗</a>
              </div>
            </motion.aside>
          </div>
        </AnimatePresence>,
        cardRef.current,
      )}
    </div>
  );
}

