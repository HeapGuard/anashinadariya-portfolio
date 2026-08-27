import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaBehance, FaTelegramPlane } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { AnimatePresence, motion, type MotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { StackStage } from "./components/selected-works/StackStage";
import { StackProject } from "./components/selected-works/StackProject";
import { Hero } from "./components/hero/Hero";
import { SelectedWorks } from "./components/selected-works/SelectedWorks";
import { Experience } from "./components/experience/Experience";
import { Award } from "./components/award/Award";
import { SiteLoader } from "./components/layout/SiteLoader";
import { CompactHeader } from "./components/layout/SiteNavigation";
import { navigation, preloadedImages } from "./data/portfolio";
import avatar from "../images/dasha-avatar.jpg";
import roam from "../images/ROAM—TravelMagazineDesign/preview/1.png";
import drop from "../images/DROP—NewspaperDesign/preview/1.png";
import solar from "../images/SOLAR ADVENTURES/preview/1.png";
import corporate from "../images/CorporatePrint&DigitalDesign/preview/1.png";
import avatarCat from "../images/котики на фон/hero-cat-on-avatar.png";
import theatre from "../images/ТЕАТРАЛЬНАЯ ПЬЕСА/1.png";
import solarCaseOne from "../images/SOLAR ADVENTURES/1.png";
import solarCaseTwo from "../images/SOLAR ADVENTURES/2.png";
import theatreCase from "../images/ТЕАТРАЛЬНАЯ ПЬЕСА/1.png";
import roamCaseOne from "../images/ROAM—TravelMagazineDesign/1.png";
import roamCaseTwo from "../images/ROAM—TravelMagazineDesign/2.png";
import roamCaseThree from "../images/ROAM—TravelMagazineDesign/4.png";
import roamCaseFour from "../images/ROAM—TravelMagazineDesign/7.png";
import dropCaseOne from "../images/DROP—NewspaperDesign/1.png";
import dropCaseTwo from "../images/DROP—NewspaperDesign/3.png";
import dropCaseThree from "../images/DROP—NewspaperDesign/5.png";

const behanceUrl = "https://www.behance.net/pegasy";
 

function App() {
  const [compactHeaderVisible, setCompactHeaderVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

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
      document.body.style.overflow = previousOverflow;
    };
  }, [assetsLoaded]);

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
      <Experience />
      <Award />
    </main>
  );
}

export default App;
