import React from "react";
import { Button } from "./ui/button";
import { DeckSelect } from "./DeckSelect";
import { StatusFilter } from "./StatusFilter";
import { Plus, Trash2 } from "lucide-react";
import type { FlashcardFilters, DeckDTO } from "../types";
import { Card, CardContent } from "./ui/card";

interface FlashcardsToolbarProps {
  filters: FlashcardFilters;
  onFiltersChange: (filters: Partial<FlashcardFilters>) => void;
  onAdd: () => void;
  onDeleteDeck: (deckId: string) => void;
  decks: DeckDTO[];
  decksLoading: boolean;
}

export function FlashcardsToolbar({
  filters,
  onFiltersChange,
  onAdd,
  onDeleteDeck,
  decks,
  decksLoading,
}: FlashcardsToolbarProps) {
  const handleDeckChange = (deckId?: string) => {
    onFiltersChange({ deckId, page: 1 }); // Reset page when changing filters
  };

  const handleStatusChange = (status?: string) => {
    onFiltersChange({ status: status as any, page: 1 }); // Reset page when changing filters
  };

  const handleDeleteDeck = () => {
    if (filters.deckId) {
      onDeleteDeck(filters.deckId);
    }
  };

  // Find current deck name for display in delete button
  const currentDeck = filters.deckId ? decks.find((deck) => deck.id === filters.deckId) : null;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <DeckSelect
          value={filters.deckId}
          onValueChange={handleDeckChange}
          placeholder="Wybierz talię"
          decks={decks}
          decksLoading={decksLoading}
        />
        <StatusFilter value={filters.status} onValueChange={handleStatusChange} placeholder="Wybierz status" />
      </div>

      <div className="flex items-center gap-2">
        {filters.deckId && currentDeck && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteDeck}
            disabled={decksLoading}
            className="flex items-center gap-2"
            title={`Usuń talię "${currentDeck.name}"`}
          >
            <Trash2 className="h-4 w-4" />
            Usuń talię
          </Button>
        )}

        <Button
          onClick={() => {
            try {
              onAdd();
            } catch (error) {
              alert("Error in onAdd: " + error);
            }
          }}
          variant="ghost"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Dodaj fiszkę
        </Button>
      </div>
    </div>
  );
}
