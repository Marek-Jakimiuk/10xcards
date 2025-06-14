import type { FlashcardGenerateResponseDTO, FlashcardSuggestionDTO } from '../../types';
// import { OpenAI } from 'openai';
import { supabaseClient, DEFAULT_USER_ID, type SupabaseClient } from '../../db/supabase.client';

export class FlashcardService {
  // private openai: OpenAI;
  private supabase: SupabaseClient;

  constructor() {
    // const apiKey = import.meta.env.OPENAI_API_KEY;
    // if (!apiKey) {
    //   throw new Error('OpenAI API key is not configured');
    // }
    // this.openai = new OpenAI({ apiKey });
    this.supabase = supabaseClient;
  }


  private async callAIService(text: string): Promise<FlashcardSuggestionDTO[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return Array.from({ length: 3 }, (_, i) => ({
      przod: `What is the capital of France? ${i}`,
      tyl: `Paris ${i}`
    }))
  }

  private async logOperation(action: string, details?: any) {
    try {
      const data = await this.supabase.from('fiszki_logs').insert({
        user_id: DEFAULT_USER_ID,
        action,
        details,
        fiszka_id: '00000000-0000-0000-0000-000000000000'
      });
      console.log('TC:  ~ data ~ data:', data);

      return data;
    } catch (error) {
      console.error('Failed to log operation:', error);
    }
  }

  private async saveGeneratedFlashcards(data: {
    title: string,
    text: string,
  }) {
    const { error } = await this.supabase.from('decks').insert({
      name: data.title,
      description: data.text,
      user_id: DEFAULT_USER_ID,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to save deck:', error);
      throw new Error(`Failed to save deck: ${error.message}`);
    }
  }


  async generateFlashcards({text, title}: {text: string, title: string}): Promise<FlashcardGenerateResponseDTO> {
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

      const proposal = await this.callAIService(text)

      await this.saveGeneratedFlashcards({
        title: title,
        text: text
      });

      // const suggestions: FlashcardSuggestionDTO[] = response.flashcards.map((card: any) => ({
        const suggestions: FlashcardSuggestionDTO[] = proposal.map((card: FlashcardSuggestionDTO) => ({
          przod: card.przod,
          tyl: card.tyl
        }));

      await this.logOperation('generate_flashcards', {
        input_length: text.length,
        suggestions_count: suggestions.length,
        status: 'success'
      });

      console.log('4');

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