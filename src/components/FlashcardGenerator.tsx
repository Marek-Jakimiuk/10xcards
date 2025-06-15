import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { FlashcardSuggestionList } from './FlashcardSuggestionList';
import { useFlashcardGenerator } from './hooks/useFlashcardGenerator';

interface FlashcardGeneratorProps {
  userId: string;
}

export function FlashcardGenerator({ userId }: FlashcardGeneratorProps) {
  const {
    text,
    setText,
    title,
    setTitle,
    status,
    error,
    suggestions,
    isTextValid,
    isTitleValid,
    remainingChars,
    minCharsNeeded,
    hasApprovedSuggestions,
    handleGenerateClick,
    handleSuggestionUpdate,
    handleSuggestionStatusChange,
    handleSaveApproved,
    pendingSaves,
  } = useFlashcardGenerator({ userId });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Tytuł zestawu fiszek..."
          value={title}
          onChange={handleTitleChange}
          className="w-full"
          disabled={status === 'loading' || status === 'saving'}
        />
        <Textarea
          placeholder="Wklej tutaj tekst do analizy..."
          value={text}
          onChange={handleTextChange}
          className="min-h-[200px]"
          disabled={status === 'loading' || status === 'saving'}
        />
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            {minCharsNeeded > 0
              ? `Wymagane jeszcze ${minCharsNeeded} znaków`
              : `Pozostało ${remainingChars} znaków`}
          </span>
          <span>{text.length} / 10000</span>
        </div>
        <Button
          onClick={handleGenerateClick}
          disabled={!isTextValid || !isTitleValid || status === 'loading' || status === 'saving'}
          className="w-full"
        >
          {status === 'loading' ? 'Generowanie...' : 'Generuj Fiszki'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {status === 'loading' && (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      )}

      {suggestions.length > 0 && status !== 'loading' && (
        <div className="space-y-6">
          <FlashcardSuggestionList
            suggestions={suggestions}
            onSuggestionUpdate={handleSuggestionUpdate}
            onSuggestionStatusChange={handleSuggestionStatusChange}
            pendingSaves={pendingSaves}
          />
          
          <Button
            onClick={handleSaveApproved}
            disabled={!hasApprovedSuggestions || status === 'saving'}
            className="w-full"
          >
            {status === 'saving' ? 'Zapisywanie...' : 'Zapisz zatwierdzone fiszki'}
          </Button>
        </div>
      )}

      {suggestions.length === 0 && status === 'success' && (
        <Alert>
          <AlertDescription>
            Nie znaleziono propozycji dla podanego tekstu. Spróbuj go zmodyfikować.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 