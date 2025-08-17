// Import wymaganych typów
import type {
  FlashcardDTO,
  FlashcardDetailDTO,
  FlashcardCreateInput,
  FlashcardUpdateCommand,
  TypedSupabaseClient,
  User,
  FlashcardStatus,
  FiszkaRow,
} from "../../types";

// Funkcja do pobierania fiszek z paginacją i opcjonalnym filtrowaniem
export async function getFlashcards({
  supabase,
  user,
  page,
  limit,
  deckId,
  status,
}: {
  supabase: TypedSupabaseClient;
  user: User;
  page: number;
  limit: number;
  deckId?: string;
  status?: FlashcardStatus;
}): Promise<{ flashcards: FlashcardDTO[]; totalCount: number }> {
  const start = (page - 1) * limit;
  const end = page * limit - 1;
  let query = supabase.from("fiszki").select("*", { count: "exact" }).eq("user_id", user.id);
  if (deckId) {
    query = query.eq("deck_id", deckId);
  }
  if (status) {
    query = query.eq("status", status);
  }
  const { data, error, count } = await query.order("created_at", { ascending: false }).range(start, end);
  if (error) {
    throw new Error(error.message);
  }
  const flashcards: FlashcardDTO[] = (data || []).map((item: FiszkaRow) => ({
    id: item.id,
    przod: item.przod,
    tyl: item.tyl,
    status: item.status,
    deck_id: item.deck_id,
  }));
  return { flashcards, totalCount: count ?? 0 };
}

// Funkcja do tworzenia nowych fiszek
export async function createFlashcards({
  supabase,
  userId,
  deck_id,
  flashcards,
}: {
  supabase: TypedSupabaseClient;
  userId: string;
  deck_id?: string;
  flashcards: FlashcardCreateInput[];
}): Promise<FlashcardDTO[]> {
  const flashcardsToInsert = flashcards.map((fc) => ({
    ...fc,
    deck_id: deck_id || null,
    user_id: userId,
  }));
  const { data, error } = await supabase.from("fiszki").insert(flashcardsToInsert).select();
  if (error) {
    throw new Error(error.message);
  }
  const result: FlashcardDTO[] = (data || []).map((item: FiszkaRow) => ({
    id: item.id,
    przod: item.przod,
    tyl: item.tyl,
    status: item.status,
    deck_id: item.deck_id,
  }));
  return result;
}

// Funkcja do pobierania pojedynczej fiszki
export async function getFlashcardById({
  supabase,
  user,
  id,
}: {
  supabase: TypedSupabaseClient;
  user: User;
  id: string;
}): Promise<FlashcardDetailDTO> {
  const { data, error } = await supabase.from("fiszki").select("*").eq("id", id).eq("user_id", user.id).single();
  if (error || !data) {
    throw new Error("Flashcard not found");
  }
  const flashcard: FlashcardDetailDTO = {
    id: data.id,
    przod: data.przod,
    tyl: data.tyl,
    status: data.status,
    deck_id: data.deck_id,
  };
  return flashcard;
}

// Funkcja do aktualizacji fiszki
export async function updateFlashcard({
  supabase,
  user,
  id,
  updateData,
}: {
  supabase: TypedSupabaseClient;
  user: User;
  id: string;
  updateData: FlashcardUpdateCommand;
}): Promise<FlashcardDetailDTO> {
  const { data, error } = await supabase
    .from("fiszki")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }
  const flashcard: FlashcardDetailDTO = {
    id: data.id,
    przod: data.przod,
    tyl: data.tyl,
    status: data.status,
    deck_id: data.deck_id,
  };
  return flashcard;
}

// Funkcja do usuwania fiszki
export async function deleteFlashcard({
  supabase,
  user,
  id,
}: {
  supabase: TypedSupabaseClient;
  user: User;
  id: string;
}): Promise<void> {
  const { error } = await supabase.from("fiszki").delete().eq("id", id).eq("user_id", user.id);
  if (error) {
    throw new Error(error.message);
  }
}
