import React, { useState, useEffect } from 'react';
import { getBreakpointName, getBreakpointColor } from '../../styles/mediaQueries';

// Mögliche Positionen für den Debug-Indikator
type Position = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface BreakpointDebugProps {
  /** Position des Debug-Indikators */
  position?: Position;
  /** Zeigt die aktuelle Breite in Pixeln an */
  showPixels?: boolean;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Zusätzliche Inline-Styles */
  style?: React.CSSProperties;
}

/**
 * BreakpointDebug Komponente
 * 
 * Zeigt einen Debug-Indikator für den aktuellen Breakpoint an.
 * Steuerung:
 * - Alt+D: Ein/Ausblenden
 * - Alt+P: Position ändern
 */
export const BreakpointDebug: React.FC<BreakpointDebugProps> = ({
  position: initialPosition = 'center',
  showPixels = true,
  className = '',
  style = {}
}) => {
  // State
  const [width, setWidth] = useState(window.innerWidth);
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState<Position>(initialPosition);

  // Aktuelle Farbe direkt berechnen statt im State zu halten
  const currentColor = getBreakpointColor(width);

  // Bildschirmbreite überwachen
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CSS-Änderungen überwachen
  useEffect(() => {
    const styleObserver = new MutationObserver(() => {
      // Force re-render
      setWidth(window.innerWidth);
    });

    styleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      styleObserver.disconnect();
    };
  }, []);

  // Keyboard-Shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt+D: Debug-Anzeige ein/ausblenden
      if (e.altKey && e.key.toLowerCase() === 'd') {
        setIsVisible(prev => !prev);
      }
      // Alt+P: Position wechseln
      if (e.altKey && e.key.toLowerCase() === 'p') {
        const positions: Position[] = ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
        const currentIndex = positions.indexOf(position);
        const nextIndex = (currentIndex + 1) % positions.length;
        setPosition(positions[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [position]);

  // Position Styles berechnen
  const getPositionStyle = (pos: Position): React.CSSProperties => {
    const spacing = getComputedStyle(document.documentElement)
      .getPropertyValue('--debug-padding')
      .trim();

    switch (pos) {
      case 'top-left':
        return { top: spacing, left: spacing };
      case 'top-right':
        return { top: spacing, right: spacing };
      case 'bottom-left':
        return { bottom: spacing, left: spacing };
      case 'bottom-right':
        return { bottom: spacing, right: spacing };
      default:
        return {
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  // Wenn nicht sichtbar, nichts rendern
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        padding: getComputedStyle(document.documentElement).getPropertyValue('--debug-padding').trim(),
        borderRadius: getComputedStyle(document.documentElement).getPropertyValue('--debug-border-radius').trim(),
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--debug-font-size-large').trim(),
        fontWeight: 'bold',
        backgroundColor: currentColor,
        color: getComputedStyle(document.documentElement).getPropertyValue('--debug-text').trim(),
        zIndex: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--debug-z-index').trim()),
        textAlign: 'center',
        whiteSpace: 'pre-line',
        pointerEvents: 'none',
        minWidth: '120px',
        opacity: 0.9,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        ...getPositionStyle(position),
        ...style
      }}
      className={`breakpoint-debug breakpoint-custom ${className}`}
    >
      {/* Breakpoint Name */}
      {getBreakpointName(width)}

      {/* Pixel-Breite */}
      {showPixels ? `\n${width}px` : ''}

      {/* Shortcut-Hilfe */}
      <div style={{
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--debug-font-size-small').trim(),
        marginTop: '8px',
        opacity: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--debug-text-opacity').trim())
      }}>
        Alt+D: Toggle | Alt+P: Position
      </div>
    </div>
  );
};

export default BreakpointDebug;
