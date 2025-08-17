# View Transitions Feature Flags

System feature flag umożliwia precyzyjne kontrolowanie wszystkich animacji View Transitions w aplikacji. Każdy efekt może być włączony lub wyłączony niezależnie od pozostałych.

## 🎛️ Konfiguracja

### Główny plik konfiguracyjny
```typescript
// src/config/view-transitions.config.ts
export const viewTransitionsConfig: ViewTransitionsConfig = 
  defaultViewTransitionsConfig; // Wybierz profil
```

### Dostępne profile konfiguracji

#### 1. `defaultViewTransitionsConfig` - Pełne animacje
- Wszystkie animacje włączone
- Pełne timing i easing
- Rekomendowane dla produkcji

#### 2. `devViewTransitionsConfig` - Development
- Szybsze animacje (krótsze czasy)
- Wyłączone niektóre złożone efekty
- Debug mode włączony
- Idealne do developmentu

#### 3. `reducedMotionConfig` - Ograniczone animacje
- Tylko podstawowe przejścia
- Zgodne z accessibility
- Dla użytkowników z `prefers-reduced-motion`

#### 4. `noAnimationsConfig` - Bez animacji
- Wszystkie animacje wyłączone
- Maksymalna wydajność
- Zachowany prefetch

## 🎯 Kategorie animacji

### Transmorfizm (Morphing)
```typescript
morphing: {
  header: boolean,    // Płynne przejście header między stronami
  footer: boolean,    // Płynne przejście footer między stronami  
  logo: boolean,      // Animacja logo z bounce effect
  main: boolean,      // Przesuwanie głównej treści
}
```

### Przejścia między stronami
```typescript
pageTransitions: {
  slideLeft: boolean,       // Przesunięcie w lewo
  slideRight: boolean,      // Przesunięcie w prawo
  slideUp: boolean,         // Przesunięcie w górę
  slideDown: boolean,       // Przesunięcie w dół
  fade: boolean,            // Płynne zanikanie
  scale: boolean,           // Skalowanie
  flashcardsPage: boolean,  // Specjalne animacje dla strony fiszek
  generatorPage: boolean,   // Specjalne animacje dla generatora
}
```

### Animacje autoryzacji
```typescript
authAnimations: {
  cardFlip: boolean,    // Obrót 3D kart autoryzacji
  titleBounce: boolean, // Bounce effect dla tytułów
  formFade: boolean,    // Zanikanie formularzy
}
```

### Timing i easing
```typescript
timing: {
  fast: 200,         // Szybkie animacje
  normal: 300,       // Standardowe
  slow: 500,         // Wolne
  verySlow: 800,     // Bardzo wolne
}

easing: {
  easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
}
```

## 🔧 Jak używać

### 1. Zmiana profilu konfiguracji
```typescript
// W pliku src/config/view-transitions.config.ts
export const viewTransitionsConfig: ViewTransitionsConfig = 
  // Wybierz jeden:
  defaultViewTransitionsConfig;  // Pełne animacje
  // devViewTransitionsConfig;   // Development
  // reducedMotionConfig;        // Ograniczone
  // noAnimationsConfig;         // Bez animacji
```

### 2. Własna konfiguracja
```typescript
export const myCustomConfig: ViewTransitionsConfig = {
  ...defaultViewTransitionsConfig,
  
  // Wyłącz tylko animacje autoryzacji
  authAnimations: {
    cardFlip: false,
    titleBounce: false,
    formFade: true,  // Zostaw tylko fade
  },
  
  // Przyspiesz timing
  timing: {
    fast: 100,
    normal: 150,
    slow: 250,
    verySlow: 350,
  }
};
```

### 3. Conditional config na podstawie środowiska
```typescript
export const viewTransitionsConfig: ViewTransitionsConfig = 
  process.env.NODE_ENV === 'production' 
    ? defaultViewTransitionsConfig
    : devViewTransitionsConfig;
```

## 🎨 Mapowanie flag na efekty wizualne

| Flaga | Efekt | Opis |
|-------|-------|------|
| `morphing.header` | Header transition | Header płynnie przechodzi między stronami |
| `morphing.footer` | Footer transition | Footer pozostaje na miejscu podczas przejść |
| `morphing.logo` | Logo bounce | Logo wykonuje bounce przy kliknięciu |
| `morphing.main` | Content slide | Główna treść przesuwa się w bok |
| `pageTransitions.flashcardsPage` | Scale effect | Strona fiszek skaluje się podczas wejścia/wyjścia |
| `pageTransitions.generatorPage` | Slide up/down | Generator przesuwa się góra-dół |
| `authAnimations.cardFlip` | 3D flip | Karty auth obracają się w 3D |
| `authAnimations.titleBounce` | Bounce title | Tytuły wykonują bounce effect |
| `authAnimations.formFade` | Form fade | Formularze zanikają/pojawiają się |

## 🚀 Performance Tips

### Dla najlepszej wydajności:
```typescript
const performanceConfig = {
  ...noAnimationsConfig,
  prefetch: true,  // Zachowaj prefetch dla szybkości
}
```

### Dla development:
```typescript
const devConfig = {
  ...defaultViewTransitionsConfig,
  timing: {
    fast: 50,    // Bardzo szybkie animacje
    normal: 100,
    slow: 150,
    verySlow: 200,
  },
  debug: true,
}
```

### Dla accessibility:
```typescript
const a11yConfig = {
  ...reducedMotionConfig,
  // Media query prefers-reduced-motion jest automatycznie obsługiwana
}
```

## 🐛 Debug Mode

Włącz debug mode dla dodatkowych informacji:
```typescript
debug: true
```

To włączy:
- Konsolowe logi animacji
- Podświetlenie elementów z transition-name
- Timing informacje

## 📱 Responsive Behavior

Animacje automatycznie respektują:
- `prefers-reduced-motion: reduce`
- Viewport size (mobilne mogą być prostsze)
- Browser support (fallback dla starszych przeglądarek)

## 🔄 Hot Reload

Zmiany w konfiguracji wymagają restartu dev server:
```bash
npm run dev
```

## ⚡ Przykłady zastosowań

### Wyłącz animacje na mobile
```typescript
const isMobile = window.innerWidth < 768;
export const viewTransitionsConfig = isMobile 
  ? reducedMotionConfig 
  : defaultViewTransitionsConfig;
```

### A/B testing animacji
```typescript
const userGroup = getUserGroup(); // A lub B
export const viewTransitionsConfig = userGroup === 'A'
  ? defaultViewTransitionsConfig
  : noAnimationsConfig;
```

### Dark mode optimized
```typescript
const isDarkMode = document.documentElement.classList.contains('dark');
export const viewTransitionsConfig = {
  ...defaultViewTransitionsConfig,
  timing: isDarkMode ? 
    { fast: 150, normal: 250, slow: 400, verySlow: 600 } : // Wolniej w dark mode
    { fast: 100, normal: 200, slow: 300, verySlow: 450 }   // Szybciej w light mode
};
```
