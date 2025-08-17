import { z } from "zod";
import type { APIRoute } from "astro";
import { DeckService } from "../../../lib/services/deck.service";
import { handleError } from "../../../lib/error-handler";

// Disable prerender for dynamic API endpoint
export const prerender = false;

// DELETE /api/decks/[id] - Delete a deck
export const DELETE: APIRoute = async ({ params, locals }) => {
  const { user, supabase } = locals;

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const deckId = params.id;

  if (!deckId) {
    return new Response(JSON.stringify({ error: "Deck ID is required" }), { status: 400 });
  }

  // Validate UUID format
  const uuidSchema = z.string().uuid();
  const result = uuidSchema.safeParse(deckId);

  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid deck ID format" }), { status: 400 });
  }

  try {
    const deckService = new DeckService(supabase);
    await deckService.deleteDeck(deckId, user.id);

    return new Response(JSON.stringify({ message: "Deck deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting deck:", error);
    return handleError(error);
  }
};
