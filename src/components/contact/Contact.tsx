import { useEffect, useRef } from "react";
import { behanceUrl, mailUrl, telegramUrl } from "../../data/portfolio";

const contacts = [
  { label: "EMAIL", value: "pegas915@gmail.com", href: mailUrl },
  { label: "TELEGRAM", value: "@pegasy8", href: telegramUrl },
  { label: "BEHANCE", value: "VIEW PROFILE ↗", href: behanceUrl },
];

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      section.classList.add("contact--revealed");
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) section.classList.add("contact--revealed");
      section.classList.toggle("contact--away", entry.intersectionRatio < 0.25);
    }, { threshold: [0, 0.1, 0.25], rootMargin: "0px 0px -7%" });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__grain" aria-hidden="true" />

      <header className="contact__topline">
        <p><span>06</span> / LET&apos;S MAKE SOMETHING</p>
        <span aria-hidden="true">✦</span>
        <p>OPEN FOR PROJECTS / 2026</p>
      </header>

      <div className="contact__poster">
        <span className="contact__register contact__register--one" aria-hidden="true">+</span>
        <span className="contact__register contact__register--two" aria-hidden="true">+</span>

        <h2 id="contact-title" className="contact__title">
          <span>ЕСТЬ</span>
          <span>ПРОЕКТ?</span>
        </h2>

        <a className="contact__cta" href={mailUrl}>
          <span>НАПИСАТЬ МНЕ</span>
          <span aria-hidden="true">↗</span>
        </a>

        <div className="contact__list" aria-label="Контакты">
          {contacts.map((contact) => (
            <div className="contact__item" key={contact.label}>
              <p>{contact.label}</p>
              <a
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {contact.value}
              </a>
            </div>
          ))}
        </div>

        <p className="contact__note">AVAILABLE FOR SELECTED<br />FREELANCE PROJECTS</p>
      </div>

      <footer className="contact__footer">
        <p>DARIA ANASHINA<br /><span>GRAPHIC DESIGNER</span></p>
        <p>MOSCOW / 2026</p>
        <a href="#top">↑ BACK TO TOP</a>
      </footer>
    </section>
  );
}
