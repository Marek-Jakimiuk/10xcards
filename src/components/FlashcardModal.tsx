import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import type { FlashcardDTO, FlashcardStatus, FlashcardFormValues, DeckDTO } from "../types";

// Validation schema
const flashcardSchema = z.object({
  przod: z.string().min(1, "Przód jest wymagany").max(200, "Przód może mieć maksymalnie 200 znaków"),
  tyl: z.string().min(1, "Tył jest wymagany").max(500, "Tył może mieć maksymalnie 500 znaków"),
  status: z.enum(["oczekująca", "zatwierdzona", "odrzucona"]).optional(),
  deck_id: z.string().uuid().or(z.literal("")).optional(),
});

interface FlashcardModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialValues?: FlashcardDTO;
  onSubmit: (values: FlashcardFormValues) => void;
  onClose: () => void;
  loading?: boolean;
  decks: DeckDTO[];
  decksLoading: boolean;
}

const statusLabels: Record<FlashcardStatus, string> = {
  oczekująca: "Oczekująca",
  zatwierdzona: "Zatwierdzona",
  odrzucona: "Odrzucona",
};

export function FlashcardModal({
  open,
  mode,
  initialValues,
  onSubmit,
  onClose,
  loading = false,
  decks,
  decksLoading,
}: FlashcardModalProps) {
  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      przod: "",
      tyl: "",
      status: "oczekująca",
      deck_id: "",
    },
  });

  // Reset form when modal opens/closes or initial values change
  useEffect(() => {
    if (open && initialValues && mode === "edit") {
      form.reset({
        przod: initialValues.przod,
        tyl: initialValues.tyl,
        status: initialValues.status as FlashcardStatus,
        deck_id: initialValues.deck_id || "",
      });
    } else if (open && mode === "add") {
      form.reset({
        przod: "",
        tyl: "",
        status: "oczekująca" as FlashcardStatus,
        deck_id: "",
      });
    }
  }, [open, initialValues, mode, form]);

  const handleSubmit = (values: FlashcardFormValues) => {
    onSubmit(values);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const title = mode === "add" ? "Dodaj nową fiszkę" : "Edytuj fiszkę";
  const submitText = mode === "add" ? "Dodaj fiszkę" : "Zapisz zmiany";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Wprowadź treść dla przodu i tyłu fiszki." : "Edytuj treść fiszki lub zmień jej status."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="przod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Przód fiszki</FormLabel>
                  <FormControl>
                    <Input placeholder="Wprowadź treść dla przodu fiszki..." {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tyl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tył fiszki</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Wprowadź treść dla tyłu fiszki..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "add" && (
              <FormField
                control={form.control}
                name="deck_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Talia</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} disabled={loading || decksLoading}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={decksLoading ? "Ładowanie talii..." : "Wybierz talię (opcjonalnie)"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {decks.map((deck) => (
                            <SelectItem key={deck.id} value={deck.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{deck.name}</span>
                                {deck.description && (
                                  <span className="text-xs text-gray-500 mt-0.5  max-w-[420px]">
                                    {deck.description}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {mode === "edit" && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([status, label]) => (
                          <SelectItem key={status} value={status}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Anuluj
              </Button>
              <Button type="submit" variant="ghost" disabled={loading}>
                {loading ? "Zapisywanie..." : submitText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
