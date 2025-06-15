# Flashcard Service Curl Request Examples

This document provides sample curl commands that can be used to test the flashcard service endpoints through Postman or the terminal.

**Note**: Replace `http://localhost:3000/api/flashcards` with the actual base URL of your service if it's different.

## List Flashcards

This request retrieves a paginated list of flashcards. You can optionally filter by `deckId` and `status`.

```
curl -X GET "http://localhost:3000/api/flashcards?page=1&limit=10&deckId=deck1&status=zatwierdzona" \
-H "Content-Type: application/json"
```

## Create Flashcards

This request creates new flashcards by sending a POST request with required data.

```
curl -X POST "http://localhost:3000/api/flashcards" \
-H "Content-Type: application/json" \
-d '{
  "deck_id": "deck1",
  "flashcards": [
    {
      "przod": "What is the capital of France?",
      "tyl": "Paris"
    },
    {
      "przod": "What is 2 + 2?",
      "tyl": "4"
    }
  ],
  "user": {
    "id": "user1"
  }
}'
```

## Get Flashcard by ID

This request retrieves the details of a single flashcard. Replace `{id}` with the actual flashcard ID.

```
curl -X GET "http://localhost:3000/api/flashcards/{id}" \
-H "Content-Type: application/json"
```

## Update Flashcard

This request updates an existing flashcard. Modify the JSON data as required. Replace `{id}` with the actual flashcard ID.

```
curl -X PUT "http://localhost:3000/api/flashcards/{id}" \
-H "Content-Type: application/json" \
-d '{
  "updateData": {
    "przod": "Updated Front Side",
    "tyl": "Updated Back Side",
    "status": "zatwierdzona"
  },
  "user": {
    "id": "user1"
  }
}'
```

## Delete Flashcard

This request deletes a flashcard by its ID. Replace `{id}` with the actual flashcard ID.

```
curl -X DELETE "http://localhost:3000/api/flashcards/{id}" \
-H "Content-Type: application/json"
```

---

Adjust these examples as needed for your specific testing scenario. 