import React, { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ActivePage } from './types/navigation';
import { LevelProvider } from './context/LevelContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import Keys from './components/Keys';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('home');

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'keys':
        return <Keys />;
      default:
        return <Home />;
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      <LevelProvider>
        <div className="pl_app">
          <Navbar activePage={activePage} setActivePage={setActivePage} />
          <main className="pl_app__main">
            {renderContent()}
          </main>
          <Footer />
        </div>
      </LevelProvider>
    </I18nextProvider>
  );
};

export default App;