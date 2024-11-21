import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Zap, ChevronDown, Copy, Check } from 'lucide-react';
import NostrIcon from '../icons/NostrIcon';
import '../../styles/footer.css';

const Footer: React.FC = () => {
  const { t } = useTranslation('footer');
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const npub = 'npub1hht9umpeet75w55uzs9lq6ksayfpcvl9lk64hye75j0yj4husq5ss8xsry';
  const truncatedNpub = `${npub.slice(0, 8)}...${npub.slice(-4)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(npub);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <footer className="pl_footer">
      <div className="pl_footer__bottom">
        <div className="pl_footer__row">
          <p className="pl_footer__made-with">
            {t('made_with')} <Heart size={16} className="pl_footer__heart" /> {t('by_community')}
          </p>

          <div className={`pl_footer__dropdown ${resourcesOpen ? 'open' : ''}`}>
            <button 
              className="pl_footer__dropdown-btn"
              onClick={() => setResourcesOpen(!resourcesOpen)}
              aria-expanded={resourcesOpen}
            >
              {t('resources')} <ChevronDown size={16} className="pl_footer__chevron" />
            </button>
            <ul className="pl_footer__dropdown-content">
              <li><a href="https://github.com/nostr-protocol/nips">{t('nips')}</a></li>
              <li><a href="https://github.com/nostr-protocol/nostr">{t('documentation')}</a></li>
              <li><a href="https://github.com/nostr-protocol/nips/wiki">{t('wiki')}</a></li>
            </ul>
          </div>

          <div className={`pl_footer__dropdown ${communityOpen ? 'open' : ''}`}>
            <button 
              className="pl_footer__dropdown-btn"
              onClick={() => setCommunityOpen(!communityOpen)}
              aria-expanded={communityOpen}
            >
              {t('community')} <ChevronDown size={16} className="pl_footer__chevron" />
            </button>
            <ul className="pl_footer__dropdown-content">
              <li><a href="https://t.me/nostr_protocol">{t('telegram')}</a></li>
              <li><a href="https://discord.gg/nostr">{t('discord')}</a></li>
              <li><a href="https://github.com/nostr-protocol/nips/discussions">{t('discussions')}</a></li>
            </ul>
          </div>
        </div>

        <div className="pl_footer__creator">
          <p>
            {t('created_by')} <NostrIcon size={16} className="pl_footer__nostr" /> 
            <button 
              onClick={handleCopy}
              className="pl_footer__npub-btn"
              title={npub}
            >
              {truncatedNpub}
              {copied ? (
                <Check size={16} className="pl_footer__copy-icon success" />
              ) : (
                <Copy size={16} className="pl_footer__copy-icon" />
              )}
            </button>
          </p>
          <p>
            <Zap size={16} className="pl_footer__lightning" />
            <a 
              href="lightning:aldobarazutti@getalby.com" 
              className="pl_footer__lightning-address"
            >
              {t('lightning')}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;