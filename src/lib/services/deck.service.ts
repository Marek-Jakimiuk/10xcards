// import type { SupabaseClient } from "@supabase/supabase-js";
import type { supabaseClient } from "../../db/supabase.client";
import type { DeckDTO, DeckCreateCommand } from "../../types";

export class DeckService {
  constructor(private supabase: supabaseClient) {}

  async listDecks(userId: string): Promise<DeckDTO[]> {
    const { data, error } = await this.supabase.from("decks").select("id, name, description").eq("user_id", userId);
    if (error) {
      throw error;
    }
    return data;
  }

  async createDeck(userId: string, command: DeckCreateCommand): Promise<DeckDTO> {
    const deckData = {
      user_id: userId,
      name: command.name,
      description: command.description || "",
    };

    const { data, error } = await this.supabase
      .from("decks")
      .insert([deckData])
      .select("id, name, description")
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  async deleteDeck(deckId: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("decks").delete().eq("id", deckId).eq("user_id", userId);

    if (error) {
      throw error;
    }
  }

  // Future methods: getDeck, updateDeck
}
