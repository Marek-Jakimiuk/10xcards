import { useState, useCallback } from "react";
import { toast } from "sonner";
import { routesApi } from "../../lib/routes";
import type {
  SuggestionViewModel,
  FlashcardGenerateResponseDTO,
  FlashcardCreateCommand,
  FlashcardGenerateCommand,
} from "../../types";

interface UseFlashcardGeneratorProps {
  userId: string;
}

interface UseFlashcardGeneratorReturn {
  text: string;
  setText: (text: string) => void;
  title: string;
  setTitle: (title: string) => void;
  status: "idle" | "loading" | "saving" | "success" | "error";
  error: string | null;
  suggestions: SuggestionViewModel[];
  isTextValid: boolean;
  isTitleValid: boolean;
  remainingChars: number;
  minCharsNeeded: number;
  hasApprovedSuggestions: boolean;
  handleGenerateClick: () => Promise<void>;
  handleSuggestionUpdate: (id: string, updatedData: { przod: string; tyl: string }) => void;
  handleSuggestionStatusChange: (id: string, status: "approved" | "rejected" | "pending") => Promise<void>;
  handleSaveApproved: () => Promise<void>;
  pendingSaves: Set<string>;
}

export function useFlashcardGenerator({ userId }: UseFlashcardGeneratorProps): UseFlashcardGeneratorReturn {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionViewModel[]>([]);
  const [pendingSaves, setPendingSaves] = useState<Set<string>>(new Set());
  const [deckId, setDeckId] = useState<string | null>(null);

  // Validation calculations
  const isTextValid = text.length >= 1000 && text.length <= 10000;
  const isTitleValid = title.length > 0 && title.length <= 100;
  const remainingChars = 10000 - text.length;
  const minCharsNeeded = Math.max(0, 1000 - text.length);
  const hasApprovedSuggestions = suggestions.some((s) => s.status === "approved");

  const handleGenerateClick = async () => {
    if (!isTextValid || !isTitleValid) return;

    try {
      setStatus("loading");
      setError(null);

      const generateCommand: FlashcardGenerateCommand = { text, title };
      const response = await fetch(routesApi.flashcardsGenerate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generateCommand),
      });
      console.log("TC:  ~ handleGenerateClick ~ response:", response);

      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas generowania fiszek.");
      }

      const data = (await response.json()) as FlashcardGenerateResponseDTO;
      const newSuggestions = data.suggestions.map((suggestion) => ({
        id: crypto.randomUUID(),
        przod: suggestion.przod,
        tyl: suggestion.tyl,
        status: "pending" as const,
      }));

      setDeckId(data.deckId);
      setSuggestions(newSuggestions);
      setStatus("success");
      toast.success(`Wygenerowano ${newSuggestions.length} propozycji fiszek`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd.";
      setError(message);
      setStatus("error");
      toast.error(message);
    }
  };

  const handleSuggestionUpdate = useCallback((id: string, updatedData: { przod: string; tyl: string }) => {
    setSuggestions((prev) =>
      prev.map((suggestion) => (suggestion.id === id ? { ...suggestion, ...updatedData } : suggestion))
    );
  }, []);

  const handleSuggestionStatusChange = useCallback(
    async (id: string, newStatus: "approved" | "rejected" | "pending") => {
      // Optimistically update the UI
      setSuggestions((prev) =>
        prev.map((suggestion) => (suggestion.id === id ? { ...suggestion, status: newStatus } : suggestion))
      );

      // Add to pending saves
      setPendingSaves((prev) => new Set(prev).add(id));

      try {
        // Here you could implement a debounced API call to save the status change
        // For now, we'll just simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Remove from pending saves after successful update
        setPendingSaves((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } catch (err) {
        // Revert the optimistic update on error
        setSuggestions((prev) =>
          prev.map((suggestion) => (suggestion.id === id ? { ...suggestion, status: suggestion.status } : suggestion))
        );
        setPendingSaves((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.error("Nie udało się zaktualizować statusu fiszki.");
      }
    },
    []
  );

  const handleSaveApproved = async () => {
    const approvedSuggestions = suggestions.filter((s) => s.status === "approved");
    if (approvedSuggestions.length === 0) return;

    // Store current state for rollback
    const previousSuggestions = suggestions;
    const previousText = text;

    try {
      // Optimistically update UI
      setStatus("saving");
      setError(null);
      setSuggestions([]);
      setText("");
      setTitle("");
      setDeckId(null);

      const flashcards: FlashcardCreateCommand = {
        deck_id: deckId || undefined,
        flashcards: approvedSuggestions.map((s) => ({
          przod: s.przod,
          tyl: s.tyl,
          status: "zatwierdzona",
        })),
      };

      const response = await fetch(routesApi.flashcardsBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flashcards),
      });

      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas zapisywania fiszek.");
      }

      setStatus("idle");
      toast.success(`Zapisano ${approvedSuggestions.length} fiszek`);
    } catch (err) {
      // Rollback on error
      setSuggestions(previousSuggestions);
      setText(previousText);
      const message = err instanceof Error ? err.message : "Wystąpił błąd podczas zapisywania fiszek.";
      setError(message);
      setStatus("error");
      toast.error(message);
    }
  };

  return {
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
  };
}
