/**
 * View Transitions Feature Flags Configuration
 * 
 * Ten plik pozwala na kontrolowanie wszystkich animacji View Transitions
 * w aplikacji. Każdy efekt może być włączony/wyłączony niezależnie.
 */

export interface ViewTransitionsConfig {
  // Główne przełączniki
  enabled: boolean;
  prefetch: boolean;

  // Animacje dla wspólnych elementów (transmorfizm)
  morphing: {
    header: boolean;
    footer: boolean;
    logo: boolean;
    main: boolean;
  };

  // Animacje przejść między stronami
  pageTransitions: {
    // Podstawowe animacje main content
    slideLeft: boolean;
    slideRight: boolean;
    slideUp: boolean;
    slideDown: boolean;
    fade: boolean;
    scale: boolean;

    // Animacje dla konkretnych stron
    flashcardsPage: boolean;
    generatorPage: boolean;
  };

  // Animacje autoryzacji
  authAnimations: {
    cardFlip: boolean;
    titleBounce: boolean;
    formFade: boolean;
  };

  // Timing i easing
  timing: {
    fast: number;      // 200ms
    normal: number;    // 300ms
    slow: number;      // 500ms
    verySlow: number;  // 800ms
  };

  // Easing functions
  easing: {
    easeOut: string;
    easeIn: string;
    easeInOut: string;
    bounce: string;
    elastic: string;
  };

  // Debug mode
  debug: boolean;
}

/**
 * Domyślna konfiguracja - wszystkie animacje włączone
 */
export const defaultViewTransitionsConfig: ViewTransitionsConfig = {
  enabled: true,
  prefetch: true,

  morphing: {
    header: true,
    footer: true,
    logo: true,
    main: true,
  },

  pageTransitions: {
    slideLeft: true,
    slideRight: true,
    slideUp: true,
    slideDown: true,
    fade: true,
    scale: true,
    flashcardsPage: true,
    generatorPage: true,
  },

  authAnimations: {
    cardFlip: true,
    titleBounce: true,
    formFade: true,
  },

  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },

  easing: {
    easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  debug: false,
};

/**
 * Konfiguracja dla development - niektóre animacje wyłączone dla szybszego testowania
 */
export const devViewTransitionsConfig: ViewTransitionsConfig = {
  ...defaultViewTransitionsConfig,
  
  pageTransitions: {
    ...defaultViewTransitionsConfig.pageTransitions,
    flashcardsPage: false,  // Wyłącz dla szybszego developmentu
    generatorPage: false,
  },

  authAnimations: {
    ...defaultViewTransitionsConfig.authAnimations,
    titleBounce: false,  // Upraszcza animacje auth
  },

  timing: {
    fast: 100,    // Szybsze animacje w dev
    normal: 150,
    slow: 250,
    verySlow: 400,
  },

  debug: true,
};

/**
 * Konfiguracja dla reduced-motion - minimalne animacje
 */
export const reducedMotionConfig: ViewTransitionsConfig = {
  ...defaultViewTransitionsConfig,
  
  morphing: {
    header: true,   // Pozostaw tylko transmorfizm
    footer: true,
    logo: false,    // Bez dodatkowych animacji logo
    main: false,    // Bez przesuwania content
  },

  pageTransitions: {
    slideLeft: false,
    slideRight: false,
    slideUp: false,
    slideDown: false,
    fade: true,     // Tylko proste fade
    scale: false,
    flashcardsPage: false,
    generatorPage: false,
  },

  authAnimations: {
    cardFlip: false,
    titleBounce: false,
    formFade: true,  // Tylko podstawowe fade
  },

  timing: {
    fast: 150,
    normal: 200,
    slow: 250,
    verySlow: 300,
  },
};

/**
 * Konfiguracja bez animacji - dla maksymalnej wydajności
 */
export const noAnimationsConfig: ViewTransitionsConfig = {
  enabled: false,
  prefetch: true,  // Zachowaj prefetch dla wydajności

  morphing: {
    header: false,
    footer: false,
    logo: false,
    main: false,
  },

  pageTransitions: {
    slideLeft: false,
    slideRight: false,
    slideUp: false,
    slideDown: false,
    fade: false,
    scale: false,
    flashcardsPage: false,
    generatorPage: false,
  },

  authAnimations: {
    cardFlip: false,
    titleBounce: false,
    formFade: false,
  },

  timing: {
    fast: 0,
    normal: 0,
    slow: 0,
    verySlow: 0,
  },

  easing: {
    easeOut: 'linear',
    easeIn: 'linear',
    easeInOut: 'linear',
    bounce: 'linear',
    elastic: 'linear',
  },

  debug: false,
};

/**
 * Aktualna konfiguracja - zmień tutaj aby przełączyć profil
 */
export const viewTransitionsConfig: ViewTransitionsConfig = 
  // Wybierz jeden z profili:
  defaultViewTransitionsConfig;
  // devViewTransitionsConfig;
  // reducedMotionConfig;
  // noAnimationsConfig;

/**
 * Utility function do generowania CSS custom properties
 */
export function generateCSSProperties(config: ViewTransitionsConfig): Record<string, string> {
  return {
    '--vt-enabled': config.enabled ? '1' : '0',
    '--vt-prefetch': config.prefetch ? '1' : '0',
    
    // Morphing flags
    '--vt-morph-header': config.morphing.header ? '1' : '0',
    '--vt-morph-footer': config.morphing.footer ? '1' : '0',
    '--vt-morph-logo': config.morphing.logo ? '1' : '0',
    '--vt-morph-main': config.morphing.main ? '1' : '0',
    
    // Page transitions
    '--vt-slide-left': config.pageTransitions.slideLeft ? '1' : '0',
    '--vt-slide-right': config.pageTransitions.slideRight ? '1' : '0',
    '--vt-slide-up': config.pageTransitions.slideUp ? '1' : '0',
    '--vt-slide-down': config.pageTransitions.slideDown ? '1' : '0',
    '--vt-fade': config.pageTransitions.fade ? '1' : '0',
    '--vt-scale': config.pageTransitions.scale ? '1' : '0',
    '--vt-flashcards-page': config.pageTransitions.flashcardsPage ? '1' : '0',
    '--vt-generator-page': config.pageTransitions.generatorPage ? '1' : '0',
    
    // Auth animations
    '--vt-auth-flip': config.authAnimations.cardFlip ? '1' : '0',
    '--vt-auth-bounce': config.authAnimations.titleBounce ? '1' : '0',
    '--vt-auth-fade': config.authAnimations.formFade ? '1' : '0',
    
    // Timing
    '--vt-timing-fast': `${config.timing.fast}ms`,
    '--vt-timing-normal': `${config.timing.normal}ms`,
    '--vt-timing-slow': `${config.timing.slow}ms`,
    '--vt-timing-very-slow': `${config.timing.verySlow}ms`,
    
    // Easing
    '--vt-easing-out': config.easing.easeOut,
    '--vt-easing-in': config.easing.easeIn,
    '--vt-easing-in-out': config.easing.easeInOut,
    '--vt-easing-bounce': config.easing.bounce,
    '--vt-easing-elastic': config.easing.elastic,
    
    // Debug
    '--vt-debug': config.debug ? '1' : '0',
  };
}
