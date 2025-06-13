# Schemat bazy danych PostgreSQL dla 10x-cards

## 1. Tabele i kolumny

### Tabela: users

This table is managed by Supabase Auth.

- `id`: UUID, PRIMARY KEY, domyślnie generowane za pomocą `uuid_generate_v4()`
- `email`: VARCHAR NOT NULL, UNIQUE
- `login`: VARCHAR NOT NULL, UNIQUE
- `hashed_password`: VARCHAR NOT NULL
- `data_rejestracji`: TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
- `rola`: TEXT NOT NULL CHECK (rola IN ('admin', 'user'))

### Tabela: fiszki
- `id`: UUID, PRIMARY KEY, domyślnie generowane za pomocą `uuid_generate_v4()`
- `user_id`: UUID NOT NULL, FOREIGN KEY REFERENCES users(id)
- `przod`: VARCHAR(200) NOT NULL
- `tyl`: VARCHAR(500) NOT NULL
- `status`: TEXT NOT NULL CHECK (status IN ('zatwierdzona', 'odrzucona', 'oczekująca'))
- `metadane`: JSONB

## 2. Relacje
- Jeden użytkownik (`users`) ma wiele fiszek (`fiszki`). Relacja 1:N między `users.id` i `fiszki.user_id`.

## 3. Indeksy
- PRIMARY KEY na kolumnach `id` w obu tabelach.
- Indeks na `user_id` w tabeli `fiszki` dla poprawy wydajności zapytań.

## 4. Zasady PostgreSQL (RLS)
- Włączone Row Level Security na tabeli `fiszki`:
  ```sql
  ALTER TABLE fiszki ENABLE ROW LEVEL SECURITY;

  CREATE POLICY user_isolation ON fiszki
      FOR ALL
      USING (user_id = current_setting('myapp.current_user_uuid')::uuid);
  ```
  (Przy założeniu, że aplikacja ustawia zmienną `myapp.current_user_uuid` dla aktualnie zalogowanego użytkownika)

## 5. Dodatkowe uwagi
- Włączenie rozszerzenia `uuid-ossp` jest wymagane do użycia funkcji `uuid_generate_v4()`:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```
- Schemat jest zaprojektowany zgodnie z zasadami normalizacji do 3NF. Dalsze optymalizacje (indeksy, partycjonowanie) mogą być rozważone w przyszłych iteracjach produktu. 