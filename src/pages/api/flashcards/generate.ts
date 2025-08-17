// Import necessary modules and types
import { z } from "zod";
import type { FlashcardGenerateCommand, FlashcardGenerateResponseDTO } from "../../../types";
import { FlashcardGeneratorService } from "../../../lib/services/flashcard.generator.service";
import { DeckService } from "../../../lib/services/deck.service";

// Disable prerender for dynamic API endpoint
export const prerender = false;

// POST /api/flashcards/generate - Generate flashcards using AI service
export async function POST({ request, locals }: { request: Request; locals: App.Locals }) {
  console.log("🎯 [API] Starting POST /api/flashcards/generate");

  try {
    // Authenticate user
    const {
      data: { user },
      error: userError,
    } = await locals.supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ [API] Unauthorized access attempt:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    console.log("✅ [API] User authenticated:", { userId: user.id, email: user.email });

    console.log("📦 [API] Parsing request body");
    const body = await request.json();
    console.log("📄 [API] Request body:", {
      textLength: body.text?.length,
      titleLength: body.title?.length,
    });

    const flashcardGenerateSchema = z.object({
      text: z.string().min(1000).max(10000),
      title: z.string().min(1).max(100),
    });

    console.log("🔍 [API] Validating request data");
    const command: FlashcardGenerateCommand = flashcardGenerateSchema.parse(body);
    console.log("✅ [API] Request validation successful");

    // Create deck first before generating flashcards
    console.log("📦 [API] Creating deck for flashcards");
    const deckService = new DeckService(locals.supabase);
    const newDeck = await deckService.createDeck(user.id, {
      name: command.title,
      description: `Generated from text: ${command.text.substring(0, 100)}...`,
    });
    console.log("✅ [API] Deck created successfully with ID:", newDeck.id);

    console.log("⚙️ [API] Initializing FlashcardGeneratorService");
    const flashcardGenerator = new FlashcardGeneratorService();

    console.log("🤖 [API] Calling generateFlashcards (without creating new deck)");
    const aiSuggestions = await flashcardGenerator.generateFlashcardSuggestions(command.text);

    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("✅ [API] Successfully generated flashcards:", {
      suggestionsCount: aiSuggestions.length,
      deckId: newDeck.id,
      userId: user.id,
    });

    const responseDto: FlashcardGenerateResponseDTO = {
      suggestions: aiSuggestions,
      deckId: newDeck.id,
    };

    return new Response(JSON.stringify(responseDto), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.error("💥 [API] Error in POST /api/flashcards/generate:", { err });

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
      }
    );
  }
}
