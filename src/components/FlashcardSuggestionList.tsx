import type { SuggestionViewModel } from '../types';
import { FlashcardSuggestionItem } from './FlashcardSuggestionItem';

interface FlashcardSuggestionListProps {
  suggestions: SuggestionViewModel[];
  onSuggestionUpdate: (id: string, updatedData: { przod: string; tyl: string }) => void;
  onSuggestionStatusChange: (id: string, status: 'approved' | 'rejected' | 'pending') => Promise<void>;
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
      <h2 className="text-xl font-semibold mb-4">Sugerowane fiszki ({suggestions.length})</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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