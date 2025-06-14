// DTO and Command Model Definitions
// These types are used for data transfer in the REST API and are based on the underlying database models.

import type { Tables } from './db/database.types';

// Define allowed flashcard statuses as per API plan
export type FlashcardStatus = 'oczekująca' | 'zatwierdzona' | 'odrzucona';

// Underlying database types for flashcards and decks
// FiszkaRow represents a row in the "fiszki" table
// DeckRow represents a row in the "decks" table

type FiszkaRow = Tables<'fiszki'>;
type DeckRow = Tables<'decks'>;

// =============================
// Flashcards DTOs & Commands
// =============================

// 1. FlashcardListDTO
// Used to list flashcards (GET /api/flashcards). It picks a subset of fields from FiszkaRow.
export type FlashcardListDTO = Pick<FiszkaRow, 'id' | 'przod' | 'tyl' | 'status'>;

// 2. FlashcardDetailDTO
// Used to retrieve a single flashcard (GET /api/flashcards/{id}). It extends FlashcardListDTO with deck_id (from deck_id).
export interface FlashcardDetailDTO extends FlashcardListDTO {
  deck_id: FiszkaRow['deck_id'];
}

// 3. FlashcardCreateInput
// Represents a single flashcard creation payload (used in POST /api/flashcards).
export interface FlashcardCreateInput {
  przod: string; // Front text (max 200 chars)
  tyl: string;   // Back text (max 500 chars)
  status: FlashcardStatus;
}

// 4. FlashcardCreateCommand
// Command for creating one or more flashcards, with an optional deck assignment.
export interface FlashcardCreateCommand {
  deck_id?: string;
  flashcards: FlashcardCreateInput[];
}

// 5. FlashcardUpdateCommand
// Command for updating an existing flashcard (PUT /api/flashcards/{id}).
export interface FlashcardUpdateCommand {
  przod: string;
  tyl: string;
  status: FlashcardStatus;
}

// 6. FlashcardGenerateCommand
// Command for generating flashcards via AI (POST /api/flashcards/generate).
export interface FlashcardGenerateCommand {
  text: string; // Input text with length between 1000 and 10000 characters.
}

// 7. FlashcardSuggestionDTO
// Represents a suggested flashcard returned by the AI generation service.
export interface FlashcardSuggestionDTO {
  przod: string;
  tyl: string;
}

// 8. FlashcardGenerateResponseDTO
// Response structure for AI-generated flashcard suggestions.
export interface FlashcardGenerateResponseDTO {
  suggestions: FlashcardSuggestionDTO[];
}

// 9. PaginationDTO
// Represents pagination details used in list endpoints.
export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
}

// 10. FlashcardListResponseDTO
// Final response for listing flashcards, including flashcards and pagination info.
export interface FlashcardListResponseDTO {
  flashcards: FlashcardListDTO[];
  pagination: PaginationDTO;
}

// =============================
// Decks DTOs & Commands
// =============================

// 11. DeckDTO
// Represents a deck (GET /api/decks). Picked from the decks table.
export type DeckDTO = Pick<DeckRow, 'id' | 'name' | 'description'>;

// 12. DeckCreateCommand
// Command to create a new deck (POST /api/decks).
export interface DeckCreateCommand {
  name: string;
  description: string;
}

// 13. DeckUpdateCommand
// Command to update an existing deck (PUT /api/decks/{id}).
export interface DeckUpdateCommand {
  name: string;
  description: string;
}

// =============================
// Study Session DTOs
// =============================

// 14. StudySessionFlashcardDTO
// Represents a flashcard used during a study session (GET /api/study-session).
export interface StudySessionFlashcardDTO {
  id: string;
  przod: string;
  tyl: string;
}

// 15. StudySessionInfoDTO
// Contains metadata about the study session.
export interface StudySessionInfoDTO {
  total: number;
  current_index: number;
}

// 16. StudySessionResponseDTO
// Final response for a study session endpoint, combining flashcards and session metadata.
export interface StudySessionResponseDTO {
  session: StudySessionFlashcardDTO[];
  session_info: StudySessionInfoDTO;
}
