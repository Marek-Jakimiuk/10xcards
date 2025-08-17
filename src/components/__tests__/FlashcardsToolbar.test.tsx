/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FlashcardsToolbar } from "../FlashcardsToolbar";
import type { DeckDTO } from "../../types";

// Mock the child components
vi.mock("../DeckSelect", () => ({
  DeckSelect: ({ placeholder, onValueChange }: any) => (
    <select data-testid="deck-select" onChange={(e) => onValueChange(e.target.value)}>
      <option value="">{placeholder}</option>
    </select>
  ),
}));

vi.mock("../StatusFilter", () => ({
  StatusFilter: ({ placeholder, onValueChange }: any) => (
    <select data-testid="status-filter" onChange={(e) => onValueChange(e.target.value)}>
      <option value="">{placeholder}</option>
    </select>
  ),
}));

describe("FlashcardsToolbar", () => {
  const mockDecks: DeckDTO[] = [
    { id: "1", name: "Deck 1", description: "Test deck 1", created_at: "2023-01-01", updated_at: "2023-01-01" },
    { id: "2", name: "Deck 2", description: "Test deck 2", created_at: "2023-01-01", updated_at: "2023-01-01" },
  ];

  const defaultProps = {
    filters: {
      deckId: undefined,
      status: undefined,
      page: 1,
      pageSize: 10,
    },
    onFiltersChange: vi.fn(),
    onAdd: vi.fn(),
    onDeleteDeck: vi.fn(),
    decks: mockDecks,
    decksLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders add button", () => {
    render(<FlashcardsToolbar {...defaultProps} />);

    expect(screen.getByText("Dodaj fiszkę")).toBeInTheDocument();
  });

  it("calls onAdd when add button is clicked", () => {
    render(<FlashcardsToolbar {...defaultProps} />);

    const addButton = screen.getByText("Dodaj fiszkę");
    fireEvent.click(addButton);

    expect(defaultProps.onAdd).toHaveBeenCalledOnce();
  });

  it("renders deck select component", () => {
    render(<FlashcardsToolbar {...defaultProps} />);

    expect(screen.getByText("Wybierz talię")).toBeInTheDocument();
  });

  it("renders status filter component", () => {
    render(<FlashcardsToolbar {...defaultProps} />);

    expect(screen.getByText("Wybierz status")).toBeInTheDocument();
  });

  it("shows delete deck button when deck is selected", () => {
    const propsWithSelectedDeck = {
      ...defaultProps,
      filters: {
        ...defaultProps.filters,
        deckId: "1",
      },
    };

    render(<FlashcardsToolbar {...propsWithSelectedDeck} />);

    expect(screen.getByText("Usuń talię")).toBeInTheDocument();
  });

  it("does not show delete deck button when no deck is selected", () => {
    render(<FlashcardsToolbar {...defaultProps} />);

    expect(screen.queryByText("Usuń talię")).not.toBeInTheDocument();
  });

  it("calls onDeleteDeck when delete button is clicked", () => {
    const propsWithSelectedDeck = {
      ...defaultProps,
      filters: {
        ...defaultProps.filters,
        deckId: "1",
      },
    };

    render(<FlashcardsToolbar {...propsWithSelectedDeck} />);

    const deleteButton = screen.getByText("Usuń talię");
    fireEvent.click(deleteButton);

    expect(defaultProps.onDeleteDeck).toHaveBeenCalledWith("1");
  });

  it("disables delete button when decks are loading", () => {
    const propsWithLoading = {
      ...defaultProps,
      filters: {
        ...defaultProps.filters,
        deckId: "1",
      },
      decksLoading: true,
    };

    render(<FlashcardsToolbar {...propsWithLoading} />);

    const deleteButton = screen.getByText("Usuń talię");
    expect(deleteButton).toBeDisabled();
  });
});
