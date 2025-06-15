# Plan Implementacji Endpointu API: API Fiszek

## 1. Przegląd Endpointu
API Fiszek zapewnia kompletny zestaw operacji CRUD do zarządzania fiszkami, włącznie z generowaniem fiszek wspomaganym przez AI. Obsługuje paginację, filtrowanie i utrzymuje kompleksowy rejestr audytu wszystkich operacji.

## 2. Szczegóły Żądań

### Lista Fiszek
- Metoda: GET
- URL: `/api/flashcards`
- Parametry Zapytania:
  - Opcjonalne: page (domyślnie: 1)
  - Opcjonalne: limit (domyślnie: 20)
  - Opcjonalne: deckId (UUID)
  - Opcjonalne: status (FlashcardStatus)
- Uwierzytelnianie: Wymagane (sesja Supabase)

### Pojedyncza Fiszka
- Metoda: GET
- URL: `/api/flashcards/{id}`
- Parametry Ścieżki:
  - Wymagane: id (UUID)
- Uwierzytelnianie: Wymagane (sesja Supabase)

### Tworzenie Fiszek
- Metoda: POST
- URL: `/api/flashcards`
- Treść Żądania: FlashcardCreateCommand
- Uwierzytelnianie: Wymagane (sesja Supabase)

### Aktualizacja Fiszki
- Metoda: PUT
- URL: `/api/flashcards/{id}`
- Parametry Ścieżki:
  - Wymagane: id (UUID)
- Treść Żądania: FlashcardUpdateCommand
- Uwierzytelnianie: Wymagane (sesja Supabase)

### Usuwanie Fiszki
- Metoda: DELETE
- URL: `/api/flashcards/{id}`
- Parametry Ścieżki:
  - Wymagane: id (UUID)
- Uwierzytelnianie: Wymagane (sesja Supabase)

### Generowanie Fiszek
- Metoda: POST
- URL: `/api/flashcards/generate`
- Treść Żądania: FlashcardGenerateCommand
- Uwierzytelnianie: Wymagane (sesja Supabase)

## 3. Używane Typy

### DTOs
```typescript
import {
  FlashcardListDTO,
  FlashcardDetailDTO,
  FlashcardCreateInput,
  FlashcardCreateCommand,
  FlashcardUpdateCommand,
  FlashcardGenerateCommand,
  FlashcardSuggestionDTO,
  FlashcardGenerateResponseDTO,
  PaginationDTO,
  FlashcardListResponseDTO
} from '../types';
```

### Schematy Zod
```typescript
const flashcardCreateSchema = z.object({
  przod: z.string().max(200),
  tyl: z.string().max(500),
  status: z.enum(['oczekująca', 'zatwierdzona', 'odrzucona'])
});

const flashcardGenerateSchema = z.object({
  text: z.string().min(1000).max(10000)
});

const paginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20)
});
```

## 4. Przepływ Danych

### Lista Fiszek
1. Walidacja parametrów zapytania przy użyciu paginationSchema
2. Pobranie użytkownika z kontekstu Supabase
3. Zapytanie do bazy danych z zastosowanym RLS
4. Transformacja wyników do FlashcardListDTO[]
5. Zwrócenie odpowiedzi z paginacją

### Tworzenie Fiszek
1. Walidacja treści żądania przy użyciu flashcardCreateSchema
2. Pobranie użytkownika z kontekstu Supabase
3. Rozpoczęcie transakcji
4. Wstawienie fiszek
5. Logowanie operacji do fiszki_logs
6. Zatwierdzenie transakcji
7. Zwrócenie utworzonych fiszek

### Generowanie Fiszek
1. Walidacja tekstu wejściowego przy użyciu flashcardGenerateSchema
2. Wywołanie usługi AI do generowania
3. Transformacja odpowiedzi AI do FlashcardSuggestionDTO[]
4. Zwrócenie sugestii

## 5. Aspekty Bezpieczeństwa

### Uwierzytelnianie i Autoryzacja
- Użycie middleware Supabase do walidacji sesji
- Zastosowanie polityk RLS dla dostępu do danych
- Walidacja własności użytkownika przed aktualizacjami/usunięciami

### Walidacja Danych Wejściowych
- Ścisła walidacja schematów przy użyciu Zod
- Sanityzacja wszystkich danych wejściowych
- Walidacja UUID przed zapytaniami do bazy danych

### Ograniczanie Częstotliwości
- Implementacja rate limitingu dla endpointu generowania AI
- Rozważenie rate limitingu dla masowego tworzenia

### Klucze API
- Bezpieczne przechowywanie kluczy API usługi AI
- Regularna rotacja kluczy
- Użycie zmiennych środowiskowych dla wrażliwych danych

## 6. Obsługa Błędów

### Kody Statusu HTTP
- 200: Operacja udana
- 201: Utworzenie udane
- 400: Nieprawidłowe dane wejściowe
  - Nieprawidłowy format UUID
  - Przekroczona długość tekstu
  - Nieprawidłowa wartość statusu
  - Nieprawidłowe parametry paginacji
- 401: Brak autoryzacji
  - Brakująca lub nieprawidłowa sesja
- 404: Zasób nie znaleziony
  - Fiszka nie znaleziona
  - Talia nie znaleziona
- 500: Błąd serwera
  - Błąd bazy danych
  - Błąd usługi AI
  - Nieoczekiwane błędy

### Format Odpowiedzi Błędu
```typescript
interface ErrorResponse {
  error: string;
  details?: {
    field: string;
    message: string;
  }[];
}
```

## 7. Aspekty Wydajnościowe

### Optymalizacja Bazy Danych
- Użycie odpowiednich indeksów (idx_fiszki_user_id, idx_fiszki_deck_id)
- Implementacja paginacji opartej na kursorze dla dużych zbiorów danych
- Użycie transakcji bazodanowych dla operacji masowych

### Strategia Cachowania
- Cachowanie często używanych fiszek
- Cachowanie odpowiedzi usługi AI
- Implementacja ETagów dla endpointów listy

### Optymalizacja Zapytań
- Wybieranie tylko wymaganych pól
- Użycie COUNT(*) z LIMIT dla paginacji
- Optymalizacja operacji JOIN z tabelą decks

## 8. Kroki Implementacji

1. Konfiguracja Struktury Projektu
   ```
   src/
     pages/
       api/
         flashcards/
           index.ts        # GET (lista), POST (tworzenie)
           [id].ts         # GET, PUT, DELETE
           generate.ts     # POST (generowanie AI)
     lib/
       services/
         flashcard.service.ts
         ai.service.ts
       validation/
         flashcard.schema.ts
   ```

2. Utworzenie Podstawowych Serwisów
   - Implementacja FlashcardService dla operacji CRUD
   - Implementacja AIService dla integracji z OpenRouter.ai
   - Utworzenie schematów walidacji przy użyciu Zod

3. Implementacja Endpointów API
   - Utworzenie obsługi tras w api/flashcards/
   - Implementacja middleware dla uwierzytelniania
   - Dodanie walidacji danych wejściowych
   - Dodanie obsługi błędów

4. Dodanie Logowania i Monitorowania
   - Implementacja logowania operacji do fiszki_logs
   - Dodanie monitorowania wydajności
   - Konfiguracja śledzenia błędów

5. Implementacja Zabezpieczeń
   - Konfiguracja polityk RLS
   - Implementacja rate limitingu
   - Konfiguracja rotacji kluczy API

6. Dokumentacja
   - Dokumentacja API
   - Specyfikacje Swagger/OpenAPI
   - Dokumentacja wewnętrzna
