import type { APIRoute } from "astro";
import { createSupabaseServer } from "../../../db/supabase.server";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      return new Response(
        JSON.stringify({
          errors: validatedData.error.flatten().fieldErrors,
        }),
        { status: 400 }
      );
    }

    const { email, password } = validatedData.data;
    const supabase = createSupabaseServer(cookies);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return new Response(
          JSON.stringify({
            errors: {
              email: "Ten adres email jest już zarejestrowany",
            },
          }),
          { status: 400 }
        );
      }

      return new Response(
        JSON.stringify({
          error: "Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.",
        }),
        { status: 500 }
      );
    }

    // Sign in the user immediately after registration
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return new Response(
        JSON.stringify({
          error: "Rejestracja udana, ale wystąpił błąd podczas logowania. Spróbuj zalogować się ręcznie.",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        user: signInData.user,
        message: "Rejestracja przebiegła pomyślnie!",
        redirect: "/",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas przetwarzania żądania.",
      }),
      { status: 500 }
    );
  }
};
