import type { SupabaseClient } from '@supabase/supabase-js';
import type { DeckDTO, DeckCreateCommand } from "../../types";

export class DeckService {
  constructor(private supabase: SupabaseClient) {}

  async listDecks(userId: string): Promise<DeckDTO[]> {
    const { data, error } = await this.supabase
      .from('decks')
      .select('id, name, description')
      .eq('user_id', userId);
    if (error) {
      throw error;
    }
    return data;
  }

  async createDeck(userId: string, command: DeckCreateCommand): Promise<DeckDTO> {
    const { data, error } = await this.supabase
      .from('decks')
      .insert([{ user_id: userId, ...command }])
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  // Future methods: getDeck, updateDeck, deleteDeck
} 