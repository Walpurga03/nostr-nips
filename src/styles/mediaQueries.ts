/**
 * CSS-Variablen Helfer
 * Liest CSS-Variablen aus dem :root Element
 */
const getCSSVariable = (name: string): string => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!value) {
    console.warn(`CSS Variable ${name} not found`);
    return '';
  }
  return value;
};

const getCSSNumber = (name: string): number => {
  return parseInt(getCSSVariable(name));
};

/**
 * Breakpoint Definitionen
 * Liest die Breakpoints aus den CSS-Variablen
 * 
 * Bereiche (min-width):
 * xxs: 375px  - iPhone SE/Mini
 * xs:  415px  - Große Smartphones
 * sm:  640px  - Kleine Tablets
 * md:  768px  - iPad/Tablets
 * lg:  1024px - iPad Pro/Kleine Laptops
 * xl:  1280px - Laptops
 * 2xl: 1536px - Große Bildschirme
 */
export const breakpoints = {
  xxs: getCSSNumber('--breakpoint-xxs'), // Ab 375px
  xs: getCSSNumber('--breakpoint-xs'),   // Ab 415px
  sm: getCSSNumber('--breakpoint-sm'),   // Ab 640px
  md: getCSSNumber('--breakpoint-md'),   // Ab 768px
  lg: getCSSNumber('--breakpoint-lg'),   // Ab 1024px
  xl: getCSSNumber('--breakpoint-xl'),   // Ab 1280px
  '2xl': getCSSNumber('--breakpoint-2xl') // Ab 1536px
} as const;

/**
 * Media Query Generator
 * Erzeugt Media Queries für verschiedene Breakpoints
 * 
 * Beispiele:
 * up('sm')           -> @media (min-width: 640px)
 * down('md')         -> @media (max-width: 767px)
 * between('sm','lg') -> @media (min-width: 640px) and (max-width: 1023px)
 */
export const mediaQuery = {
  // Basis Media Queries
  up: (size: keyof typeof breakpoints) => 
    `@media (min-width: ${breakpoints[size]}px)`,
  
  down: (size: keyof typeof breakpoints) => 
    `@media (max-width: ${breakpoints[size] - 1}px)`,
  
  between: (min: keyof typeof breakpoints, max: keyof typeof breakpoints) => 
    `@media (min-width: ${breakpoints[min]}px) and (max-width: ${breakpoints[max] - 1}px)`,
  
  // Vordefinierte Gerätekategorien
  mobile: `@media (max-width: ${breakpoints.sm - 1}px)`,         // 0-639px
  tablet: `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg - 1}px)`, // 640-1023px
  desktop: `@media (min-width: ${breakpoints.lg}px)`,            // Ab 1024px
};

/**
 * Gibt den Namen des aktuellen Breakpoints zurück
 * Basierend auf der aktuellen Bildschirmbreite
 */
export const getBreakpointName = (width: number): string => {
  if (width >= breakpoints['2xl']) return '2XL'; // Ab 1536px
  if (width >= breakpoints.xl) return 'XL';      // 1280-1535px
  if (width >= breakpoints.lg) return 'LG';      // 1024-1279px
  if (width >= breakpoints.md) return 'MD';      // 768-1023px
  if (width >= breakpoints.sm) return 'SM';      // 640-767px
  if (width >= breakpoints.xs) return 'XS';      // 415-639px
  if (width >= breakpoints.xxs) return 'XS';     // 375-414px
  return 'XXS';                                  // 0-374px
};

/**
 * Gibt die Farbe für den aktuellen Breakpoint zurück
 * Verwendet die CSS-Variablen für die Farbdefinitionen
 */
export const getBreakpointColor = (width: number): string => {
  // Debug: Aktuelle Breite
  console.log('Current width:', width);

  // Immer die CSS-Variable neu auslesen
  const getColor = (name: string) => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    
    // Debug: Gelesene Farbe
    console.log(`Reading color for ${name}:`, color || '#ff6b6b');
    
    return color || '#ff6b6b'; // Fallback ist die XXS-Farbe (Rot)
  };

  // Debug: Aktuelle Breakpoints
  console.log('Breakpoints:', breakpoints);

  if (width >= breakpoints['2xl']) {
    console.log('Using 2XL color');
    return getColor('--debug-color-2xl'); // Ab 1536px
  }
  if (width >= breakpoints.xl) {
    console.log('Using XL color');
    return getColor('--debug-color-xl');      // 1280-1535px
  }
  if (width >= breakpoints.lg) {
    console.log('Using LG color');
    return getColor('--debug-color-lg');      // 1024-1279px
  }
  if (width >= breakpoints.md) {
    console.log('Using MD color');
    return getColor('--debug-color-md');      // 768-1023px
  }
  if (width >= breakpoints.sm) {
    console.log('Using SM color');
    return getColor('--debug-color-sm');      // 640-767px
  }
  if (width >= breakpoints.xs) {
    console.log('Using XS color (415-639px)');
    return getColor('--debug-color-xs');      // 415-639px
  }
  if (width >= breakpoints.xxs) {
    console.log('Using XS color (375-414px)');
    return getColor('--debug-color-xs');     // 375-414px: XS-Farbe!
  }
  console.log('Using XXS color (0-374px)');
  return getColor('--debug-color-xxs');                                  // 0-374px
};
