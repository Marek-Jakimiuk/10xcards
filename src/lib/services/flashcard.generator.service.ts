import type { FlashcardGenerateResponseDTO } from "../../types";
import { supabaseClient } from "../../db/supabase.client";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  OpenRouterService,
  type OpenRouterConfig,
  flashcardSchema,
  type FlashcardResponse,
  ValidationError,
  ApiError, // ... istniejące importy ...
  OpenRouterError,
} from "../openrouter-service";

export class FlashcardGeneratorService {
  private openRouter: OpenRouterService;
  private supabase: SupabaseClient;

  constructor() {
    const apiKey = import.meta.env.OPENROUTER_API_KEY;
    console.log("🔑 [FlashcardGenerator] API Key status:", apiKey ? "✅" : "Missing");

    if (!apiKey) {
      console.error("❌ [FlashcardGenerator] OpenRouter API key is not configured");
      throw new Error("OpenRouter API key is not configured");
    }

    const config: OpenRouterConfig = {
      apiKey,
      endpoint: "https://openrouter.ai",
      modelName: "openai/o4-mini",
      modelParams: {
        temperature: 0.7,
        max_tokens: 2000,
      },
      responseFormat: {
        type: "json_schema",
        schema: flashcardSchema,
      },
      systemMessage: `You are a helpful assistant that creates flashcards from text. Create concise, clear questions and answers that test understanding of key concepts. Each flashcard should have a question (przod) and answer (tyl).`,
    };
    console.log("⚙️ [FlashcardGenerator] Initializing with config:", {
      endpoint: config.endpoint,
      model: config.modelName,
      params: config.modelParams,
    });
    this.openRouter = new OpenRouterService(config);
    this.supabase = supabaseClient;
    console.log("✅ [FlashcardGenerator] Service initialized successfully");
  }

  private async callAIService(text: string): Promise<FlashcardResponse> {
    const prompt = `Create 4-12 flashcards from the following text. Each flashcard should have a question (przod) and answer (tyl). Format the response as a JSON object with a 'flashcards' array containing objects with 'przod' and 'tyl' properties. 
    Make sure to:
    1. Use proper JSON syntax with double quotes
    2. Include ONLY the JSON object, no additional text
    3. Make each question (przod) and answer (tyl) clear and concise

    Text to process: ${text}`;

    try {
      console.log("📤 [FlashcardGenerator] Sending request to OpenRouter", prompt, flashcardSchema);
      return await this.openRouter.sendStructuredChatMessage(prompt, flashcardSchema);
    } catch (error) {
      console.error("💥 [FlashcardGenerator] Error calling OpenRouter:", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                // stack: error.stack,
              }
            : error,
      });
      throw new Error("Failed to generate flashcards with AI");
    }
  }

  private async createDeck(data: { title: string; text: string }, userId: string): Promise<string> {
    console.log("💾 [FlashcardGenerator] Saving generated flashcards:", {
      title: data.title,
      textLength: data.text.length,
      userId,
    });

    const { data: deck, error } = await this.supabase
      .from("decks")
      .insert({
        name: data.title,
        description: data.text,
        user_id: userId,
        // Usuwamy created_at i updated_at - baza danych ustawi je automatycznie
      })
      .select("id")
      .single();

    if (error) {
      console.error("❌ [FlashcardGenerator] Failed to save deck:", error);
      throw new Error(`Failed to save deck: ${error.message}`);
    }

    console.log("✅ [FlashcardGenerator] Successfully saved deck with ID:", deck.id);
    return deck.id; // Zwracamy ID dla późniejszego użycia
  }

  async generateFlashcardSuggestions(text: string): Promise<import("../../types").FlashcardSuggestionDTO[]> {
    // console.log("🎯 [FlashcardGenerator] Starting flashcard generation (only AI suggestions):", {
    //   textLength: text.length,
    // });

    try {
      // console.log("🤖 [FlashcardGenerator] Calling AI service");
      const result = await this.callAIService(text);
      // console.log("✅ [FlashcardGenerator] AI service returned suggestions:", {
      //   count: result.flashcards.length,
      // });

      return result.flashcards;
    } catch (error) {
      console.error("💥 [FlashcardGenerator] Error in generateFlashcardSuggestions:", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
              }
            : error,
      });

      if (error instanceof ValidationError) {
        throw new Error(`Failed to validate flashcards: ${error.message}`);
      } else if (error instanceof ApiError) {
        throw new Error(`API error while generating flashcards: ${error.message}`);
      } else if (error instanceof OpenRouterError) {
        throw new Error(`OpenRouter error: ${error.message}`);
      }

      throw new Error("Failed to generate flashcards");
    }
  }

  async generateFlashcards({
    text,
    title,
    userId,
    deckId,
  }: {
    text: string;
    title: string;
    userId: string;
    deckId: string;
  }): Promise<FlashcardGenerateResponseDTO> {
    console.log("🎯 [FlashcardGenerator] Starting flashcard generation:", {
      titleLength: title.length,
      textLength: text.length,
      userId: userId,
      deckId: deckId,
    });

    try {
      console.log("🤖 [FlashcardGenerator] Calling AI service");
      const result = await this.callAIService(text);

      // console.log("💾 [FlashcardGenerator] Creating deck for generated flashcards");
      const deckId = await this.createDeck(
        {
          title: title,
          text: text,
        },
        userId
      );
      console.log("✅ [FlashcardGenerator] Deck created successfully with ID:", deckId);

      return {
        suggestions: result.flashcards,
        deckId: deckId,
      };
    } catch (error) {
      console.error("💥 [FlashcardGenerator] Error in generateFlashcards:", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                // stack: error.stack,
                cause: error.cause,
                details:
                  error instanceof ApiError
                    ? error.details
                    : error instanceof OpenRouterError
                      ? error.metadata
                      : undefined,
              }
            : error,
      });

      if (error instanceof ValidationError) {
        throw new Error(`Failed to validate flashcards: ${error.message}`);
      } else if (error instanceof ApiError) {
        throw new Error(`API error while generating flashcards: ${error.message}`);
      } else if (error instanceof OpenRouterError) {
        throw new Error(`OpenRouter error: ${error.message}`);
      }

      throw new Error("Failed to generate flashcards");
    }
  }
}
