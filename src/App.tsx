import React, { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ActivePage } from './types/navigation';
import Navbar from './components/Navbar';
import Home from './components/Home';
import KeyGenerator from './components/KeyGenerator';
import NostrMessenger from './components/NostrMessenger';
import Nip1 from './components/Nip1';
import Nip2 from './components/Nip2';
import './styles/shared-layout.css';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('home');

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'keyGenerator':
        return <KeyGenerator />;
      case 'messenger':
        return <NostrMessenger />;
      case 'nip1':
        return <Nip1 />;
      case 'nip2':
        return <Nip2 />;
      default:
        return <Home />;
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div className="container">
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        <main className="content">
          {renderContent()}
        </main>
      </div>
    </I18nextProvider>
  );
};

export default App;