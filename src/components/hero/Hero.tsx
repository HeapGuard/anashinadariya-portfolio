import { FaBehance, FaTelegramPlane } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { heroAssets, navigation } from "../../data/portfolio";

export function Hero({ mobileMenuOpen, onToggleMenu }: { mobileMenuOpen: boolean; onToggleMenu: () => void }) {
  return (
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
            onClick={() => onToggleMenu()}
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
              src={heroAssets.avatarCat}
              alt=""
              aria-hidden="true"
            />
            <img src={heroAssets.avatar} alt="Дарья Анашина" />
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
              <img src={heroAssets.solar} alt="Проект Solar Adventures" />
              <span>
                heroAssets.solar
                <br />
                ADVENTURES
              </span>
            </article>
            <article className="work-piece work-piece--drop">
              <img src={heroAssets.drop} alt="Проект Drop newspaper" />
              <span>DROP / 2025</span>
            </article>
            <article className="work-piece work-piece--corporate">
              <img src={heroAssets.corporate} alt="Корпоративный печатный проект" />
            </article>
            <article className="work-piece work-piece--roam">
              <img src={heroAssets.roam} alt="Проект ROAM Travel Magazine" />
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
  );
}
