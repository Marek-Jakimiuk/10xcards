import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserMenu from "../UserMenu";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock form submission
const mockFormSubmit = vi.fn();
Object.defineProperty(HTMLFormElement.prototype, "submit", {
  value: mockFormSubmit,
  writable: true,
});

describe("UserMenu", () => {
  const defaultProps = {
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
    });
  });

  it("renders user email", () => {
    render(<UserMenu {...defaultProps} />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("shows logout button", () => {
    render(<UserMenu {...defaultProps} />);

    expect(screen.getByText("Wyloguj się")).toBeInTheDocument();
  });

  it("calls logout when logout button is clicked", async () => {
    render(<UserMenu {...defaultProps} />);

    // Click logout button
    const logoutButton = screen.getByText("Wyloguj się");
    fireEvent.click(logoutButton);

    // Wait for fetch to be called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/logout", {
        method: "POST",
      });
    });
  });

  it("displays correct email format", () => {
    const longEmail = "very.long.email.address@example.com";
    render(<UserMenu email={longEmail} />);

    expect(screen.getByText(longEmail)).toBeInTheDocument();
  });
});
