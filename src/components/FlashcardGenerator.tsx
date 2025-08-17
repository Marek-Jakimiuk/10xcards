import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";
import { FlashcardSuggestionList } from "./FlashcardSuggestionList";
import { useFlashcardGenerator } from "./hooks/useFlashcardGenerator";
import { Card, CardContent } from "../components/ui/card";
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

  const isLoading = status === "loading" || status === "saving";

  return (
    <div className={`flex gap-8 w-full space-y-6 ${isLoading ? "pointer-events-none opacity-50 cursor-wait" : ""}`}>
      <Card className="w-full max-w-[560px] sticky self-start h-fit p-4 top-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <CardContent>
          <h1 className="text-6xl font-bold mb-6">Generator Fiszek</h1>
          <p className="text-gray-600 mb-8">
            Wklej tekst poniżej, aby automatycznie wygenerować propozycje fiszek. System przeanalizuje tekst i
            zaproponuje fiszki, które możesz zatwierdzić, odrzucić lub edytować.
          </p>

          <div className="space-y-4">
            <Input
              placeholder="Tytuł zestawu fiszek..."
              value={title}
              onChange={handleTitleChange}
              className="w-full"
              disabled={isLoading}
            />
            <Textarea
              placeholder="Wklej tutaj tekst do analizy..."
              value={text}
              onChange={handleTextChange}
              className="min-h-[300px] max-h-[300px]"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                {minCharsNeeded > 0
                  ? `Wymagane jeszcze ${minCharsNeeded} znaków`
                  : `Pozostało ${remainingChars} znaków`}
              </span>
              <span>{text.length} / 10000</span>
            </div>
            {!(!isTextValid || !isTitleValid) ? (
              <Button onClick={handleGenerateClick} className="w-full">
                {status === "loading" ? "Generowanie..." : "Generuj Fiszki"}
              </Button>
            ) : null}
          </div>
        </CardContent>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </Card>
      <div className="w-full max-w-[400px] min-h-screen">
        {status === "loading" && (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        )}

        {suggestions.length > 0 && status !== "loading" && (
          <div className="space-y-6">
            <FlashcardSuggestionList
              suggestions={suggestions}
              onSuggestionUpdate={handleSuggestionUpdate}
              onSuggestionStatusChange={handleSuggestionStatusChange}
              pendingSaves={pendingSaves}
            />
            <Button
              onClick={handleSaveApproved}
              disabled={!hasApprovedSuggestions || status === "saving"}
              className="w-full"
            >
              {status === "saving" ? "Zapisywanie..." : "Zapisz zatwierdzone fiszki"}
            </Button>
          </div>
        )}

        {suggestions.length === 0 && status === "success" && (
          <Alert>
            <AlertDescription>Nie znaleziono propozycji dla podanego tekstu. Spróbuj go zmodyfikować.</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
