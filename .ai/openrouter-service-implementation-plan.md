# OpenRouter Service Implementation Plan

## 1. Opis usługi

Usługa OpenRouter służy do integracji z API OpenRouter w celu wspierania czatów opartych na LLM. Jej zadaniem jest:
- Realizacja wysyłki zapytań do API z odpowiednio sformatowanymi komunikatami.
- Automatyczna obsługa i walidacja odpowiedzi, w tym przetwarzanie ustrukturyzowanych odpowiedzi opartych o JSON schema.
- Zapewnienie elastyczności przy definiowaniu komunikatów systemowych, komunikatów użytkownika, parametrów modelu oraz nazwy modelu.
- Umożliwienie dynamicznej konfiguracji parametrów takich jak temperatura, maksymalna liczba tokenów i inne.

## 2. Opis konstruktora

Konstruktor klasy integrującej z API OpenRouter przyjmuje obiekt konfiguracji, który zawiera:

1. Klucz API oraz endpoint do komunikacji (np. https://api.openrouter.com).
2. Nazwę modelu (np. "gpt-4" lub inna, konfigurowalna wartość).
3. Parametry modelu (np. { temperature: 0.7, max_tokens: 150 }).
4. Domyślny komunikat systemowy, definiujący kontekst działania (np. "Jesteś pomocnym asystentem.").
5. Response format używany do walidacji odpowiedzi, np.
   ```
   { type: 'json_schema', json_schema: { name: 'chatResponse', strict: true, schema: { answer: 'string', source: 'string' } } }
   ```

Przykładowa konfiguracja:

```json
{
  "apiKey": "YOUR_API_KEY",
  "endpoint": "https://api.openrouter.com",
  "modelName": "gpt-4",
  "modelParams": { "temperature": 0.7, "max_tokens": 150 },
  "systemMessage": "Jesteś pomocnym asystentem.",
  "responseFormat": { "type": "json_schema", "json_schema": { "name": "chatResponse", "strict": true, "schema": { "answer": "string", "source": "string" } } }
}
```

## 3. Publiczne metody i pola

- `sendChatMessage(userMessage: string): Promise<ChatResponse>`
  - Metoda wysyła zapytanie do API OpenRouter, łącząc komunikat systemowy oraz komunikat użytkownika, a następnie waliduje odpowiedź zgodnie z ustalonym `responseFormat`.

- Pola publiczne:
  1. `modelName`: Konfigurowalna nazwa modelu wykorzystywanego przez API.
  2. `modelParams`: Obiekt zawierający parametry modelu (np. temperatura, maksymalna liczba tokenów).
  3. `responseFormat`: Schemat odpowiedzi używany do weryfikacji struktury odpowiedzi z API.
  4. `systemMessage`: Domyślny komunikat systemowy wykorzystywany przy każdym żądaniu.

## 4. Prywatne metody i pola

- Prywatne metody:
  1. `formatPayload(userMessage: string): Payload`
     - Łączy komunikat systemowy i komunikat użytkownika, tworząc obiekt payload zgodny z wymaganiami API.
  2. `validateResponse(response: any): ChatResponse`
     - Waliduje otrzymaną odpowiedź względem zdefiniowanego `responseFormat` i przekształca ją do wewnętrznej struktury.
  3. `handleError(error: any): void`
     - Centralny mechanizm obsługi błędów, logujący i przekazujący informacje o problemach do systemów monitorujących.

- Prywatne pola:
  1. Instancja klienta HTTP odpowiedzialnego za komunikację z API.
  2. Wewnętrzne zmienne przechowujące konfigurację i ustawienia zapytań.

## 5. Obsługa błędów

Potencjalne scenariusze błędów oraz proponowane rozwiązania:

1. Błąd połączenia (timeout, brak sieci):
   - Implementacja mechanizmu ponawiania zapytań (retry) oraz logowanie błędów.

2. Błąd autoryzacji (np. nieprawidłowy klucz API):
   - Walidacja klucza API podczas inicjalizacji oraz jasny komunikat błędu dla użytkownika.

3. Nieprawidłowa struktura odpowiedzi (naruszenie `responseFormat`):
   - Automatyczna walidacja odpowiedzi przy użyciu JSON schema i rzucenie szczegółowego błędu w przypadku niezgodności.

4. Błąd przetwarzania danych wejściowych:
   - Wczesna walidacja danych wejściowych oraz stosowanie mechanizmu "guard clauses".

## 6. Kwestie bezpieczeństwa

- Przechowywanie kluczy API i danych konfiguracyjnych w bezpiecznych zmiennych środowiskowych.
- Używanie połączeń szyfrowanych (HTTPS) do komunikacji z API.
- Walidacja i sanitizacja danych wejściowych, aby zapobiec atakom (np. injection).
- Wdrożenie mechanizmów limitowania zapytań (rate limiting) dla ochrony przed nadużyciami.
- Regularne monitorowanie logów oraz analiza błędów w celu szybkiej reakcji na incydenty.

## 7. Plan wdrożenia krok po kroku

1. **Konfiguracja środowiska**:
   - Ustawić zmienne środowiskowe (np. API_KEY, API_ENDPOINT, MODEL_NAME).
   - Skonfigurować plik konfiguracyjny z domyślnymi wartościami.

2. **Utworzenie modułu konfiguracji**:
   - Opracować dedykowany moduł zarządzający konfiguracją usługi, umożliwiający łatwą modyfikację ustawień.

3. **Implementacja klienta API**:
   - Stworzyć klasę odpowiedzialną za komunikację z OpenRouter API, wykorzystującą klienta HTTP.
   - Zaimplementować metodę `sendChatMessage`, która łączy komunikaty systemowe, użytkownika, nazwę modelu oraz parametry modelu.

4. **Formatowanie zapytań**:
   - Utworzyć metodę `formatPayload`:
     1. Komunikat systemowy: np. "Jesteś pomocnym asystentem.", predefiniowany kontekst dla usługi.
     2. Komunikat użytkownika: przekazywany jako argument do `sendChatMessage`.
     3. Response format: np. 
        `{ type: 'json_schema', json_schema: { name: 'chatResponse', strict: true, schema: { answer: 'string', source: 'string' } } }`
     4. Nazwa modelu: przykładowo "gpt-4" lub wartość konfigurowalna.
     5. Parametry modelu: przykładowo `{ temperature: 0.7, max_tokens: 150 }`.

5. **Implementacja walidacji odpowiedzi**:
   - Stworzyć metodę `validateResponse`, która zweryfikuje strukturę odpowiedzi zgodnie z ustalonym schematem (responseFormat).

6. **Implementacja centralnej obsługi błędów**:
   - Zaimplementować metodę `handleError` do logowania i obsługi wszelkich błędów powstałych podczas komunikacji z API.
   - Wdrożyć mechanizmy ponawiania zapytań w przypadku błędów połączeniowych.

7. **Weryfikacja bezpieczeństwa**:
   - Zapewnić poprawną walidację i sanitizację danych wejściowych.
