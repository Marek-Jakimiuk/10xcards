import { defineMiddleware } from "astro:middleware";
import { createSupabaseServer } from "../db/supabase.server";

// Public paths that don't require authentication
const PUBLIC_PATHS = ["/login", "/register", "/auth/reset-password"];

export const onRequest = defineMiddleware(async ({ cookies, url, redirect, locals }, next) => {
  // Create server-side Supabase client
  const supabase = createSupabaseServer(cookies);
  locals.supabase = supabase;

  console.log("aaaaaaaa");

  // // Get session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching session:", sessionError);
  }

  // Add user to locals if session exists
  if (session?.user) {
    locals.user = {
      id: session.user.id,
      email: session.user.email,
    };
  }

  // Handle auth redirects
  // const isPublicPath = PUBLIC_PATHS.includes(url.pathname);
  // const isAuthenticated = !!session?.user;

  // // Redirect authenticated users away from public paths (login, register)
  // if (isAuthenticated && isPublicPath) {
  //   return redirect("/");
  // }

  // // Redirect unauthenticated users to login from protected paths
  // if (!isAuthenticated && !isPublicPath) {
  //   return redirect("/login");
  // }

  return next();
});
