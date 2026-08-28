import avatar from "../../images/dasha-avatar.jpg";
import roam from "../../images/ROAM—TravelMagazineDesign/preview/1.png";
import drop from "../../images/DROP—NewspaperDesign/preview/1.png";
import solar from "../../images/SOLAR ADVENTURES/preview/1.png";
import corporate from "../../images/CorporatePrint&DigitalDesign/preview/1.png";
import avatarCat from "../../images/котики на фон/hero-cat-on-avatar.png";
import theatre from "../../images/ТЕАТРАЛЬНАЯ ПЬЕСА/1.png";
import solarCaseOne from "../../images/SOLAR ADVENTURES/1.png";
import solarCaseTwo from "../../images/SOLAR ADVENTURES/2.png";
import theatreCase from "../../images/ТЕАТРАЛЬНАЯ ПЬЕСА/1.png";
import roamCaseOne from "../../images/ROAM—TravelMagazineDesign/1.png";
import roamCaseTwo from "../../images/ROAM—TravelMagazineDesign/2.png";
import roamCaseThree from "../../images/ROAM—TravelMagazineDesign/4.png";
import roamCaseFour from "../../images/ROAM—TravelMagazineDesign/7.png";
import dropCaseOne from "../../images/DROP—NewspaperDesign/1.png";
import dropCaseTwo from "../../images/DROP—NewspaperDesign/3.png";
import dropCaseThree from "../../images/DROP—NewspaperDesign/5.png";

export type ProjectDetail = { description: string; images: string[]; tags: string[]; behanceUrl: string };
export type Project = {
  className: string;
  index: number;
  type: string;
  title: string[];
  description?: string;
  image: string;
  imageAlt: string;
  detail: ProjectDetail;
};
export type SocialLink = { label: string; href: string; kind: "behance" | "telegram" | "mail" };

export const navigation = [
  { label: "ОБО МНЕ", href: "#about" },
  { label: "РАБОТЫ", href: "#selected-works" },
  { label: "КОНТАКТЫ", href: "#contact" },
];
export const behanceUrl = "https://www.behance.net/pegasy";
export const telegramUrl = "https://t.me/pegasy8";
export const mailUrl = "mailto:pegas915@gmail.com";
export const socialLinks: SocialLink[] = [
  { label: "BEHANCE", href: behanceUrl, kind: "behance" },
  { label: "TELEGRAM", href: telegramUrl, kind: "telegram" },
  { label: "MAIL", href: mailUrl, kind: "mail" },
];
export const heroAssets = { avatar, avatarCat, solar, drop, corporate, roam };

export const projects: Project[] = [
  { className: "project--solar", index: 0, type: "BRANDING / TRAVEL", title: ["SOLAR", "ADVENTURES"], description: "Айдентика приключения, построенная на ярком маршруте, свободе и солнечном цвете.", image: solar, imageAlt: "SOLAR ADVENTURES — айдентика путешествий", detail: { description: "Система айдентики для путешествия, где маршрут собирается из живой типографики, солнечных полей и наблюдений в дороге.", images: [solarCaseOne, solarCaseTwo], tags: ["АЙДЕНТИКА", "ПУТЕШЕСТВИЯ", "PRINT"], behanceUrl: "https://www.behance.net/search/projects?search=SOLAR%20ADVENTURES%20Daria%20Anashina" } },
  { className: "project--theatre", index: 1, type: "POSTER / CULTURE", title: ["Театральная", "пьеса"], image: theatre, imageAlt: "Плакат театральной пьесы", detail: { description: "Плакат для театральной пьесы: масштабный образ, напряжённый цвет и типографика, которая работает как часть сценического действия.", images: [theatreCase], tags: ["ПОСТЕР", "КУЛЬТУРА", "ТИПОГРАФИКА"], behanceUrl: "https://www.behance.net/search/projects?search=%D0%A2%D0%B5%D0%B0%D1%82%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D0%BF%D1%8C%D0%B5%D1%81%D0%B0%20Daria%20Anashina" } },
  { className: "project--roam", index: 2, type: "EDITORIAL / 2025", title: ["ROAM"], description: "Журнал о путешествиях с живой журнальной сеткой, картами и коллекцией маршрутов.", image: roam, imageAlt: "ROAM — travel magazine design", detail: { description: "Редакционный журнал о путешествиях. Карты, заметки, развороты и ритм полос складываются в личный путевой архив.", images: [roamCaseOne, roamCaseTwo, roamCaseThree, roamCaseFour], tags: ["EDITORIAL", "ЖУРНАЛ", "КАРТЫ"], behanceUrl: "https://www.behance.net/search/projects?search=ROAM%20Travel%20Magazine%20Design%20Daria%20Anashina" } },
  { className: "project--drop", index: 3, type: "NEWSPAPER / 2025", title: ["DROP"], description: "Газетный формат, в котором новости, реклама и культурная афиша собираются в единую систему.", image: drop, imageAlt: "DROP — newspaper design", detail: { description: "Газетная визуальная система, где новости, события и рекламные модули собираются в выразительный ежедневный формат.", images: [dropCaseOne, dropCaseTwo, dropCaseThree], tags: ["ГАЗЕТА", "СЕТКА", "ART DIRECTION"], behanceUrl: "https://www.behance.net/search/projects?search=DROP%20Newspaper%20Design%20Daria%20Anashina" } },
];

export const preloadedImages = [...new Set([avatar, avatarCat, solar, drop, corporate, roam, theatre, solarCaseOne, solarCaseTwo, theatreCase, roamCaseOne, roamCaseTwo, roamCaseThree, roamCaseFour, dropCaseOne, dropCaseTwo, dropCaseThree])];
