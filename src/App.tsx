import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Hero } from "./components/hero/Hero";
import { SelectedWorks } from "./components/selected-works/SelectedWorks";
import { Catalog } from "./components/catalog/Catalog";
import { Experience } from "./components/experience/Experience";
import { Award } from "./components/award/Award";
import { About } from "./components/about/About";
import { Skills } from "./components/skills/Skills";
import { Contact } from "./components/contact/Contact";
import { SiteLoader } from "./components/layout/SiteLoader";
import { CompactHeader } from "./components/layout/SiteNavigation";
import { preloadedImages } from "./data/portfolio";
import { useBodyScrollLock } from "./hooks/useBodyScrollLock";
 

function App() {
  const [compactHeaderVisible, setCompactHeaderVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  useBodyScrollLock(!assetsLoaded);
  useBodyScrollLock(mobileMenuOpen);

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
    };
  }, [assetsLoaded]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setMobileMenuOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

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
          <SiteLoader />
        )}
      </AnimatePresence>
      <CompactHeader visible={compactHeaderVisible} open={mobileMenuOpen} onToggle={() => setMobileMenuOpen((isOpen) => !isOpen)} />
      <Hero mobileMenuOpen={mobileMenuOpen} onToggleMenu={() => setMobileMenuOpen((isOpen) => !isOpen)} />
      <SelectedWorks />
      <Catalog />
      <Experience />
      <Award />
      <About />
      <Skills />
      <Contact />
    </main>
  );
}

export default App;
