import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request, locals }) => {
  // Pobieramy sesję użytkownika z context.locals.supabase
  const { data: { session }, error } = await locals.supabase.auth.getSession();
  if (error) {
    return new Response(JSON.stringify({ message: "Błąd pobierania sesji", error }), { status: 500 });
  }
  if (!session) {
    return new Response(JSON.stringify({ message: "Użytkownik niezalogowany" }), { status: 401 });
  }

  // Odczytujemy ID użytkownika
  const user_id = session.user.id;

  // Odczytujemy dane z żądania, np. nazwę deck-u
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ message: "Nieprawidłowy format danych" }), { status: 400 });
  }

  const { deck_name } = body;
  if (!deck_name) {
    return new Response(JSON.stringify({ message: "Brakuje nazwy decku" }), { status: 400 });
  }

  // Wstawiamy nowy rekord do tabeli 'decks' używając user_id
  const { data, error: insertError } = await locals.supabase
    .from('decks')
    .insert({ user_id, deck_name });

  if (insertError) {
    return new Response(JSON.stringify({ message: "Błąd zapisywania decku", insertError }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}; 