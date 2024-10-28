import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivePage } from '../types';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  setActivePage: (page: ActivePage) => void;
  activePage: ActivePage;
}

const menuItems: Array<{ id: ActivePage; label: string }> = [
  { id: 'home', label: 'Startseite' },
  { id: 'nip1', label: 'NIP-01' },
  { id: 'nip2', label: 'NIP-02' }
];

const Navbar: React.FC<NavbarProps> = ({ setActivePage, activePage }) => {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
      
      {menuOpen && <div className="blur-background" onClick={toggleMenu} />}
      
      <nav className="navbar">
        <button className="menu-icon" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className="navbar-container">
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
        </div>
      </nav>
    </>
  );
}

export default Navbar;