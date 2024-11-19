import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { nip19, getPublicKey, generateSecretKey } from 'nostr-tools';
import { bytesToHex } from '@noble/hashes/utils';
import { AlertTriangle, Copy, Download, Key, Lock, Shield, Code, ChevronUp, ChevronDown } from 'lucide-react';
import '../styles/keyGenerator.css';

interface SectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

interface KeyGeneratorProps {
  onKeyGenerated?: (privKey: string, pubKey: string) => void;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  icon,
  children,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section className="sl_content-section" id={id}>
      <button
        className="sl_section-header sl_interactive"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`section-content-${id}`}
      >
        {icon}
        <h2>{title}</h2>
        {isExpanded ?
          <ChevronUp className="sl_transition-transform" /> :
          <ChevronDown className="sl_transition-transform" />
        }
      </button>

      {isExpanded && (
        <div
          className="home-section-content"
          id={`section-content-${id}`}
          role="region"
          aria-labelledby={id}
        >
          {children}
        </div>
      )}
    </section>
  );
};

const KeyGenerator: React.FC<KeyGeneratorProps> = ({ onKeyGenerated }) => {
  const { t } = useTranslation('keyGenerator');
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateKeys = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Generate private key
      const privKeyBytes = generateSecretKey();
      if (!privKeyBytes) {
        throw new Error('Failed to generate private key');
      }
      
      // Get public key
      const pubKey = getPublicKey(privKeyBytes);
      if (!pubKey) {
        throw new Error('Failed to generate public key');
      }

      // Convert to bech32 format
      const nsec = nip19.nsecEncode(privKeyBytes);
      const npub = nip19.npubEncode(pubKey);

      // Convert private key to hex for the callback
      const privKeyHex = bytesToHex(privKeyBytes);

      // Call the callback if provided
      onKeyGenerated?.(privKeyHex, pubKey);

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
        setCopyStatus({ ...copyStatus, [key]: false });
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setError(t('errors.copyFailed'));
    }
  };

  const downloadKeys = () => {
    try {
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
      setError(null);
    } catch (error) {
      console.error('Error downloading keys:', error);
      setError(t('errors.downloadFailed'));
    }
  };

  return (
    <article className="sl_page-container">
      {/* Header */}
      <header className="sl_page-header">
        <h1 className="sl_page-title">{t('pageTitle')}</h1>
        <p className="sl_page-intro">{t('pageSubtitle')}</p>
      </header>

      {/* Main Content */}
      <main className="sections-container">
        {/* Key Pair Introduction */}
        <Section
          id="key-pair-intro"
          title={t('sections.intro.title')}
          icon={<Key className="sl_section-icon" size={24} />}
        >
          <div className="key-info-container">
            <p className="key-info-intro">{t('sections.intro.content')}</p>
            <p className="key-info-intro">{t('sections.intro.content-info')}</p>
          </div>
        </Section>

        {/* Private Key Section */}
        <Section
          id="private-key"
          title={t('sections.privateKey.title')}
          icon={<Lock className="sl_section-icon" size={24} />}
        >
          <div className="key-info-container">
            <p className="key-info-content">{t('sections.privateKey.content')}</p>
          </div>
        </Section>

        {/* Public Key Section */}
        <Section
          id="public-key"
          title={t('sections.publicKey.title')}
          icon={<Key className="sl_section-icon" size={24} />}
        >
          <div className="key-info-container">
            <p className="key-info-content">{t('sections.publicKey.content')}</p>
          </div>
        </Section>

        {/* Technical Details */}
        <Section
          id="technical-details"
          title={t('sections.technical.title')}
          icon={<Code className="sl_section-icon" size={24} />}
        >
          <div className="technical-container">
            <h3>{t('sections.technical.subtitle')}</h3>
            
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

            <p className="technical-conclusion">{t('sections.technical.conclusion')}</p>
          </div>
        </Section>

        {/* Security Guidelines */}
        <Section
          id="security-guidelines"
          title={t('sections.security.title')}
          icon={<Shield className="sl_section-icon" size={24} />}
        >
          <div className="security-container">
            <div className="security-content">
              <p className="security-intro">{t('sections.security.content')}</p>
              
              <div className="security-guidelines">
                <h4>{t('sections.security.guidelines.title')}</h4>
                <ul>
                  <li>{t('sections.security.guidelines.storage')}</li>
                  <li>{t('sections.security.guidelines.backup')}</li>
                  <li>{t('sections.security.guidelines.trust')}</li>
                </ul>
              </div>

              <div className="security-warning">
                <AlertTriangle className="h-5 w-5" />
                <p>{t('sections.security.warning')}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Key Generator */}
        <Section
          id="key-generator"
          title={t('sections.generator.title')}
          icon={<Key className="sl_section-icon" size={24} />}
        >
          <div className="generator-container">
            <button 
              onClick={generateKeys} 
              className="generate-button"
              disabled={isGenerating}
            >
              {isGenerating ? t('sections.generator.generating') : t('sections.generator.button')}
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
                  <div className="key-value-container">
                    <input type="text" value={privateKey} readOnly />
                    <button
                      onClick={() => copyToClipboard(privateKey, 'private')}
                      className="copy-button"
                    >
                      {copyStatus['private'] ? (
                        t('sections.generator.copied')
                      ) : (
                        <>
                          <Copy size={16} />
                          {t('sections.generator.copyButton')}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="key-field">
                  <label>{t('sections.generator.publicKeyLabel')}</label>
                  <div className="key-value-container">
                    <input type="text" value={publicKey} readOnly />
                    <button
                      onClick={() => copyToClipboard(publicKey, 'public')}
                      className="copy-button"
                    >
                      {copyStatus['public'] ? (
                        t('sections.generator.copied')
                      ) : (
                        <>
                          <Copy size={16} />
                          {t('sections.generator.copyButton')}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <button onClick={downloadKeys} className="download-button">
                  <Download size={16} />
                  {t('sections.generator.downloadButton')}
                </button>
              </div>
            )}
          </div>
        </Section>
      </main>
    </article>
  );
};

export default KeyGenerator;
