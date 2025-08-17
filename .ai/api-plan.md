# REST API Plan

## 1. Resources

1. **Users** (`users` table):
  - Key Fields: `id`, `email`, `created_at`, `role`
  - Relationship: One user can have many decks, flashcards, history records, and logs.
   - Note: Managed by Supabase Auth and enforced via RLS.


2. **Decks** (`decks` table):
  - Key Fields: `id`, `user_id`, `name`, `description`, `created_at`, `updated_at`
  - Relationship: Each deck belongs to a user and can contain many flashcards.

3. **Flashcards** (`fiszki` table):
  - Key Fields: `id`, `user_id`, `deck_id`, `przod` (front), `tyl` (back), `status` (`zatwierdzona`, `odrzucona`, `oczekująca`), `metadane`, `created_at`, `updated_at`
  - Relationship: Each flashcard belongs to a user and an optional deck; has many history entries and logs.

4. **Flashcards History & Logs** (`fiszki_history`, `fiszki_logs` tables):
  - Key Fields History: `history_id`, `fiszka_id`, `user_id`, `version_number`, `edited_at`
  - Key Fields Logs: `log_id`, `fiszka_id`, `user_id`, `action`, `log_timestamp`
  - Relationship: History and log entries belong to a flashcard and user; internal usage only.

## 2. Endpoints

### Flashcards Endpoints

1. **List Flashcards**

   - **Method:** GET
   - **URL:** `/api/flashcards`
   - **Description:** Retrieve a paginated list of authenticated user. Supports filtering by `deck_id` and `status`.
   - **Query Parameters:**
     - `page` (integer, default 1)
     - `limit` (integer, default 20)
     - `deck_id` (UUID, optional)
     - `status` (`zatwierdzona`, `odrzucona`, `oczekująca`, optional)
   - **Response 200:**
     ```json
     {
       "flashcards": [
         {
           "id": "...",
           "przod": "...",
           "tyl": "...",
           "status": "...",
           "deck_id": "...",
           "created_at": "...",
           "updated_at": "..."
         }
       ],
       "pagination": { "page": 1, "limit": 20, "total": 100 }
     }
     ```
   - **Errors:**
     - 400 Bad Request: Invalid query parameters.
     - 401 Unauthorized: Authentication required.
     - 403 Forbidden: Access denied.
     - 500 Internal Server Error.

2. **Retrieve a Single Flashcard**
   - **Method:** GET
   - **URL:** `/api/flashcards/{id}`
   - **Description:** Retrieves details of a specific flashcard.
   - **Response 200:**
     ```json
     {
       "id": "...",
       "przod": "...",
       "tyl": "...",
       "status": "...",
       "deck_id": "...",
       "created_at": "...",
       "updated_at": "..."
     }
     ```
   - **Errors:**
     - 401 Unauthorized: Authentication required.
     - 403 Forbidden: Access denied.
     - 404 Not Found: Flashcard not found.
     - 500 Internal Server Error.

3. **Create Flashcards** (Bulk)
   - **Method:** POST
   - **URL:** `/api/flashcards`
   - **Description:** Creates one or more flashcard entries. Used for both manual flashcard creation and AI-generated flashcards.
   - **Request Payload:**
     ```json
     {
       "deck_id": "optional-deck-id",
       "flashcards": [
         {
           "przod": "Front (≤200 chars)",
           "tyl": "Back (≤500 chars)",
           "status": "oczekująca" // default status for manually created flashcards
         },
         {
           "przod": "Another front",
           "tyl": "Another back",
           "status": "zatwierdzona" // can be used for AI-generated and approved cards
         }
       ]
     }
     ```
   - **Response 201:**
     ```json
     [
       { "id": "...", "przod": "...", "tyl": "...", "status": "...", "deck_id": "...", "created_at": "...", "updated_at": "..." },
       ...
     ]
     ```
   - **Errors:**
     - 400 Bad Request: Validation errors.
     - 401 Unauthorized: Authentication required.
     - 403 Forbidden: Cannot create for another user's deck.
     - 500 Internal Server Error.

4. **Update a Flashcard**

   - **Method:** PUT
   - **URL:** `/api/flashcards/{id}`
   - **Request:**
     ```json
     { "przod": "Updated front", "tyl": "Updated back", "status": "zatwierdzona" }
     ```
   - **Response 200:** Updated flashcard object.
   - **Errors:**
     - 400 Bad Request: Validation errors on update.
     - 401 Unauthorized: Authentication required.
     - 403 Forbidden: Cannot update another user's flashcard.
     - 404 Not Found: Flashcard not found.
     - 500 Internal Server Error.

5. **Delete a Flashcard**

   - **Method:** DELETE
   - **URL:** `/api/flashcards/{id}`
   - **Response 200:**
     ```json
     { "message": "Flashcard deleted." }
     ```
   - **Errors:**
     - 401 Unauthorized: Authentication required.
     - 403 Forbidden: Cannot delete another user's flashcard.
     - 404 Not Found: Flashcard not found.
     - 500 Internal Server Error.

6. **Generate Flashcards via AI**

   - **Method:** POST
   - **URL:** `/api/flashcards/generate`
   - **Description:** Generate flashcard suggestions via LLM.
   - **Request:**
     ```json
     { "text": "<1000–10000 chars>" }
     ```
   - **Response 200:**
     ```json
     {
       "suggestions": [{ "suggestion_id": "...", "przod": "...", "tyl": "..." }]
     }
     ```
   - **Errors:**
     - 400 Bad Request: Invalid or missing input.
     - 401 Unauthorized.
     - 429 Too Many Requests: Rate limit exceeded.
     - 500 Internal Server Error: LLM failure.

7. **Accept/Reject/Edit Suggestion**

   - **Method:** PATCH
   - **URL:** `/api/flashcards/suggestions/{suggestion_id}`
   - **Request:**
     ```json
     { "action": "accept" | "reject" | "edit", "przod"?: "...", "tyl"?: "..." }
     ```
   - **Response 200:** Confirmation or updated suggestion object.
   - **Errors:**
     - 400 Bad Request: Invalid action or payload.
     - 401 Unauthorized: Authentication required.
     - 403 Forbidden: Cannot modify another user's suggestion.
     - 404 Not Found: Suggestion not found.
     - 500 Internal Server Error.

8. **Discard Suggestion**
   - **Method:** DELETE
   - **URL:** `/api/flashcards/suggestions/{suggestion_id}`
   - **Response 200:**
     ```json
     { "message": "Suggestion discarded." }
     ```
   - **Errors:**
     - 401 Unauthorized: Authentication required.
     - 403 Forbidden: Cannot delete another user's suggestion.
     - 404 Not Found: Suggestion not found.
     - 500 Internal Server Error.

### Decks Endpoints

1. **List Decks**
   - Method: GET
   - URL: `/api/decks`
   - Response 200:
     ```json
     { "decks": [{ "id": "...", "name": "...", "description": "...", "created_at": "...", "updated_at": "..." }] }
     ```
   - Errors:
     - 401 Unauthorized: Authentication required.
     - 500 Internal Server Error.

2. **Create a New Deck**
   - Method: POST
   - URL: `/api/decks`
   - Request:
     ```json
     { "name": "Deck Name", "description": "Optional" }
     ```
   - Response 201: Deck object.
   - Errors:
     - 400 Bad Request: Validation errors (e.g., missing name).
     - 401 Unauthorized: Authentication required.
     - 500 Internal Server Error.

3. **Retrieve Deck**
   - Method: GET
   - URL: `/api/decks/{id}`
   - Response 200: Deck object (optionally include `flashcards` if `includeFlashcards=true`).
   - Errors:
     - 401 Unauthorized: Authentication required.
     - 403 Forbidden: Cannot access another user's deck.
     - 404 Not Found: Deck not found.
     - 500 Internal Server Error.

4. **Update Deck**
   - Method: PUT
   - URL: `/api/decks/{id}`
   - Request:
     ```json
     { "name": "Updated", "description": "Updated" }
     ```
   - Response 200: Updated deck object.
   - Errors:
     - 400 Bad Request: Validation errors.
     - 401 Unauthorized: Authentication required.
     - 403 Forbidden: Cannot update another user's deck.
     - 404 Not Found: Deck not found.
     - 500 Internal Server Error.

5. **Delete Deck**
   - Method: DELETE
   - URL: `/api/decks/{id}`
   - Response 200:
     ```json
     { "message": "Deck deleted." }
     ```
   - Errors:
     - 401 Unauthorized: Authentication required.
     - 403 Forbidden: Cannot delete another user's deck.
     - 404 Not Found: Deck not found.
     - 500 Internal Server Error.

### Study Session Endpoint

1. **Get Learning Session**
   - Method: GET
   - URL: `/api/sessions/learning`
   - Description: Fetch flashcards for spaced-repetition session.
   - Query Params: `page`, `limit`, `deck_id` (UUID, optional)
   - Response 200:
     ```json
     {
       "session": [{ "id": "...", "przod": "...", "tyl": "..." }],
       "session_info": { "total": 10, "current_index": 0 }
     }
     ```
   - Errors:
     - 401 Unauthorized: Authentication required.
     - 500 Internal Server Error.

## 3. Authentication & Authorization

- Mechanism: All endpoints (except `/api/auth/register` and `/api/auth/login`) require authentication using JWT tokens issued by Supabase Auth.
- Implementation: Clients must include an Authorization header: `Authorization: Bearer <token>`.
- RLS Enforcement: Supabase enforces Row Level Security, ensuring per-user data isolation.

## 4. Validation & Business Logic

- **Flashcard Validation**: `przod` ≤200 chars, `tyl` ≤500 chars; `status` ∈ [`zatwierdzona`,`odrzucona`,`oczekująca`].
- **Generate Validation**: `text` length 1000–10000 chars; (rate limiting planned: e.g. 10/min). <!-- PLAN: Add rate-limiting middleware on generation endpoint. -->
- **Bulk Create**: ensure array payload; validation per item.
- **Update via PUT**: full object update.
- **Suggestion Workflow**: POST returns wrapper; PATCH & DELETE operate on in-memory suggestions until accepted then persisted as flashcards.

- **Error Handling and Status Codes:**
   - **200 OK / 201 Created:** For successful operations.
   - **400 Bad Request:** For validation errors or malformed requests.
   - **401 Unauthorized:** When authentication fails or is missing.
   - **404 Not Found:** When requested resources do not exist.
   - **500 Internal Server Error:** For unexpected failures.

- **Performance and Security Considerations:**
   - **Pagination, Filtering, and Sorting:** Implemented on GET list endpoints to efficiently navigate large datasets.
   - **Rate Limiting:** Consider applying rate limits on endpoints, especially on flashcard generation to prevent abuse.
   - **Data Security:** All sensitive operations require authentication and the backend should ensure that RLS policies are in place at the database level.


## 5. Assumptions

- Supabase Auth manages authentication; RLS enforces per-user isolation.
- Histories & logs remain internal and are not exposed in public API.
- 

*Assumptions:*
- The external AI service for flashcard generation is reliable and its API response is normalized to our flashcard schema.
- Flashcard histories and logs are maintained internally for versioning and auditing rather than exposed to the end user.
- Study session endpoint encapsulates logic for spaced repetition without requiring the client to manage flashcard queueing.

This API plan aligns with the product requirements (PRD), the database schema, and the specified tech stack, offering a robust and scalable design for the 10x-cards application.
