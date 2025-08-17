// DTO and Command Model Definitions
// These types are used for data transfer in the REST API and are based on the underlying database models.

import type { Tables, Database } from "./db/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

// Define allowed flashcard statuses as per API plan
export type FlashcardStatus = "oczekująca" | "zatwierdzona" | "odrzucona";

// =============================
// Auth Types
// =============================
// Define user and Supabase client types as per legacy definitions.

export interface User {
  id: string;
  email: string | null;
}

// Underlying database types for flashcards and decks
// FiszkaRow represents a row in the "fiszki" table
// DeckRow represents a row in the "decks" table

export type FiszkaRow = Tables<"fiszki">;
export type DeckRow = Tables<"decks">;

/*----------------------------------------------------
  Flashcards DTOs & Commands
----------------------------------------------------*/

// 1. FlashcardDTO
// Used to list flashcards. Picks a subset of fields from FiszkaRow, including deck_id.
export type FlashcardDTO = Pick<FiszkaRow, "id" | "przod" | "tyl" | "status" | "deck_id">;

// 2. FlashcardDetailDTO
// Used to retrieve a single flashcard. Now the same as FlashcardDTO since it includes deck_id.
export type FlashcardDetailDTO = FlashcardDTO;

// 3. FlashcardCreateInput
// Represents the input for creating a single flashcard.
export interface FlashcardCreateInput {
  przod: string; // Front text (max 200 chars)
  tyl: string; // Back text (max 500 chars)
  status: FlashcardStatus;
}

// 4. FlashcardCreateCommand
// Command for creating one or more flashcards, with an optional deck assignment.
export interface FlashcardCreateCommand {
  deck_id?: string;
  flashcards: FlashcardCreateInput[];
}

// 5. FlashcardUpdateCommand
// Command for updating an existing flashcard.
export interface FlashcardUpdateCommand {
  przod: string;
  tyl: string;
  status: FlashcardStatus;
}

// 6. FlashcardGenerateCommand
// Command for generating flashcards via AI. Includes a title for the flashcard deck as per legacy definitions.
export interface FlashcardGenerateCommand {
  text: string; // Input text (1000-10000 chars)
  title: string;
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
  deckId: string;
}

// 9. PaginationDTO
// Defines pagination details for list endpoints.
export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
}

// 10. FlashcardListResponseDTO
// Final response for listing flashcards, including flashcards and pagination info.
export interface FlashcardListResponseDTO {
  flashcards: FlashcardDTO[];
  pagination: PaginationDTO;
}

/*----------------------------------------------------
  Decks DTOs & Commands
----------------------------------------------------*/

// 11. DeckDTO
// Represents a deck.
export type DeckDTO = Pick<DeckRow, "id" | "name" | "description">;

// 12. DeckCreateCommand
// Command to create a new deck.
export interface DeckCreateCommand {
  name: string;
  description?: string;
}

// 13. DeckUpdateCommand
// Command to update an existing deck.
export interface DeckUpdateCommand {
  name: string;
  description: string;
}

// 14. DeckListResponseDTO
// Final response for listing decks.
export interface DeckListResponseDTO {
  decks: DeckDTO[];
}

/*----------------------------------------------------
  Study Session DTOs
----------------------------------------------------*/

// 15. StudySessionFlashcardDTO
// Represents a flashcard used during a study session.
export interface StudySessionFlashcardDTO {
  id: string;
  przod: string;
  tyl: string;
}

// 16. StudySessionInfoDTO
// Contains metadata about the study session.
export interface StudySessionInfoDTO {
  total: number;
  current_index: number;
}

// 17. StudySessionResponseDTO
// Final response for a study session endpoint, combining flashcards and session metadata.
export interface StudySessionResponseDTO {
  session: StudySessionFlashcardDTO[];
  session_info: StudySessionInfoDTO;
}

/*----------------------------------------------------
  Supabase Client & Locals
----------------------------------------------------*/

export type TypedSupabaseClient = SupabaseClient<Database>;

// declare global {
//   namespace App {
//     interface Locals {
//       supabase: TypedSupabaseClient;
//       user?: User;
//     }
//   }
// }

/*----------------------------------------------------
  Flashcards View Types
----------------------------------------------------*/

// FlashcardFilters - for filtering flashcards in the view
export interface FlashcardFilters {
  deckId?: string; // UUID talii
  status?: FlashcardStatus;
  page: number;
  limit: number;
}

// FlashcardsState - main state for flashcards view
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

// FlashcardFormValues - form values for add/edit modal
export interface FlashcardFormValues {
  przod: string;
  tyl: string;
  status?: FlashcardStatus; // w trybie edit
  deck_id?: string; // w trybie add - wybór talii
}

// End of DTO and Command Model definitions
