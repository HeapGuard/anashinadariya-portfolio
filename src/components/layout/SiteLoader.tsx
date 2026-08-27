import { motion } from "framer-motion";
export function SiteLoader() { return <motion.div className="site-loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} aria-live="polite" aria-label="Загружаем портфолио"><p>DARIA<br />ANASHINA</p><span>ЗАГРУЖАЕМ РАБОТЫ <i /></span></motion.div>; }
