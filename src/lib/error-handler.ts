import { ZodError } from "zod";

export function handleError(error: unknown): Response {
  if (error instanceof ZodError) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  // Potentially add more error handling for other error types
  return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
}
