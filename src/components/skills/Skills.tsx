import { useEffect, useRef } from "react";
import { SiFigma } from "react-icons/si";
import { TbBrandAdobeIllustrator, TbBrandAdobeIndesign, TbBrandAdobePhotoshop } from "react-icons/tb";
import { FiPlus, FiStar } from "react-icons/fi";

const tools = [
  { index: "01", Icon: TbBrandAdobePhotoshop, name: "PHOTOSHOP" },
  { index: "02", Icon: TbBrandAdobeIllustrator, name: "ILLUSTRATOR" },
  { index: "03", Icon: TbBrandAdobeIndesign, name: "INDESIGN" },
  { index: "04", Icon: SiFigma, name: "FIGMA" },
];

const expertise = ["BRANDING", "IDENTITY", "TYPOGRAPHY", "EDITORIAL", "PRINT", "PACKAGING", "INFOGRAPHICS", "ADVERTISING", "RETOUCH", "COLLAGE"];

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      section.classList.add("skills--revealed");
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("skills--revealed");
      observer.disconnect();
    }, { threshold: 0.08, rootMargin: "0px 0px -8%" });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const moveType = (event: PointerEvent) => {
      const bounds = section.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      section.style.setProperty("--skills-x", `${(x * 12).toFixed(1)}px`);
      section.style.setProperty("--skills-y", `${(y * 7).toFixed(1)}px`);
    };

    const resetType = () => {
      section.style.setProperty("--skills-x", "0px");
      section.style.setProperty("--skills-y", "0px");
    };

    section.addEventListener("pointermove", moveType);
    section.addEventListener("pointerleave", resetType);
    return () => {
      section.removeEventListener("pointermove", moveType);
      section.removeEventListener("pointerleave", resetType);
    };
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="skills" aria-labelledby="skills-title">
      <div className="skills__grain" aria-hidden="true" />

      <header className="skills__topline">
        <p><span>05</span> / SKILLS &amp; TOOLS</p>
        <FiStar aria-hidden="true" />
        <p>DESIGN PRACTICE / 2026</p>
      </header>

      <div className="skills__heading">
        <h2 id="skills-title"><span>SKILLS</span><span>/ TOOLS</span></h2>
        <p>SOFTWARE<br />TYPE SPECIMEN</p>
      </div>

      <div className="skills__tools" role="list" aria-label="Инструменты">
        {tools.map((tool, index) => (
          <article className={`skills__tool skills__tool--${index + 1}`} role="listitem" key={tool.name}>
            <tool.Icon className="skills__monogram" aria-hidden="true" focusable="false" />
            <p className="skills__tool-name"><span>{tool.index}</span> / {tool.name}</p>
            <FiPlus className="skills__tool-mark" aria-hidden="true" />
          </article>
        ))}
      </div>

      <div className="skills__expertise">
        <div className="skills__expertise-head">
          <h3>EXPERTISE</h3>
          <p>10 DIRECTIONS<br />ONE VISUAL SYSTEM</p>
        </div>

        <ol className="skills__index" aria-label="Направления работы">
          {expertise.map((item, index) => (
            <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
          ))}
        </ol>

        <div className="skills__expertise-footer">
          <p>GRAPHIC / COMMUNICATION / EDITORIAL</p>
          <span aria-hidden="true">[ 010 / 010 ]</span>
        </div>
      </div>
    </section>
  );
}
