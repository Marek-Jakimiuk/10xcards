Na podstawie dostarczonych informacji o projekcie "10x-cards", jako doświadczony inżynier QA, przedstawiam kompleksowy plan testów.

***

# Plan Testów dla Aplikacji "10x-cards"

## 1. Wprowadzenie i Cele Testowania

### 1.1 Wprowadzenie

Niniejszy dokument określa strategię, zakres, zasoby i harmonogram działań testowych dla aplikacji **10x-cards** w fazie MVP (Minimum Viable Product). Projekt jest aplikacją internetową do tworzenia i zarządzania fiszkami edukacyjnymi, z kluczową funkcjonalnością generowania ich za pomocą AI. Plan ten ma na celu zapewnienie, że finalny produkt będzie spełniał wymagania funkcjonalne, jakościowe i bezpieczeństwa przed wdrożeniem produkcyjnym.

### 1.2 Cele Testowania

Główne cele procesu testowego to:
*   **Weryfikacja funkcjonalności:** Potwierdzenie, że wszystkie kluczowe funkcje (autentykacja, CRUD na fiszkach i taliach, generowanie AI) działają zgodnie ze specyfikacją.
*   **Zapewnienie jakości i stabilności:** Identyfikacja i eliminacja błędów, które mogłyby negatywnie wpłynąć na doświadczenie użytkownika (UX).
*   **Weryfikacja bezpieczeństwa:** Upewnienie się, że dane użytkowników są odizolowane i zabezpieczone przed nieautoryzowanym dostępem.
*   **Ocena integracji:** Sprawdzenie poprawności działania integracji z usługami zewnętrznymi (Supabase, OpenRouter.ai).
*   **Zapewnienie kompatybilności:** Weryfikacja poprawnego działania aplikacji na najpopularniejszych przeglądarkach internetowych.

## 2. Zakres Testów

### 2.1 Funkcjonalności w Zakresie Testów

*   **Moduł Autentykacji Użytkowników:**
    *   Rejestracja nowych użytkowników.
    *   Logowanie i wylogowywanie.
    *   Zarządzanie sesją użytkownika.
    *   Ochrona tras wymagających zalogowania.
*   **Zarządzanie Fiszkami (CRUD):**
    *   Ręczne tworzenie, odczytywanie, aktualizacja i usuwanie fiszek.
    *   Walidacja pól formularzy (długość tekstu, wymagane pola).
    *   Filtrowanie listy fiszek po statusie i przynależności do talii.
    *   Paginacja listy fiszek.
*   **Zarządzanie Taliami (CRUD):**
    *   Tworzenie i usuwanie talii.
    *   Przypisywanie fiszek do talii.
*   **Generator Fiszek AI:**
    *   Generowanie sugestii fiszek na podstawie wklejonego tekstu.
    *   Walidacja danych wejściowych (minimalna i maksymalna długość tekstu).
    *   Interakcja z wygenerowanymi sugestiami (akceptacja, odrzucenie, edycja).
    *   Zapisywanie zaakceptowanych fiszek w nowo utworzonej talii.
*   **Interfejs Użytkownika (UI/UX):**
    *   Poprawność wyświetlania i responsywność kluczowych komponentów.
    *   Obsługa stanów (ładowanie, błąd, brak danych).
    *   Działanie animacji `View Transitions`.
    *   System powiadomień (toasty).

### 2.2 Funkcjonalności Poza Zakresem Testów

*   Testy obciążeniowe i stress-testy (poza podstawowymi testami wydajności).
*   Testy samego API Supabase oraz OpenRouter.ai (testujemy jedynie integrację z nimi).
*   Zaawansowane testy algorytmu "spaced repetition" (w fazie MVP polegamy na jego podstawowej integracji).
*   Testy na niszowych lub przestarzałych przeglądarkach.

## 3. Typy Testów

W ramach projektu przeprowadzone zostaną następujące rodzaje testów:

*   **Testy Jednostkowe (Unit Tests):**
    *   **Cel:** Weryfikacja małych, izolowanych fragmentów kodu (np. funkcje pomocnicze, proste komponenty UI).
    *   **Obszar:** Logika w customowych hookach Reacta (np. `useFlashcards` z mockowanymi serwisami), funkcje w `lib/utils.ts`.

*   **Testy Integracyjne (Integration Tests):**
    *   **Cel:** Weryfikacja współpracy pomiędzy różnymi modułami aplikacji.
    *   **Obszar:**
        *   Komponenty React wraz z ich hookami i wywołaniami API (mockowane API).
        *   Warstwa serwisowa (`flashcard.service.ts`, `deck.service.ts`) w połączeniu z mockowaną instancją klienta Supabase.
        *   Endpointy API Astro weryfikujące logikę biznesową i interakcję z serwisami.

*   **Testy End-to-End (E2E):**
    *   **Cel:** Symulacja pełnych scenariuszy użytkownika w środowisku zbliżonym do produkcyjnego.
    *   **Obszar:** Kompletne przepływy, np. "Rejestracja -> Logowanie -> Wygenerowanie fiszek AI -> Zapisanie fiszek -> Edycja fiszki -> Wylogowanie".

*   **Testy API (Manualne i Automatyczne):**
    *   **Cel:** Weryfikacja poprawności działania, walidacji i bezpieczeństwa endpointów API.
    *   **Obszar:** Wszystkie endpointy w `src/pages/api/`. Testy będą przeprowadzane za pomocą narzędzi (np. Postman) oraz w ramach testów E2E.

*   **Testy Bezpieczeństwa:**
    *   **Cel:** Weryfikacja mechanizmów autoryzacji i izolacji danych.
    *   **Obszar:** Sprawdzenie polityk RLS (Row Level Security) w Supabase poprzez próby dostępu do danych innego użytkownika.

*   **Testy Kompatybilności (Cross-Browser):**
    *   **Cel:** Zapewnienie spójnego działania i wyglądu aplikacji w różnych przeglądarkach.
    *   **Obszar:** Manualne testy kluczowych funkcjonalności na najnowszych wersjach Chrome, Firefox i Safari.

*   **Testy Manualne i Eksploracyjne:**
    *   **Cel:** Wykrywanie nieoczywistych błędów i ocena ogólnego UX.
    *   **Obszar:** Cała aplikacja, ze szczególnym uwzględnieniem płynności interfejsu i działania animacji `View Transitions`.

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

Poniżej przedstawiono przykładowe, wysokopoziomowe scenariusze testowe.

| ID | Funkcjonalność | Scenariusz | Oczekiwany Rezultat | Priorytet |
|---|---|---|---|---|
| **AUTH-01** | Autentykacja | Pomyślna rejestracja nowego użytkownika. | Użytkownik zostaje utworzony, automatycznie zalogowany i przekierowany na stronę główną. | **Krytyczny** |
| **AUTH-02** | Autentykacja | Próba rejestracji z zajętym adresem e-mail. | Wyświetlony zostaje komunikat o błędzie informujący, że e-mail jest już w użyciu. | **Wysoki** |
| **AUTH-03** | Autentykacja | Pomyślne logowanie istniejącego użytkownika. | Użytkownik zostaje zalogowany, a UI (np. menu) aktualizuje się, pokazując stan zalogowania. | **Krytyczny** |
| **AUTH-04** | Autentykacja | Próba dostępu do chronionej strony (`/flashcards`) bez zalogowania. | Użytkownik zostaje przekierowany na stronę logowania (`/login`). | **Krytyczny** |
| **DECK-01** | Zarządzanie Talią | Użytkownik tworzy nową talię. | Talia pojawia się na liście wyboru talii. | **Wysoki** |
| **DECK-02** | Zarządzanie Talią | Użytkownik usuwa talię z przypisanymi fiszkami. | Talia zostaje usunięta. Fiszki, które do niej należały, mają `deck_id` ustawione na `NULL`. | **Wysoki** |
| **CARD-01** | Zarządzanie Fiszkami | Użytkownik ręcznie tworzy nową fiszkę i przypisuje ją do talii. | Fiszka jest widoczna na liście po wybraniu odpowiedniego filtra talii. | **Krytyczny** |
| **CARD-02** | Zarządzanie Fiszkami | Użytkownik edytuje treść i status istniejącej fiszki. | Zmiany są widoczne na liście fiszek. | **Wysoki** |
| **CARD-03** | Zarządzanie Fiszkami | Użytkownik usuwa fiszkę. | Fiszka znika z listy. | **Wysoki** |
| **CARD-04** | Zarządzanie Fiszkami | Użytkownik filtruje fiszki po statusie "zatwierdzona". | Na liście widoczne są tylko fiszki z tym statusem. | **Średni** |
| **GEN-01** | Generator AI | Użytkownik wkleja tekst (1000-10000 znaków) i klika "Generuj". | Po chwili ładowania wyświetla się lista sugestii fiszek. Powstaje nowa talia. | **Krytyczny** |
| **GEN-02** | Generator AI | Próba generowania z tekstem < 1000 znaków. | Przycisk "Generuj" jest nieaktywny lub wyświetlany jest błąd walidacji. | **Wysoki** |
| **GEN-03** | Generator AI | Użytkownik akceptuje kilka sugestii, a następnie klika "Zapisz". | Zaakceptowane fiszki zostają zapisane w bazie danych i przypisane do nowo utworzonej talii. Użytkownik zostaje poinformowany o sukcesie. | **Krytyczny** |
| **GEN-04** | Generator AI | Występuje błąd podczas komunikacji z API OpenRouter. | Użytkownik widzi czytelny komunikat o błędzie. | **Wysoki** |
| **SEC-01** | Bezpieczeństwo | Użytkownik A próbuje uzyskać dostęp do talii użytkownika B przez bezpośredni URL lub żądanie API. | Żądanie zostaje odrzucone z błędem 403/404 (Forbidden/Not Found). | **Krytyczny** |

## 5. Środowisko Testowe

*   **Środowisko lokalne:** Programiści i testerzy uruchamiają aplikację lokalnie, korzystając z lokalnej instancji Supabase (`supabase start`) w celu przeprowadzenia testów jednostkowych i integracyjnych. Wymagana wersja Node.js: `22.14.0`.
*   **Środowisko CI/CD (Github Actions):** Zautomatyzowane testy jednostkowe i integracyjne będą uruchamiane dla każdego pusha do repozytorium w izolowanym kontenerze Docker.
*   **Środowisko Staging:** Dedykowana, odizolowana instancja aplikacji wdrożona na platformie hostingowej, połączona z osobnym projektem Supabase. Na tym środowisku będą przeprowadzane testy E2E oraz testy manualne. Klucze API dla usług zewnętrznych będą skonfigurowane dla tego środowiska.

## 6. Narzędzia do Testowania

| Typ testu | Narzędzie | Uzasadnienie |
|---|---|---|
| **Testy jednostkowe i integracyjne** | **Vitest** + **React Testing Library** | Popularny i dobrze wspierany standard do testowania aplikacji React, idealny do testowania komponentów i hooków. |
| **Testy End-to-End (E2E)** | **Playwright** | Nowoczesne i potężne narzędzie oferujące szybkie i stabilne testy na różnych przeglądarkach, z doskonałym wsparciem dla testowania API. |
| **Testy manualne API** | **Postman / Insomnia** | Umożliwiają szybkie prototypowanie i weryfikację endpointów API niezależnie od UI (zgodnie z `curl-tests/*.md`). |
| **CI/CD** | **Github Actions** | Zintegrowane z repozytorium, umożliwia pełną automatyzację procesu testowania. |
| **Linting i formatowanie** | **ESLint** i **Prettier** | Zapewniają spójność i jakość kodu, co jest formą statycznego testowania. |

## 7. Harmonogram Testów

Proces testowy będzie prowadzony w sposób ciągły, równolegle z procesem deweloperskim.
*   **Testy jednostkowe i integracyjne:** Pisane przez deweloperów w trakcie implementacji nowych funkcjonalności.
*   **Testy E2E:** Rozwijane przez zespół QA równolegle z developmentem. Uruchamiane w całości co najmniej raz dziennie na środowisku Staging.
*   **Testy manualne/eksploracyjne:** Przeprowadzane po wdrożeniu większych funkcjonalności na środowisko Staging.
*   **Pełna regresja:** Przed każdym planowanym wdrożeniem produkcyjnym zostanie przeprowadzona pełna regresja (automatyczna i manualna).

## 8. Kryteria Akceptacji Testów

### 8.1 Kryteria Wejścia

*   Kod źródłowy został zintegrowany z główną gałęzią deweloperską.
*   Build aplikacji w CI zakończył się sukcesem.
*   Wszystkie testy jednostkowe i podstawowe testy integracyjne przechodzą pomyślnie.

### 8.2 Kryteria Wyjścia (Zakończenia Testów)

*   Co najmniej 95% scenariuszy testowych o priorytecie **Krytycznym** i **Wysokim** kończy się sukcesem.
*   Brak otwartych błędów o statusie `Blocker` lub `Critical`.
*   Pokrycie kodu testami jednostkowymi i integracyjnymi dla kluczowych serwisów (`*.service.ts`) przekracza 80%.
*   Wszystkie zidentyfikowane problemy z bezpieczeństwem zostały rozwiązane.

## 9. Role i Odpowiedzialności

*   **Deweloperzy:**
    *   Implementacja testów jednostkowych i integracyjnych dla tworzonego kodu.
    *   Naprawa błędów zgłoszonych przez zespół QA.
    *   Utrzymanie jakości kodu zgodnie ze standardami projektu (ESLint, Prettier).
*   **Inżynier QA:**
    *   Projektowanie i utrzymanie planu testów.
    *   Tworzenie i utrzymanie automatycznych testów E2E i API.
    *   Wykonywanie testów manualnych i eksploracyjnych.
    *   Zarządzanie cyklem życia błędów (raportowanie, weryfikacja poprawek).
*   **Product Owner:**
    *   Dostarczanie kryteriów akceptacji dla historyjek użytkownika.
    *   Priorytetyzacja naprawy zgłoszonych błędów.
    *   Finalna akceptacja funkcjonalności.

## 10. Procedury Raportowania Błędów

Wszystkie wykryte błędy będą raportowane w systemie do zarządzania projektami (np. Github Issues, Jira).

### 10.1 Format Zgłoszenia Błędu

Każde zgłoszenie powinno zawierać:
*   **Tytuł:** Zwięzły i jednoznaczny opis problemu.
*   **Środowisko:** Gdzie błąd wystąpił (np. Lokalne, Staging, przeglądarka i jej wersja).
*   **Kroki do odtworzenia:** Numerowana lista kroków potrzebnych do wywołania błędu.
*   **Oczekiwany rezultat:** Co powinno się wydarzyć.
*   **Rzeczywisty rezultat:** Co faktycznie się wydarzyło.
*   **Priorytet/Waga (Severity):**
    *   **Blocker:** Uniemożliwia dalsze testowanie kluczowej funkcjonalności.
    *   **Critical:** Błąd w kluczowej funkcjonalności, który uniemożliwia jej użycie.
    *   **Major:** Poważny błąd, który znacznie utrudnia korzystanie z aplikacji.
    *   **Minor:** Błąd o niewielkim wpływie na działanie, np. błąd w UI.
*   **Załączniki:** Zrzuty ekranu, nagrania wideo, logi z konsoli.

### 10.2 Cykl Życia Błędu

1.  **New:** Zgłoszony błąd oczekuje na analizę.
2.  **In Progress:** Deweloper pracuje nad naprawą.
3.  **Ready for Retest:** Błąd został naprawiony i wdrożony na środowisko Staging.
4.  **Closed:** QA potwierdziło, że błąd został poprawnie naprawiony.
5.  **Reopened:** Poprawka nie zadziałała lub wprowadziła regresję; błąd wraca do `In Progress`.