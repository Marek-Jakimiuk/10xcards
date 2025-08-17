import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useDecks } from "./hooks/useDecks";
import { Skeleton } from "./ui/skeleton";
import type { DeckDTO } from "../types";

interface DeckSelectProps {
  value?: string;
  onValueChange: (deckId?: string) => void;
  placeholder?: string;
  decks?: DeckDTO[]; // Optional external decks
  decksLoading?: boolean; // Optional external loading state
}

export function DeckSelect({
  value,
  onValueChange,
  placeholder = "Wszystkie talie",
  decks: externalDecks,
  decksLoading: externalDecksLoading,
}: DeckSelectProps) {
  // Use external decks if provided, otherwise fallback to internal hook
  const internalDecks = useDecks();

  // Prefer external data if provided
  const decks = externalDecks ?? internalDecks.decks;
  const loading = externalDecksLoading ?? internalDecks.loading;

  const handleValueChange = (val: string) => {
    if (val === "all") {
      onValueChange(undefined);
    } else {
      onValueChange(val);
    }
  };

  // Find current deck to display its name in the trigger
  const currentDeck = value ? decks.find((deck) => deck.id === value) : null;
  const displayValue = value === undefined || value === "all" ? "Wszystkie talie" : currentDeck?.name || placeholder;

  if (loading) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  return (
    <Select value={value || "all"} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={placeholder}>{displayValue}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex flex-col">
            <span className="font-medium py-2">Wszystkie talie</span>
          </div>
        </SelectItem>
        {decks.map((deck) => (
          <SelectItem key={deck.id} value={deck.id}>
            <div className="flex flex-col">
              <span className="font-medium">{deck.name}</span>
              {deck.description && <span className="text-xs text-gray-500 mt-0.5 w-[300px]">{deck.description}</span>}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
