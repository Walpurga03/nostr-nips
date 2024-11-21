import React, { useState, useCallback } from 'react';
import { Book, Filter, Hash, Network, Server, Users, Layout, Shield, Workflow, Boxes, Volume2, VolumeX } from 'lucide-react';
import PageLayout from './layout/PageLayout';
import { useTranslation } from 'react-i18next';
import '../styles/home.css';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation('home');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getSectionText = (sectionId: string): string => {
    switch (sectionId) {
      case 'protocol-basics':
        return `${t('protocol_basics')}. 
                ${t('protocol_basics_intro')}. 
                ${t('event_structure.title')}. 
                ${t('event_structure.id_desc')}. 
                ${t('event_structure.pubkey_desc')}. 
                ${t('event_structure.created_at_desc')}. 
                ${t('event_structure.kind_desc')}. 
                ${t('event_structure.tags_desc')}. 
                ${t('event_structure.content_desc')}. 
                ${t('event_structure.sig_desc')}.`;
      
      case 'central-concepts':
        return `${t('central_concepts.title')}. 
                ${t('protocol_concepts.nips_vs_kinds')}. 
                ${t('protocol_concepts.nips_vs_kinds_explanation')}. 
                ${t('central_concepts.event_kinds.title')}. 
                ${t('central_concepts.event_kinds.list_items.0')}. 
                ${t('central_concepts.event_kinds.list_items.1')}. 
                ${t('central_concepts.event_kinds.list_items.2')}. 
                ${t('central_concepts.nips.title')}. 
                ${t('central_concepts.nips.list_items.0')}. 
                ${t('central_concepts.nips.list_items.1')}. 
                ${t('central_concepts.nips.list_items.2')}. 
                ${t('central_concepts.summary.title')}. 
                ${t('central_concepts.summary.text')}.`;
      
      case 'relays':
        return `${t('relays_section.title')}. 
                ${t('relays_section.intro')}. 
                ${t('relays_section.features.decentralized.title')}. 
                ${t('relays_section.features.decentralized.description')}. 
                ${t('relays_section.features.simple.title')}. 
                ${t('relays_section.features.simple.description')}. 
                ${t('relays_section.features.efficient.title')}. 
                ${t('relays_section.features.efficient.description')}.`;
      
      case 'clients':
        return `${t('clients_section.title')}. 
                ${t('clients_section.intro')}. 
                ${t('clients_section.types.web.title')}. 
                ${t('clients_section.types.web.description')}. 
                ${t('clients_section.types.web.features.browser_based')}. 
                ${t('clients_section.types.web.features.everywhere_available')}. 
                ${t('clients_section.types.mobile.title')}. 
                ${t('clients_section.types.mobile.description')}. 
                ${t('clients_section.types.mobile.features.ios_android')}. 
                ${t('clients_section.types.mobile.features.push_support')}. 
                ${t('clients_section.types.desktop.title')}. 
                ${t('clients_section.types.desktop.description')}. 
                ${t('clients_section.types.desktop.features.full_control')}. 
                ${t('clients_section.types.desktop.features.offline_support')}.`;
      
      case 'summary':
        return `${t('summary_section.title')}. 
                ${t('summary_section.intro')}. 
                ${t('summary_section.key_points.protocol.title')}. 
                ${t('summary_section.key_points.protocol.description')}. 
                ${t('summary_section.key_points.decentralized.title')}. 
                ${t('summary_section.key_points.decentralized.description')}. 
                ${t('summary_section.key_points.flexible.title')}. 
                ${t('summary_section.key_points.flexible.description')}. 
                ${t('summary_section.key_points.secure.title')}. 
                ${t('summary_section.key_points.secure.description')}. 
                ${t('summary_section.conclusion')}. 
                ${t('summary_section.info_box')}.`;
      
      default:
        return '';
    }
  };

  const speakText = useCallback((text: string, sectionId: string) => {
    // Stoppe vorherige Sprachausgabe
    window.speechSynthesis.cancel();

    if (isSpeaking === sectionId) {
      setIsSpeaking(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Wähle deutsche oder englische Stimme basierend auf der aktuellen Sprache
    const voices = window.speechSynthesis.getVoices();
    const lang = i18n.language;
    const voice = voices.find(voice => voice.lang.startsWith(lang)) || 
                 voices.find(voice => voice.lang === 'de-DE') ||
                 voices.find(voice => voice.lang === 'en-US');
    
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    
    utterance.onend = () => {
      setIsSpeaking(null);
    };

    setIsSpeaking(sectionId);
    window.speechSynthesis.speak(utterance);
  }, [i18n.language, isSpeaking, t]);

  const SpeakButton: React.FC<{ sectionId: string }> = ({ sectionId }) => (
    <button 
      className="speak-button"
      onClick={(e) => {
        e.stopPropagation();
        const text = getSectionText(sectionId);
        speakText(text, sectionId);
      }}
      title={isSpeaking === sectionId ? t('stop_speaking') : t('start_speaking')}
      data-speaking={isSpeaking === sectionId}
      aria-label={isSpeaking === sectionId ? t('stop_speaking') : t('start_speaking')}
    >
      {isSpeaking === sectionId ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );

  const sections = [
    {
      id: 'protocol-basics',
      title: t('protocol_basics'),
      icon: <Hash size={20} />,
      children: (
        <div className="home-protocol-basics-container">
          <div className="section-header">
            <h2>{t('protocol_basics')}</h2>
            <SpeakButton sectionId="protocol-basics" />
          </div>
          <p className="home-protocol-basics-intro">{t('protocol_basics_intro')}</p>
          <div className="home-event-structure-container">
            <h3 className="home-event-structure-heading">{t('event_structure.title')}</h3>
            <div className="home-code-example-container">
              <pre className="home-code-example-pre">
                <code>
                  {`{
  `}<span className="home-code-example-key">"id"</span>{`: "...",        // ${t('event_structure.id_desc')}
  `}<span className="home-code-example-key">"pubkey"</span>{`: "...",    // ${t('event_structure.pubkey_desc')}
  `}<span className="home-code-example-key">"created_at"</span>{`: ...,  // ${t('event_structure.created_at_desc')}
  `}<span className="home-code-example-key">"kind"</span>{`: ...,        // ${t('event_structure.kind_desc')}
  `}<span className="home-code-example-key">"tags"</span>{`: [...],      // ${t('event_structure.tags_desc')}
  `}<span className="home-code-example-key">"content"</span>{`: "...",   // ${t('event_structure.content_desc')}
  `}<span className="home-code-example-key">"sig"</span>{`: "..."        // ${t('event_structure.sig_desc')}
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      ),
      isExpanded: expandedSections.includes('protocol-basics'),
      onToggle: () => toggleSection('protocol-basics')
    },
    {
      id: 'central-concepts',
      title: t('central_concepts.title'),
      icon: <Filter size={20} />,
      children: (
        <div className="home-protocol-concepts-container">
          <div className="section-header">
            <h2>{t('central_concepts.title')}</h2>
            <SpeakButton sectionId="central-concepts" />
          </div>
          <div className="home-concepts-grid">
            <div className="home-concept-card">
              <div className="home-concept-card-header">
                <Filter size={24} />
                <h4>{t('central_concepts.event_kinds.title')}</h4>
              </div>
              <ul className="home-concept-list">
                {Object.values(t('central_concepts.event_kinds.list_items', { returnObjects: true })).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="home-concept-card">
              <div className="home-concept-card-header">
                <Book size={24} />
                <h4>{t('central_concepts.nips.title')}</h4>
              </div>
              <ul className="home-concept-list">
                {Object.values(t('central_concepts.nips.list_items', { returnObjects: true })).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="home-concept-summary">
            <h4>{t('central_concepts.summary.title')}</h4>
            <p>{t('central_concepts.summary.text')}</p>
          </div>
          <div className="home-protocol-concepts">
            <h4>{t('protocol_concepts.nips_vs_kinds')}</h4>
            <p>{t('protocol_concepts.nips_vs_kinds_explanation')}</p>
          </div>
        </div>
      ),
      isExpanded: expandedSections.includes('central-concepts'),
      onToggle: () => toggleSection('central-concepts')
    },
    {
      id: 'relays',
      title: t('relays_section.title'),
      icon: <Server size={20} />,
      children: (
        <div className="home-relays-container">
          <div className="section-header">
            <h2>{t('relays_section.title')}</h2>
            <SpeakButton sectionId="relays" />
          </div>
          <p className="home-relays-intro">{t('relays_section.intro')}</p>
          <div className="home-relays-features-grid">
            <div className="home-relay-feature-card">
              <div className="home-relay-feature-header">
                <Network size={24} />
                <h4>{t('relays_section.features.decentralized.title')}</h4>
              </div>
              <p>{t('relays_section.features.decentralized.description')}</p>
            </div>
            <div className="home-relay-feature-card">
              <div className="home-relay-feature-header">
                <Layout size={24} />
                <h4>{t('relays_section.features.simple.title')}</h4>
              </div>
              <p>{t('relays_section.features.simple.description')}</p>
            </div>
            <div className="home-relay-feature-card">
              <div className="home-relay-feature-header">
                <Workflow size={24} />
                <h4>{t('relays_section.features.efficient.title')}</h4>
              </div>
              <p>{t('relays_section.features.efficient.description')}</p>
            </div>
          </div>
        </div>
      ),
      isExpanded: expandedSections.includes('relays'),
      onToggle: () => toggleSection('relays')
    },
    {
      id: 'clients',
      title: t('clients_section.title'),
      icon: <Users size={20} />,
      children: (
        <div className="home-clients-container">
          <div className="section-header">
            <h2>{t('clients_section.title')}</h2>
            <SpeakButton sectionId="clients" />
          </div>
          <p className="home-clients-intro">{t('clients_section.intro')}</p>
          <div className="home-clients-grid">
            <div className="home-client-card">
              <div className="home-client-header">
                <Layout size={24} />
                <h4>{t('clients_section.types.web.title')}</h4>
              </div>
              <p>{t('clients_section.types.web.description')}</p>
              <ul className="home-client-features">
                <li>{t('clients_section.types.web.features.browser_based')}</li>
                <li>{t('clients_section.types.web.features.everywhere_available')}</li>
              </ul>
            </div>
            <div className="home-client-card">
              <div className="home-client-header">
                <Boxes size={24} />
                <h4>{t('clients_section.types.mobile.title')}</h4>
              </div>
              <p>{t('clients_section.types.mobile.description')}</p>
              <ul className="home-client-features">
                <li>{t('clients_section.types.mobile.features.ios_android')}</li>
                <li>{t('clients_section.types.mobile.features.push_support')}</li>
              </ul>
            </div>
            <div className="home-client-card">
              <div className="home-client-header">
                <Shield size={24} />
                <h4>{t('clients_section.types.desktop.title')}</h4>
              </div>
              <p>{t('clients_section.types.desktop.description')}</p>
              <ul className="home-client-features">
                <li>{t('clients_section.types.desktop.features.full_control')}</li>
                <li>{t('clients_section.types.desktop.features.offline_support')}</li>
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
      title: t('summary_section.title'),
      icon: <Network size={20} />,
      children: (
        <div className="home-summary-container">
          <div className="section-header">
            <h2>{t('summary_section.title')}</h2>
            <SpeakButton sectionId="summary" />
          </div>
          <p className="home-summary-intro">{t('summary_section.intro')}</p>
          <div className="home-summary-points">
            {/* Protocol Point */}
            <div className="home-summary-point">
              <div className="home-summary-point-header">
                <div className="home-summary-point-icon">
                  <Workflow size={24} />
                </div>
                <h4 className="home-summary-point-title">
                  {t('summary_section.key_points.protocol.title')}
                </h4>
              </div>
              <p className="home-summary-point-description">
                {t('summary_section.key_points.protocol.description')}
              </p>
            </div>

            {/* Decentralized Point */}
            <div className="home-summary-point">
              <div className="home-summary-point-header">
                <div className="home-summary-point-icon">
                  <Network size={24} />
                </div>
                <h4 className="home-summary-point-title">
                  {t('summary_section.key_points.decentralized.title')}
                </h4>
              </div>
              <p className="home-summary-point-description">
                {t('summary_section.key_points.decentralized.description')}
              </p>
            </div>

            {/* Flexible Point */}
            <div className="home-summary-point">
              <div className="home-summary-point-header">
                <div className="home-summary-point-icon">
                  <Boxes size={24} />
                </div>
                <h4 className="home-summary-point-title">
                  {t('summary_section.key_points.flexible.title')}
                </h4>
              </div>
              <p className="home-summary-point-description">
                {t('summary_section.key_points.flexible.description')}
              </p>
            </div>

            {/* Secure Point */}
            <div className="home-summary-point">
              <div className="home-summary-point-header">
                <div className="home-summary-point-icon">
                  <Shield size={24} />
                </div>
                <h4 className="home-summary-point-title">
                  {t('summary_section.key_points.secure.title')}
                </h4>
              </div>
              <p className="home-summary-point-description">
                {t('summary_section.key_points.secure.description')}
              </p>
            </div>
          </div>
          <div className="home-summary-info-box">
            <p>{t('summary_section.info_box')}</p>
          </div>
          <p className="home-summary-conclusion">
            {t('summary_section.conclusion')}
          </p>
        </div>
      ),
      isExpanded: expandedSections.includes('summary'),
      onToggle: () => toggleSection('summary')
    }
  ];

  return (
    <article className="home">
      <PageLayout
        title={t('title')}
        subtitle={t('subtitle')}
        sections={sections}
      />
    </article>
  );
};

export default Home;
