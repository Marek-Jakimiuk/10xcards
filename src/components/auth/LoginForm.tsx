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

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();

        if (response.status === 400) {
          // console.log(response);

          // Handle validation/auth errors
          setErrors(data.errors || { server: data.error });
        } else {
          // Handle server/network errors
          toast.error("Wystąpił błąd podczas logowania. Spróbuj ponownie później.");
        }
        return;
      }

      // Successful login - page will be redirected by the server
      window.location.href = "/";
    } catch (error) {
      console.log("TC:  ~ handleSubmit ~ error:", error);
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
          placeholder=""
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

      {errors.server && <p className="text-sm text-red-500 text-center">{errors.server}</p>}

      <Button type="submit" className="w-full mt-4 h-14" disabled={isLoading}>
        {isLoading ? "Logowanie..." : "Zaloguj się"}
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Nie masz jeszcze konta?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Zarejestruj się
        </a>
      </p>
    </form>
  );
}
