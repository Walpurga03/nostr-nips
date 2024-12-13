import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import '../../styles/pageLayout.css';

interface SectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
}

interface PageLayoutProps {
  title?: string;
  subtitle?: string;
  sections?: SectionProps[];
  children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  icon,
  children,
  isExpanded = false,
  onToggle
}) => {
  return (
    <section className="pl_section" id={id}>
      <button
        className="pl_section__header"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`section-content-${id}`}
      >
        <div className="pl_section__header-content">
          <span className="pl_section__icon">{icon}</span>
          <h2 className="pl_section__title">{title}</h2>
        </div>
        {onToggle && (
          <span className="pl_section__toggle">
            <ChevronDown className="pl_section__toggle-icon" />
          </span>
        )}
      </button>
      {isExpanded && (
        <div
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

const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, sections, children }) => {
  const { t } = useTranslation('pageLayout');
  console.log(t);

  return (
    <div className="pl_app">
      <div className="pl_page">
        <header className="pl_page__header">
          <h1 className="pl_page__title">{title}</h1>
          {subtitle && <p className="pl_page__subtitle">{subtitle}</p>}
        </header>
        <main className="pl_page__main">
          {sections?.map((section) => (
            <Section key={section.id} {...section} />
          ))}
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
