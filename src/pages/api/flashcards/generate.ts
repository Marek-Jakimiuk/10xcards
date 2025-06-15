// Import necessary modules and types
import { z } from 'zod';
import type { FlashcardGenerateCommand, FlashcardGenerateResponseDTO } from '../../../types';
// Import funkcji serwisowej AI
import { getFlashcardGenerationResponse } from '../../../lib/services/ai.service';

// Disable prerender for dynamic API endpoint
export const prerender = false;

// POST /api/flashcards/generate - Generate flashcards using AI service
export async function POST({ request, locals }: { request: Request, locals: any }) {
  try {
    // Validate request body
    const body = await request.json();
    const flashcardGenerateSchema = z.object({
      text: z.string().min(1000).max(10000)
    });
    const command: FlashcardGenerateCommand = flashcardGenerateSchema.parse(body);

    // Authenticate user
    const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Call service function to get flashcard generation response
    const responseDto: FlashcardGenerateResponseDTO = await getFlashcardGenerationResponse(command);

    return new Response(JSON.stringify(responseDto), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('Error in POST /api/flashcards/generate:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), { status: 500 });
  }
} 