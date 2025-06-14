-- Migration: Initial Schema Setup
-- Description: Creates the initial database schema including users, decks, fiszki (flashcards),
-- fiszki_history (flashcard history), and fiszki_logs (flashcard logs) tables with proper
-- relationships, indexes and RLS policies.

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create decks table
create table decks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name varchar not null,
    description text,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz
);

-- Create fiszki (flashcards) table
create table fiszki (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    deck_id uuid references decks(id) on delete set null,
    przod varchar(200) not null,
    tyl varchar(500) not null,
    status text not null check (status in ('zatwierdzona', 'odrzucona', 'oczekująca')),
    metadane jsonb,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz
);

-- Create fiszki_history table for versioning
create table fiszki_history (
    history_id uuid primary key default uuid_generate_v4(),
    fiszka_id uuid not null references fiszki(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    przod varchar(200) not null,
    tyl varchar(500) not null,
    status text not null check (status in ('zatwierdzona', 'odrzucona', 'oczekująca')),
    metadane jsonb,
    version_number integer not null,
    edited_at timestamptz not null default current_timestamp
);

-- Create fiszki_logs table for activity tracking
create table fiszki_logs (
    log_id uuid primary key default uuid_generate_v4(),
    fiszka_id uuid not null references fiszki(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    action text not null,
    details jsonb,
    log_timestamp timestamptz not null default current_timestamp
);

-- Create indexes for performance optimization
create index idx_fiszki_user_id on fiszki(user_id);
create index idx_fiszki_deck_id on fiszki(deck_id);
create index idx_fiszki_history_fiszka_id on fiszki_history(fiszka_id);
create index idx_fiszki_logs_fiszka_id on fiszki_logs(fiszka_id);

-- Enable Row Level Security (RLS)
alter table decks enable row level security;
alter table fiszki enable row level security;
alter table fiszki_history enable row level security;
alter table fiszki_logs enable row level security;

-- RLS Policies for decks
create policy "Users can view their own decks"
    on decks for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can create their own decks"
    on decks for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own decks"
    on decks for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own decks"
    on decks for delete
    to authenticated
    using (auth.uid() = user_id);

-- RLS Policies for fiszki
create policy "Users can view their own flashcards"
    on fiszki for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can create their own flashcards"
    on fiszki for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own flashcards"
    on fiszki for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
    on fiszki for delete
    to authenticated
    using (auth.uid() = user_id);

-- RLS Policies for fiszki_history
create policy "Users can view their own flashcard history"
    on fiszki_history for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can create flashcard history"
    on fiszki_history for insert
    to authenticated
    with check (auth.uid() = user_id);

-- RLS Policies for fiszki_logs
create policy "Users can view their own flashcard logs"
    on fiszki_logs for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can create flashcard logs"
    on fiszki_logs for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;

create trigger update_decks_updated_at
    before update on decks
    for each row
    execute function update_updated_at_column();

create trigger update_fiszki_updated_at
    before update on fiszki
    for each row
    execute function update_updated_at_column(); 