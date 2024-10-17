import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Nip1 from './components/Nip1';
import Nip2 from './components/Nip2';
import './styles/App.css';
const App: React.FC = () => {
  const [activeNip, setActiveNip] = useState<string>('home');

  return (
    <div>
      <Navbar setActiveNip={setActiveNip} activeNip={activeNip} />
      <div className="container">
        {activeNip === 'home' && <Home />}
        {activeNip === 'nip1' && <Nip1 />}
        {activeNip === 'nip2' && <Nip2 />}
      </div>
    </div>
  );
}

export default App;