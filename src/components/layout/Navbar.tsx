import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivePage } from '../../types/navigation';
import { Languages } from 'lucide-react';
import '../../styles/navbar.css';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuItemClick = (page: ActivePage) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const nextLang = currentLang === 'de' ? 'en' : 'de';
    i18n.changeLanguage(nextLang);
  };

  return (
    <nav className="pl_navbar">
      <div className="pl_navbar__content">
        <button
          className={`pl_navbar__item ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('home')}
        >
          {t('nav.home', 'Home')}
        </button>
        <button
          className={`pl_navbar__item ${activePage === 'keyGenerator' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('keyGenerator')}
        >
          {t('nav.keyGenerator', 'Key Generator')}
        </button>
        <button
          className={`pl_navbar__item ${activePage === 'messenger' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('messenger')}
        >
          {t('nav.messenger', 'Messenger')}
        </button>
        <button
          className={`pl_navbar__item ${activePage === 'nip1' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('nip1')}
        >
          {t('nav.nip1', 'NIP-01')}
        </button>
        <button
          className={`pl_navbar__item ${activePage === 'nip2' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('nip2')}
        >
          {t('nav.nip2', 'NIP-02')}
        </button>
        <button
          className={`pl_navbar__item ${activePage === 'example' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('example')}
        >
          {t('nav.example', 'Example')}
        </button>
        <button 
          className="pl_navbar__lang-button"
          onClick={toggleLanguage}
          title={t('nav.switchLanguage', 'Switch language')}
        >
          <Languages size={20} className="pl_navbar__lang-icon" />
          <span className="pl_navbar__lang-text">
            {i18n.language.toUpperCase()}
          </span>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="pl_navbar-mobile-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={t('nav.toggleMenu', 'Toggle menu')}
      >
        <span className={`hamburger ${menuOpen ? 'open' : ''}`} />
      </button>

      {/* Mobile Menu */}
      <div className={`pl_navbar-mobile ${menuOpen ? 'open' : ''}`}>
        <button
          className={`pl_navbar-mobile-item ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('home')}
        >
          {t('nav.home', 'Home')}
        </button>
        <button
          className={`pl_navbar-mobile-item ${activePage === 'keyGenerator' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('keyGenerator')}
        >
          {t('nav.keyGenerator', 'Key Generator')}
        </button>
        <button
          className={`pl_navbar-mobile-item ${activePage === 'nip1' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('nip1')}
        >
          {t('nav.nip1', 'NIP-01')}
        </button>
        <button
          className={`pl_navbar-mobile-item ${activePage === 'nip2' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('nip2')}
        >
          {t('nav.nip2', 'NIP-02')}
        </button>
        <button
          className={`pl_navbar-mobile-item ${activePage === 'messenger' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('messenger')}
        >
          {t('nav.messenger', 'Messenger')}
        </button>
        <button
          className={`pl_navbar-mobile-item ${activePage === 'example' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('example')}
        >
          {t('nav.example', 'Example')}
        </button>

        {/* Language Switch in Mobile Menu */}
        <button
          className="pl_navbar-mobile-item language-switch"
          onClick={toggleLanguage}
        >
          <Languages size={20} />
          <span>{t('nav.switchLanguage', 'Switch Language')} ({i18n.language.toUpperCase()})</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;