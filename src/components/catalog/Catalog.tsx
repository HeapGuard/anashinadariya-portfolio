import { useEffect, useRef, useState } from "react";
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
  const [isOpening, setIsOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    if (!isOpen && !isOpening) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen, isOpening]);

  useEffect(() => () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
  }, []);

  const openCatalog = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    openTimer.current = window.setTimeout(() => {
      setIsOpening(false);
      setIsOpen(true);
    }, 720);
  };

  const closeCatalog = () => setIsOpen(false);

  return (
    <section ref={sectionRef} id="catalog" className="catalog" aria-labelledby="catalog-title">
      <button className="catalog__trigger" type="button" onClick={openCatalog} aria-haspopup="dialog">
        <span>01A / COMPLETE INDEX</span>
        <strong>ОТКРЫТЬ КАТАЛОГ</strong>
        <FiArrowUpRight aria-hidden="true" />
      </button>

      {isOpening && <div className="catalog__opening" role="status" aria-live="polite"><p>ОТКРЫВАЮ<br />КАТАЛОГ...</p><FiStar aria-hidden="true" /></div>}

      <div className={`catalog__fullscreen ${isOpen ? "catalog__fullscreen--open" : ""}`} role="dialog" aria-modal="true" aria-label="Каталог проектов" aria-hidden={!isOpen}>
        <div className="catalog__grain" aria-hidden="true" />
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
    </section>
  );
}
