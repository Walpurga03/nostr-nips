import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Navbar.css';

interface NavbarProps {
  setActiveNip: (nip: string) => void;
  activeNip: string;
}

const Navbar: React.FC<NavbarProps> = ({ setActiveNip, activeNip }) => {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = (nip: string) => {
    setActiveNip(nip);
    setMenuOpen(false); // Schließt das Menü
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scrollt nach oben
  };

  return (
    <>
      <div className="language-switcher">
        <button onClick={() => changeLanguage('de')}>DE</button>
        <button onClick={() => changeLanguage('en')}>EN</button>
      </div>
      {menuOpen && <div className="blur-background"></div>}
      <nav className="navbar">
        <div className="menu-icon" onClick={toggleMenu}>
          &#9776; {/* Unicode für das Menü-Icon */}
        </div>
        <ul className={menuOpen ? 'show' : ''}>
          <li onClick={() => handleMenuItemClick('home')} className={activeNip === 'home' ? 'active' : ''}>Startseite</li>
          <li onClick={() => handleMenuItemClick('nip1')} className={activeNip === 'nip1' ? 'active' : ''}>NIP-01</li>
          <li onClick={() => handleMenuItemClick('nip2')} className={activeNip === 'nip2' ? 'active' : ''}>NIP-02</li>
          {/* Weitere NIPs können hier hinzugefügt werden */}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;