import React, { useState, useCallback, useEffect } from 'react';
import { Book, Filter, Hash, Network, Server, Users, Layout, Shield, Workflow, Boxes, Volume2, VolumeX } from 'lucide-react';
import PageLayout from './layout/PageLayout';
import { useTranslation } from 'react-i18next';
import { useLevel } from '../context/LevelContext';
import '../styles/home.css';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation('home');
  const { level } = useLevel();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getSectionText = (sectionId: string): string => {
    const prefix = `${level}.`;
    
    switch (sectionId) {
      case 'protocol-basics':
        return `${t(`${prefix}protocol_basics`)}. 
                ${t(`${prefix}protocol_basics_intro`)}. 
                ${t(`${prefix}event_structure.title`)}. 
                ${t(`${prefix}event_structure.id_desc`)}. 
                ${t(`${prefix}event_structure.pubkey_desc`)}. 
                ${t(`${prefix}event_structure.created_at_desc`)}. 
                ${t(`${prefix}event_structure.kind_desc`)}. 
                ${t(`${prefix}event_structure.tags_desc`)}. 
                ${t(`${prefix}event_structure.content_desc`)}. 
                ${t(`${prefix}event_structure.sig_desc`)}.`;
      
      case 'central-concepts':
        return `${t(`${prefix}central_concepts.title`)}. 
                ${t(`${prefix}protocol_concepts.nips_vs_kinds`)}. 
                ${t(`${prefix}protocol_concepts.nips_vs_kinds_explanation`)}. 
                ${t(`${prefix}central_concepts.event_kinds.title`)}. 
                ${t(`${prefix}central_concepts.event_kinds.list_items.0`)}. 
                ${t(`${prefix}central_concepts.event_kinds.list_items.1`)}. 
                ${t(`${prefix}central_concepts.event_kinds.list_items.2`)}. 
                ${t(`${prefix}central_concepts.nips.title`)}. 
                ${t(`${prefix}central_concepts.nips.list_items.0`)}. 
                ${t(`${prefix}central_concepts.nips.list_items.1`)}. 
                ${t(`${prefix}central_concepts.nips.list_items.2`)}. 
                ${t(`${prefix}central_concepts.summary.title`)}. 
                ${t(`${prefix}central_concepts.summary.text`)}.`;
      
      case 'relays':
        return `${t(`${prefix}relays_section.title`)}. 
                ${t(`${prefix}relays_section.intro`)}. 
                ${t(`${prefix}relays_section.features.decentralized.title`)}. 
                ${t(`${prefix}relays_section.features.decentralized.description`)}. 
                ${t(`${prefix}relays_section.features.simple.title`)}. 
                ${t(`${prefix}relays_section.features.simple.description`)}. 
                ${t(`${prefix}relays_section.features.efficient.title`)}. 
                ${t(`${prefix}relays_section.features.efficient.description`)}.`;
      
      case 'clients':
        return `${t(`${prefix}clients_section.title`)}. 
                ${t(`${prefix}clients_section.intro`)}. 
                ${t(`${prefix}clients_section.types.web.title`)}. 
                ${t(`${prefix}clients_section.types.web.description`)}. 
                ${t(`${prefix}clients_section.types.web.features.browser_based`)}. 
                ${t(`${prefix}clients_section.types.web.features.everywhere_available`)}. 
                ${t(`${prefix}clients_section.types.mobile.title`)}. 
                ${t(`${prefix}clients_section.types.mobile.description`)}. 
                ${t(`${prefix}clients_section.types.mobile.features.ios_android`)}. 
                ${t(`${prefix}clients_section.types.mobile.features.push_support`)}. 
                ${t(`${prefix}clients_section.types.desktop.title`)}. 
                ${t(`${prefix}clients_section.types.desktop.description`)}. 
                ${t(`${prefix}clients_section.types.desktop.features.full_control`)}. 
                ${t(`${prefix}clients_section.types.desktop.features.offline_support`)}.`;
      
      case 'summary':
        return `${t(`${prefix}summary_section.title`)}. 
                ${t(`${prefix}summary_section.intro`)}. 
                ${t(`${prefix}summary_section.key_points.protocol.title`)}. 
                ${t(`${prefix}summary_section.key_points.protocol.description`)}. 
                ${t(`${prefix}summary_section.key_points.decentralized.title`)}. 
                ${t(`${prefix}summary_section.key_points.decentralized.description`)}. 
                ${t(`${prefix}summary_section.key_points.flexible.title`)}. 
                ${t(`${prefix}summary_section.key_points.flexible.description`)}. 
                ${t(`${prefix}summary_section.key_points.secure.title`)}. 
                ${t(`${prefix}summary_section.key_points.secure.description`)}. 
                ${t(`${prefix}summary_section.conclusion`)}. 
                ${t(`${prefix}summary_section.info_box`)}.`;
      
      default:
        return '';
    }
  };

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis && utterance) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      setUtterance(null);
    }
  }, [utterance]);

  const startSpeaking = useCallback((sectionId: string) => {
    if (window.speechSynthesis) {
      stopSpeaking();

      const text = getSectionText(sectionId);
      const newUtterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const currentLang = i18n.language;
      const voice = voices.find(v => v.lang.startsWith(currentLang));
      
      if (voice) {
        newUtterance.voice = voice;
        newUtterance.lang = currentLang;
      }

      newUtterance.rate = 1.0;  
      newUtterance.pitch = 1.0; 
      newUtterance.volume = 1.0; 

      newUtterance.onend = () => {
        setIsSpeaking(null);
        setUtterance(null);
      };

      newUtterance.onerror = (event) => {
        console.error('Sprachsynthese Fehler:', event);
        setIsSpeaking(null);
        setUtterance(null);
      };

      setUtterance(newUtterance);
      setIsSpeaking(sectionId);
      window.speechSynthesis.speak(newUtterance);
    }
  }, [i18n.language, stopSpeaking]);

  const toggleSpeaking = useCallback((sectionId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (isSpeaking === sectionId) {
      stopSpeaking();
    } else {
      startSpeaking(sectionId);
    }
  }, [isSpeaking, startSpeaking, stopSpeaking]);

  const sections = [
    {
      id: 'protocol-basics',
      title: t(`${level}.protocol_basics`),
      icon: <Hash size={20} />,
      children: (
        <div className="home-protocol-basics-container">
          <div className="section-header">
            <h2>{t(`${level}.protocol_basics`)}</h2>
            <button 
              className="home-speech-button"
              onClick={(e) => toggleSpeaking('protocol-basics', e)}
              aria-label={isSpeaking === 'protocol-basics' ? 'Vorlesen beenden' : 'Vorlesen starten'}
            >
              {isSpeaking === 'protocol-basics' ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
          <p className="home-protocol-basics-intro">{t(`${level}.protocol_basics_intro`)}</p>
          <div className="home-event-structure-container">
            <h3 className="home-event-structure-heading">{t(`${level}.event_structure.title`)}</h3>
            <div className="home-code-example-outer">
              <div className="home-code-example-container">
                <pre className="home-code-example-pre">
                  <div className="home-code-block">
                    <code>
{`{
  "id": "...",        // ${t(`${level}.event_structure.id_desc`)}
  "pubkey": "...",    // ${t(`${level}.event_structure.pubkey_desc`)}
  "created_at": ...,  // ${t(`${level}.event_structure.created_at_desc`)}
  "kind": ...,        // ${t(`${level}.event_structure.kind_desc`)}
  "tags": [...],      // ${t(`${level}.event_structure.tags_desc`)}
  "content": "...",   // ${t(`${level}.event_structure.content_desc`)}
  "sig": "..."        // ${t(`${level}.event_structure.sig_desc`)}
}`}
                    </code>
                  </div>
                </pre>
              </div>
            </div>
          </div>
        </div>
      ),
      isExpanded: expandedSections.includes('protocol-basics'),
      onToggle: () => toggleSection('protocol-basics')
    },
    {
      id: 'central-concepts',
      title: t(`${level}.central_concepts.title`),
      icon: <Filter size={20} />,
      children: (
        <div className="home-protocol-concepts-container">
          <div className="section-header">
            <h2>{t(`${level}.central_concepts.title`)}</h2>
            <button 
              className="home-speech-button"
              onClick={(e) => toggleSpeaking('central-concepts', e)}
              aria-label={isSpeaking === 'central-concepts' ? 'Vorlesen beenden' : 'Vorlesen starten'}
            >
              {isSpeaking === 'central-concepts' ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
          <div className="home-concepts-grid">
            <div className="home-concept-card">
              <div className="home-concept-card-header">
                <Filter size={24} />
                <h4>{t(`${level}.central_concepts.event_kinds.title`)}</h4>
              </div>
              <ul className="home-concept-list">
                {Object.values(t(`${level}.central_concepts.event_kinds.list_items`, { returnObjects: true })).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="home-concept-card">
              <div className="home-concept-card-header">
                <Book size={24} />
                <h4>{t(`${level}.central_concepts.nips.title`)}</h4>
              </div>
              <ul className="home-concept-list">
                {Object.values(t(`${level}.central_concepts.nips.list_items`, { returnObjects: true })).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="home-concept-summary">
            <h4>{t(`${level}.central_concepts.summary.title`)}</h4>
            <p>{t(`${level}.central_concepts.summary.text`)}</p>
          </div>
          <div className="home-protocol-concepts">
            <h4>{t(`${level}.protocol_concepts.nips_vs_kinds`)}</h4>
            <p>{t(`${level}.protocol_concepts.nips_vs_kinds_explanation`)}</p>
          </div>
        </div>
      ),
      isExpanded: expandedSections.includes('central-concepts'),
      onToggle: () => toggleSection('central-concepts')
    },
    {
      id: 'relays',
      title: t(`${level}.relays_section.title`),
      icon: <Server size={20} />,
      children: (
        <div className="home-relays-container">
          <div className="section-header">
            <h2>{t(`${level}.relays_section.title`)}</h2>
            <button 
              className="home-speech-button"
              onClick={(e) => toggleSpeaking('relays', e)}
              aria-label={isSpeaking === 'relays' ? 'Vorlesen beenden' : 'Vorlesen starten'}
            >
              {isSpeaking === 'relays' ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
          <p className="home-relays-intro">{t(`${level}.relays_section.intro`)}</p>
          <div className="home-relays-features-grid">
            <div className="home-relay-feature-card">
              <div className="home-relay-feature-header">
                <Network size={24} />
                <h4>{t(`${level}.relays_section.features.decentralized.title`)}</h4>
              </div>
              <p>{t(`${level}.relays_section.features.decentralized.description`)}</p>
            </div>
            <div className="home-relay-feature-card">
              <div className="home-relay-feature-header">
                <Layout size={24} />
                <h4>{t(`${level}.relays_section.features.simple.title`)}</h4>
              </div>
              <p>{t(`${level}.relays_section.features.simple.description`)}</p>
            </div>
            <div className="home-relay-feature-card">
              <div className="home-relay-feature-header">
                <Workflow size={24} />
                <h4>{t(`${level}.relays_section.features.efficient.title`)}</h4>
              </div>
              <p>{t(`${level}.relays_section.features.efficient.description`)}</p>
            </div>
          </div>
        </div>
      ),
      isExpanded: expandedSections.includes('relays'),
      onToggle: () => toggleSection('relays')
    },
    {
      id: 'clients',
      title: t(`${level}.clients_section.title`),
      icon: <Users size={20} />,
      children: (
        <div className="home-clients-container">
          <div className="section-header">
            <h2>{t(`${level}.clients_section.title`)}</h2>
            <button 
              className="home-speech-button"
              onClick={(e) => toggleSpeaking('clients', e)}
              aria-label={isSpeaking === 'clients' ? 'Vorlesen beenden' : 'Vorlesen starten'}
            >
              {isSpeaking === 'clients' ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
          <p className="home-clients-intro">{t(`${level}.clients_section.intro`)}</p>
          <div className="home-clients-grid">
            <div className="home-client-card">
              <div className="home-client-header">
                <Layout size={24} />
                <h4>{t(`${level}.clients_section.types.web.title`)}</h4>
              </div>
              <p>{t(`${level}.clients_section.types.web.description`)}</p>
              <ul className="home-client-features">
                <li>{t(`${level}.clients_section.types.web.features.browser_based`)}</li>
                <li>{t(`${level}.clients_section.types.web.features.everywhere_available`)}</li>
              </ul>
            </div>
            <div className="home-client-card">
              <div className="home-client-header">
                <Boxes size={24} />
                <h4>{t(`${level}.clients_section.types.mobile.title`)}</h4>
              </div>
              <p>{t(`${level}.clients_section.types.mobile.description`)}</p>
              <ul className="home-client-features">
                <li>{t(`${level}.clients_section.types.mobile.features.ios_android`)}</li>
                <li>{t(`${level}.clients_section.types.mobile.features.push_support`)}</li>
              </ul>
            </div>
            <div className="home-client-card">
              <div className="home-client-header">
                <Shield size={24} />
                <h4>{t(`${level}.clients_section.types.desktop.title`)}</h4>
              </div>
              <p>{t(`${level}.clients_section.types.desktop.description`)}</p>
              <ul className="home-client-features">
                <li>{t(`${level}.clients_section.types.desktop.features.full_control`)}</li>
                <li>{t(`${level}.clients_section.types.desktop.features.offline_support`)}</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      isExpanded: expandedSections.includes('clients'),
      onToggle: () => toggleSection('clients')
    },
    {
      id: 'summary',
      title: t(`${level}.summary_section.title`),
      icon: <Network size={20} />,
      children: (
        <div className="home-summary-container">
          <div className="section-header">
            <h2>{t(`${level}.summary_section.title`)}</h2>
            <button 
              className="home-speech-button"
              onClick={(e) => toggleSpeaking('summary', e)}
              aria-label={isSpeaking === 'summary' ? 'Vorlesen beenden' : 'Vorlesen starten'}
            >
              {isSpeaking === 'summary' ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
          <p className="home-summary-intro">{t(`${level}.summary_section.intro`)}</p>
          <div className="home-summary-points">
            <div className="home-summary-point">
              <div className="home-summary-point-header">
                <div className="home-summary-point-icon">
                  <Workflow size={24} />
                </div>
                <h4 className="home-summary-point-title">
                  {t(`${level}.summary_section.key_points.protocol.title`)}
                </h4>
              </div>
              <p className="home-summary-point-description">
                {t(`${level}.summary_section.key_points.protocol.description`)}
              </p>
            </div>

            <div className="home-summary-point">
              <div className="home-summary-point-header">
                <div className="home-summary-point-icon">
                  <Network size={24} />
                </div>
                <h4 className="home-summary-point-title">
                  {t(`${level}.summary_section.key_points.decentralized.title`)}
                </h4>
              </div>
              <p className="home-summary-point-description">
                {t(`${level}.summary_section.key_points.decentralized.description`)}
              </p>
            </div>

            <div className="home-summary-point">
              <div className="home-summary-point-header">
                <div className="home-summary-point-icon">
                  <Boxes size={24} />
                </div>
                <h4 className="home-summary-point-title">
                  {t(`${level}.summary_section.key_points.flexible.title`)}
                </h4>
              </div>
              <p className="home-summary-point-description">
                {t(`${level}.summary_section.key_points.flexible.description`)}
              </p>
            </div>

            <div className="home-summary-point">
              <div className="home-summary-point-header">
                <div className="home-summary-point-icon">
                  <Shield size={24} />
                </div>
                <h4 className="home-summary-point-title">
                  {t(`${level}.summary_section.key_points.secure.title`)}
                </h4>
              </div>
              <p className="home-summary-point-description">
                {t(`${level}.summary_section.key_points.secure.description`)}
              </p>
            </div>
          </div>
          <div className="home-summary-info-box">
            <p>{t(`${level}.summary_section.info_box`)}</p>
          </div>
          <p className="home-summary-conclusion">
            {t(`${level}.summary_section.conclusion`)}
          </p>
        </div>
      ),
      isExpanded: expandedSections.includes('summary'),
      onToggle: () => toggleSection('summary')
    }
  ];

  return (
    <PageLayout
      title={t(`${level}.title`)}
      subtitle={t(`${level}.subtitle`)}
      sections={sections}
    />
  );
};

export default Home;
