import type { FlashcardGenerateResponseDTO, FlashcardSuggestionDTO } from '../../types';
import { OpenAI } from 'openai';
import { supabaseClient, DEFAULT_USER_ID, type SupabaseClient } from '../../db/supabase.client';

export class FlashcardService {
  private openai: OpenAI;
  private supabase: SupabaseClient;

  constructor() {
    const apiKey = import.meta.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    this.openai = new OpenAI({ apiKey });
    this.supabase = supabaseClient;
  }

  private async logOperation(action: string, details?: any) {
    try {
      await this.supabase.from('fiszki_logs').insert({
        user_id: DEFAULT_USER_ID,
        action,
        details,
        // Since we're logging AI generation which happens before flashcard creation,
        // we'll use a special fiszka_id that indicates this is a generation log
        fiszka_id: '00000000-0000-0000-0000-000000000000'
      });
    } catch (error) {
      console.error('Failed to log operation:', error);
    }
  }

  async generateFlashcards(text: string): Promise<FlashcardGenerateResponseDTO> {
    try {
      // const completion = await this.openai.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: [
      //     {
      //       role: "system",
      //       content: "You are a helpful assistant that creates flashcards from text. Create concise, clear questions and answers that test understanding of key concepts."
      //     },
      //     {
      //       role: "user",
      //       content: `Create 5-10 flashcards from the following text. Each flashcard should have a question (przod) and answer (tyl). Format the response as a JSON array of objects with 'przod' and 'tyl' properties. Text: ${text}`
      //     }
      //   ],
      //   response_format: { type: "json_object" }
      // });

      // const response = JSON.parse(completion.choices[0].message.content || '{}');
      
      // if (!Array.isArray(response.flashcards)) {
      //   throw new Error('Invalid response format from OpenAI');
      // }


      const response = {
        flashcards: [
          { przod: 'What is the capital of France?', tyl: 'Paris' },
          { przod: 'What is the capital of Germany?', tyl: 'Berlin' }
        ]
      };

      const suggestions: FlashcardSuggestionDTO[] = response.flashcards.map((card: any) => ({
        przod: card.przod,
        tyl: card.tyl
      }));

      await this.logOperation('generate_flashcards', {
        input_length: text.length,
        suggestions_count: suggestions.length,
        status: 'success'
      });

      return { suggestions };
    } catch (error) {
      await this.logOperation('generate_flashcards', {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      });
      console.error('Error generating flashcards with AI:', error);
      throw new Error('Failed to generate flashcards');
    }
  }
} 