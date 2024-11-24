import React, { useState, useEffect, useCallback } from 'react';
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
  const [color, setColor] = useState(getBreakpointColor(window.innerWidth));

  // CSS-Variablen Helper
  const getCSSVar = (name: string): string => {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };

  // Farbe aktualisieren
  const updateColor = useCallback(() => {
    console.log('Updating color for width:', width);
    const newColor = getBreakpointColor(width);
    console.log('New color:', newColor);
    setColor(newColor);
  }, [width]);

  // Bildschirmbreite überwachen
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      console.log('Window resized to:', newWidth);
      setWidth(newWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Breite-Änderungen überwachen
  useEffect(() => {
    console.log('Width changed, updating color');
    updateColor();
  }, [width, updateColor]);

  // CSS-Änderungen überwachen
  useEffect(() => {
    console.log('Setting up MutationObserver');
    const styleObserver = new MutationObserver(() => {
      console.log('CSS changes detected');
      updateColor();
    });
    
    styleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: false,
      subtree: false
    });

    // Regelmäßige Aktualisierung
    const interval = setInterval(() => {
      console.log('Interval update');
      updateColor();
    }, 1000);

    return () => {
      console.log('Cleaning up observers');
      styleObserver.disconnect();
      clearInterval(interval);
    };
  }, [updateColor]);

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
  }, [position, updateColor]);

  // Position Styles berechnen
  const getPositionStyle = (pos: Position): React.CSSProperties => {
    const spacing = getCSSVar('--debug-padding');
    
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
        padding: getCSSVar('--debug-padding'),
        borderRadius: getCSSVar('--debug-border-radius'),
        fontSize: getCSSVar('--debug-font-size-large'),
        fontWeight: 'bold',
        backgroundColor: color,
        color: getCSSVar('--debug-text'),
        zIndex: parseInt(getCSSVar('--debug-z-index')),
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
        fontSize: getCSSVar('--debug-font-size-small'),
        marginTop: '8px',
        opacity: parseFloat(getCSSVar('--debug-text-opacity'))
      }}>
        Alt+D: Toggle | Alt+P: Position
      </div>
    </div>
  );
};

export default BreakpointDebug;
