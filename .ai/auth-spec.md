# Specyfikacja Techniczna Modułu Autentykacji

## 1. Architektura Interfejsu Użytkownika

### 1.1. Struktura Stron i Komponentów

#### Nowe Strony Astro
- `/src/pages/login.astro` - strona logowania
- `/src/pages/register.astro` - strona rejestracji

#### Nowe Komponenty React
- `/src/components/auth/LoginForm.tsx` - formularz logowania
- `/src/components/auth/RegisterForm.tsx` - formularz rejestracji
- `/src/components/auth/AuthLayout.tsx` - wspólny layout dla stron auth
- `/src/components/auth/AuthGuard.tsx` - komponent HOC do zabezpieczania stron wymagających autoryzacji

#### Rozszerzenie Istniejących Komponentów
- `/src/layouts/Layout.astro` - dodanie obsługi stanu autoryzacji i wyświetlania odpowiednich elementów w nawigacji
- `/src/components/ui/UserMenu.tsx` - menu użytkownika w prawym górnym rogu z opcją wylogowania

### 1.2. Przepływ Użytkownika i Walidacja

#### Rejestracja (US-001)
1. Formularz zawiera pola:
   - Email (walidacja: poprawny format email)
   - Hasło (walidacja: min. 6 znaków)
   - Potwierdzenie hasła (walidacja: zgodność z hasłem)
2. Obsługa błędów:
   - Zajęty email
   - Niepoprawny format danych
   - Błędy serwera
3. Po udanej rejestracji:
   - Automatyczne logowanie
   - Przekierowanie do strony głównej (generator)
   - Wyświetlenie komunikatu powitalnego

#### Logowanie (US-002)
1. Formularz zawiera pola:
   - Email
   - Hasło
2. Obsługa błędów:
   - Niepoprawne dane logowania
   - Błędy serwera
3. Po udanym logowaniu:
   - Zapisanie tokena w localStorage
   - Przekierowanie do strony głównej (generator)
   - Aktualizacja stanu UI (menu użytkownika)

### 1.3. Zabezpieczenie Stron

1. Strony wymagające autoryzacji:
   - `/` (strona generator) - strona główna z generatorem fiszek
   - `/decks` - kolekcje użytkownika
   - `/study` - sesja nauki
2. Mechanizm przekierowania:
   - Automatyczne przekierowanie do /login dla niezalogowanych użytkowników
   - Powrót do strony głównej (generator) po zalogowaniu

## 2. Logika Backendowa

### 2.1. Endpointy API

#### Rejestracja
```typescript
POST /api/auth/register
Body: { email: string, password: string }
Response: { user: User, session: Session }
```

#### Logowanie
```typescript
POST /api/auth/login
Body: { email: string, password: string }
Response: { user: User, session: Session }
```

#### Wylogowanie
```typescript
POST /api/auth/logout
Response: { success: boolean }
```

### 2.2. Middleware i Walidacja

1. Middleware autoryzacji (`/src/middleware/auth.ts`):
   - Weryfikacja tokena JWT
   - Dodanie danych użytkownika do kontekstu
   - Obsługa wygaśnięcia sesji
   - Przekierowanie na /login dla chronionych ścieżek

2. Walidacja danych wejściowych:
   - Wykorzystanie Zod do walidacji payloadu
   - Spójne komunikaty błędów
   - Sanityzacja danych

### 2.3. Integracja z Bazą Danych

1. Tabele i relacje:
   - Wykorzystanie wbudowanych tabel Supabase Auth
   - Powiązanie z tabelą `decks` przez `user_id`
   - Policies RLS dla zabezpieczenia dostępu

2. Policies RLS:
   - Dostęp tylko do własnych danych
   - Publiczny dostęp do endpointów rejestracji/logowania
   - Automatyczne przypisywanie `user_id`

## 3. System Autentykacji

### 3.1. Konfiguracja Supabase Auth

1. Ustawienia podstawowe:
   - Minimalna długość hasła: 6 znaków
   - Dozwolone domeny email: wszystkie
   - Czas życia tokena JWT: 3600s (1h)
   - Wyłączenie funkcji resetowania hasła

### 3.2. Zarządzanie Sesją

1. Client-side:
   - Przechowywanie tokena w localStorage
   - Automatyczne odświeżanie tokena
   - Obsługa wygaśnięcia sesji

2. Server-side:
   - Weryfikacja tokena w middleware
   - Obsługa błędów autoryzacji
   - Bezpieczne przekazywanie stanu auth

### 3.3. Bezpieczeństwo

1. Zabezpieczenia:
   - CSRF protection
   - Rate limiting dla prób logowania
   - Bezpieczne przechowywanie tokenów

2. Obsługa błędów:
   - Logowanie nieudanych prób autoryzacji
   - Blokowanie konta po wielu nieudanych próbach
   - Monitorowanie podejrzanych aktywności

## 4. Implementacja

### 4.1. Kolejność Wdrożenia

1. Faza 1:
   - Konfiguracja Supabase Auth
   - Podstawowe komponenty UI (login, register)
   - Endpointy rejestracji i logowania

2. Faza 2:
   - Middleware autoryzacji
   - Zabezpieczenie stron
   - Integracja z istniejącymi stronami

### 4.2. Zależności

1. Wymagane pakiety:
   - @supabase/supabase-js (już zainstalowany)
   - zod (do walidacji)
   - @supabase/auth-helpers-astro

2. Konfiguracja środowiska:
   - Zmienne SUPABASE_URL i SUPABASE_KEY
   - Konfiguracja CORS 