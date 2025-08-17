-- Migration: Initial Schema Setup
-- Description: Creates the initial database schema for 10x-cards application
-- Tables: user_profiles, decks, fiszki (flashcards), fiszki_history, fiszki_logs
-- Author: AI Assistant
-- Date: 2024-03-27

-- Create user_profiles table to store additional user information
create table if not exists user_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    role text not null check (role in ('admin', 'user')) default 'user',
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz
);

-- Enable RLS on user_profiles table
alter table user_profiles enable row level security;

-- Drop existing policies if any
drop policy if exists "Users can view their own profile" on user_profiles;
drop policy if exists "Users can update their own profile" on user_profiles;

-- RLS Policies for user_profiles
create policy "Users can view their own profile"
    on user_profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on user_profiles for update
    using (auth.uid() = id);

create policy "Users can insert their own profile"
    on user_profiles for insert
    with check (auth.uid() = id);

-- Decks table
create table if not exists decks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name varchar not null,
    description text,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz
);

-- Enable RLS on decks table
alter table decks enable row level security;

-- Drop existing policies if any
drop policy if exists "Users can view their own decks" on decks;
drop policy if exists "Users can create their own decks" on decks;
drop policy if exists "Users can update their own decks" on decks;
drop policy if exists "Users can delete their own decks" on decks;

-- RLS Policies for decks
create policy "Users can view their own decks"
    on decks for select
    using (auth.uid() = user_id);

create policy "Users can create their own decks"
    on decks for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own decks"
    on decks for update
    using (auth.uid() = user_id);

create policy "Users can delete their own decks"
    on decks for delete
    using (auth.uid() = user_id);

-- Flashcards table (fiszki)
create table if not exists fiszki (
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

-- Enable RLS on fiszki table
alter table fiszki enable row level security;

-- Drop existing policies if any
drop policy if exists "Users can view their own flashcards" on fiszki;
drop policy if exists "Users can create their own flashcards" on fiszki;
drop policy if exists "Users can update their own flashcards" on fiszki;
drop policy if exists "Users can delete their own flashcards" on fiszki;

-- RLS Policies for fiszki
create policy "Users can view their own flashcards"
    on fiszki for select
    using (auth.uid() = user_id);

create policy "Users can create their own flashcards"
    on fiszki for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own flashcards"
    on fiszki for update
    using (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
    on fiszki for delete
    using (auth.uid() = user_id);

-- Flashcard history table (fiszki_history)
create table if not exists fiszki_history (
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

-- Enable RLS on fiszki_history table
alter table fiszki_history enable row level security;

-- Drop existing policies if any
drop policy if exists "Users can view their flashcard history" on fiszki_history;
drop policy if exists "Users can create flashcard history entries" on fiszki_history;

-- RLS Policies for fiszki_history
create policy "Users can view their flashcard history"
    on fiszki_history for select
    using (auth.uid() = user_id);

create policy "Users can create flashcard history entries"
    on fiszki_history for insert
    with check (auth.uid() = user_id);

-- Flashcard logs table (fiszki_logs)
create table if not exists fiszki_logs (
    log_id uuid primary key default uuid_generate_v4(),
    fiszka_id uuid not null references fiszki(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    action text not null,
    details jsonb,
    log_timestamp timestamptz not null default current_timestamp
);

-- Enable RLS on fiszki_logs table
alter table fiszki_logs enable row level security;

-- Drop existing policies if any
drop policy if exists "Users can view their flashcard logs" on fiszki_logs;
drop policy if exists "Users can create log entries" on fiszki_logs;

-- RLS Policies for fiszki_logs
create policy "Users can view their flashcard logs"
    on fiszki_logs for select
    using (auth.uid() = user_id);

create policy "Users can create log entries"
    on fiszki_logs for insert
    with check (auth.uid() = user_id);

-- Create indexes for better query performance (if they don't exist)
do $$ 
begin
    -- Indexes for fiszki table
    if not exists (select 1 from pg_indexes where indexname = 'idx_fiszki_user_id') then
        create index idx_fiszki_user_id on fiszki(user_id);
    end if;
    
    if not exists (select 1 from pg_indexes where indexname = 'idx_fiszki_deck_id') then
        create index idx_fiszki_deck_id on fiszki(deck_id);
    end if;

    -- Indexes for fiszki_history table
    if not exists (select 1 from pg_indexes where indexname = 'idx_fiszki_history_fiszka_id') then
        create index idx_fiszki_history_fiszka_id on fiszki_history(fiszka_id);
    end if;
    
    if not exists (select 1 from pg_indexes where indexname = 'idx_fiszki_history_user_id') then
        create index idx_fiszki_history_user_id on fiszki_history(user_id);
    end if;

    -- Indexes for fiszki_logs table
    if not exists (select 1 from pg_indexes where indexname = 'idx_fiszki_logs_fiszka_id') then
        create index idx_fiszki_logs_fiszka_id on fiszki_logs(fiszka_id);
    end if;
    
    if not exists (select 1 from pg_indexes where indexname = 'idx_fiszki_logs_user_id') then
        create index idx_fiszki_logs_user_id on fiszki_logs(user_id);
    end if;
end $$;

-- Add triggers for updated_at timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;

-- Drop existing triggers if any
drop trigger if exists update_user_profiles_updated_at on user_profiles;
drop trigger if exists update_decks_updated_at on decks;
drop trigger if exists update_fiszki_updated_at on fiszki;

-- Create triggers
create trigger update_user_profiles_updated_at
    before update on user_profiles
    for each row
    execute function update_updated_at_column();

create trigger update_decks_updated_at
    before update on decks
    for each row
    execute function update_updated_at_column();

create trigger update_fiszki_updated_at
    before update on fiszki
    for each row
    execute function update_updated_at_column();

-- Create function to automatically create user profile on auth.user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.user_profiles (id, role)
    values (new.id, 'user');
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger to handle new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user(); 