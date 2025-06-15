# OpenRouter Service

Serwis do integracji z API OpenRouter, umożliwiający komunikację z różnymi modelami LLM poprzez ujednolicone API.

## Instalacja

Serwis jest częścią projektu i nie wymaga dodatkowej instalacji. Wymagane zależności:
- TypeScript 5+
- Zod (walidacja danych)
- Fetch API (dostępne natywnie w nowoczesnych środowiskach)

## Konfiguracja

Aby rozpocząć korzystanie z serwisu, należy utworzyć nową instancję z odpowiednią konfiguracją:

```typescript
import { OpenRouterService, type OpenRouterConfig } from './openrouter-service';

const config: OpenRouterConfig = {
  apiKey: 'your-api-key',
  endpoint: 'https://api.openrouter.com/api/v1/chat/completions',
  modelName: 'gpt-4',
  modelParams: {
    temperature: 0.7,
    max_tokens: 150
  },
  systemMessage: 'Jesteś pomocnym asystentem.',
  responseFormat: {
    type: 'json_schema',
    json_schema: {
      name: 'chatResponse',
      strict: true,
      schema: {
        answer: 'string',
        source: 'string'
      }
    }
  }
};

const service = new OpenRouterService(config);
```

### Parametry konfiguracji

| Parametr | Typ | Opis |
|----------|-----|------|
| `apiKey` | `string` | Klucz API do autoryzacji z OpenRouter |
| `endpoint` | `string` | URL endpointu API OpenRouter |
| `modelName` | `string` | Nazwa modelu do użycia (np. 'gpt-4') |
| `modelParams` | `object` | Parametry kontrolujące zachowanie modelu |
| `systemMessage` | `string` | Komunikat systemowy definiujący kontekst |
| `responseFormat` | `object` | Format odpowiedzi w postaci JSON schema |

## Użycie

### Wysyłanie wiadomości

```typescript
try {
  const response = await service.sendChatMessage("Jaka jest stolica Polski?");
  console.log(response.answer); // Odpowiedź modelu
  console.log(response.source); // Źródło informacji
} catch (error) {
  if (error instanceof OpenRouterError) {
    console.error(`Błąd: ${error.message} (kod: ${error.code})`);
  }
}
```

### Obsługa błędów

Serwis definiuje następujące typy błędów:

- `OpenRouterError` - bazowa klasa dla wszystkich błędów
- `ValidationError` - błąd walidacji danych
- `ApiError` - błąd komunikacji z API

Przykład obsługi różnych typów błędów:

```typescript
try {
  const response = await service.sendChatMessage("...");
} catch (error) {
  if (error instanceof ValidationError) {
    // Błąd walidacji odpowiedzi
    console.error("Nieprawidłowy format odpowiedzi:", error.message);
  } else if (error instanceof ApiError) {
    // Błąd API
    console.error(`Błąd API (${error.status}):`, error.message);
  } else if (error instanceof OpenRouterError) {
    // Inny błąd serwisu
    console.error(`Błąd serwisu (${error.code}):`, error.message);
  }
}
```

## Limity i ograniczenia

### Rate Limiting

Serwis implementuje wewnętrzny mechanizm rate limitingu:
- Maksymalnie 60 zapytań na minutę
- Automatyczne odrzucanie zapytań przekraczających limit
- Informacja o czasie oczekiwania w przypadku przekroczenia limitu

### Ponowne próby

W przypadku błędów sieciowych lub czasowych problemów z API:
- Maksymalnie 3 próby dla każdego zapytania
- Wykładniczy backoff między próbami (1s, 2s, 4s)
- Brak ponownych prób dla błędów klienta (4xx) i błędów walidacji

## Bezpieczeństwo

- Klucz API jest przechowywany bezpiecznie w konfiguracji
- Wszystkie żądania są wysyłane przez HTTPS
- Walidacja danych wejściowych i wyjściowych za pomocą Zod
- Sanityzacja komunikatów błędów

## Dobre praktyki

1. Zawsze obsługuj błędy używając odpowiednich typów błędów
2. Ustawiaj rozsądne wartości `temperature` i `max_tokens`
3. Używaj jasnych i konkretnych komunikatów systemowych
4. Monitoruj wykorzystanie API i rate limiting
5. Przechowuj klucz API w zmiennych środowiskowych

## Przykłady użycia

### Podstawowe zapytanie

```typescript
const service = new OpenRouterService(config);
const response = await service.sendChatMessage("Jaka jest stolica Polski?");
console.log(response.answer);
```

### Z obsługą rate limitingu

```typescript
try {
  const response = await service.sendChatMessage("...");
} catch (error) {
  if (error instanceof OpenRouterError && error.code === 'RATE_LIMIT') {
    console.log("Przekroczono limit zapytań, proszę spróbować później");
  }
}
```

### Z niestandardowymi parametrami modelu

```typescript
const config: OpenRouterConfig = {
  // ... pozostałe parametry ...
  modelParams: {
    temperature: 0.9,
    max_tokens: 500,
    top_p: 0.8
  }
};
``` 