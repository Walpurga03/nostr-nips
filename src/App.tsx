import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Nip1 from './components/Nip1';
import Nip2 from './components/Nip2';
import { ActivePage } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'nip1':
        return <Nip1 />;
      case 'nip2':
        return <Nip2 />;
      default:
        return <Home />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <Navbar setActivePage={setActivePage} activePage={activePage} />
        <main className="container">
          {renderPage()}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;