import { useEffect, useRef } from "react";
import { FiArrowRight, FiStar } from "react-icons/fi";
import awardPodium from "../../../images/dasha-winner.png";
import flowerCat from "../../../images/котики на фон/hero-cat-flower.png";

export function Award() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const moveCat = (event: PointerEvent) => {
      const bounds = section.getBoundingClientRect();
      const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
      const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
      stage.style.setProperty("--award-cat-x", `${offsetX.toFixed(1)}px`);
      stage.style.setProperty("--award-cat-y", `${offsetY.toFixed(1)}px`);
    };
    const resetCat = () => {
      stage.style.setProperty("--award-cat-x", "0px");
      stage.style.setProperty("--award-cat-y", "0px");
    };

    section.addEventListener("pointermove", moveCat);
    section.addEventListener("pointerleave", resetCat);
    return () => {
      section.removeEventListener("pointermove", moveCat);
      section.removeEventListener("pointerleave", resetCat);
    };
  }, []);

  return (
    <section ref={sectionRef} id="award" className="award" aria-labelledby="award-title">
      <div className="award__grain" aria-hidden="true" />

      <header className="award__topline">
        <p><span>03</span> / AWARD &amp; RECOGNITION</p>
        <FiStar className="award__star" aria-hidden="true" />
        <p>TOMSK REGION / 2025</p>
      </header>

      <div className="award__title-wrap">
        <h2 id="award-title" className="award__title">
          <span>01</span><span>PLACE</span>
        </h2>
        <div className="award__title-rule" aria-hidden="true"><span>WINNER</span><span>001</span></div>
      </div>

      <div ref={stageRef} className="award__stage">
        <div className="award__championship">
          <p>ПРОФЕССИОНАЛЫ</p>
          <span>2025</span>
        </div>

        <div className="award__copy">
          <p className="award__discipline">ГРАФИЧЕСКИЙ<br />ДИЗАЙН</p>
          <p className="award__description">
            <span>1 МЕСТО ПО ТОМСКОЙ ОБЛАСТИ</span>
            <span>В ЧЕМПИОНАТЕ ПРОФЕССИОНАЛЬНОГО МАСТЕРСТВА «ПРОФЕССИОНАЛЫ»</span>
            <span>КОМПЕТЕНЦИЯ — «ГРАФИЧЕСКИЙ ДИЗАЙН»</span>
          </p>
        </div>

        <div className="award__art">
          <img className="award__cat" src={flowerCat} alt="" aria-hidden="true" />
          <figure className="award__visual">
            <div className="award__visual-float">
              <img src={awardPodium} alt="Дарья на бумажном пьедестале первого места" loading="lazy" decoding="async" />
            </div>
          </figure>
        </div>

        <div className="award__location">
          <FiArrowRight aria-hidden="true" />
          <p>МЕЖРЕГИОНАЛЬНЫЙ ЭТАП<br /><strong>САРАНСК</strong></p>
        </div>

        <p className="award__edition">PROFESSIONAL<br />SKILLS<br />CHAMPIONSHIP</p>
      </div>
    </section>
  );
}
