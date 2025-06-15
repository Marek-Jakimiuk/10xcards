# API Endpoint Implementation Plan: Decks API

## 1. Przegląd punktu końcowego
Zestaw endpointów REST API do zarządzania talią kart (decks) w aplikacji 10x-cards. Umożliwia tworzenie, odczytywanie, aktualizowanie i usuwanie talii kart, z uwzględnieniem powiązań z fiszkami i zachowaniem izolacji danych między użytkownikami.

## 2. Szczegóły żądania

### 2.1 List Decks
- Metoda: GET
- URL: `/api/decks`
- Headers: 
  - Authorization: Bearer {token}
- Query Params: Brak
- Body: Brak

### 2.2 Create Deck
- Metoda: POST
- URL: `/api/decks`
- Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- Body:
```typescript
{
  name: string;      // required
  description?: string;  // optional
}
```

### 2.3 Get Deck
- Metoda: GET
- URL: `/api/decks/{id}`
- Headers:
  - Authorization: Bearer {token}
- Path Params:
  - id: UUID (required)

### 2.4 Update Deck
- Metoda: PUT
- URL: `/api/decks/{id}`
- Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- Path Params:
  - id: UUID (required)
- Body:
```typescript
{
  name: string;      // required
  description?: string;  // optional
}
```

### 2.5 Delete Deck
- Metoda: DELETE
- URL: `/api/decks/{id}`
- Headers:
  - Authorization: Bearer {token}
- Path Params:
  - id: UUID (required)

## 3. Wykorzystywane typy

```typescript
// src/types.ts
type DeckDTO = Pick<DeckRow, 'id' | 'name' | 'description'>;

interface DeckCreateCommand {
  name: string;
  description: string;
}

interface DeckUpdateCommand {
  name: string;
  description: string;
}

interface DeckWithFlashcardsDTO extends DeckDTO {
  flashcards?: FlashcardListDTO[];
}
```

## 4. Szczegóły odpowiedzi

### 4.1 List Decks
- Status: 200
- Body:
```typescript
{
  decks: DeckDTO[]
}
```

### 4.2 Create Deck
- Status: 201
- Body: `DeckDTO`

### 4.3 Get Deck
- Status: 200
- Body: `DeckWithFlashcardsDTO`

### 4.4 Update Deck
- Status: 200
- Body: `DeckDTO`

### 4.5 Delete Deck
- Status: 200
- Body: 
```typescript
{
  message: string;
  id: string;
}
```

## 5. Przepływ danych

### Service Layer
```typescript
// src/lib/services/deck.service.ts
export class DeckService {
  constructor(private supabase: SupabaseClient) {}

  async listDecks(userId: string): Promise<DeckDTO[]>;
  async createDeck(userId: string, command: DeckCreateCommand): Promise<DeckDTO>;
  async getDeck(userId: string, deckId: string): Promise<DeckWithFlashcardsDTO>;
  async updateDeck(userId: string, deckId: string, command: DeckUpdateCommand): Promise<DeckDTO>;
  async deleteDeck(userId: string, deckId: string): Promise<void>;
}
```

### Endpoint Implementation
```typescript
// src/pages/api/decks/[...].ts
export const GET: APIRoute = async ({ locals, params }) => {
  const { supabase, user } = locals;
  const deckService = new DeckService(supabase);
  
  try {
    const decks = await deckService.listDecks(user.id);
    return json({ decks });
  } catch (error) {
    return handleError(error);
  }
};
```

## 6. Względy bezpieczeństwa

### Uwierzytelnianie i Autoryzacja
1. Middleware sprawdza token JWT w każdym żądaniu
2. RLS policies w Supabase:
```sql
CREATE POLICY "Users can only access their own decks"
ON decks
FOR ALL
USING (user_id = auth.uid());
```

### Walidacja danych
1. Zod schema dla walidacji:
```typescript
const DeckCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional()
});
```

### Sanityzacja
1. Escape special characters w name i description
2. Validate UUID format dla deck_id

## 7. Obsługa błędów

### Kody błędów
- 400: Invalid input data
  - Invalid deck name
  - Invalid description length
  - Invalid UUID format
- 401: Unauthorized
  - Missing/invalid JWT token
- 403: Forbidden
  - User doesn't own the deck
- 404: Not Found
  - Deck not found
- 500: Server Error
  - Database errors
  - Unexpected errors

### Error Handler
```typescript
// src/lib/error-handler.ts
export function handleError(error: unknown): Response {
  if (error instanceof ValidationError) {
    return json({ error: error.message }, { status: 400 });
  }
  // ... handle other error types
}
```

## 8. Rozważania dotyczące wydajności

1. Indeksy
```sql
CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_decks_created_at ON decks(created_at);
```

2. Caching
- Implement ETag for GET requests
- Cache deck list responses (short TTL)

3. Query Optimization
- Select only needed columns
- Use efficient joins for flashcard relationships

## 9. Etapy wdrożenia

1. Przygotowanie infrastruktury
   - Utworzenie tabel w Supabase
   - Konfiguracja RLS policies
   - Utworzenie indeksów

2. Implementacja warstwy serwisowej
   - Utworzenie DeckService
   - Implementacja metod CRUD
   - Dodanie walidacji i obsługi błędów

3. Implementacja endpointów
   - Utworzenie plików w src/pages/api/decks
   - Implementacja routingu
   - Integracja z DeckService

4. Dokumentacja
   - API documentation (OpenAPI/Swagger)
   - Implementation details
   - Deployment guide
