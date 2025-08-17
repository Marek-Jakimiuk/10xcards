import { Button } from "./button";
import { toast } from "sonner";

interface UserMenuProps {
  email: string;
}

export default function UserMenu({ email }: UserMenuProps) {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      // Redirect to login page after successful logout
      window.location.href = "/login";
    } catch (error: unknown) {
      console.error("Logout error:", error);
      toast.error("Wystąpił błąd podczas wylogowywania. Spróbuj ponownie później.");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <a href="/generator" className="text-sm text-gray-600 hover:text-gray-900">
        Generator
      </a>
      <a href="/flashcards" className="text-sm text-gray-600 hover:text-gray-900">
        Moje Fiszki
      </a>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">{email}</span>
        <Button variant="outline" onClick={handleLogout}>
          Wyloguj się
        </Button>
      </div>
    </div>
  );
}
