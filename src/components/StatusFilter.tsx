import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { FlashcardStatus } from "../types";

interface StatusFilterProps {
  value?: FlashcardStatus;
  onValueChange: (status?: FlashcardStatus) => void;
  placeholder?: string;
}

const statusLabels: Record<FlashcardStatus, string> = {
  oczekująca: "Oczekująca",
  zatwierdzona: "Zatwierdzona",
  odrzucona: "Odrzucona",
};

export function StatusFilter({ value, onValueChange, placeholder = "Wszystkie statusy" }: StatusFilterProps) {
  const handleValueChange = (val: string) => {
    if (val === "all") {
      onValueChange(undefined);
    } else {
      onValueChange(val as FlashcardStatus);
    }
  };

  return (
    <Select value={value || "all"} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Wszystkie statusy</SelectItem>
        {Object.entries(statusLabels).map(([status, label]) => (
          <SelectItem key={status} value={status}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
