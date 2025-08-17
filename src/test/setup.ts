/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock Shadcn/ui components
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => React.createElement("button", { onClick, ...props }, children),
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children, ...props }: any) => React.createElement("select", props, children),
  SelectContent: ({ children, ...props }: any) => React.createElement("div", props, children),
  SelectItem: ({ children, value, ...props }: any) => React.createElement("option", { value, ...props }, children),
  SelectTrigger: ({ children, ...props }: any) => React.createElement("div", props, children),
  SelectValue: ({ placeholder, ...props }: any) => React.createElement("span", props, placeholder),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children, ...props }: any) => React.createElement("div", props, children),
  DropdownMenuContent: ({ children, ...props }: any) => React.createElement("div", props, children),
  DropdownMenuItem: ({ children, onClick, ...props }: any) =>
    React.createElement("div", { onClick, ...props }, children),
  DropdownMenuTrigger: ({ children, asChild, ...props }: any) => React.createElement("div", props, children),
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, ...props }: any) => React.createElement("div", props, children),
  AvatarFallback: ({ children, ...props }: any) => React.createElement("div", props, children),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: any) => React.createElement("div", props, children),
  CardContent: ({ children, ...props }: any) => React.createElement("div", props, children),
}));

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  Plus: () => React.createElement("span", {}, "+"),
  Trash2: () => React.createElement("span", {}, "🗑"),
  User: () => React.createElement("span", {}, "👤"),
  LogOut: () => React.createElement("span", {}, "🚪"),
  ChevronDown: () => React.createElement("span", {}, "⌄"),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock Astro globals
Object.defineProperty(globalThis, "Astro", {
  value: {
    request: new Request("http://localhost:4321"),
    url: new URL("http://localhost:4321"),
    cookies: {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      has: vi.fn(),
    },
    redirect: vi.fn(),
    locals: {},
    params: {},
  },
  writable: true,
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.location
Object.defineProperty(window, "location", {
  value: {
    origin: "http://localhost:4321",
    href: "http://localhost:4321",
    protocol: "http:",
    host: "localhost:4321",
    hostname: "localhost",
    port: "4321",
    pathname: "/",
    search: "",
    hash: "",
  },
  writable: true,
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests
  // log: vi.fn(),
  // debug: vi.fn(),
  // info: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
};
