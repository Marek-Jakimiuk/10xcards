import type { APIRoute } from "astro";
import { createSupabaseServer } from "../../../db/supabase.server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  // console.log("TC:  ~ POST ~ request:", request);
  // console.log("TC:  ~ POST ~ cookies:", cookies);
  console.log("");
  console.log("");
  console.log("start");
  try {
    const data = await request.json();

    console.log("TC:  ~ POST ~ data:", data);

    // Validate input
    const result = loginSchema.safeParse(data);

    console.log("TC:  ~ POST ~ result:", result);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          errors: result.error.flatten().fieldErrors,
        }),
        { status: 400 }
      );
    }

    const supabase = createSupabaseServer(cookies);

    const response = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    console.log("TC:  ~ POST ~ response:", response);

    if (response.error) {
      if (response.error.status === 400) {
        return new Response(
          JSON.stringify({
            error: "Nieprawidłowy email lub hasło",
          }),
          { status: 400 }
        );
      }

      throw response.error;
    }

    return new Response(response.data, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);

    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas logowania. Spróbuj ponownie później.",
      }),
      { status: 500 }
    );
  }
};
