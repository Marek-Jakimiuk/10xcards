# Testy API: /api/decks

Poniżej znajdują się przykłady użycia curl do testowania endpointu obsługującego talie (decks) oraz działania serwisu `deck.service.ts`.

## Pobieranie listy talii (GET /api/decks)

Załóżmy, że endpoint akceptuje parametr `userId` jako query param.

Przykład użycia:

```bash
curl -X GET "http://localhost:3000/api/decks?userId=12345" \
  -H "Content-Type: application/json"
```

Oczekiwany wynik: Lista obiektów talii w formacie JSON, np.:

```json
[
    {
        "id": 1,
        "name": "Przykładowa Talia",
        "description": "Opis talii"
    },
    {
        "id": 2,
        "name": "Druga Talia",
        "description": "Drugi opis"
    }
]
```

## Tworzenie nowej talii (POST /api/decks)

Endpoint zakłada, że tworzenie talii odbywa się poprzez przesłanie danych w formacie JSON. Wymagane dane mogą zawierać:
- `userId`: identyfikator użytkownika
- `name`: nazwa talii
- `description`: opis talii

Przykład użycia:

```bash
curl -X POST "http://localhost:3000/api/decks" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "12345",
    "name": "Nowa Talia",
    "description": "Opis nowej talii"
  }'
```

Oczekiwany wynik: Obiekt nowej talii w formacie JSON, np.:

```json
{
    "id": 3,
    "name": "Nowa Talia",
    "description": "Opis nowej talii"
}
```

## Uwagi dotyczące `deck.service.ts`

Plik `deck.service.ts` definiuje dwie główne metody:

- `listDecks(userId)`: Pobiera listę talii dla danego użytkownika.
- `createDeck(userId, command)`: Tworzy nową talię na podstawie przesłanych danych.

Aby zasymulować ich działanie, należy uruchomić backend i przetestować powyższe endpointy za pomocą curl lub innego narzędzia (np. Postman).

> Upewnij się, że serwer działa na odpowiednim porcie (domyślnie np. 3000) i że Supabase jest poprawnie skonfigurowane. 