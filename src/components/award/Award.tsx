import { useEffect, useRef } from "react";
import awardPodium from "../../../images/dasha-winner.png";

export function Award() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      section.classList.add("award--revealed");
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("award--revealed");
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -8%" });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="award" className="award" aria-labelledby="award-title">
      <div className="award__grain" aria-hidden="true" />

      <header className="award__topline">
        <p><span>03</span> / AWARD &amp; RECOGNITION</p>
        <span className="award__star" aria-hidden="true">✦</span>
        <p>TOMSK REGION / 2025</p>
      </header>

      <div className="award__title-wrap">
        <h2 id="award-title" className="award__title">
          <span>01</span><span>PLACE</span>
        </h2>
        <div className="award__title-rule" aria-hidden="true"><span>WINNER</span><span>001</span></div>
      </div>

      <div className="award__stage">
        <div className="award__championship">
          <p>ПРОФЕССИОНАЛЫ</p>
          <span>2025</span>
        </div>

        <div className="award__copy">
          <p className="award__discipline">ГРАФИЧЕСКИЙ<br />ДИЗАЙН</p>
          <p className="award__description">1 место по Томской области<br />{" "}в чемпионате профессионального мастерства<br />{" "}«Профессионалы»<br />{" "}в компетенции «Графический дизайн».</p>
        </div>

        <figure className="award__visual">
          <div className="award__visual-float">
            <img src={awardPodium} alt="Дарья на бумажном пьедестале первого места" loading="lazy" decoding="async" />
          </div>
        </figure>

        <div className="award__location">
          <span>→</span>
          <p>МЕЖРЕГИОНАЛЬНЫЙ ЭТАП<br /><strong>САРАНСК</strong></p>
        </div>

        <p className="award__edition">PROFESSIONAL<br />SKILLS<br />CHAMPIONSHIP</p>
      </div>
    </section>
  );
}
