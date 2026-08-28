import { useEffect, useRef } from "react";
import { FiArrowRight, FiPlus, FiStar } from "react-icons/fi";
import aboutDaria from "../../../images/dasha-about.png";

const details = ["MOSCOW", "RU — NATIVE", "EN — B1", "ES — A1"];
const interests = ["MUSIC", "SPORT", "TRAVEL", "SPANISH"];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      section.classList.add("about--revealed");
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("about--revealed");
      observer.disconnect();
    }, { threshold: 0.1, rootMargin: "0px 0px -8%" });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const moveArtwork = (event: PointerEvent) => {
      const bounds = section.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      section.style.setProperty("--about-x", `${(x * 14).toFixed(1)}px`);
      section.style.setProperty("--about-y", `${(y * 10).toFixed(1)}px`);
      section.style.setProperty("--about-rx", `${(y * -1.2).toFixed(2)}deg`);
      section.style.setProperty("--about-ry", `${(x * 1.2).toFixed(2)}deg`);
    };

    const resetArtwork = () => {
      section.style.setProperty("--about-x", "0px");
      section.style.setProperty("--about-y", "0px");
      section.style.setProperty("--about-rx", "0deg");
      section.style.setProperty("--about-ry", "0deg");
    };

    section.addEventListener("pointermove", moveArtwork);
    section.addEventListener("pointerleave", resetArtwork);
    return () => {
      section.removeEventListener("pointermove", moveArtwork);
      section.removeEventListener("pointerleave", resetArtwork);
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about" aria-labelledby="about-title">
      <div className="about__grain" aria-hidden="true" />

      <header className="about__topline">
        <p><span>04</span> / PERSONAL NOTES</p>
        <FiStar className="about__asterisk" aria-hidden="true" />
        <p>GRAPHIC DESIGNER / MOSCOW</p>
      </header>

      <div className="about__poster">
        <h2 id="about-title" className="about__title">
          <span>ОБО</span>
          <span>МНЕ</span>
        </h2>

        <figure className="about__visual">
          <div className="about__visual-inner">
            <img
              src={aboutDaria}
              alt="Дарья с ноутбуком в бумажном коллаже"
              loading="lazy"
              decoding="async"
            />
          </div>
        </figure>

        <div className="about__copy about__copy--intro">
          <span className="about__copy-index">01 / PROFILE</span>
          <p>Я графический дизайнер из Москвы. Работаю с брендингом, печатными и digital-коммуникациями, editorial-дизайном и рекламными материалами.</p>
        </div>

        <div className="about__copy about__copy--approach">
          <span className="about__copy-index">02 / APPROACH</span>
          <p>Люблю системный подход, выразительную типографику и визуальные решения, которые не только выглядят эстетично, но и решают задачу бизнеса.</p>
        </div>

        <aside className="about__data" aria-label="Языки и местоположение">
          {details.map((detail, index) => (
            <p key={detail}><span>{String(index + 1).padStart(2, "0")}</span>{detail}</p>
          ))}
        </aside>

        <div className="about__interests" aria-label="Интересы">
          <span className="about__interests-title">INTERESTS <FiArrowRight aria-hidden="true" /></span>
          {interests.map((interest, index) => (
            <span key={interest} className={`about__tag about__tag--${index + 1}`}>{interest}</span>
          ))}
        </div>

        <p className="about__folio" aria-hidden="true">PERSONAL FILE<br />DASHA / 2026</p>
        <FiPlus className="about__cross about__cross--one" aria-hidden="true" />
        <FiPlus className="about__cross about__cross--two" aria-hidden="true" />
      </div>
    </section>
  );
}
