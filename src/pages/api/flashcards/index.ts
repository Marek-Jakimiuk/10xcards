// Import necessary modules and types
import { z } from "zod";
import { getFlashcards, createFlashcards } from "../../../lib/services/flashcard.service";

// Disable prerender for dynamic API endpoint
export const prerender = false;

// GET /api/flashcards - List flashcards with pagination and optional filtering
export async function GET({ request, locals }: { request: Request; locals: App.Locals }) {
  try {
    // Parse query parameters from the URL
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    // Define the query schema using Zod
    const querySchema = z.object({
      page: z
        .preprocess((arg) => Number(arg), z.number().int().min(1))
        .optional()
        .default(1),
      limit: z
        .preprocess((arg) => Number(arg), z.number().int().min(1).max(100))
        .optional()
        .default(20),
      deckId: z.string().uuid().optional(),
      status: z.enum(["oczekująca", "zatwierdzona", "odrzucona"]).optional(),
    });

    // Validate and parse query parameters
    const parsedQuery = querySchema.parse(params);
    const { page, limit, deckId, status } = parsedQuery;

    // Retrieve authenticated user from Supabase session
    const {
      data: { user },
      error: userError,
    } = await locals.supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Convert Supabase User to our internal User type
    const internalUser = {
      id: user.id,
      email: user.email ?? null,
    };

    // Use service function to list flashcards
    const { flashcards, totalCount } = await getFlashcards({
      supabase: locals.supabase,
      user: internalUser,
      page,
      limit,
      deckId,
      status,
    });

    // Prepare the response DTO
    const responseDto = {
      flashcards,
      pagination: {
        page,
        limit,
        total: totalCount,
      },
    };

    return new Response(JSON.stringify(responseDto), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("Error in GET /api/flashcards:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), { status: 500 });
  }
}

// POST /api/flashcards - Create new flashcards
export async function POST({ request, locals }: { request: Request; locals: App.Locals }) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const flashcardCreateSchema = z.object({
      deck_id: z.string().uuid().optional(),
      flashcards: z
        .array(
          z.object({
            przod: z.string().max(200),
            tyl: z.string().max(500),
            status: z.enum(["oczekująca", "zatwierdzona", "odrzucona"]),
          })
        )
        .nonempty(),
    });
    const command = flashcardCreateSchema.parse(body);

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await locals.supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Use service function to create flashcards
    const createdFlashcards = await createFlashcards({
      supabase: locals.supabase,
      userId: user.id,
      deck_id: command.deck_id,
      flashcards: command.flashcards,
    });

    return new Response(JSON.stringify({ flashcards: createdFlashcards }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("Error in POST /api/flashcards:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), { status: 500 });
  }
}
