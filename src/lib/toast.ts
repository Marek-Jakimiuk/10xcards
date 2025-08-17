import { toast } from "sonner";

/**
 * Centralized toast notifications using Sonner
 * This provides consistent messaging across the application
 */

export const toastService = {
  // Success messages
  success: (message: string) => toast.success(message),

  // Error messages
  error: (message: string) => toast.error(message),

  // Info messages
  info: (message: string) => toast.info(message),

  // Warning messages
  warning: (message: string) => toast.warning(message),

  // Loading messages
  loading: (message: string) => toast.loading(message),

  // Custom toast with options
  custom: (message: string, options?: Parameters<typeof toast>[1]) => toast(message, options),

  // Promise-based toast for async operations
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => toast.promise(promise, messages),

  // Dismiss all toasts
  dismiss: () => toast.dismiss(),
};

// Re-export toast for backward compatibility
export { toast };

// Common error messages
export const errorMessages = {
  network: "Wystąpił błąd podczas połączenia z serwerem. Sprawdź swoje połączenie internetowe.",
  unauthorized: "Sesja wygasła. Zaloguj się ponownie.",
  notFound: "Zasób nie został znaleziony.",
  serverError: "Wystąpił błąd serwera. Spróbuj ponownie później.",
  validation: "Wprowadzone dane są nieprawidłowe.",
} as const;

// Common success messages
export const successMessages = {
  saved: "Dane zostały zapisane",
  deleted: "Element został usunięty",
  updated: "Element został zaktualizowany",
  created: "Element został utworzony",
} as const;
