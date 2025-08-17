import { useState, useCallback, useEffect } from "react";
import { toastService, errorMessages } from "../../lib/toast";
import type { DeckDTO, DeckListResponseDTO } from "../../types";

interface UseDecksReturn {
  decks: DeckDTO[];
  loading: boolean;
  error?: string;
  loadDecks: () => Promise<void>;
  deleteDeck: (deckId: string) => Promise<void>;
}

export function useDecks(): UseDecksReturn {
  const [decks, setDecks] = useState<DeckDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const loadDecks = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const response = await fetch("/api/decks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        const errorData = await response.json().catch(() => ({ message: "Wystąpił błąd" }));
        throw new Error(errorData.message || "Nie udało się pobrać talii");
      }

      const data: DeckListResponseDTO = await response.json();
      setDecks(data.decks);
    } catch (error) {
      const message = error instanceof Error ? error.message : errorMessages.serverError;
      setError(message);
      toastService.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDeck = useCallback(
    async (deckId: string) => {
      try {
        setLoading(true);

        const response = await fetch(`/api/decks/${deckId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            return;
          }
          if (response.status === 404) {
            toastService.error("Talia nie istnieje");
            await loadDecks();
            return;
          }
          const errorData = await response.json().catch(() => ({ message: "Wystąpił błąd" }));
          throw new Error(errorData.message || "Nie udało się usunąć talii");
        }

        // Remove deck from local state
        setDecks((prev) => prev.filter((deck) => deck.id !== deckId));
        toastService.success("Usunięto talię");
      } catch (error) {
        const message = error instanceof Error ? error.message : errorMessages.serverError;
        toastService.error(message);
      } finally {
        setLoading(false);
      }
    },
    [loadDecks]
  );

  // Load initial data
  useEffect(() => {
    loadDecks();
  }, [loadDecks]);

  return {
    decks,
    loading,
    error,
    loadDecks,
    deleteDeck,
  };
}
