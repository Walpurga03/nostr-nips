import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivePage } from '../../types/navigation';
import { Languages, GraduationCap, BookOpen } from 'lucide-react';
import '../../styles/navbar.css';
import { useLevel } from '../../context/LevelContext';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { level, setLevel } = useLevel();

  const handleMenuItemClick = (page: ActivePage) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const nextLang = currentLang === 'de' ? 'en' : 'de';
    i18n.changeLanguage(nextLang);
  };

  const toggleLevel = () => {
    setLevel(level === 'beginner' ? 'expert' : 'beginner');
  };

  return (
    <nav className="navbar">
      <div className="navbar__items">
        <button
          className={`navbar__item ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('home')}
        >
          {t('nav.home', 'Home')}
        </button>
        <button
          className={`navbar__item ${activePage === 'keys' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('keys')}
        >
          {t('nav.key', 'Keys')}
        </button>
      </div>
      
      <div className="navbar__controls">
        <button 
          className="navbar__lang-button"
          onClick={toggleLanguage}
          title={t('nav.switchLanguage', 'Switch language')}
        >
          <Languages size={20} />
          <span className="navbar__lang-text">
            {i18n.language.toUpperCase()}
          </span>
        </button>
        <button
          onClick={toggleLevel}
          className={`navbar__level-button ${level}`}
          title={t('nav.switchLevel', 'Switch level')}
        >
          {level === 'beginner' ? (
            <>
              <BookOpen size={20} className="navbar__level-icon" />
              <span className="navbar__level-text">{t('nav.beginner', 'Beginner')}</span>
            </>
          ) : (
            <>
              <GraduationCap size={20} className="navbar__level-icon" />
              <span className="navbar__level-text">{t('nav.expert', 'Expert')}</span>
            </>
          )}
          <span className={`navbar__level-indicator ${level}`} />
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="navbar-mobile-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={t('nav.toggleMenu', 'Toggle menu')}
      >
        <span className={`hamburger ${menuOpen ? 'open' : ''}`} />
      </button>

      {/* Mobile Menu */}
      <div className={`navbar-mobile ${menuOpen ? 'open' : ''}`}>
        <button
          className={`navbar-mobile-item ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('home')}
        >
          {t('nav.home', 'Home')}
        </button>
        <button
          className={`navbar-mobile-item ${activePage === 'keys' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('keys')}
        >
          {t('nav.keys', 'Keys')}
        </button> 
      </div>
    </nav>
  );
};

export default Navbar;
