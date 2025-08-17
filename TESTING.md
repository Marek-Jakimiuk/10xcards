# Testowanie w projekcie 10x0-cards-2

## Przegląd

Projekt wykorzystuje kompleksowe podejście do testowania obejmujące:

- **Testy jednostkowe** - Vitest + React Testing Library
- **Testy E2E** - Playwright
- **CI/CD** - GitHub Actions

## Struktura testów

```
├── src/
│   ├── components/
│   │   └── __tests__/           # Testy jednostkowe komponentów
│   └── test/
│       └── setup.ts             # Konfiguracja testów jednostkowych
├── e2e/                         # Testy E2E
│   ├── auth/                    # Testy autentykacji
│   ├── flashcards/              # Testy funkcjonalności fiszek
│   └── page-objects/            # Page Object Model
├── vitest.config.ts             # Konfiguracja Vitest
└── playwright.config.ts         # Konfiguracja Playwright
```

## Uruchamianie testów

### Testy jednostkowe

```bash
# Uruchom wszystkie testy jednostkowe
npm run test

# Tryb watch (automatyczne ponowne uruchamianie)
npm run test:watch

# UI mode (interfejs graficzny)
npm run test:ui

# Pokrycie kodu
npm run test:coverage

# Jednorazowe uruchomienie (bez watch)
npm run test:run
```

### Testy E2E

```bash
# Uruchom wszystkie testy E2E
npm run test:e2e

# UI mode (interfejs graficzny)
npm run test:e2e:ui

# Tryb z widoczną przeglądarką
npm run test:e2e:headed

# Tryb debugowania
npm run test:e2e:debug
```

### Wszystkie testy

```bash
# Uruchom wszystkie testy (jednostkowe + E2E)
npm run test:all
```

## Wskazówki dla deweloperów

### Testy jednostkowe

1. **Umieszczanie testów**: Testy komponentów umieszczaj w folderze `__tests__` obok testowanego komponentu
2. **Nazywanie**: Używaj konwencji `ComponentName.test.tsx`
3. **Struktura testu**: Używaj wzorca Arrange-Act-Assert
4. **Mock'owanie**: Wykorzystuj `vi.fn()` i `vi.mock()` do mock'owania zależności

Przykład:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

### Testy E2E

1. **Page Object Model**: Używaj wzorca POM dla lepszej organizacji testów
2. **Locatory**: Preferuj `data-testid` dla stabilnych selektorów
3. **Asercje**: Używaj specyficznych matcher'ów Playwright
4. **Cleanup**: Testy powinny być niezależne i czyścić po sobie

Przykład:
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

## Data-testid Guidelines

Dodawaj `data-testid` do elementów testowanych w E2E:

```tsx
// Dobre praktyki
<button data-testid="login-button">Zaloguj</button>
<input data-testid="email-input" type="email" />
<div data-testid="flashcards-list">{/* lista fiszek */}</div>
```

## CI/CD

Testy uruchamiają się automatycznie w GitHub Actions przy:
- Push na branch `main` lub `develop`
- Pull Request do `main` lub `develop`

Pipeline składa się z:
1. **Unit Tests** - Testy jednostkowe + linting + coverage
2. **E2E Tests** - Testy end-to-end
3. **Build Check** - Weryfikacja buildu aplikacji

## Coverage

Pokrycie kodu jest generowane automatycznie i wysyłane do Codecov. Skonfigurowane progi:
- Linie: 80%
- Funkcje: 80%
- Branches: 75%

## Debugging

### Testy jednostkowe
- Użyj `test.only()` lub `describe.only()` do uruchamiania pojedynczych testów
- `console.log` w testach jest dozwolony podczas debugowania
- Użyj `npm run test:ui` dla graficznego interfejsu

### Testy E2E
- `npm run test:e2e:debug` dla trybu debugowania
- `npm run test:e2e:headed` aby zobaczyć przeglądarkę
- Trace viewer dostępny po niepowodzeniu testu

## Najlepsze praktyki

1. **Izolacja testów**: Każdy test powinien być niezależny
2. **Czytelne nazwy**: Opisuj co test weryfikuje
3. **Jeden assert na test**: Skupiaj się na jednej funkcjonalności
4. **Setup/Teardown**: Używaj `beforeEach`/`afterEach` dla przygotowania testów
5. **Mock'owanie**: Mock'uj zewnętrzne zależności
6. **Async/Await**: Zawsze używaj właściwego obsługiwania asynchroniczności

## Konfiguracja środowiska

### Wymagania
- Node.js 20+
- npm 9+

### Instalacja
```bash
npm install
npx playwright install chromium
```

### Zmienne środowiskowe
Utwórz `.env.test` dla testów:
```
# Test environment variables
TEST_DATABASE_URL=your_test_db_url
SUPABASE_ANON_KEY=your_test_key
```
