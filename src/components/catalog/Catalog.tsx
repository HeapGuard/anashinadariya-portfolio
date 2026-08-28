import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaBehance } from "react-icons/fa";
import { FiArrowUpRight, FiStar, FiX } from "react-icons/fi";
import { behanceUrl, catalogWorks } from "../../data/portfolio";
import { useHorizontalSwipe } from "../../hooks/useHorizontalSwipe";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useFirstOpenHint } from "../../hooks/useFirstOpenHint";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { SwipeGuide } from "../interaction/SwipeGuide";
import { BehanceConfirmDialog } from "../interaction/BehanceConfirmDialog";
import catSleep from "../../../images/котики на фон/hero-cat-sleep.png";
import catBouquet from "../../../images/котики на фон/hero-cat-bouquet.png";

export function Catalog() {
  const sectionRef = useRef<HTMLElement>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [pendingBehanceUrl, setPendingBehanceUrl] = useState<string | null>(null);
  const isPhone = useMediaQuery("(pointer: coarse) and (max-width: 760px)");
  useBodyScrollLock(isOpen || isOpening || isClosing);
  const showSwipeGuide = useFirstOpenHint("catalog-swipe", isOpen && isPhone);

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

  const catalogSwipe = useHorizontalSwipe({
    enabled: isOpen && !isClosing,
    edge: "both",
    onComplete: (direction) => {
      if (direction === "close") closeCatalog(true);
      else openCatalogBehance(true);
    },
  });

  const closeCatalog = (fromSwipe = false) => {
    if (!isOpen || isClosing) return;
    if (!fromSwipe) catalogSwipe.reset();
    setIsOpen(false);
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setIsClosing(false);
      catalogSwipe.reset();
    }, 620);
  };

  const openCatalogBehance = (fromSwipe = false) => {
    if (!isOpen || isClosing) return;
    if (!fromSwipe) catalogSwipe.reset();
    setIsOpen(false);
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setIsClosing(false);
      catalogSwipe.reset();
      setPendingBehanceUrl(behanceUrl);
    }, 620);
  };

  const catalogScreen = (
    <>
      {isOpening && (
        <div className="catalog__opening" role="status" aria-live="polite">
          <p>ОТКРЫВАЮ<br />КАТАЛОГ...</p>
          <FiStar aria-hidden="true" />
        </div>
      )}
      <SwipeGuide visible={showSwipeGuide} />

      {isOpen && catalogSwipe.direction && <div className={`catalog__swipe-hint catalog__swipe-hint--${catalogSwipe.direction} ${catalogSwipe.isReady ? "catalog__swipe-hint--ready" : ""}`} style={{ opacity: 0.18 + catalogSwipe.progress * 0.74 }} aria-hidden="true">{catalogSwipe.direction === "close" ? <FiX /> : <FaBehance />}</div>}

      <div
        className={`catalog__fullscreen ${isOpen ? "catalog__fullscreen--open" : ""} ${isClosing ? "catalog__fullscreen--closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Каталог проектов"
        aria-hidden={!isOpen}
        {...catalogSwipe.handlers}
        style={(isOpen || isClosing) && catalogSwipe.offset ? { transform: `translateX(${catalogSwipe.offset}px) translateY(${catalogSwipe.progress * 24}px) rotate(${Math.sign(catalogSwipe.offset) * catalogSwipe.progress * 4.5}deg)`, transformOrigin: "55% 100%" } : undefined}
      >
        <div className="catalog__grain" aria-hidden="true" />
        <button className="catalog__close" type="button" onClick={() => closeCatalog()} aria-label="Закрыть каталог"><FiX aria-hidden="true" /> <span>ЗАКРЫТЬ</span></button>
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
          {catalogWorks.map((work, index) => (
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
      <BehanceConfirmDialog href={pendingBehanceUrl} onCancel={() => setPendingBehanceUrl(null)} />
    </>
  );
}
