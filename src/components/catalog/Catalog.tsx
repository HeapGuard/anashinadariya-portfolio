import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiArrowUpRight, FiStar, FiX } from "react-icons/fi";
import calendar from "../../../images/ДИЗАЙН КАЛЕНДАРЯ/1.png";
import corporate from "../../../images/CorporatePrint&DigitalDesign/1.png";
import culture from "../../../images/InternalCultureDesignSet/1.png";
import posters from "../../../images/ПЛАКАТЫ/1.png";
import catSleep from "../../../images/котики на фон/hero-cat-sleep.png";
import catBouquet from "../../../images/котики на фон/hero-cat-bouquet.png";
import solar from "../../../images/SOLAR ADVENTURES/preview/1.png";
import theatre from "../../../images/ТЕАТРАЛЬНАЯ ПЬЕСА/1.png";
import roam from "../../../images/ROAM—TravelMagazineDesign/preview/1.png";
import drop from "../../../images/DROP—NewspaperDesign/preview/1.png";

const works = [
  { number: "01", title: "SOLAR ADVENTURES", type: "BRANDING / TRAVEL", image: solar, href: "https://www.behance.net/gallery/243499863/SOLAR-ADVENTURES" },
  { number: "02", title: "ТЕАТРАЛЬНАЯ ПЬЕСА", type: "POSTER / CULTURE", image: theatre, href: "https://www.behance.net/pegasy" },
  { number: "03", title: "ROAM", type: "EDITORIAL / 2025", image: roam, href: "https://www.behance.net/gallery/243580057/ROAM-Travel-Magazine-Design" },
  { number: "04", title: "DROP", type: "NEWSPAPER / 2025", image: drop, href: "https://www.behance.net/gallery/243642391/DROP-Newspaper-Design" },
  { number: "05", title: "ДИЗАЙН КАЛЕНДАРЯ", type: "PRINT / CALENDAR", image: calendar, href: "https://www.behance.net/pegasy" },
  { number: "06", title: "ПЛАКАТЫ", type: "POSTER / SERIES", image: posters, href: "https://www.behance.net/pegasy" },
  { number: "07", title: "CORPORATE PRINT", type: "PRINT / DIGITAL", image: corporate, href: "https://www.behance.net/pegasy" },
  { number: "08", title: "INTERNAL CULTURE", type: "HR / COMMUNICATION", image: culture, href: "https://www.behance.net/pegasy" },
];

export function Catalog() {
  const sectionRef = useRef<HTMLElement>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const swipeStart = useRef<{ x: number; y: number; intent: "horizontal" | "vertical" | null } | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeReady, setSwipeReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!("IntersectionObserver" in window)) {
      section.classList.add("catalog--revealed");
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("catalog--revealed");
      observer.disconnect();
    }, { threshold: 0.08, rootMargin: "0px 0px -8%" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen && !isOpening && !isClosing) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen, isOpening]);

  useEffect(() => () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const openCatalog = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    openTimer.current = window.setTimeout(() => {
      setIsOpening(false);
      setIsOpen(true);
    }, 720);
  };

  const resetSwipe = () => {
    setSwipeOffset(0);
    setSwipeProgress(0);
    setSwipeReady(false);
  };

  const closeCatalog = () => {
    if (!isOpen || isClosing) return;
    resetSwipe();
    setIsOpen(false);
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => setIsClosing(false), 620);
  };

  const startCloseSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isOpen || event.pointerType === "mouse" || !event.isPrimary || window.innerWidth > 760 || event.clientX > 32) return;
    const target = event.target as HTMLElement;
    if (target.closest("a, button")) return;
    swipeStart.current = { x: event.clientX, y: event.clientY, intent: null };
  };

  const moveCloseSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    const swipe = swipeStart.current;
    if (!swipe || swipe.intent === "vertical") return;
    const offsetX = Math.max(0, event.clientX - swipe.x);
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
    const threshold = window.innerWidth * 0.3;
    setSwipeOffset(offsetX);
    setSwipeProgress(Math.min(offsetX / threshold, 1));
    setSwipeReady(offsetX >= threshold);
  };

  const endCloseSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    const swipe = swipeStart.current;
    swipeStart.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!swipe || swipe.intent !== "horizontal") return;
    if (event.clientX - swipe.x >= window.innerWidth * 0.3) closeCatalog();
    else resetSwipe();
  };

  const cancelCloseSwipe = () => {
    swipeStart.current = null;
    resetSwipe();
  };

  const catalogScreen = (
    <>
      {isOpening && (
        <div className="catalog__opening" role="status" aria-live="polite">
          <p>ОТКРЫВАЮ<br />КАТАЛОГ...</p>
          <FiStar aria-hidden="true" />
        </div>
      )}

      <div
        className={`catalog__fullscreen ${isOpen ? "catalog__fullscreen--open" : ""} ${isClosing ? "catalog__fullscreen--closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Каталог проектов"
        aria-hidden={!isOpen}
        onPointerDown={startCloseSwipe}
        onPointerMove={moveCloseSwipe}
        onPointerUp={endCloseSwipe}
        onPointerCancel={cancelCloseSwipe}
        style={isOpen && swipeOffset ? { transform: `translateX(${swipeOffset}px)` } : undefined}
      >
        <div className="catalog__grain" aria-hidden="true" />
        {isOpen && swipeProgress > 0 && <div className={`catalog__swipe-close ${swipeReady ? "catalog__swipe-close--ready" : ""}`} style={{ opacity: 0.18 + swipeProgress * 0.74 }} aria-hidden="true"><FiX /></div>}
        <button className="catalog__close" type="button" onClick={closeCatalog} aria-label="Закрыть каталог"><FiX aria-hidden="true" /> <span>ЗАКРЫТЬ</span></button>
        <header className="catalog__topline">
          <p><span>01A</span> / COMPLETE INDEX</p>
          <FiStar aria-hidden="true" />
          <p>08 PROJECTS / 2026</p>
        </header>

        <div className="catalog__heading">
          <p>ВСЕ РАБОТЫ<br />В ОДНОМ МЕСТЕ</p>
          <h2 id="catalog-title">КАТАЛОГ<br /><span>ПРОЕКТОВ</span></h2>
          <img className="catalog__sleeping-cat" src={catSleep} alt="" aria-hidden="true" loading="lazy" />
        </div>

        <div className="catalog__grid" aria-label="Каталог работ">
          {works.map((work, index) => (
            <a className={`catalog__card catalog__card--${index + 1}`} href={work.href} target="_blank" rel="noreferrer" key={work.number}>
              <span className="catalog__number">{work.number}</span>
              <figure><img src={work.image} alt={work.title} loading="lazy" decoding="async" /></figure>
              <div className="catalog__card-meta">
                <p>{work.type}</p>
                <h3>{work.title}</h3>
                <FiArrowUpRight aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>

        <footer className="catalog__footer">
          <img src={catBouquet} alt="" aria-hidden="true" loading="lazy" />
          <p>MORE PROJECTS<br />ON BEHANCE</p>
          <a href="https://www.behance.net/pegasy" target="_blank" rel="noreferrer">VIEW PROFILE <FiArrowUpRight aria-hidden="true" /></a>
        </footer>
      </div>
    </>
  );

  return (
    <>
      <section ref={sectionRef} id="catalog" className="catalog" aria-label="Каталог проектов">
        <button className="catalog__trigger" type="button" onClick={openCatalog} aria-haspopup="dialog">
          <span>01A / COMPLETE INDEX</span>
          <strong>ОТКРЫТЬ КАТАЛОГ</strong>
          <FiArrowUpRight aria-hidden="true" />
        </button>
      </section>
      {(isOpening || isOpen || isClosing) && createPortal(catalogScreen, document.body)}
    </>
  );
}
