import type { APIRoute } from 'astro';
import { z } from 'zod';
import type { FlashcardGenerateCommand, FlashcardGenerateResponseDTO } from '../../../types';
import { FlashcardService } from '../../../lib/services/flashcardService';
import { DEFAULT_USER_ID } from '../../../db/supabase.client';

// Validation schema for the request body
const generateFlashcardsSchema = z.object({
  title: z.string()
    .min(3, 'Title must not exceed 3 characters')
    .max(255, 'Title must not exceed 255 characters'),
  text: z.string()
    .min(1000, 'Text must be at least 1000 characters long')
    .max(10000, 'Text must not exceed 10000 characters')
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse and validate request body
    const body = await request.json() as FlashcardGenerateCommand;
    const validationResult = generateFlashcardsSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(JSON.stringify({
        error: 'Invalid input',
        details: validationResult.error.errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate flashcards using the service
    const flashcardService = new FlashcardService();
    const result = await flashcardService.generateFlashcards({title: validationResult.data.title,text: validationResult.data.text,});

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating flashcards:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: 'Failed to generate flashcards'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};