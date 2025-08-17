/* Dodanie ostatecznej architektury UI w formacie Markdown */
# Architektura UI dla 10x-cards

## 1. Przegląd struktury UI

Aplikacja 10x-cards składa się z kilku głównych widoków, które wspólnie tworzą spójną i responsywną strukturę interfejsu użytkownika. Interfejs opiera się na komponentach Shadcn/ui, React Hookach oraz React Context dla zarządzania stanem. Główne widoki są projektowane z myślą o intuicyjnej nawigacji i szybkim przepływie informacji, z uwzględnieniem komunikatów o błędach inline oraz popup alertów widocznych przez 5 sekund.

## 2. Lista widoków

### Widok Autoryzacji (Logowanie/Rejestracja)
- **Ścieżka widoku:** `/login` i `/register`
- **Główny cel:** Umożliwienie użytkownikowi logowania i rejestracji.
- **Kluczowe informacje:** Formularze logowania i rejestracji z polami email i hasło, walidacja pól, komunikaty o błędach widoczne w formularzu.
- **Kluczowe komponenty:** `AuthForm`, pola input, przyciski, inline error feedback, popup alert (Shadcn/ui).
- **UX, dostępność i bezpieczeństwo:** Prosty formularz, Dostępne etykiety, kontrast kolorów, zabezpieczenie wejścia przez podstawowe mechanizmy walidacji.

### Dashboard
- **Ścieżka widoku:** `/dashboard`
- **Główny cel:** Zapewnienie użytkownikowi przeglądu najważniejszych funkcji aplikacji i szybkiego dostępu do generowania oraz zarządzania fiszkami.
- **Kluczowe informacje:** Podsumowanie ostatnich operacji, skróty do generowania fiszek, przejście do panelu użytkownika i sesji powtórzeniowych.
- **Kluczowe komponenty:** `SummaryCard`, `NavigationBar`, statystyki, alerty.
- **UX, dostępność i bezpieczeństwo:** Jasna hierarchia informacji, responsywność, czytelne komunikaty.

### Widok Generowania Fiszek
- **Ścieżka widoku:** `/generator`
- **Główny cel:** Umożliwienie użytkownikowi wprowadzenia tekstu, wysłania go do API (usługa Openrouter) oraz otrzymania propozycji fiszek.
- **Kluczowe informacje:** Pole tekstowe (textarea) dla wejściowego tekstu (1000-10000 znaków), przycisk "Generuj fiszki", lista sugerowanych fiszek z możliwymi akcjami (akceptacja, edycja, odrzucenie).
- **Kluczowe komponenty:** `FlashcardGenerator`, `FlashcardItem`, przyciski akcji, loading indicator, inline error messages. Wskaźnik ładowania (skeleton), komunikaty o błędach.
- **UX, dostępność i bezpieczeństwo:** Walidacja długości tekstu, responsywny design, komunikaty o błędach, łatwa edycja fiszek, przyjazny interfejs. 

### Widok Listy Fiszek (Moje fiszki)
- **Ścieżka widoku:** `/flashcards`
- **Główny cel:** Prezentacja zapisanych fiszek (zarówno ręcznie utworzonych, jak i zatwierdzonych, generowanych przez AI) z możliwością edycji i usuwania.
- **Kluczowe informacje:** Lista fiszek z danymi (przód, tył, status), możliwość filtrowania (opcjonalnie według stanu lub talii), interaktywne elementy edycji w modalu.
- **Kluczowe komponenty:** `FlashcardList`, `FlashcardModal` (do edycji), przyciski usuwania, confirm dialog dla operacji krytycznych.
- **UX, dostępność i bezpieczeństwo:** Łatwy dostęp do funkcji modyfikacji, potwierdzanie operacji usunięcia, czytelność informacji, zgodność z wytycznymi WCAG.

### Panel Użytkownika
- **Ścieżka widoku:** `/user`
- **Główny cel:** Umożliwienie użytkownikowi zarządzania profilem, ustawieniami konta oraz przeglądania historii aktywności.
- **Kluczowe informacje:** Dane użytkownika, opcje edycji profilu, ustawienia powiadomień, historia operacji.
- **Kluczowe komponenty:** `UserProfile`, formularze edycji, przyciski zapisu, alerty.
- **UX, dostępność i bezpieczeństwo:** Ochrona danych użytkownika, czytelne formularze, komunikaty walidacyjne i bezpieczeństwa.

### Widok Sesji Powtórzeniowych
- **Ścieżka widoku:** `/study-session`
- **Główny cel:** Prowadzenie sesji nauki opartej na algorytmie powtórek, umożliwiającej efektywne przeglądanie fiszek według zasad spaced repetition.
- **Kluczowe informacje:** Wyświetlanie fiszek jedna po drugiej, przyciski do oceny zrozumienia fiszki, podsumowanie sesji.
- **Kluczowe komponenty:** `StudySession`, komponent do prezentacji fiszki, kontrolki oceny, wskaźnik postępu.
- **UX, dostępność i bezpieczeństwo:** Intuicyjny przepływ sesji, natychmiastowy feedback, czytelność oraz możliwość łatwego poruszania się między fiszkami.

## 3. Mapa podróży użytkownika

1. Użytkownik wchodzi na stronę i trafia do widoku autoryzacji (`/auth`).
2. Po logowaniu/rejestracji następuje przekierowanie do Dashboardu (`/dashboard`), gdzie widoczny jest skrót do funkcjonalności aplikacji.
3. Użytkownik wybiera widok generowania fiszek (`/generator`), wprowadza tekst i wysyła żądanie do API generującego fiszki.
4. Otrzymane propozycje fiszek są prezentowane w interaktywnym widoku. Użytkownik może zaakceptować, edytować lub odrzucić poszczególne fiszki.
5. Po wyborze i ewentualnej edycji, użytkownik zapisuje zatwierdzone fiszki, co powoduje ich zapis w bazie danych za pomocą odpowiednich endpointów API.
6. Użytkownik przechodzi do widoku listy fiszek (`/flashcards`), gdzie może dodatkowo zarządzać istniejącymi fiszkami poprzez edycję w modalach lub usuwanie.
7. Dodatkowo użytkownik ma możliwość przejścia do sesji powtórzeniowych (`/study-session`), gdzie na podstawie algorytmu spaced repetition rozpoczyna naukę.
8. W każdej części interfejsu dostępne są opcje nawigacji oraz panel użytkownika (`/user`), umożliwiający modyfikację ustawień konta.

## 4. Układ i struktura nawigacji

- **Globalna nawigacja:** Umieszczona na górze ekranu (NavigationBar). Zawiera linki do głównych widoków: Generowanie fiszek, Moje fiszki, Sesja nauki, Panel użytkownika oraz opcję wylogowania.
- **Menu mobilne:** Dla urządzeń mobilnych nawigacja zmienia się w hamburger menu, zapewniając wszystkie kluczowe elementy dotykowe.
- **Kontekstowa nawigacja:** W obrębie poszczególnych widoków mogą występować dodatkowe przyciski umożliwiające powrót do poprzednich ekranów lub dostęp do pomocy.
- **Feedback użytkownika:** Komunikaty o błędach i potwierdzenia operacji są wyświetlane inline oraz w postaci popup alertów (widoczne przez 5 sekund), przy użyciu komponentów Shadcn/ui.
- **Przepływ:** Nawigacja umozliwia bezproblemowe przechodzenie miedzy widokami, zachowujac kontekts uzytkownika i jego dane sesyjne.

## 5. Kluczowe komponenty

- **AuthForm:** Formularz logowania i rejestracji z walidacją oraz obsługą błędów.
- **NavigationBar:** Pasek nawigacyjny dostępny globalnie, adaptujący się do rozmiaru ekranu.
- **FlashcardGenerator:** Komponent umożliwiający wprowadzenie tekstu i wywołanie API do generowania fiszek.
- **FlashcardList:** Lista prezentująca zapisane fiszki z opcjami edycji i usuwania.
- **FlashcardModal:** Modal do edycji szczegółów fiszki z potwierdzeniem zmian.
- **StudySession:** Komponent zarządzający logiką sesji nauki, prezentacją fiszek oraz oceną przyswajania.
- **UserProfile:** Panel użytkownika do zarządzania danymi konta i ustawieniami.
- **Alert/Popup:** Komponent do prezentacji komunikatów błędów oraz potwierdzeń działań, widoczny przez określony czas.

Ta architektura UI zapewnia spójny, dostępny i intuicyjny interfejs, który odpowiada na wymagania produktu, integruje się z założonym planem API i uwzględnia wszystkie kluczowe interakcje użytkownika oraz bezpieczeństwo danych. 