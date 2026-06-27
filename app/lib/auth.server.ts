import { redirect } from "react-router";
import { createSupabaseServerClient } from "./supabase.server";

/**
 * Retrieves the current authenticated user from the session cookie.
 * Returns null if no valid session exists.
 */
export async function getUser(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, headers };
}

/**
 * Guard function for admin routes.
 * Redirects to /login if no authenticated user is found.
 * Use this at the top of every admin loader/action.
 */
export async function requireAuth(request: Request) {
  const { user, headers } = await getUser(request);

  if (!user) {
    throw redirect("/login", { headers });
  }

  return { user, headers };
}
