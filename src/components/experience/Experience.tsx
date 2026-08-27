const practices = [
  {
    className: "experience-entry--radcop",
    period: "2024",
    company: "RAD COP",
    role: <>GRAPHIC<br />DESIGNER</>,
    description: <>Внештатная работа над print, identity,<br className="experience-entry__desktop-break" /> обложками видео, презентациями,<br className="experience-entry__desktop-break" /> визуальными коммуникациями<br className="experience-entry__desktop-break" /> и обработкой фото.</>,
  },
  {
    className: "experience-entry--digest",
    period: "2026",
    company: <>РЕКЛАМНЫЙ<br />ДАЙДЖЕСТ</>,
    role: <>GRAPHIC<br />PRACTICE</>,
    description: <>Internal communication, интерактивная карта<br className="experience-entry__desktop-break" /> для новых сотрудников, корпоративные<br className="experience-entry__desktop-break" /> плакаты и подготовка материалов к печати.</>,
  },
];

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const animatedItems = Array.from(section.querySelectorAll<HTMLElement>("[data-experience-reveal]"));
    section.classList.add("experience--motion-ready");

    if (!("IntersectionObserver" in window)) {
      animatedItems.forEach((item) => item.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -6%" });

    animatedItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="experience" aria-labelledby="experience-title">
      <div className="experience__grain" aria-hidden="true" />
      <header className="experience__header experience__grid" data-experience-reveal>
        <p className="experience__eyebrow"><span>02</span> / COMMERCIAL PRACTICE</p>
        <div className="experience__compass" aria-hidden="true">✦</div>
        <p className="experience__corner-label">SELECTED<br />POSITIONS</p>
        <h2 id="experience-title">EXPERIENCE</h2>
        <div className="experience__rule" aria-hidden="true"><span>✶</span></div>
      </header>

      <div className="experience__entries">
        <article className={`experience-entry experience__grid ${practices[0].className}`} data-experience-reveal>
          <p className="experience-entry__period">{practices[0].period}</p>
          <h3 className="experience-entry__company">{practices[0].company}</h3>
          <p className="experience-entry__role">{practices[0].role}</p>
          <p className="experience-entry__description">{practices[0].description}</p>
          <span className="experience-entry__marker" aria-hidden="true">01</span>
        </article>

        <article className="experience-feature" data-experience-reveal aria-label="ЗУБР МСК, Communication Designer, 2026 — сейчас">
          <div className="experience-feature__tape" aria-hidden="true" />
          <div className="experience-feature__inner experience__grid">
            <p className="experience-feature__period">2026 — NOW</p>
            <h3>ЗУБР МСК</h3>
            <p className="experience-feature__role">COMMUNICATION<br />DESIGNER</p>
            <p className="experience-feature__description">Презентации, карточки товаров, rich content<br className="experience-entry__desktop-break" /> для маркетплейсов, баннеры, рекламные<br className="experience-entry__desktop-break" /> макеты, многостраничные издания,<br className="experience-entry__desktop-break" /> ретушь и коллажи.</p>
            <p className="experience-feature__index">02 / CENTRAL PRACTICE</p>
          </div>
        </article>

        <article className={`experience-entry experience__grid ${practices[1].className}`} data-experience-reveal>
          <p className="experience-entry__period">{practices[1].period}</p>
          <h3 className="experience-entry__company">{practices[1].company}</h3>
          <p className="experience-entry__role">{practices[1].role}</p>
          <p className="experience-entry__description">{practices[1].description}</p>
          <span className="experience-entry__marker" aria-hidden="true">03</span>
        </article>
      </div>
    </section>
  );
}
import { useEffect, useRef } from "react";
