/**
 * Przykłady różnych konfiguracji View Transitions
 *
 * Skopiuj dowolną konfigurację i użyj jej jako viewTransitionsConfig
 * w pliku view-transitions.config.ts
 */

import type { ViewTransitionsConfig } from "./view-transitions.config";

// 1. 🚀 Performance First - minimalne animacje, maksymalna wydajność
export const performanceConfig: ViewTransitionsConfig = {
  enabled: true,
  prefetch: true,

  morphing: {
    header: true, // Tylko transmorfizm głównych elementów
    footer: true,
    logo: false, // Bez dodatkowych animacji
    main: true,
  },

  pageTransitions: {
    slideLeft: false,
    slideRight: false,
    slideUp: false,
    slideDown: false,
    fade: false, // Tylko podstawowe fade
    scale: false,
    flashcardsPage: false,
    generatorPage: false,
  },

  authAnimations: {
    cardFlip: false,
    titleBounce: true,
    formFade: false, // Minimum animacji
  },

  timing: {
    fast: 150,
    normal: 200,
    slow: 250,
    verySlow: 300,
  },

  easing: {
    easeOut: "ease-out",
    easeIn: "ease-in",
    easeInOut: "ease-in-out",
    bounce: "ease-out",
    elastic: "ease-out",
  },

  debug: false,
};

// 2. 🎪 Show-off Mode - wszystkie animacje na maksa
export const showcaseConfig: ViewTransitionsConfig = {
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
    fast: 300, // Wolniejsze dla lepszego efektu
    normal: 500,
    slow: 800,
    verySlow: 1200,
  },

  easing: {
    easeOut: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Overdone
    easeIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },

  debug: true, // Pokaż wszystko co się dzieje
};

// 3. 📱 Mobile Optimized - szybkie i proste
export const mobileConfig: ViewTransitionsConfig = {
  enabled: true,
  prefetch: true,

  morphing: {
    header: true,
    footer: false, // Footer często nie widoczny na mobile
    logo: true,
    main: false, // Bez przesuwania na małych ekranach
  },

  pageTransitions: {
    slideLeft: true, // Natural mobile gestures
    slideRight: true,
    slideUp: false,
    slideDown: false,
    fade: true,
    scale: false, // Może być problematyczne na mobile
    flashcardsPage: false,
    generatorPage: false,
  },

  authAnimations: {
    cardFlip: false, // 3D może być wolny na mobile
    titleBounce: false,
    formFade: true,
  },

  timing: {
    fast: 100, // Szybko dla responsywności
    normal: 150,
    slow: 200,
    verySlow: 300,
  },

  easing: {
    easeOut: "ease-out",
    easeIn: "ease-in",
    easeInOut: "ease-in-out",
    bounce: "ease-out",
    elastic: "ease-out",
  },

  debug: false,
};

// 4. 🎮 Gaming Style - intensywne animacje
export const gamingConfig: ViewTransitionsConfig = {
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
    fade: false, // Gaming preferuje ruchy
    scale: true,
    flashcardsPage: true,
    generatorPage: true,
  },

  authAnimations: {
    cardFlip: true,
    titleBounce: true,
    formFade: false, // Ruchy zamiast fade
  },

  timing: {
    fast: 150,
    normal: 250,
    slow: 400,
    verySlow: 600,
  },

  easing: {
    easeOut: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    easeIn: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
    easeInOut: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },

  debug: false,
};

// 5. 🏢 Corporate/Professional - subtelne i eleganckie
export const corporateConfig: ViewTransitionsConfig = {
  enabled: true,
  prefetch: true,

  morphing: {
    header: true,
    footer: true,
    logo: false, // Logo pozostaje statyczne
    main: false, // Subtelne przejścia
  },

  pageTransitions: {
    slideLeft: false,
    slideRight: false,
    slideUp: false,
    slideDown: false,
    fade: true, // Tylko fade
    scale: false,
    flashcardsPage: false,
    generatorPage: false,
  },

  authAnimations: {
    cardFlip: false,
    titleBounce: false,
    formFade: true,
  },

  timing: {
    fast: 200,
    normal: 300,
    slow: 400,
    verySlow: 500,
  },

  easing: {
    easeOut: "cubic-bezier(0.4, 0, 0.2, 1)", // Material Design
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.4, 0, 0.2, 1)",
    elastic: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  debug: false,
};

// 6. 🧪 A/B Testing Configurations
export const abTestConfigA: ViewTransitionsConfig = {
  ...performanceConfig,
  // Wariant A: szybkie, minimalne animacje
};

export const abTestConfigB: ViewTransitionsConfig = {
  ...showcaseConfig,
  timing: {
    fast: 200,
    normal: 300,
    slow: 450,
    verySlow: 600,
  },
  // Wariant B: pełne animacje ale szybsze
};

// 7. 🎨 Creative/Portfolio - artystyczne efekty
export const creativeConfig: ViewTransitionsConfig = {
  enabled: true,
  prefetch: true,

  morphing: {
    header: true,
    footer: true,
    logo: true,
    main: true,
  },

  pageTransitions: {
    slideLeft: false,
    slideRight: false,
    slideUp: true, // Artystyczne kierunki
    slideDown: true,
    fade: false,
    scale: true, // Dramatyczne skalowanie
    flashcardsPage: true,
    generatorPage: true,
  },

  authAnimations: {
    cardFlip: true, // 3D efekty
    titleBounce: true,
    formFade: false,
  },

  timing: {
    fast: 250,
    normal: 400,
    slow: 650,
    verySlow: 900, // Długie dla efektu
  },

  easing: {
    easeOut: "cubic-bezier(0.19, 1, 0.22, 1)", // ExpoOut
    easeIn: "cubic-bezier(0.95, 0.05, 0.795, 0.035)", // ExpoIn
    easeInOut: "cubic-bezier(0.87, 0, 0.13, 1)", // ExpoInOut
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },

  debug: false,
};

// 8. 🔧 Debug/Development - wszystko widoczne i wolne
export const debugConfig: ViewTransitionsConfig = {
  enabled: true,
  prefetch: false, // Nie prefetch w debug

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
    fast: 1000, // Bardzo wolno dla analizy
    normal: 1500,
    slow: 2000,
    verySlow: 3000,
  },

  easing: {
    easeOut: "linear", // Liniowe dla łatwiejszej analizy
    easeIn: "linear",
    easeInOut: "linear",
    bounce: "linear",
    elastic: "linear",
  },

  debug: true,
};

// Użyj jednej z konfiguracji kopiując ją do view-transitions.config.ts:
// export const viewTransitionsConfig = performanceConfig;
