import React, { useState } from 'react';
import { Book, Code, Lightbulb, Settings, Terminal } from 'lucide-react';
import PageLayout from './layout/PageLayout';

const ExamplePage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    {
      id: 'overview',
      title: 'Übersicht',
      icon: <Book size={20} />,
      children: (
        <div>
          <p>Dies ist ein Beispieltext für den Übersichtsbereich. Hier könnte eine längere Beschreibung oder Einführung stehen.</p>
          <ul>
            <li>Erster wichtiger Punkt</li>
            <li>Zweiter wichtiger Punkt</li>
            <li>Dritter wichtiger Punkt</li>
          </ul>
        </div>
      ),
      isExpanded: expandedSections.includes('overview'),
      onToggle: () => toggleSection('overview')
    },
    {
      id: 'features',
      title: 'Funktionen',
      icon: <Lightbulb size={20} />,
      children: (
        <div>
          <h3>Hauptfunktionen</h3>
          <div className="feature-grid">
            <div className="feature-item">
              <h4>Funktion 1</h4>
              <p>Beschreibung der ersten Funktion mit einigen Details.</p>
            </div>
            <div className="feature-item">
              <h4>Funktion 2</h4>
              <p>Beschreibung der zweiten Funktion mit einigen Details.</p>
            </div>
          </div>
        </div>
      ),
      isExpanded: expandedSections.includes('features'),
      onToggle: () => toggleSection('features')
    },
    {
      id: 'code',
      title: 'Code Beispiel',
      icon: <Code size={20} />,
      children: (
        <div>
          <pre className="code-block">
            <code>
              {`// Ein Beispiel-Code-Block
const example = () => {
  console.log("Hallo Welt!");
  return true;
};`}
            </code>
          </pre>
        </div>
      ),
      isExpanded: expandedSections.includes('code'),
      onToggle: () => toggleSection('code')
    },
    {
      id: 'terminal',
      title: 'Terminal Ausgabe',
      icon: <Terminal size={20} />,
      children: (
        <div className="terminal-output">
          <p>$ nostr-tool --version</p>
          <p>Nostr Tool v1.0.0</p>
          <p>$ nostr-tool --help</p>
          <p>Verwendung: nostr-tool [optionen]</p>
        </div>
      ),
      isExpanded: expandedSections.includes('terminal'),
      onToggle: () => toggleSection('terminal')
    },
    {
      id: 'settings',
      title: 'Einstellungen',
      icon: <Settings size={20} />,
      children: (
        <div className="settings-form">
          <div className="form-group">
            <label>Einstellung 1</label>
            <input type="text" placeholder="Wert eingeben..." />
          </div>
          <div className="form-group">
            <label>Einstellung 2</label>
            <select>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          <button className="pl_button">Speichern</button>
        </div>
      ),
      isExpanded: expandedSections.includes('settings'),
      onToggle: () => toggleSection('settings')
    }
  ];

  return (
    <PageLayout
      title="Beispiel Seite"
      subtitle="Dies ist eine Beispielseite um das neue Layout zu demonstrieren. Sie enthält verschiedene Arten von Inhalten und Interaktionen."
      sections={sections}
    />
  );
};

export default ExamplePage;
