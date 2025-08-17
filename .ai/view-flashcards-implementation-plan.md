# Plan implementacji widoku Listy Fiszek ("Moje fiszki")

## 1. Przegląd
Widok „Moje fiszki” umożliwia zalogowanemu użytkownikowi przeglądanie, filtrowanie, tworzenie, edytowanie oraz usuwanie własnych fiszek. Integruje się z istniejącymi endpointami REST API oraz zachowuje spójność wizualną/UX całej aplikacji.

## 2. Routing widoku
```
Path: /flashcards
File: src/pages/flashcards.astro (ładuje komponent React)
Prerender: false (widok zależny od sesji użytkownika)
Authentication guard: redirect to /login gdy brak usera w locals
```

## 3. Struktura komponentów
```
FlashcardsPage (Astro)  
└── <FlashcardsView /> (React)
    ├── <FlashcardsToolbar />
    │   ├── <DeckSelect />
    │   ├── <StatusFilter />
    │   └── <Button "Dodaj fiszkę" />
    ├── <Pagination />
    ├── <FlashcardList />
    │   └── <FlashcardItem /> × N
    ├── <Pagination />
    ├── <FlashcardModal />  (add / edit)
    └── <ConfirmDialog />   (delete)
```

## 4. Szczegóły komponentów
### FlashcardsView
- **Opis:** Główny kontener odpowiada za pobieranie danych, trzymanie stanu filtrów/paginacji oraz renderowanie pod-komponentów.
- **Elementy:** `FlashcardsToolbar`, `FlashcardList`, `Pagination`, `FlashcardModal`, `ConfirmDialog`.
- **Interakcje:** zmiana filtrów, paginacja, otwarcie modali, wywołania CRUD.
- **Walidacja:** brak bezpośredniej – delegowana do formularzy.
- **Typy:** `FlashcardsState`, `FlashcardDTO`, `PaginationDTO`, `FlashcardFilters`.
- **Propsy:** brak (renderowany bezpośrednio przez stronę).

### FlashcardsToolbar
- **Opis:** Pasek narzędzi z filtrami i akcją dodania fiszki.
- **Elementy:** select decku (`DeckSelect`), select statusu (`StatusFilter`), przycisk „Dodaj fiszkę”.
- **Interakcje:** `onFiltersChange`, `onAdd`.
- **Walidacja:** poprawne UUID decku, status w dozwolonych wartościach.
- **Typy:** `FlashcardFilters`.
- **Propsy:** `{ filters, onChange(filters), onAdd() }`.

### FlashcardList
- **Opis:** Rendersuje listę wierszy fiszek.
- **Elementy:** tabela lub lista `<FlashcardItem>`.
- **Interakcje:** brak – logika w `FlashcardItem`.
- **Walidacja:** n/a.
- **Typy:** `FlashcardDTO`[]
- **Propsy:** `{ flashcards, onEdit(flashcard), onDelete(flashcard) }`.

### FlashcardItem
- **Opis:** Wiersz z danymi fiszki i przyciskami akcji.
- **Elementy:** tekst przód/tył, badge status, ikony edit/delete.
- **Interakcje:** klik edit -> `onEdit`, klik delete -> `onDelete`.
- **Walidacja:** n/a.
- **Typy:** `FlashcardDTO`.
- **Propsy:** `{ data, onEdit, onDelete }`.

### FlashcardModal
- **Opis:** Modal z formularzem dodawania/edycji fiszki.
- **Elementy:** pola input/textarea dla przód, tył, select status (edycja), przyciski save/cancel.
- **Interakcje:** submit -> `onSubmit`, close -> `onClose`.
- **Walidacja:**
  - `przod` max 200 znaków (required)
  - `tyl` max 500 znaków (required)
  - `status` w `FlashcardStatus` (only in edit)
- **Typy:** `FlashcardFormValues`, `FlashcardCreateInput`, `FlashcardUpdateCommand`.
- **Propsy:** `{ mode: "add" | "edit", initialValues?, onSubmit(values), onClose() }`.

### ConfirmDialog
- **Opis:** Uniwersalne okno potwierdzenia usunięcia.
- **Elementy:** tekst potwierdzenia, przyciski „Usuń”/„Anuluj”.
- **Interakcje:** confirm -> `onConfirm`, cancel -> `onCancel`.
- **Walidacja:** n/a.
- **Typy:** none.
- **Propsy:** `{ open, message, onConfirm, onCancel }`.

### DeckSelect & StatusFilter
- **Opis:** Selecty w toolbarze; `DeckSelect` pobiera listę talich użytkownika.
- **Elementy:** `select`, opcje.
- **Interakcje:** `onChange`.
- **Walidacja:** UUID / status enum.

### Pagination
- **Opis:** Steruje stronicowaniem.
- **Elementy:** przyciski numeryczne/next/prev.
- **Interakcje:** `onPageChange`.
- **Typy:** `PaginationDTO`.
- **Propsy:** `{ pagination, onChange(page) }`.

## 5. Typy
```ts
// już istniejące
FlashcardDTO, FlashcardDetailDTO, FlashcardCreateInput, FlashcardCreateCommand,
FlashcardUpdateCommand, PaginationDTO, DeckDTO

// nowe
export interface FlashcardFilters {
  deckId?: string;      // UUID talii
  status?: FlashcardStatus;
  page: number;
  limit: number;
}

export interface FlashcardsState {
  items: FlashcardDTO[];
  pagination: PaginationDTO;
  loading: boolean;
  error?: string;
  filters: FlashcardFilters;
  selected?: FlashcardDTO; // do edycji/usunięcia
  modalOpen: boolean;
  modalMode: "add" | "edit";
  confirmOpen: boolean;
}

export interface FlashcardFormValues {
  przod: string;
  tyl: string;
  status?: FlashcardStatus; // w trybie edit
}
```

## 6. Zarządzanie stanem
- **React state + custom hook** `useFlashcards` w `src/components/hooks`.
- Hook udostępnia: `state`, `loadFlashcards(filters)`, `createFlashcard(data)`, `updateFlashcard(id, data)`, `deleteFlashcard(id)`.
- Wewnętrznie wywołuje fetch na API, aktualizuje `items` i `pagination`, ustawia `loading`/`error`.
- Context niepotrzebny – stan tylko w obrębie widoku.

## 7. Integracja API
| Akcja | Endpoint | Metoda | Typ żądania | Typ odpowiedzi |
|-------|----------|--------|-------------|----------------|
| Pobierz fiszki | `/api/flashcards` | GET | query `FlashcardFilters` | `{ flashcards: FlashcardDTO[], pagination: PaginationDTO }` |
| Dodaj fiszki | `/api/flashcards` | POST | `FlashcardCreateCommand` | `{ flashcards: FlashcardDTO[] }` |
| Edytuj fiszkę | `/api/flashcards/{id}` | PUT | `FlashcardUpdateCommand` | `FlashcardDetailDTO` |
| Usuń fiszkę | `/api/flashcards/{id}` | DELETE | — | `{ message: string }` |

- Wszystkie żądania muszą zawierać cookies sesyjne Supabase (fetch domyślnie je wyśle w tej samej domenie).
- Błędy HTTP mapowane na user-friendly Toasty (Sonner).

## 8. Interakcje użytkownika
1. Filtrowanie listy → debounce 300 ms → `useFlashcards.loadFlashcards()`.
2. Klik „Dodaj fiszkę” → otwiera `FlashcardModal` w trybie **add**.
3. Submit formularza **add** → POST → reload listy, toast „Dodano fiszkę”.
4. Klik ikony edycji → otwiera `FlashcardModal` w trybie **edit** z danymi.
5. Submit formularza **edit** → PUT → aktualizacja elementu na liście, toast.
6. Klik ikony kosza → `ConfirmDialog` → po potwierdzeniu DELETE → usunięcie z listy, toast.
7. Zmiana strony w `Pagination` → `loadFlashcards` z nowym `page`.

## 9. Warunki i walidacja
- Pola formularza walidowane z wykorzystaniem `zod` + `react-hook-form`.
- `przod`: required, ≤200 znaków.
- `tyl`: required, ≤500 znaków.
- `status`: enum, tylko w edycji.
- Filtry: UUID decku, status enum.
- Przy błędach walidacji formularz pokazuje komunikaty pod fieldami.

## 10. Obsługa błędów
- `try/catch` w hookach; dla HTTP status ≥400 wyświetlany toast z treścią błędu.
- 401 → redirect do `/login` (middleware globalny już to robi).
- 404 podczas edycji/usuwania → toast „Fiszka nie istnieje” + odświeżenie listy.
- Timeout/Network → toast „Brak połączenia”.

## 11. Kroki implementacji
1. **Routing:** utworzyć `src/pages/flashcards.astro` z ochroną autoryzacji.
2. **Hook:** zaimplementować `useFlashcards` (fetch, CRUD, state management).
3. **Toolbar:** stworzyć `FlashcardsToolbar` z `DeckSelect` & `StatusFilter`.
4. **Lista:** zaimplementować `FlashcardList` i `FlashcardItem` (Shadcn `card` / tabela).
5. **Modal:** wykorzystując `Dialog` z Shadcn ‑ `FlashcardModal` z `react-hook-form` + `zod`.
6. **ConfirmDialog:** na bazie Shadcn `AlertDialog`.
7. **Pagination:** prosty komponent lub biblioteka.
8. **Integracja:** podłączyć hook do widoku, ustawić initial load.
9. **UX:** dodać skeleton loaders (`<Skeleton />`) przy `loading`.
10. **Toasty:** sukces/blad w hookach (`sonner`).
11. **Testy manualne:** scenariusze CRUD + filtry + paginacja.
12. **Dostępność:** role ARIA, focus trap w modalu, keyboard nav.
13. **Dokumentacja:** uzupełnić README + storybook (opcjonalnie).
