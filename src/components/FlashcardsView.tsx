import React from "react";
import { useFlashcards } from "./hooks/useFlashcards";
import { useDecks } from "./hooks/useDecks";
import { FlashcardsToolbar } from "./FlashcardsToolbar";
import { FlashcardList } from "./FlashcardList";
import { FlashcardModal } from "./FlashcardModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { Pagination } from "./Pagination";
import type { FlashcardDTO, FlashcardFormValues, FlashcardCreateCommand, FlashcardUpdateCommand } from "../types";
import { Card, CardContent } from "./ui/card";

interface FlashcardsViewProps {
  userId: string;
}

export function FlashcardsView({ userId }: FlashcardsViewProps) {
  const {
    state,
    loadFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    setFilters,
    openModal,
    closeModal,
    openConfirmDialog,
    closeConfirmDialog,
  } = useFlashcards();

  // Pobieramy decks jeden raz w głównym komponencie
  const { decks, loading: decksLoading, deleteDeck } = useDecks();

  const handleFiltersChange = (newFilters: Partial<typeof state.filters>) => {
    setFilters(newFilters);
    // loadFlashcards will be called automatically by useEffect when filters change
  };

  const handleAddFlashcard = () => {
    openModal("add");
  };

  const handleEditFlashcard = (flashcard: FlashcardDTO) => {
    openModal("edit", flashcard);
  };

  const handleDeleteFlashcard = (flashcard: FlashcardDTO) => {
    openConfirmDialog(flashcard);
  };

  const handleModalSubmit = (values: FlashcardFormValues) => {
    try {
      if (state.modalMode === "add") {
        const command: FlashcardCreateCommand = {
          deck_id: values.deck_id || undefined, // Przekaż deck_id jeśli wybrano
          flashcards: [
            {
              przod: values.przod,
              tyl: values.tyl,
              status: "oczekująca", // New flashcards always start as pending
            },
          ],
        };
        createFlashcard(command);
      } else if (state.modalMode === "edit" && state.selected) {
        const command: FlashcardUpdateCommand = {
          przod: values.przod,
          tyl: values.tyl,
          status: values.status || "oczekująca",
        };
        updateFlashcard(state.selected.id, command);
      }
    } catch (error) {
      console.error("Modal submit error:", error);
      // Error handling is already done in the hooks, just log for debugging
    }
  };

  const handleConfirmDelete = () => {
    if (state.selected) {
      deleteFlashcard(state.selected.id);
    }
  };

  const handlePageChange = (page: number) => {
    handleFiltersChange({ page });
  };

  const handleDeleteDeck = async (deckId: string) => {
    try {
      await deleteDeck(deckId);
      // Po usunięciu deck resetuj filtry do "Wszystkie talie"
      // Sprawdzamy czy usunięty deck był aktualnie wybrany
      if (state.filters.deckId === deckId) {
        handleFiltersChange({ deckId: undefined });
      }
    } catch (error) {
      // Error jest już obsłużony w useDecks hook
      console.error("Failed to delete deck:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <CardContent>
          <div className="flex items-center justify-between">
            <h1 className="text-6xl font-bold mb-4">Moje Fiszki</h1>
          </div>

          <FlashcardsToolbar
            filters={state.filters}
            onFiltersChange={handleFiltersChange}
            onAdd={handleAddFlashcard}
            onDeleteDeck={handleDeleteDeck}
            decks={decks}
            decksLoading={decksLoading}
          />
        </CardContent>
      </Card>

      <Pagination pagination={state.pagination} onPageChange={handlePageChange} loading={state.loading} />

      <FlashcardList
        flashcards={state.items}
        loading={state.loading}
        onEdit={handleEditFlashcard}
        onDelete={handleDeleteFlashcard}
        decks={decks}
        decksLoading={decksLoading}
      />

      <Pagination pagination={state.pagination} onPageChange={handlePageChange} loading={state.loading} />

      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">Błąd: {state.error}</div>
      )}

      <FlashcardModal
        open={state.modalOpen}
        mode={state.modalMode}
        initialValues={state.selected}
        onSubmit={handleModalSubmit}
        onClose={closeModal}
        loading={state.loading}
        decks={decks}
        decksLoading={decksLoading}
      />

      <ConfirmDialog
        open={state.confirmOpen}
        title="Usuń fiszkę"
        message={
          state.selected
            ? `Czy na pewno chcesz usunąć fiszkę "${state.selected.przod}"? Ta akcja jest nieodwracalna.`
            : "Czy na pewno chcesz usunąć tę fiszkę?"
        }
        onConfirm={handleConfirmDelete}
        onCancel={closeConfirmDialog}
        loading={state.loading}
      />
    </div>
  );
}
