import React from "react";
import { FlashcardItem } from "./FlashcardItem";
import { Skeleton } from "./ui/skeleton";
import type { FlashcardDTO, DeckDTO } from "../types";
import { Card, CardContent } from "./ui/card";

interface FlashcardListProps {
  flashcards: FlashcardDTO[];
  loading: boolean;
  onEdit: (flashcard: FlashcardDTO) => void;
  onDelete: (flashcard: FlashcardDTO) => void;
  decks: DeckDTO[];
  decksLoading: boolean;
}

export function FlashcardList({ flashcards, loading, onEdit, onDelete, decks, decksLoading }: FlashcardListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <p className="text-gray-500 text-lg">Brak fiszek do wyświetlenia</p>
          <p className="text-gray-400 text-sm mt-2">Dodaj nową fiszkę lub zmień filtry, aby zobaczyć fiszki</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {flashcards.map((flashcard) => (
        <FlashcardItem
          key={flashcard.id}
          data={flashcard}
          {...{ onEdit, onDelete, decks }}
          decksLoading={decksLoading}
        />
      ))}
    </div>
  );
}
