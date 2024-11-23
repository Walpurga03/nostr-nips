import React, { useState, useCallback } from 'react';
import {
  Info, Lock, Key, Shield, Copy, Download, AlertTriangle, Volume2,
  CheckCircle, CheckCircle2, Code, RefreshCcw, Lock as LockIcon
} from 'lucide-react';
import PageLayout from './layout/PageLayout';
import { useTranslation } from 'react-i18next';
import { nip19, getPublicKey, generateSecretKey } from 'nostr-tools';
import '../styles/keys.css';


const getIntroSectionContent = (t: any) => {
  const privateKeyPoints = t('sections.intro.keyTypes.privateKey.points', { returnObjects: true });
  const publicKeyPoints = t('sections.intro.keyTypes.publicKey.points', { returnObjects: true });

  return `${t('sections.intro.title')}. 
    ${t('sections.intro.description')}
    
    ${t('sections.intro.keyTypes.title')}
    
    ${t('sections.intro.keyTypes.privateKey.title')}:
    ${t('sections.intro.keyTypes.privateKey.description')}
    ${privateKeyPoints.map((point: string) => `• ${point}`).join('\n')}
    
    ${t('sections.intro.keyTypes.publicKey.title')}:
    ${t('sections.intro.keyTypes.publicKey.description')}
    ${publicKeyPoints.map((point: string) => `• ${point}`).join('\n')}`;
};

const getTechnicalSectionContent = (t: any) => {
  return `${t('sections.technical.title')}. 
    ${t('sections.technical.description')}
    
    ${t('sections.technical.keyGeneration.title')}
    
    ${t('sections.technical.keyGeneration.privateKey.title')}:
    ${t('sections.technical.keyGeneration.privateKey.description')}
    
    ${t('sections.technical.keyGeneration.publicKey.title')}:
    ${t('sections.technical.keyGeneration.publicKey.description')}
    
    ${t('sections.technical.formats.title')}:
    ${t('sections.technical.formats.description')}
    • ${t('sections.technical.formats.types.bech32')}
    • ${t('sections.technical.formats.types.hex')}`;
};

const getSecuritySectionContent = (t: any) => {
  return `${t('sections.security.title')}. 
    ${t('sections.security.description')}
    
    ${t('sections.security.warning')}
    
    ${t('sections.security.guidelines.title')}:
    • ${t('sections.security.guidelines.storage')}
    • ${t('sections.security.guidelines.backup')}
    • ${t('sections.security.guidelines.sharing')}
    • ${t('sections.security.guidelines.software')}
    
    ${t('sections.security.extensions.title')}:
    ${t('sections.security.extensions.description')}
    • ${t('sections.security.extensions.guidelines.verify')}
    • ${t('sections.security.extensions.guidelines.updates')}
    • ${t('sections.security.extensions.guidelines.permissions')}
    • ${t('sections.security.extensions.guidelines.source')}`;
};

const getGeneratorSectionContent = (t: any) => {
  return `${t('sections.generator.title')}. 
    ${t('sections.generator.description')}
    
    ${t('sections.generator.warning')}`;
};

const Keys: React.FC = () => {
  const { t, i18n } = useTranslation('keys');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  // const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [speaking, setSpeaking] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // const speakText = async (text: string, sectionId: string) => {
  //   if (isPlaying[sectionId]) {
  //     window.speechSynthesis.cancel();
  //     setIsPlaying(prev => ({ ...prev, [sectionId]: false }));
  //     return;
  //   }

  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.lang = i18n.language === 'en' ? 'en-US' : 'de-DE';
  //   utterance.onend = () => {
  //     setIsPlaying(prev => ({ ...prev, [sectionId]: false }));
  //   };
  //   setIsPlaying(prev => ({ ...prev, [sectionId]: true }));
  //   window.speechSynthesis.speak(utterance);
  // };

  const speak = useCallback((text: string, section: string) => {
    if (speaking === section) {
      window.speechSynthesis.cancel();
      setSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language;
    utterance.onend = () => setSpeaking(null);
    window.speechSynthesis.speak(utterance);
    setSpeaking(section);
  }, [speaking, i18n.language]);

  // const getSectionContent = useCallback((section: string) => {
  //   switch (section) {
  //     case 'privateKey':
  //       return `${t('sections.explanation.privateKey.title')}. 
  //               ${t('sections.explanation.privateKey.description')}
  //               ${t('sections.explanation.privateKey.point1')}
  //               ${t('sections.explanation.privateKey.point2')}
  //               ${t('sections.explanation.privateKey.point3')}
  //               ${t('sections.explanation.privateKey.format.title')}
  //               ${t('sections.explanation.privateKey.format.description')}`;
  //     case 'publicKey':
  //       return `${t('sections.explanation.publicKey.title')}. 
  //               ${t('sections.explanation.publicKey.description')}
  //               ${t('sections.explanation.publicKey.point1')}
  //               ${t('sections.explanation.publicKey.point2')}
  //               ${t('sections.explanation.publicKey.point3')}
  //               ${t('sections.explanation.publicKey.format.title')}
  //               ${t('sections.explanation.publicKey.format.description')}`;
  //     case 'usage':
  //       return `${t('sections.explanation.usage.title')}. 
  //               ${t('sections.explanation.usage.description')}
  //               ${t('sections.explanation.usage.signing.title')}
  //               ${t('sections.explanation.usage.signing.description')}
  //               ${t('sections.explanation.usage.verification.title')}
  //               ${t('sections.explanation.usage.verification.description')}`;
  //     case 'security':
  //       return `${t('sections.security.title')}. 
  //               ${t('sections.security.description')}
  //               ${t('sections.security.warning')}
  //               ${t('sections.security.guidelines.title')}
  //               ${t('sections.security.guidelines.storage')}
  //               ${t('sections.security.guidelines.backup')}
  //               ${t('sections.security.guidelines.trust')}
  //               ${t('sections.security.guidelines.validation')}
  //               ${t('sections.security.guidelines.rotation')}`;
  //     default:
  //       return '';
  //   }
  // }, [t]);

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
          <div className="section-header">
            <h2>{t('sections.intro.title')}</h2>
            <button
              className="speech-button"
              onClick={() => speak(getIntroSectionContent(t), 'intro')}
              aria-label={t('accessibility.speak')}
            >
              <Volume2 className={`speech-icon ${speaking === 'intro' ? 'speaking' : ''}`} />
            </button>
          </div>
          <p>{t('sections.intro.description')}</p>

          <div className="key-types">
            <h3>{t('sections.intro.keyTypes.title')}</h3>
            <div className="key-type">
              <Shield className="key-section-icon" />
              <div className="key-type-content">
                <h4>{t('sections.intro.keyTypes.privateKey.title')}</h4>
                <p>{t('sections.intro.keyTypes.privateKey.description')}</p>
                <ul>
                  {Object.values(t('sections.intro.keyTypes.privateKey.points', { returnObjects: true })).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="key-type">
              <Key className="key-section-icon" />
              <div className="key-type-content">
                <h4>{t('sections.intro.keyTypes.publicKey.title')}</h4>
                <p>{t('sections.intro.keyTypes.publicKey.description')}</p>
                <ul>
                  {Object.values(t('sections.intro.keyTypes.publicKey.points', { returnObjects: true })).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
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
          <div className="section-header">
            <h2>{t('sections.generator.title')}</h2>
            <button
              className="speech-button"
              onClick={() => speak(getGeneratorSectionContent(t), 'generator')}
              aria-label={t('accessibility.speak')}
            >
              <Volume2 className={`speech-icon ${speaking === 'generator' ? 'speaking' : ''}`} />
            </button>
          </div>
          <p>{t('sections.generator.description')}</p>
          <div className="warning-box">
            <AlertTriangle className="warning-icon" />
            <p>{t('sections.generator.warning')}</p>
          </div>
          <KeyGeneratorComponent />
        </div>
      )
    },
    {
      id: 'key-technical',
      title: t('sections.technical.title'),
      icon: <Code className="section-icon" />,
      isExpanded: expandedSections.includes('key-technical'),
      onToggle: () => toggleSection('key-technical'),
      children: (
        <div className="key-technical">
          <div className="section-header">
            <h2>{t('sections.technical.title')}</h2>
            <button
              className="speech-button"
              onClick={() => speak(getTechnicalSectionContent(t), 'technical')}
              aria-label={t('accessibility.speak')}
            >
              <Volume2 className={`speech-icon ${speaking === 'technical' ? 'speaking' : ''}`} />
            </button>
          </div>

          <p>{t('sections.technical.description')}</p>

          <div className="technical-section">
            <h3>{t('sections.technical.keyGeneration.title')}</h3>
            <div className="technical-item">
              <h4>{t('sections.technical.keyGeneration.privateKey.title')}</h4>
              <p>{t('sections.technical.keyGeneration.privateKey.description')}</p>
              <code>{t('sections.technical.keyGeneration.privateKey.code')}</code>
            </div>
            <div className="technical-item">
              <h4>{t('sections.technical.keyGeneration.publicKey.title')}</h4>
              <p>{t('sections.technical.keyGeneration.publicKey.description')}</p>
              <code>{t('sections.technical.keyGeneration.publicKey.code')}</code>
            </div>
          </div>

          <div className="formats-section">
            <h3>{t('sections.technical.formats.title')}</h3>
            <p>{t('sections.technical.formats.description')}</p>
            <div className="format-types">
              <div className="format-type">
                <Code className="format-icon" />
                <p>{t('sections.technical.formats.types.bech32')}</p>
              </div>
              <div className="format-type">
                <Code className="format-icon" />
                <p>{t('sections.technical.formats.types.hex')}</p>
              </div>
            </div>
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
          <div className="section-header">
            <h2>{t('sections.security.title')}</h2>
            <button
              className="speech-button"
              onClick={() => speak(getSecuritySectionContent(t), 'security')}
              aria-label={t('accessibility.speak')}
            >
              <Volume2 className={`speech-icon ${speaking === 'security' ? 'speaking' : ''}`} />
            </button>
          </div>

          <p>{t('sections.security.description')}</p>

          <div className="security-warning">
            <AlertTriangle className="warning-icon" />
            <p>{t('sections.security.warning')}</p>
          </div>

          <div className="security-guidelines">
            <h3>{t('sections.security.guidelines.title')}</h3>
            <ul className="guidelines-list">
              <li>
                <Lock className="guideline-icon" />
                <span>{t('sections.security.guidelines.storage')}</span>
              </li>
              <li>
                <Copy className="guideline-icon" />
                <span>{t('sections.security.guidelines.backup')}</span>
              </li>
              <li>
                <Shield className="guideline-icon" />
                <span>{t('sections.security.guidelines.sharing')}</span>
              </li>
              <li>
                <CheckCircle className="guideline-icon" />
                <span>{t('sections.security.guidelines.software')}</span>
              </li>
            </ul>
          </div>

          <div className="extensions-section">
            <h3>{t('sections.security.extensions.title')}</h3>
            <p>{t('sections.security.extensions.description')}</p>
            <div className="extensions-guidelines">
              <div className="extension-item">
                <CheckCircle2 className="extension-icon" />
                <span>{t('sections.security.extensions.guidelines.verify')}</span>
              </div>
              <div className="extension-item">
                <RefreshCcw className="extension-icon" />
                <span>{t('sections.security.extensions.guidelines.updates')}</span>
              </div>
              <div className="extension-item">
                <LockIcon className="extension-icon" />
                <span>{t('sections.security.extensions.guidelines.permissions')}</span>
              </div>
              <div className="extension-item">
                <Code className="extension-icon" />
                <span>{t('sections.security.extensions.guidelines.source')}</span>
              </div>
            </div>
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