import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaBehance, FaTelegramPlane } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { AnimatePresence, motion, type MotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import avatar from "../images/dasha-avatar.jpg";
import roam from "../images/ROAM—TravelMagazineDesign/preview/1.png";
import drop from "../images/DROP—NewspaperDesign/preview/1.png";
import solar from "../images/SOLAR ADVENTURES/preview/1.png";
import corporate from "../images/CorporatePrint&DigitalDesign/preview/1.png";
import avatarCat from "../images/котики на фон/hero-cat-on-avatar.png";
import theatre from "../images/ТЕАТРАЛЬНАЯ ПЬЕСА/1.png";
import solarCaseOne from "../images/SOLAR ADVENTURES/1.png";
import solarCaseTwo from "../images/SOLAR ADVENTURES/2.png";
import theatreCase from "../images/ТЕАТРАЛЬНАЯ ПЬЕСА/1.png";
import roamCaseOne from "../images/ROAM—TravelMagazineDesign/1.png";
import roamCaseTwo from "../images/ROAM—TravelMagazineDesign/2.png";
import roamCaseThree from "../images/ROAM—TravelMagazineDesign/4.png";
import roamCaseFour from "../images/ROAM—TravelMagazineDesign/7.png";
import dropCaseOne from "../images/DROP—NewspaperDesign/1.png";
import dropCaseTwo from "../images/DROP—NewspaperDesign/3.png";
import dropCaseThree from "../images/DROP—NewspaperDesign/5.png";

const navigation = ["ОБО МНЕ", "РАБОТЫ", "КОНТАКТЫ"];
const behanceUrl = "https://www.behance.net/pegasy";
const preloadedImages = [...new Set([
  avatar, avatarCat, solar, drop, corporate, roam, theatre,
  solarCaseOne, solarCaseTwo, theatreCase,
  roamCaseOne, roamCaseTwo, roamCaseThree, roamCaseFour,
  dropCaseOne, dropCaseTwo, dropCaseThree,
])];

function haptic(pattern: number | number[] = 12) {
  if (window.matchMedia("(pointer: coarse)").matches && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

type StackProjectProps = {
  children: ReactNode;
  className: string;
  detail: {
    description: string;
    images: string[];
    tags: string[];
  };
  index: number;
  labelledBy: string;
};

type StackContextValue = {
  progress: MotionValue<number>;
  pulse: () => void;
  snapTo: (index: number) => Promise<void>;
};

const StackContext = createContext<StackContextValue | null>(null);

function StackStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 210, damping: 32, mass: 0.3 });
  const [isFlashing, setIsFlashing] = useState(false);

  const pulse = () => {
    setIsFlashing(true);
    window.setTimeout(() => setIsFlashing(false), 720);
  };

  const snapTo = (index: number) => new Promise<void>((resolve) => {
    const stage = ref.current;
    if (!stage) {
      resolve();
      return;
    }
    const settledProgress = index === 0 ? 0 : 0.36 + (index - 1) * 0.24;
    const getTarget = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const stageStart = window.scrollY + stage.getBoundingClientRect().top;
      const scrollRange = stage.offsetHeight - viewportHeight;
      return Math.round(stageStart + scrollRange * settledProgress);
    };
    const startedAt = performance.now();
    const finish = () => {
      window.scrollTo({ top: getTarget(), behavior: "auto" });
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: getTarget(), behavior: "auto" });
        smoothProgress.jump(settledProgress);
        resolve();
      });
    };
    const waitForSettle = () => {
      const target = getTarget();
      const elapsed = performance.now() - startedAt;
      if ((Math.abs(window.scrollY - target) < 2 && elapsed > 180) || elapsed > 950) {
        finish();
        return;
      }
      window.requestAnimationFrame(waitForSettle);
    };
    window.scrollTo({ top: getTarget(), behavior: "smooth" });
    window.requestAnimationFrame(waitForSettle);
  });

  return (
    <div className={`project-stack-stage ${isFlashing ? "project-stack-stage--flash" : ""}`} ref={ref}>
      <div className="project-stack-stage__pin">
        <StackContext.Provider value={{ progress: smoothProgress, pulse, snapTo }}>
          {children}
        </StackContext.Provider>
      </div>
    </div>
  );
}

function StackProject({ children, className, detail, index, labelledBy }: StackProjectProps) {
  const stack = useContext(StackContext);
  if (!stack) throw new Error("StackProject must be rendered inside StackStage");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [detailExit, setDetailExit] = useState<"left" | "right" | null>(null);
  const [detailExpanded, setDetailExpanded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
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
    stack.snapTo(index).then(() => {
      detailOpenTimer.current = window.setTimeout(() => {
        setIsOpening(false);
        setIsOpen(true);
        detailExpandTimer.current = window.setTimeout(() => setDetailExpanded(true), 500);
      }, 80);
    });
  };
  const finishClose = () => {
    if (detailOpenTimer.current) window.clearTimeout(detailOpenTimer.current);
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
    if (!isMobile || !detailExpanded) return;
    const target = event.target as HTMLElement;
    if (target.closest(".project-detail__gallery, button, a")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
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
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (fullscreenImage) setFullscreenImage(null);
        else closeDetail("left");
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenImage, isOpen]);

  return (
    <div className="project-stack-slot">
      <motion.article
        ref={cardRef}
        className={`project ${className} ${isOpen ? "project--detail-open" : ""}`}
        aria-labelledby={labelledBy}
        style={{ x, y, rotate, scale, zIndex: index + 1 }}
        layout
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

function App() {
  const [compactHeaderVisible, setCompactHeaderVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    const updateCompactHeader = () => setCompactHeaderVisible(window.scrollY > 67);
    updateCompactHeader();
    window.addEventListener("scroll", updateCompactHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateCompactHeader);
  }, []);

  useEffect(() => {
    if (assetsLoaded) return;
    let isCurrent = true;
    const loaderStartedAt = Date.now();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const loadImage = (source: string) => new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = source;
    });

    Promise.all(preloadedImages.map(loadImage)).then(() => {
      const elapsed = Date.now() - loaderStartedAt;
      const minimumLoaderTime = 1100;
      window.setTimeout(() => {
        if (isCurrent) setAssetsLoaded(true);
      }, Math.max(0, minimumLoaderTime - elapsed));
    });

    return () => {
      isCurrent = false;
      document.body.style.overflow = previousOverflow;
    };
  }, [assetsLoaded]);

  useEffect(() => {
    if (!assetsLoaded) return;
    const initialLoader = document.getElementById("initial-loader");
    initialLoader?.classList.add("is-hidden");
    const removeLoader = window.setTimeout(() => initialLoader?.remove(), 450);
    return () => window.clearTimeout(removeLoader);
  }, [assetsLoaded]);

  return (
    <main className="portfolio">
      <AnimatePresence>
        {!assetsLoaded && (
          <motion.div className="site-loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} aria-live="polite" aria-label="Загружаем портфолио">
            <p>DARIA<br />ANASHINA</p>
            <span>ЗАГРУЖАЕМ РАБОТЫ <i /></span>
          </motion.div>
        )}
      </AnimatePresence>
      <header
        className={`compact-header ${compactHeaderVisible ? "compact-header--visible" : ""}`}
        aria-label="Закреплённая навигация"
      >
        <a className="hero-name" href="#top">
          DARIA
          <br />
          ANASHINA
        </a>
        <nav className={mobileMenuOpen ? "compact-navigation compact-navigation--open" : "compact-navigation"} aria-label="Основная навигация">
          {navigation.map((item, index) => (
            <a href="#works" key={item}>
              0{index + 1} / {item}
            </a>
          ))}
        </nav>
        <a className="compact-header__cta" href="#works">
          РАБОТЫ <FiArrowUpRight aria-hidden="true" />
        </a>
        <button
          className="compact-menu-button"
          type="button"
          aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
        </button>
      </header>
      <section className="hero" aria-labelledby="hero-title">
        <header className="hero-header">
          <a
            className="hero-name"
            href="#top"
            aria-label="Дарья Анащина, на главную"
          >
            DARIA
            <br />
            ANASHINA
          </a>
          <nav
            className={mobileMenuOpen ? "hero-navigation hero-navigation--open" : "hero-navigation"}
            aria-label="Основная навигация"
          >
            {navigation.map((item, index) => (
              <a href="#works" key={item}>
                0{index + 1} / {item}
              </a>
            ))}
          </nav>
          <button
            className="hero-menu-button"
            type="button"
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          >
            <span />
            <span />
          </button>
          <p className="hero-index">[ 01 — 01 ]</p>
        </header>
        <div className="hero-layout" id="top">
          <div className="hero-copy">
            <p className="hero-location">МОСКВА / 2026</p>
            <h1 id="hero-title" className="hero-title">
              <span>ПОРТ</span>
              <span>ФОЛИО</span>
            </h1>
            <p className="hero-role">
              ГРАФИЧЕСКИЙ /<br />
              КОММУНИКАЦИОННЫЙ
              <br />
              ДИЗАЙНЕР
            </p>
            <p className="hero-categories">
              БРЕНДИНГ • EDITORIAL • ПЕЧАТЬ • DIGITAL
            </p>
            <a className="hero-cta" href="#works">
              СМОТРЕТЬ РАБОТЫ <FiArrowUpRight aria-hidden="true" />
            </a>
            <aside className="mobile-socials" aria-label="Связаться с Дарьей">
              <a href="https://www.behance.net/pegasy" target="_blank" rel="noreferrer" aria-label="Behance Дарьи">
                <FaBehance aria-hidden="true" />
                <span>BEHANCE</span>
              </a>
              <a href="https://t.me/pegasy8" target="_blank" rel="noreferrer" aria-label="Telegram Дарьи">
                <FaTelegramPlane aria-hidden="true" />
                <span>TELEGRAM</span>
              </a>
              <a href="mailto:pegas915@gmail.com" aria-label="Написать Дарье на почту">
                <HiOutlineMail aria-hidden="true" />
                <span>MAIL</span>
              </a>
            </aside>
          </div>
          <figure className="portrait-card">
            <img
              className="portrait-cat"
              src={avatarCat}
              alt=""
              aria-hidden="true"
            />
            <img src={avatar} alt="Дарья Анашина" />
            <figcaption>
              ДАРЬЯ АНАШИНА
              <br />
              GRAPHIC DESIGNER
            </figcaption>
          </figure>
          <section
            className="work-collage"
            id="works"
            aria-label="Избранные работы"
          >
            <article className="work-piece work-piece--solar">
              <img src={solar} alt="Проект Solar Adventures" />
              <span>
                SOLAR
                <br />
                ADVENTURES
              </span>
            </article>
            <article className="work-piece work-piece--drop">
              <img src={drop} alt="Проект Drop newspaper" />
              <span>DROP / 2025</span>
            </article>
            <article className="work-piece work-piece--corporate">
              <img src={corporate} alt="Корпоративный печатный проект" />
            </article>
            <article className="work-piece work-piece--roam">
              <img src={roam} alt="Проект ROAM Travel Magazine" />
              <span>
                ROAM
                <br />
                <small>TRAVEL MAGAZINE</small>
              </span>
            </article>
          </section>
        </div>
        <p className="hero-scroll">SCROLL TO EXPLORE ↓</p>
      </section>

      <section id="selected-works" className="selected-works" aria-labelledby="selected-works-title">
        <header className="selected-works__header">
          <p className="selected-works__eyebrow">[ SELECTED WORKS / 2026 ]</p>
          <h2 id="selected-works-title">Избранные<br />работы.</h2>
          <p>Четыре истории о путешествиях, культуре, печати и визуальном ритме.</p>
        </header>

        <StackStage>
        <StackProject className="project--solar" index={0} labelledBy="project-solar-title" detail={{ description: "Система айдентики для путешествия, где маршрут собирается из живой типографики, солнечных полей и наблюдений в дороге.", images: [solarCaseOne, solarCaseTwo], tags: ["АЙДЕНТИКА", "ПУТЕШЕСТВИЯ", "PRINT"] }}>
          <div className="project__number">01</div>
          <div className="project__metadata">
            <p className="project__type">BRANDING / TRAVEL</p>
            <h3 id="project-solar-title">SOLAR<br />ADVENTURES</h3>
            <p>Айдентика приключения, построенная на ярком маршруте, свободе и солнечном цвете.</p>
          </div>
          <figure className="project__image"><img src={solar} alt="SOLAR ADVENTURES — айдентика путешествий" /></figure>
        </StackProject>

        <StackProject className="project--theatre" index={1} labelledBy="project-theatre-title" detail={{ description: "Плакат для театральной пьесы: масштабный образ, напряжённый цвет и типографика, которая работает как часть сценического действия.", images: [theatreCase], tags: ["ПОСТЕР", "КУЛЬТУРА", "ТИПОГРАФИКА"] }}>
          <div className="project__number">02</div>
          <figure className="project__image"><img src={theatre} alt="Плакат театральной пьесы" /></figure>
          <div className="project__metadata">
            <p className="project__type">POSTER / CULTURE</p>
            <h3 id="project-theatre-title">Театральная<br />пьеса</h3>
          </div>
        </StackProject>

        <StackProject className="project--roam" index={2} labelledBy="project-roam-title" detail={{ description: "Редакционный журнал о путешествиях. Карты, заметки, развороты и ритм полос складываются в личный путевой архив.", images: [roamCaseOne, roamCaseTwo, roamCaseThree, roamCaseFour], tags: ["EDITORIAL", "ЖУРНАЛ", "КАРТЫ"] }}>
          <div className="project__number">03</div>
          <figure className="project__image"><img src={roam} alt="ROAM — travel magazine design" /></figure>
          <div className="project__metadata">
            <p className="project__type">EDITORIAL / 2025</p>
            <h3 id="project-roam-title">ROAM</h3>
            <p>Журнал о путешествиях с живой журнальной сеткой, картами и коллекцией маршрутов.</p>
          </div>
        </StackProject>

        <StackProject className="project--drop" index={3} labelledBy="project-drop-title" detail={{ description: "Газетная визуальная система, где новости, события и рекламные модули собираются в выразительный ежедневный формат.", images: [dropCaseOne, dropCaseTwo, dropCaseThree], tags: ["ГАЗЕТА", "СЕТКА", "ART DIRECTION"] }}>
          <div className="project__number">04</div>
          <div className="project__metadata">
            <p className="project__type">NEWSPAPER / 2025</p>
            <h3 id="project-drop-title">DROP</h3>
            <p>Газетный формат, в котором новости, реклама и культурная афиша собираются в единую систему.</p>
          </div>
          <figure className="project__image"><img src={drop} alt="DROP — newspaper design" /></figure>
        </StackProject>
        </StackStage>
      </section>
    </main>
  );
}

export default App;
