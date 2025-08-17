# API Endpoint Implementation Plan: Generate Flashcards via AI

## 1. Przegląd punktu końcowego
Celem tego punktu końcowego jest umożliwienie generowania fiszek przez AI na podstawie dostarczonego bloku tekstu. Endpoint przyjmuje tekst o długości od 1000 do 10000 znaków i zwraca listę sugerowanych fiszek, gdzie każda fiszka zawiera pytanie ("przod") oraz odpowiedź ("tyl").

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **URL:** `/api/flashcards/generate`
- **Parametry:**
  - **Wymagane:**
    - `text` (string, długość od 1000 do 10000 znaków)
  - **Opcjonalne:** Brak
- **Request Body:**
```json
{
  "text": "Paste your text here..."
}
```
- **Walidacja:** Sprawdzenie, czy długość tekstu mieści się w zakresie 1000 - 10000 znaków.

## 3. Wykorzystywane typy
- `FlashcardGenerateCommand` – zawiera pole `text`. (Definicja w `src/types.ts`)
- `FlashcardGenerateResponseDTO` – struktura odpowiedzi zawierająca pole `suggestions`.
- `FlashcardSuggestionDTO` – pojedyncza sugestia fiszki, zawierająca pola `przod` oraz `tyl`.

## 4. Szczegóły odpowiedzi
- **Sukces (HTTP 200):**
```json
{
  "suggestions": [
    { "przod": "Question 1?", "tyl": "Answer 1." },
    { "przod": "Question 2?", "tyl": "Answer 2." }
  ]
}
```
- **Błędy:**
  - **HTTP 400:** Nieprawidłowe dane wejściowe (np. tekst o nieprawidłowej długości).
  - **HTTP 401:** Brak autoryzacji.
  - **HTTP 500:** Błąd wewnętrzny serwera lub problemy z komunikacją z zewnętrznym API.

## 5. Przepływ danych
1. Żądanie trafia do endpointu `/api/flashcards/generate`.
2. Middleware sprawdza autoryzację (JWT).
3. Treść żądania jest walidowana pod kątem długości pola `text`.
4. Wywoływana jest logika w warstwie serwisowej (np. `flashcardService`) odpowiedzialna za komunikację z zewnętrznym API LLM.
5. Otrzymane sugestie są mapowane na strukturę `FlashcardSuggestionDTO`.
6. Wynik zostaje zwrócony w formacie JSON jako odpowiedź.

## 6. Względy bezpieczeństwa
- **Autoryzacja:** Endpoint jest chroniony autoryzacją JWT, wymagającą nagłówka `Authorization: Bearer <token>`.
- **Walidacja danych:** Zapewnienie, że pole `text` spełnia wymagania długości oraz zawiera tylko oczekiwane znaki.
- **Rate Limiting:** Rozważenie zastosowania ograniczenia liczby zapytań, aby zapobiec nadużyciom.
- **Sanityzacja:** Wstępna walidacja i sanityzacja danych wejściowych dla minimalizacji ryzyka ataków.

## 7. Obsługa błędów
- **HTTP 400:** Zwracane w przypadku nieprawidłowych danych wejściowych, z odpowiednim komunikatem o błędzie.
- **HTTP 401:** Zwracane, gdy autoryzacja nie powiedzie się.
- **HTTP 500:** Zwracane w przypadku błędów wewnętrznych serwera lub problemów z zewnętrznym API.
- **Logowanie:** Wszystkie błędy, szczególnie te związane z komunikacją z zewnętrznym API, powinny być logowane (np. w tabeli `fiszki_logs`).

## 8. Rozważania dotyczące wydajności
- Walidacja długości tekstu wstępnie eliminuje nieprawidłowe zapytania, zmniejszając obciążenie.
- Użycie asynchronicznej komunikacji z zewnętrznym API LLM, aby nie blokować głównego wątku aplikacji.
- Monitorowanie metryk oraz czasu odpowiedzi, z ewentualnymi optymalizacjami w warstwie serwisowej.
- Rozważenie implementacji cache dla powtarzających się zapytań, jeśli to możliwe.

## 9. Etapy wdrożenia
1. Utworzenie nowego endpointu w katalogu `src/pages/api/flashcards/generate.ts`.
2. Implementacja middleware w celu sprawdzenia autoryzacji (JWT).
3. Implementacja walidacji request body (sprawdzenie długości pola `text`).
4. Stworzenie lub aktualizacja warstwy serwisowej (np. `src/lib/services/flashcardService.ts`) odpowiedzialnej za komunikację z zewnętrznym API LLM.
5. Implementacja logiki mapowania otrzymanych danych na `FlashcardSuggestionDTO`.
6. Dodanie logowania błędów do systemu (np. tabela `fiszki_logs`).
7. Napisanie testów jednostkowych oraz integracyjnych dla endpointu.
8. Code review i wdrożenie. 