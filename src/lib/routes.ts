export const routesApi = {
  flashcardsBase: "/api/flashcards",
  flashcardsGenerate: "/api/flashcards/generate",
} as const;

export type RoutesApi = typeof routesApi;
