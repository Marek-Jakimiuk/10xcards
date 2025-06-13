-- Migration: Initial Schema Setup
-- Description: Creates the initial database schema for 10x-cards application
-- Tables: users (managed by Supabase Auth), fiszki (flashcards)
-- Author: AI Assistant
-- Date: 2024-03-25

-- [ 1. Prerequisites and Extensions ]
-- Enable UUID extension for generating UUIDs
create extension if not exists "uuid-ossp";

-- Verify auth schema exists (Supabase specific)
do $$
begin
  if not exists (select 1 from pg_namespace where nspname = 'auth') then
    raise exception 'Auth schema does not exist. Please ensure Supabase Auth is properly set up.';
  end if;
end$$;

-- [ 2. Table Creation and Indexes ]
-- Create fiszki (flashcards) table
create table if not exists public.fiszki (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    przod varchar(200) not null,
    tyl varchar(500) not null,
    status text not null check (status in ('zatwierdzona', 'odrzucona', 'oczekująca')),
    metadane jsonb,
    created_at timestamptz not null default current_timestamp
);

comment on table public.fiszki is 'Stores flashcards created by users';
comment on column public.fiszki.id is 'Unique identifier for the flashcard';
comment on column public.fiszki.user_id is 'Reference to the user who created the flashcard';
comment on column public.fiszki.przod is 'Front side of the flashcard (question/prompt)';
comment on column public.fiszki.tyl is 'Back side of the flashcard (answer/explanation)';
comment on column public.fiszki.status is 'Current status of the flashcard: zatwierdzona (approved), odrzucona (rejected), oczekująca (pending)';
comment on column public.fiszki.metadane is 'Additional metadata for the flashcard in JSON format';
comment on column public.fiszki.created_at is 'Timestamp when the flashcard was created';

-- Create index right after table creation
create index if not exists fiszki_user_id_idx on public.fiszki(user_id);

-- [ 3. Security Setup ]
-- Enable Row Level Security
alter table public.fiszki enable row level security;

-- Create RLS Policies for authenticated users
create policy "Users can view their own flashcards"
    on public.fiszki
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can create their own flashcards"
    on public.fiszki
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own flashcards"
    on public.fiszki
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
    on public.fiszki
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create RLS Policies for anonymous users (read-only access to approved cards)
create policy "Anonymous users can view approved flashcards"
    on public.fiszki
    for select
    to anon
    using (status = 'zatwierdzona'); 