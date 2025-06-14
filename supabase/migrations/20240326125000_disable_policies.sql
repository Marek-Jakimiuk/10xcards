-- Migration: Disable all RLS policies
-- Description: Drops all previously defined RLS policies from decks, fiszki, fiszki_history, and fiszki_logs tables

-- Drop policies from decks table
drop policy if exists "Users can view their own decks" on decks;
drop policy if exists "Users can create their own decks" on decks;
drop policy if exists "Users can update their own decks" on decks;
drop policy if exists "Users can delete their own decks" on decks;

-- Drop policies from fiszki table
drop policy if exists "Users can view their own flashcards" on fiszki;
drop policy if exists "Users can create their own flashcards" on fiszki;
drop policy if exists "Users can update their own flashcards" on fiszki;
drop policy if exists "Users can delete their own flashcards" on fiszki;

-- Drop policies from fiszki_history table
drop policy if exists "Users can view their own flashcard history" on fiszki_history;
drop policy if exists "Users can create flashcard history" on fiszki_history;

-- Drop policies from fiszki_logs table
drop policy if exists "Users can view their own flashcard logs" on fiszki_logs;
drop policy if exists "Users can create flashcard logs" on fiszki_logs;

-- Disable RLS on all tables
alter table decks disable row level security;
alter table fiszki disable row level security;
alter table fiszki_history disable row level security;
alter table fiszki_logs disable row level security; 