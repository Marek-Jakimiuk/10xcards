import type { FlashcardGenerateResponseDTO } from "../../types";
import { supabaseClient, DEFAULT_USER_ID } from "../../db/supabase.client";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  OpenRouterService,
  type OpenRouterConfig,
  flashcardSchema,
  type FlashcardResponse,
} from "../openrouter-service";

export class FlashcardGeneratorService {
  private openRouter: OpenRouterService;
  private supabase: SupabaseClient;

  constructor() {
    const apiKey = import.meta.env.OPENROUTER_API_KEY;
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log(
      "🔑 [FlashcardGenerator] API Key status:",
      apiKey ? "Present (length: " + apiKey.length + ")" : "Missing"
    );

    if (!apiKey) {
      console.error("❌ [FlashcardGenerator] OpenRouter API key is not configured");
      throw new Error("OpenRouter API key is not configured");
    }

    const config: OpenRouterConfig = {
      apiKey,
      endpoint: "https://openrouter.ai",
      // modelName: "openai/gpt-4-turbo-preview",
      modelName: "openai/o4-mini",
      modelParams: {
        temperature: 0.7,
        max_tokens: 1000,
      },
      systemMessage: `You are a helpful assistant that creates flashcards from text. Create concise, clear questions and answers that test understanding of key concepts. Each flashcard should have a question (przod) and answer (tyl).`,
    };

    console.log("⚙️ [FlashcardGenerator] Initializing with config:", {
      endpoint: config.endpoint,
      model: config.modelName,
      params: config.modelParams,
    });

    console.log("11111");
    this.openRouter = new OpenRouterService(config);
    console.log("TC:  ~ constructor ~ this.openRouter:", this.openRouter);
    console.log("11111");

    this.supabase = supabaseClient;
    console.log("✅ [FlashcardGenerator] Service initialized successfully");
  }

  private async callAIService(text: string): Promise<FlashcardResponse> {
    console.log("🤖 [FlashcardGenerator] Starting AI service call with text length:", text.length);

    const prompt = `Create 5-10 flashcards from the following text. Each flashcard should have a question (przod) and answer (tyl). Format the response as a JSON object with a 'flashcards' array containing objects with 'przod' and 'tyl' properties. Text to process: ${text}`;

    try {
      console.log("📤 [FlashcardGenerator] Sending request to OpenRouter");
      return await this.openRouter.sendStructuredChatMessage(prompt, flashcardSchema);
    } catch (error) {
      console.error("💥 [FlashcardGenerator] Error calling OpenRouter:", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      });
      throw new Error("Failed to generate flashcards with AI");
    }
  }

  private async saveGeneratedFlashcards(data: { title: string; text: string }) {
    console.log("💾 [FlashcardGenerator] Saving generated flashcards:", {
      title: data.title,
      textLength: data.text.length,
    });

    const { error } = await this.supabase.from("decks").insert({
      name: data.title,
      description: data.text,
      user_id: DEFAULT_USER_ID,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("❌ [FlashcardGenerator] Failed to save deck:", error);
      throw new Error(`Failed to save deck: ${error.message}`);
    }

    console.log("✅ [FlashcardGenerator] Successfully saved deck");
  }

  async generateFlashcards({ text, title }: { text: string; title: string }): Promise<FlashcardGenerateResponseDTO> {
    console.log("🎯 [FlashcardGenerator] Starting flashcard generation:", {
      titleLength: title.length,
      textLength: text.length,
    });

    try {
      console.log("🤖 [FlashcardGenerator] Calling AI service");
      const result = await this.callAIService(text);
      console.log("✅ [FlashcardGenerator] AI service returned suggestions:", {
        count: result.flashcards.length,
      });

      console.log("💾 [FlashcardGenerator] Saving flashcards to database");
      await this.saveGeneratedFlashcards({
        title: title,
        text: text,
      });
      console.log("✅ [FlashcardGenerator] Flashcards saved successfully");

      return { suggestions: result.flashcards };
    } catch (error) {
      console.error("💥 [FlashcardGenerator] Error in generateFlashcards:", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      });

      throw new Error("Failed to generate flashcards");
    }
  }
}
