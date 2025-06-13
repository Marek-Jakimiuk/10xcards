-- Migration: Disable RLS Policies
-- Description: Drops all RLS policies from the fiszki table
-- Author: AI Assistant
-- Date: 2024-03-25

-- Drop all policies from fiszki table
drop policy if exists "Users can view their own flashcards" on public.fiszki;
drop policy if exists "Users can create their own flashcards" on public.fiszki;
drop policy if exists "Users can update their own flashcards" on public.fiszki;
drop policy if exists "Users can delete their own flashcards" on public.fiszki;
drop policy if exists "Anonymous users can view approved flashcards" on public.fiszki;

-- Disable RLS on the table
alter table public.fiszki disable row level security; 