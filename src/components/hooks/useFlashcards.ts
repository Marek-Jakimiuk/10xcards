import { useState, useCallback, useEffect } from "react";
import { toastService, errorMessages } from "../../lib/toast";
import type {
  FlashcardsState,
  FlashcardFilters,
  FlashcardDTO,
  FlashcardCreateCommand,
  FlashcardUpdateCommand,
  FlashcardListResponseDTO,
  FlashcardDetailDTO,
  PaginationDTO,
} from "../../types";

interface UseFlashcardsReturn {
  state: FlashcardsState;
  loadFlashcards: (filters: FlashcardFilters) => Promise<void>;
  createFlashcard: (data: FlashcardCreateCommand) => Promise<void>;
  updateFlashcard: (id: string, data: FlashcardUpdateCommand) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  setFilters: (filters: Partial<FlashcardFilters>) => void;
  openModal: (mode: "add" | "edit", flashcard?: FlashcardDTO) => void;
  closeModal: () => void;
  openConfirmDialog: (flashcard: FlashcardDTO) => void;
  closeConfirmDialog: () => void;
}

const DEFAULT_FILTERS: FlashcardFilters = {
  page: 1,
  limit: 12,
};

const DEFAULT_PAGINATION: PaginationDTO = {
  page: 1,
  limit: 12,
  total: 0,
};

export function useFlashcards(): UseFlashcardsReturn {
  // Separate filters state for better control
  const [filters, setFilters] = useState<FlashcardFilters>(DEFAULT_FILTERS);

  const [state, setState] = useState<Omit<FlashcardsState, "filters">>({
    items: [],
    pagination: DEFAULT_PAGINATION,
    loading: false,
    selected: undefined,
    modalOpen: false,
    modalMode: "add",
    confirmOpen: false,
  });

  // Modal and dialog management - defined early to be used in other callbacks
  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      modalOpen: false,
      selected: undefined,
    }));
  }, []);

  const closeConfirmDialog = useCallback(() => {
    setState((prev) => ({
      ...prev,
      confirmOpen: false,
      selected: undefined,
    }));
  }, []);

  // Load flashcards from API
  const loadFlashcards = useCallback(async (filtersToUse: FlashcardFilters) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: undefined }));

      // Build query parameters
      const params = new URLSearchParams({
        page: filtersToUse.page.toString(),
        limit: filtersToUse.limit.toString(),
      });

      if (filtersToUse.deckId) {
        params.append("deckId", filtersToUse.deckId);
      }
      if (filtersToUse.status) {
        params.append("status", filtersToUse.status);
      }

      const response = await fetch(`/api/flashcards?${params.toString()}`, {
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
        throw new Error(errorData.message || "Nie udało się pobrać fiszek");
      }

      const data: FlashcardListResponseDTO = await response.json();

      setState((prev) => ({
        ...prev,
        items: data.flashcards,
        pagination: data.pagination,
        loading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : errorMessages.serverError;
      setState((prev) => ({ ...prev, loading: false, error: message }));
      toastService.error(message);
    }
  }, []);

  // Create flashcard
  const createFlashcard = useCallback(
    async (data: FlashcardCreateCommand) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const response = await fetch("/api/flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            return;
          }
          const errorData = await response.json().catch(() => ({ message: "Wystąpił błąd" }));
          throw new Error(errorData.message || "Nie udało się utworzyć fiszki");
        }

        toastService.success("Dodano fiszkę");
        await loadFlashcards(filters);
        closeModal();
      } catch (error) {
        const message = error instanceof Error ? error.message : errorMessages.serverError;
        setState((prev) => ({ ...prev, loading: false }));
        toastService.error(message);
      }
    },
    [loadFlashcards, filters, closeModal]
  );

  // Update flashcard
  const updateFlashcard = useCallback(
    async (id: string, data: FlashcardUpdateCommand) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const response = await fetch(`/api/flashcards/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            return;
          }
          if (response.status === 404) {
            toastService.error("Fiszka nie istnieje");
            await loadFlashcards(filters);
            return;
          }
          const errorData = await response.json().catch(() => ({ message: "Wystąpił błąd" }));
          throw new Error(errorData.message || "Nie udało się zaktualizować fiszki");
        }

        const updatedFlashcard: FlashcardDetailDTO = await response.json();

        // Update item in state
        setState((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item.id === id
              ? {
                  id: updatedFlashcard.id,
                  przod: updatedFlashcard.przod,
                  tyl: updatedFlashcard.tyl,
                  status: updatedFlashcard.status,
                  deck_id: updatedFlashcard.deck_id,
                }
              : item
          ),
          loading: false,
        }));

        toastService.success("Zaktualizowano fiszkę");
        closeModal();
      } catch (error) {
        const message = error instanceof Error ? error.message : errorMessages.serverError;
        setState((prev) => ({ ...prev, loading: false }));
        toastService.error(message);
      }
    },
    [loadFlashcards, filters, closeModal]
  );

  // Delete flashcard
  const deleteFlashcard = useCallback(
    async (id: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const response = await fetch(`/api/flashcards/${id}`, {
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
            toastService.error("Fiszka nie istnieje");
            await loadFlashcards(filters);
            return;
          }
          const errorData = await response.json().catch(() => ({ message: "Wystąpił błąd" }));
          throw new Error(errorData.message || "Nie udało się usunąć fiszki");
        }

        // Remove item from state
        setState((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.id !== id),
          loading: false,
        }));

        toastService.success("Usunięto fiszkę");
        closeConfirmDialog();
      } catch (error) {
        const message = error instanceof Error ? error.message : errorMessages.serverError;
        setState((prev) => ({ ...prev, loading: false }));
        toastService.error(message);
      }
    },
    [loadFlashcards, filters, closeConfirmDialog]
  );

  // Set filters - now updates separate filters state
  const updateFilters = useCallback((newFilters: Partial<FlashcardFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Modal and dialog opening
  const openModal = useCallback((mode: "add" | "edit", flashcard?: FlashcardDTO) => {
    setState((prev) => ({
      ...prev,
      modalOpen: true,
      modalMode: mode,
      selected: flashcard,
    }));
  }, []);

  const openConfirmDialog = useCallback((flashcard: FlashcardDTO) => {
    setState((prev) => ({
      ...prev,
      confirmOpen: true,
      selected: flashcard,
    }));
  }, []);

  // Load data whenever filters change
  useEffect(() => {
    loadFlashcards(filters);
  }, [filters, loadFlashcards]);

  return {
    state: { ...state, filters }, // Combine state with filters
    loadFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    setFilters: updateFilters,
    openModal,
    closeModal,
    openConfirmDialog,
    closeConfirmDialog,
  };
}
