import { Link } from "react-router-dom";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="flex items-center justify-between px-6 py-6 md:px-12">
      <Link to="/" className="text-xs tracking-[6px] uppercase text-fade hover:text-parchment transition">
        {t.home}
      </Link>
      <LanguageToggle />
    </header>
  );
}
