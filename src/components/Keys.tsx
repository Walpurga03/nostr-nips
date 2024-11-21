import React, { useState } from 'react';
import { Info, Lock, Key, Shield, Copy, Download, AlertTriangle, BookOpen, Volume2 } from 'lucide-react';
import PageLayout from './layout/PageLayout';
import { useTranslation } from 'react-i18next';
import { nip19, getPublicKey, generateSecretKey } from 'nostr-tools';
import '../styles/keys.css';

const Keys: React.FC = () => {
  const { t, i18n } = useTranslation('keys');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const speakText = async (text: string, sectionId: string) => {
    if (isPlaying[sectionId]) {
      window.speechSynthesis.cancel();
      setIsPlaying(prev => ({ ...prev, [sectionId]: false }));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language === 'en' ? 'en-US' : 'de-DE'; 
    utterance.onend = () => {
      setIsPlaying(prev => ({ ...prev, [sectionId]: false }));
    };
    setIsPlaying(prev => ({ ...prev, [sectionId]: true }));
    window.speechSynthesis.speak(utterance);
  };

  const generateKeys = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const privKeyBytes = generateSecretKey();
      if (!privKeyBytes) {
        throw new Error('Failed to generate private key');
      }
      
      const pubKey = getPublicKey(privKeyBytes);
      if (!pubKey) {
        throw new Error('Failed to generate public key');
      }

      const nsec = nip19.nsecEncode(privKeyBytes);
      const npub = nip19.npubEncode(pubKey);

      setPrivateKey(nsec);
      setPublicKey(npub);
      setError(null);
    } catch (error) {
      console.error('Error generating keys:', error);
      setError(t('errors.generateFailed'));
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ ...copyStatus, [key]: true });
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setError(t('errors.copyFailed'));
    }
  };

  const downloadKeys = () => {
    const content = `Private Key (nsec): ${privateKey}\nPublic Key (npub): ${publicKey}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nostr-keys.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const KeyGeneratorComponent = () => (
    <div className="key-generator">
      <button 
        className="generate-button" 
        onClick={generateKeys}
        disabled={isGenerating}
      >
        {t('sections.generator.button')}
      </button>

      {error && (
        <div className="error-message">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {privateKey && publicKey && (
        <div className="keys-display">
          <div className="key-field">
            <label>{t('sections.generator.privateKeyLabel')}</label>
            <div className="key-value">
              <input type="text" value={privateKey} readOnly />
              <button
                onClick={() => copyToClipboard(privateKey, 'private')}
                title={t('sections.generator.copyButton')}
              >
                <Copy size={16} />
                {copyStatus['private'] && <span>{t('sections.generator.copied')}</span>}
              </button>
            </div>
          </div>

          <div className="key-field">
            <label>{t('sections.generator.publicKeyLabel')}</label>
            <div className="key-value">
              <input type="text" value={publicKey} readOnly />
              <button
                onClick={() => copyToClipboard(publicKey, 'public')}
                title={t('sections.generator.copyButton')}
              >
                <Copy size={16} />
                {copyStatus['public'] && <span>{t('sections.generator.copied')}</span>}
              </button>
            </div>
          </div>

          <button 
            className="download-button"
            onClick={downloadKeys}
            title={t('sections.generator.downloadButton')}
          >
            <Download size={16} />
            {t('sections.generator.downloadButton')}
          </button>
        </div>
      )}
    </div>
  );

  const sections = [
    {
      id: 'key-intro',
      title: t('sections.intro.title'),
      icon: <Info className="section-icon" />,
      isExpanded: expandedSections.includes('key-intro'),
      onToggle: () => toggleSection('key-intro'),
      children: (
        <div className="key-intro">
          <p>{t('sections.intro.content')}</p>
          <p>{t('sections.intro.content-info')}</p>
          <div className="key-types">
            <div className="key-type">
              <h3>{t('sections.privateKey.title')}</h3>
              <p>{t('sections.privateKey.content')}</p>
            </div>
            <div className="key-type">
              <h3>{t('sections.publicKey.title')}</h3>
              <p>{t('sections.publicKey.content')}</p>
            </div>
          </div>
          <div className="section-header">
            <h2>{t('sections.intro.title')}</h2>
            <button 
              className={`speak-button ${isPlaying['key-intro'] ? 'playing' : ''}`}
              onClick={() => speakText(
                `${t('sections.intro.content')} ${t('sections.intro.content-info')}`,
                'key-intro'
              )}
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'key-explanation',
      title: t('sections.explanation.title'),
      icon: <BookOpen className="section-icon" />,
      isExpanded: expandedSections.includes('key-explanation'),
      onToggle: () => toggleSection('key-explanation'),
      children: (
        <div className="key-explanation">
          <div className="section-header">
            <h2>{t('sections.explanation.title')}</h2>
            <button 
              className={`speak-button ${isPlaying['key-explanation'] ? 'playing' : ''}`}
              onClick={() => speakText(
                `${t('sections.explanation.title')}. 
                
                ${t('sections.explanation.privateKey.title')}:
                ${t('sections.explanation.privateKey.description')}
                ${t('sections.explanation.privateKey.point1')},
                ${t('sections.explanation.privateKey.point2')},
                ${t('sections.explanation.privateKey.point3')}.
                ${t('sections.explanation.privateKey.format.title')}:
                ${t('sections.explanation.privateKey.format.description')}

                ${t('sections.explanation.publicKey.title')}:
                ${t('sections.explanation.publicKey.description')}
                ${t('sections.explanation.publicKey.point1')},
                ${t('sections.explanation.publicKey.point2')},
                ${t('sections.explanation.publicKey.point3')}.
                ${t('sections.explanation.publicKey.format.title')}:
                ${t('sections.explanation.publicKey.format.description')}

                ${t('sections.explanation.usage.title')}:
                ${t('sections.explanation.usage.description')}
                ${t('sections.explanation.usage.signing.title')}:
                ${t('sections.explanation.usage.signing.description')}
                ${t('sections.explanation.usage.verification.title')}:
                ${t('sections.explanation.usage.verification.description')}`,
                'key-explanation'
              )}
            >
              <Volume2 size={20} />
            </button>
          </div>
          
          <div className="explanation-section">
            <h3>{t('sections.explanation.privateKey.title')}</h3>
            <div className="explanation-content">
              <p>{t('sections.explanation.privateKey.description')}</p>
              <ul>
                <li>{t('sections.explanation.privateKey.point1')}</li>
                <li>{t('sections.explanation.privateKey.point2')}</li>
                <li>{t('sections.explanation.privateKey.point3')}</li>
              </ul>
              <div className="key-format">
                <h4>{t('sections.explanation.privateKey.format.title')}</h4>
                <p>{t('sections.explanation.privateKey.format.description')}</p>
                <div className="format-examples">
                  <div className="format-example">
                    <span className="format-label">Bech32:</span>
                    <code>{t('sections.explanation.privateKey.format.bech32')}</code>
                  </div>
                  <div className="format-example">
                    <span className="format-label">Hex:</span>
                    <code>{t('sections.explanation.privateKey.format.hex')}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="explanation-section">
            <h3>{t('sections.explanation.publicKey.title')}</h3>
            <div className="explanation-content">
              <p>{t('sections.explanation.publicKey.description')}</p>
              <ul>
                <li>{t('sections.explanation.publicKey.point1')}</li>
                <li>{t('sections.explanation.publicKey.point2')}</li>
                <li>{t('sections.explanation.publicKey.point3')}</li>
              </ul>
              <div className="key-format">
                <h4>{t('sections.explanation.publicKey.format.title')}</h4>
                <p>{t('sections.explanation.publicKey.format.description')}</p>
                <div className="format-examples">
                  <div className="format-example">
                    <span className="format-label">Bech32:</span>
                    <code>{t('sections.explanation.publicKey.format.bech32')}</code>
                  </div>
                  <div className="format-example">
                    <span className="format-label">Hex:</span>
                    <code>{t('sections.explanation.publicKey.format.hex')}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="explanation-section">
            <h3>{t('sections.explanation.usage.title')}</h3>
            <div className="explanation-content">
              <p>{t('sections.explanation.usage.description')}</p>
              <div className="usage-examples">
                <div className="usage-example">
                  <h4>{t('sections.explanation.usage.signing.title')}</h4>
                  <p>{t('sections.explanation.usage.signing.description')}</p>
                </div>
                <div className="usage-example">
                  <h4>{t('sections.explanation.usage.verification.title')}</h4>
                  <p>{t('sections.explanation.usage.verification.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'key-technical',
      title: t('sections.technical.title'),
      icon: <Lock className="section-icon" />,
      isExpanded: expandedSections.includes('key-technical'),
      onToggle: () => toggleSection('key-technical'),
      children: (
        <div className="key-technical">
          <h3>{t('sections.technical.subtitle')}</h3>
          <div className="technical-details">
            <div className="technical-step">
              <h4>{t('sections.technical.privateKeyGen.title')}</h4>
              <p>{t('sections.technical.privateKeyGen.content')}</p>
              <code>{t('sections.technical.privateKeyGen.code')}</code>
            </div>
            <div className="technical-step">
              <h4>{t('sections.technical.publicKeyGen.title')}</h4>
              <p>{t('sections.technical.publicKeyGen.content')}</p>
              <code>{t('sections.technical.publicKeyGen.code')}</code>
            </div>
          </div>
          <p>{t('sections.technical.conclusion')}</p>
          <div className="section-header">
            <h2>{t('sections.technical.title')}</h2>
            <button 
              className={`speak-button ${isPlaying['key-technical'] ? 'playing' : ''}`}
              onClick={() => speakText(
                `${t('sections.technical.subtitle')} ${t('sections.technical.privateKeyGen.content')} ${t('sections.technical.publicKeyGen.content')} ${t('sections.technical.conclusion')}`,
                'key-technical'
              )}
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'key-generator',
      title: t('sections.generator.title'),
      icon: <Key className="section-icon" />,
      isExpanded: expandedSections.includes('key-generator'),
      onToggle: () => toggleSection('key-generator'),
      children: (
        <div className="key-generator-container">
          <KeyGeneratorComponent />
          <div className="section-header">
            <h2>{t('sections.generator.title')}</h2>
            <button 
              className={`speak-button ${isPlaying['key-generator'] ? 'playing' : ''}`}
              onClick={() => speakText(
                `${t('sections.generator.button')}`,
                'key-generator'
              )}
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'key-security',
      title: t('sections.security.title'),
      icon: <Shield className="section-icon" />,
      isExpanded: expandedSections.includes('key-security'),
      onToggle: () => toggleSection('key-security'),
      children: (
        <div className="key-security">
          <p>{t('sections.security.content')}</p>
          <div className="security-warning">
            <p>{t('sections.security.warning')}</p>
          </div>
          <div className="security-guidelines">
            <h3>{t('sections.security.guidelines.title')}</h3>
            <ul>
              <li>{t('sections.security.guidelines.storage')}</li>
              <li>{t('sections.security.guidelines.backup')}</li>
              <li>{t('sections.security.guidelines.trust')}</li>
            </ul>
          </div>
          <div className="section-header">
            <h2>{t('sections.security.title')}</h2>
            <button 
              className={`speak-button ${isPlaying['key-security'] ? 'playing' : ''}`}
              onClick={() => speakText(
                `${t('sections.security.content')} ${t('sections.security.warning')} ${t('sections.security.guidelines.title')}`,
                'key-security'
              )}
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title={t('pageTitle')}
      subtitle={t('pageSubtitle')}
      sections={sections}
    />
  );
};

export default Keys;