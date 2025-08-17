import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

interface FormErrors {
  email?: string;
  password?: string;
  server?: string;
}

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ password: "Hasła nie są identyczne" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setErrors(data.errors || { server: data.error });
        } else {
          toast.error("Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.");
        }
        return;
      }

      // Show success message and redirect
      toast.success(data.message || "Rejestracja przebiegła pomyślnie!");

      // Redirect to home page
      if (data.redirect) {
        window.location.href = data.redirect;
      }

      // Clear form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Wystąpił błąd podczas połączenia z serwerem. Sprawdź swoje połączenie internetowe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="twoj@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isLoading}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Hasło</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={isLoading}
          minLength={6}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-red-500">
            {errors.password}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          disabled={isLoading}
          minLength={6}
        />
      </div>

      {errors.server && <p className="text-sm text-red-500 text-center">{errors.server}</p>}

      <Button type="submit" className="w-full mt-4 h-14" disabled={isLoading}>
        {isLoading ? "Rejestracja..." : "Zarejestruj się"}
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Masz już konto?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Zaloguj się
        </a>
      </p>
    </form>
  );
}
