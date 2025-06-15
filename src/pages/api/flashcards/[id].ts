// Import dodatkowych funkcji serwisowych
import { getFlashcardById, updateFlashcard, deleteFlashcard } from '../../../lib/services/flashcard.service';

// Import zod
import { z } from 'zod';
import type { FlashcardDetailDTO } from '../../../types';

// Disable prerender for dynamic API endpoints
export const prerender = false;

// GET /api/flashcards/{id} - Retrieve a single flashcard
export async function GET({ params, locals }: { params: { id: string }, locals: any }) {
  try {
    // Validate id parameter
    const idSchema = z.object({ id: z.string().uuid() });
    const { id } = idSchema.parse(params);

    // Authenticate user
    const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Use service function to get flashcard by id
    const flashcard: FlashcardDetailDTO = await getFlashcardById({
      supabase: locals.supabase,
      user,
      id
    });

    return new Response(JSON.stringify(flashcard), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('Error in GET /api/flashcards/[id]:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), { status: 500 });
  }
}

// PUT /api/flashcards/{id} - Update a flashcard
export async function PUT({ params, request, locals }: { params: { id: string }, request: Request, locals: any }) {
  try {
    // Validate id parameter
    const idSchema = z.object({ id: z.string().uuid() });
    const { id } = idSchema.parse(params);

    // Define and validate the update schema for flashcard
    const flashcardUpdateSchema = z.object({
      przod: z.string().max(200),
      tyl: z.string().max(500),
      status: z.enum(['oczekująca', 'zatwierdzona', 'odrzucona'])
    });
    const updateData = flashcardUpdateSchema.parse(await request.json());

    // Authenticate user
    const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Use service function to update flashcard
    const updatedFlashcard: FlashcardDetailDTO = await updateFlashcard({
      supabase: locals.supabase,
      user,
      id,
      updateData
    });

    return new Response(JSON.stringify(updatedFlashcard), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('Error in PUT /api/flashcards/[id]:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), { status: 500 });
  }
}

// DELETE /api/flashcards/{id} - Delete a flashcard
export async function DELETE({ params, locals }: { params: { id: string }, locals: any }) {
  try {
    // Validate id parameter
    const idSchema = z.object({ id: z.string().uuid() });
    const { id } = idSchema.parse(params);

    // Authenticate user
    const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Use service function to delete flashcard
    await deleteFlashcard({
      supabase: locals.supabase,
      user,
      id
    });

    return new Response(JSON.stringify({ message: 'Flashcard deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('Error in DELETE /api/flashcards/[id]:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), { status: 500 });
  }
} 