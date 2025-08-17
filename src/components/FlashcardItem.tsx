import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Edit, Trash2, FolderOpen } from "lucide-react";
import type { FlashcardDTO, FlashcardStatus, DeckDTO } from "../types";

interface FlashcardItemProps {
  data: FlashcardDTO;
  onEdit: (flashcard: FlashcardDTO) => void;
  onDelete: (flashcard: FlashcardDTO) => void;
  decks: DeckDTO[];
  decksLoading: boolean;
}

const statusColors: Record<FlashcardStatus, string> = {
  oczekująca: "border-2 bg-yellow-100 text-yellow-800 border-yellow-800",
  zatwierdzona: "border-2 bg-green-100 text-green-800 border-green-800",
  odrzucona: "border-2 bg-red-100 text-red-800 border-red-800",
};

const statusLabels: Record<FlashcardStatus, string> = {
  oczekująca: "Oczekująca",
  zatwierdzona: "Zatwierdzona",
  odrzucona: "Odrzucona",
};

export function FlashcardItem({ data, onEdit, onDelete, decks, decksLoading }: FlashcardItemProps) {
  // Znajdź nazwę deck bezpośrednio z przekazanych decks
  const deckName = data.deck_id ? decks.find((deck) => deck.id === data.deck_id)?.name : null;

  const handleEdit = () => {
    onEdit(data);
  };

  const handleDelete = () => {
    onDelete(data);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center p-2 rounded text-xs font-medium ${statusColors[data.status as FlashcardStatus]}`}
          >
            {statusLabels[data.status as FlashcardStatus]}
          </span>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 w-8 p-0" title="Edytuj fiszkę">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Usuń fiszkę"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs">
          {/* <FolderOpen className="h-3 w-3" /> */}
          {data.deck_id ? (
            <span className="text-gray-600">{decksLoading ? "Ładowanie..." : deckName || "Nieznana talia"}</span>
          ) : (
            <span className="text-gray-400">Brak talii</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col grow">
        <div className="mb-auto">
          <p className="text-sm font-medium text-gray-600 mb-1">Przód:</p>
          <p className="text-sm">{data.przod}</p>
        </div>
        <div className="flex flex-col mt-4 flex-end">
          <p className="text-sm font-medium text-gray-600 mb-1">Tył:</p>
          <p className="text-sm text-gray-700 italic">{data.tyl}</p>
        </div>
      </CardContent>
    </Card>
  );
}
