import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivePage } from '../types';  // Stellen Sie sicher, dass der Pfad korrekt ist

// Definiere die Props für die Navbar-Komponente
interface NavbarProps {
  setActivePage: (page: ActivePage) => void;
  activePage: ActivePage;
}

// Definiere die Menüeinträge
const menuItems: Array<{ id: ActivePage; label: string }> = [
  { id: 'home', label: 'Startseite' },
  { id: 'nip1', label: 'NIP-01' },
  { id: 'nip2', label: 'NIP-02' }
];

const Navbar: React.FC<NavbarProps> = ({ setActivePage, activePage }) => {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Funktion zum Ändern der Sprache
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Funktion zum Umschalten des Menüs
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Funktion zum Handhaben des Klicks auf einen Menüeintrag
  const handleMenuItemClick = (page: ActivePage) => {
    setActivePage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          &#9776;
        </div>
        <ul className={menuOpen ? 'show' : ''}>
          {menuItems.map(({ id, label }) => (
            <li
              key={id}
              onClick={() => handleMenuItemClick(id)}
              className={activePage === id ? 'active' : ''}
            >
              {label}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;