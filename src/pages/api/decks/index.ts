// Updated imports at the top of the file
import { z } from "zod";
import type { APIRoute } from "astro";
import { Locals } from "../../../types";
import { DeckService } from "../../../lib/services/deck.service";
import { handleError } from "../../../lib/error-handler";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

// GET endpoint (existing, assumes it exists)
export const GET: APIRoute = async ({ request, locals }: { request: Request, locals: Locals & { user: { id: string } } }) => {
  const { user, supabase } = locals;
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const deckService = new DeckService(supabase);
    const decks = await deckService.listDecks(user.id);
    // const decks = await deckService.listDecks(DEFAULT_USER_ID);
    return new Response(JSON.stringify({ decks }), { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};

// POST endpoint for creating a new deck
export const POST: APIRoute = async ({ request, locals }: { request: Request, locals: Locals & { user: { id: string } } }) => {
  const { user, supabase } = locals;
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  let requestData;
  try {
    requestData = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const DeckCreateSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().max(500).optional()
  });

  const result = DeckCreateSchema.safeParse(requestData);
  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error.flatten() }), { status: 400 });
  }
  const command = result.data;
  const deckService = new DeckService(supabase);
  try {
    // const newDeck = await deckService.createDeck(DEFAULT_USER_ID, command);
    const newDeck = await deckService.createDeck(user.id, command);
    return new Response(JSON.stringify(newDeck), { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}; 