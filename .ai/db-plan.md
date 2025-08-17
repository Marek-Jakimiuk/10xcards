# Schemat bazy danych PostgreSQL dla 10x-cards

## 1. Tabele

### Tabela: users

This table is managed by Supabase Auth.

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user'))
    -- Inne standardowe atrybuty zarządzane przez Supabase Auth
);

### Tabela: decks
CREATE TABLE decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ
);

### Tabela: fiszki
CREATE TABLE fiszki (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    deck_id UUID REFERENCES decks(id) ON DELETE SET NULL,
    przod VARCHAR(200) NOT NULL,
    tyl VARCHAR(500) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('zatwierdzona', 'odrzucona', 'oczekująca')),
    metadane JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ
);

### Tabela: fiszki_history
CREATE TABLE fiszki_history (
    history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fiszka_id UUID NOT NULL REFERENCES fiszki(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    przod VARCHAR(200) NOT NULL,
    tyl VARCHAR(500) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('zatwierdzona', 'odrzucona', 'oczekująca')),
    metadane JSONB,
    version_number INTEGER NOT NULL,
    edited_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

### Tabela: fiszki_logs
CREATE TABLE fiszki_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fiszka_id UUID NOT NULL REFERENCES fiszki(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- np. 'created', 'edited', 'deleted', 'accepted'
    details JSONB,       -- dodatkowe informacje
    log_timestamp TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

## 2. Relacje

/*
Relacje między tabelami:
- Jeden użytkownik (users) może posiadać wiele decks, fiszek, wpisów w fiszki_history oraz fiszki_logs.
- Jeden deck (decks) może zawierać wiele fiszek (fiszki).
- Jeden rekord w fiszki może mieć wiele wersji w fiszki_history.
- Jeden rekord w fiszki może mieć wiele wpisów w fiszki_logs (logi/statystyki).
*/

## 3. Indeksy

### Indeks dla szybkiego wyszukiwania według user_id w tabeli fiszki
CREATE INDEX idx_fiszki_user_id ON fiszki(user_id);

### Indeks dla wyszukiwania fiszek według deck_id
CREATE INDEX idx_fiszki_deck_id ON fiszki(deck_id);

### Indeks dla tabeli fiszki_history
CREATE INDEX idx_fiszki_history_fiszka_id ON fiszki_history(fiszka_id);

### Indeks dla tabeli fiszki_logs
CREATE INDEX idx_fiszki_logs_fiszka_id ON fiszki_logs(fiszka_id);

## 4. Zasady PostgreSQL (RLS)

### Włączenie Row Level Security dla tabeli fiszki
ALTER TABLE fiszki ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_isolation ON fiszki
    FOR ALL
    USING (user_id = current_setting('myapp.current_user_uuid')::uuid);

### Podobne zasady RLS powinny być wdrożone także dla tabel decks, fiszki_history oraz fiszki_logs

## 5. Dodatkowe uwagi

/*
- Wszystkie klucze główne są typu UUID, co ułatwia integrację między tabelami oraz skalowalność systemu.
- Tabele są zaprojektowane zgodnie z zasadami normalizacji do 3NF.
- Mechanizm wersjonowania w tabeli fiszki_history umożliwia śledzenie zmian w treści fiszek.
- Tabela fiszki_logs rejestruje operacje na fiszkach, wspierając analizę statystyk i śledzenie działań użytkowników.
- RLS gwarantuje, że użytkownicy mają dostęp tylko do swoich danych, zwiększając bezpieczeństwo aplikacji.
*/
