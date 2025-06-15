// Import necessary modules and types
import { z } from "zod";
import type { FlashcardGenerateCommand, FlashcardGenerateResponseDTO } from "../../../types";
import { FlashcardGeneratorService } from "../../../lib/services/flashcard.generator.service";

// Disable prerender for dynamic API endpoint
export const prerender = false;

// POST /api/flashcards/generate - Generate flashcards using AI service
export async function POST({ request, locals }: { request: Request; locals: any }) {
  console.log("🎯 [API] Starting POST /api/flashcards/generate");

  try {
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

    console.log("⚙️ [API] Initializing FlashcardGeneratorService");
    const flashcardGenerator = new FlashcardGeneratorService();

    console.log("🤖 [API] Calling generateFlashcards");
    const responseDto: FlashcardGenerateResponseDTO = await flashcardGenerator.generateFlashcards({
      text: command.text,
      title: command.title,
    });

    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("✅ [API] Successfully generated flashcards:", {
      suggestionsCount: responseDto.suggestions.length,
    });

    return new Response(JSON.stringify(responseDto), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
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
