import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaBehance, FaTelegramPlane } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { AnimatePresence, motion, type MotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { StackStage } from "./components/selected-works/StackStage";
import { StackProject } from "./components/selected-works/StackProject";
import { preloadedImages } from "./data/portfolio";
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
