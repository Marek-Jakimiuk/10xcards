// Import wymaganych typów
import type { SupabaseClient } from '@supabase/supabase-js';
import type { 
  FlashcardListDTO, 
  FlashcardDetailDTO, 
  FlashcardCreateInput, 
  FlashcardUpdateCommand 
} from "../../types";

// Funkcja do pobierania fiszek z paginacją i opcjonalnym filtrowaniem
export async function listFlashcards({ supabase, user, page, limit, deckId, status }: { 
  supabase: SupabaseClient<any>, 
  user: any, 
  page: number, 
  limit: number, 
  deckId?: string, 
  status?: 'oczekująca' | 'zatwierdzona' | 'odrzucona'
}): Promise<{ flashcards: FlashcardListDTO[], totalCount: number }> {
  const start = (page - 1) * limit;
  const end = page * limit - 1;
  let query = supabase.from('fiszki').select('*', { count: 'exact' });
  if (deckId) {
    query = query.eq('deck_id', deckId);
  }
  if (status) {
    query = query.eq('status', status);
  }
  const { data, error, count } = await query.range(start, end);
  if (error) {
    throw new Error(error.message);
  }
  const flashcards: FlashcardListDTO[] = (data || []).map((item: any) => ({
    id: item.id,
    przod: item.przod,
    tyl: item.tyl,
    status: item.status
  }));
  return { flashcards, totalCount: count ?? 0 };
}

// Funkcja do tworzenia nowych fiszek
export async function createFlashcards({ supabase, user, deck_id, flashcards }: { 
  supabase: SupabaseClient<any>, 
  user: any, 
  deck_id?: string, 
  flashcards: FlashcardCreateInput[] 
}): Promise<FlashcardListDTO[]> {
  const flashcardsToInsert = flashcards.map(fc => ({
    ...fc,
    deck_id: deck_id || null,
    created_by: user.id
  }));
  const { data, error } = await supabase.from('fiszki').insert(flashcardsToInsert).select();
  if (error) {
    throw new Error(error.message);
  }
  const result: FlashcardListDTO[] = (data || []).map((item: any) => ({
    id: item.id,
    przod: item.przod,
    tyl: item.tyl,
    status: item.status
  }));
  return result;
}

// Funkcja do pobierania pojedynczej fiszki
export async function getFlashcardById({ supabase, user, id }: { 
  supabase: SupabaseClient<any>, 
  user: any, 
  id: string 
}): Promise<FlashcardDetailDTO> {
  const { data, error } = await supabase.from('fiszki').select('*').eq('id', id).single();
  if (error || !data) {
    throw new Error('Flashcard not found');
  }
  const flashcard: FlashcardDetailDTO = {
    id: data.id,
    przod: data.przod,
    tyl: data.tyl,
    status: data.status,
    deck_id: data.deck_id
  };
  return flashcard;
}

// Funkcja do aktualizacji fiszki
export async function updateFlashcard({ supabase, user, id, updateData }: { 
  supabase: SupabaseClient<any>, 
  user: any, 
  id: string, 
  updateData: FlashcardUpdateCommand 
}): Promise<FlashcardDetailDTO> {
  const { data, error } = await supabase.from('fiszki')
    .update(updateData)
    .eq('id', id)
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
    deck_id: data.deck_id
  };
  return flashcard;
}

// Funkcja do usuwania fiszki
export async function deleteFlashcard({ supabase, user, id }: { 
  supabase: SupabaseClient<any>, 
  user: any, 
  id: string
}): Promise<void> {
  const { error } = await supabase.from('fiszki').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
} 