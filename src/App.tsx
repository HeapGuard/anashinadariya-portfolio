import { useEffect, useRef, useState } from "react";
import { FaBehance, FaTelegramPlane } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import avatar from "../images/dasha-avatar.jpg";
import roam from "../images/ROAM—TravelMagazineDesign/preview/1.png";
import drop from "../images/DROP—NewspaperDesign/preview/1.png";
import solar from "../images/SOLAR ADVENTURES/preview/1.png";
import corporate from "../images/CorporatePrint&DigitalDesign/preview/1.png";
import avatarCat from "../images/котики на фон/hero-cat-on-avatar.png";

const navigation = ["ОБО МНЕ", "РАБОТЫ", "КОНТАКТЫ"];

function App() {
  const heroRef = useRef<HTMLElement>(null);
  const [compactHeaderVisible, setCompactHeaderVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCompactHeaderVisible(!entry.isIntersecting);
      },
      { threshold: 0.08 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="portfolio">
      <header
        className={`compact-header ${compactHeaderVisible ? "compact-header--visible" : ""}`}
        aria-label="Закреплённая навигация"
      >
        <a className="hero-name" href="#top">
          DARIA
          <br />
          ANASHINA
        </a>
        <nav aria-label="Основная навигация">
          {navigation.map((item, index) => (
            <a href="#works" key={item}>
              0{index + 1} / {item}
            </a>
          ))}
        </nav>
        <a className="compact-header__cta" href="#works">
          РАБОТЫ <FiArrowUpRight aria-hidden="true" />
        </a>
      </header>
      <section className="hero" ref={heroRef} aria-labelledby="hero-title">
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
    </main>
  );
}

export default App;
