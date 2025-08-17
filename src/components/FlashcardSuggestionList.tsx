import type { SuggestionViewModel } from "../types";
import { FlashcardSuggestionItem } from "./FlashcardSuggestionItem";
import { Card, CardContent } from "./ui/card";

interface FlashcardSuggestionListProps {
  suggestions: SuggestionViewModel[];
  onSuggestionUpdate: (id: string, updatedData: { przod: string; tyl: string }) => void;
  onSuggestionStatusChange: (id: string, status: "approved" | "rejected" | "pending") => Promise<void>;
  pendingSaves?: Set<string>;
}

export function FlashcardSuggestionList({
  suggestions,
  onSuggestionUpdate,
  onSuggestionStatusChange,
  pendingSaves = new Set(),
}: FlashcardSuggestionListProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <CardContent>
          <h2 className="text-4xl font-semibold">Sugerowane fiszki ({suggestions.length})</h2>
        </CardContent>
      </Card>
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1"> */}
      <div className="grid gap-4 cols-1">
        {suggestions.map((suggestion) => (
          <FlashcardSuggestionItem
            key={suggestion.id}
            suggestion={suggestion}
            onUpdate={onSuggestionUpdate}
            onStatusChange={onSuggestionStatusChange}
            isPending={pendingSaves.has(suggestion.id)}
          />
        ))}
      </div>
    </div>
  );
}
