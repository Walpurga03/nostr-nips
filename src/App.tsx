import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Nip1 from './components/Nip1';
import Nip2 from './components/Nip2';

// Definiere den Typ für die aktiven Seiten
export type ActivePage = 'home' | 'nip1' | 'nip2';

// Mappe die Seiten-Typen zu den entsprechenden Komponenten
const COMPONENTS: Record<ActivePage, React.FC> = {
  home: Home,
  nip1: Nip1,
  nip2: Nip2
};

const App: React.FC = () => {
  // Zustand für die aktive Seite
  const [activePage, setActivePage] = useState<ActivePage>('home');
  // Hole die entsprechende Komponente basierend auf der aktiven Seite
  const Component = COMPONENTS[activePage];

  return (
    <div className="app">
      {/* Navbar-Komponente mit setActivePage und activePage als Props */}
      <Navbar setActivePage={setActivePage} activePage={activePage} />
      <main className="container">
        {/* Render die aktive Komponente */}
        <Component />
      </main>
    </div>
  );
};

export default App;