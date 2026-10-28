import { redirect } from "react-router";
import { createSupabaseServerClient } from "./supabase.server";

/**
 * Retrieves the current authenticated user from the session cookie.
 * Returns null if no valid session exists.
 */
export async function getUser(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request);
  
  // Get session with proper validation
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // If no session or error, return null
  if (error || !session) {
    return { user: null, headers };
  }

  // Check if session is expired (including idle timeout)
  const now = Math.floor(Date.now() / 1000);
  const sessionAge = now - (session.user.last_sign_in_at ? new Date(session.user.last_sign_in_at).getTime() / 1000 : 0);
  const MAX_SESSION_AGE = 24 * 60 * 60; // 24 hours max session
  const IDLE_TIMEOUT = 30 * 60; // 30 minutes idle timeout

  // Check if token is expired or session is too old
  if (session.expires_at && session.expires_at < now) {
    await supabase.auth.signOut();
    return { user: null, headers };
  }

  // Check if session is older than max age
  if (sessionAge > MAX_SESSION_AGE) {
    await supabase.auth.signOut();
    return { user: null, headers };
  }

  // Get fresh user data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, headers, session };
}

/**
 * Guard function for admin routes.
 * Redirects to /login if no authenticated user is found.
 * Use this at the top of every admin loader/action.
 */
export async function requireAuth(request: Request) {
  const { user, headers, session } = await getUser(request);

  if (!user || !session) {
    // Clear any stale cookies and redirect
    const { supabase } = createSupabaseServerClient(request);
    await supabase.auth.signOut();
    throw redirect("/login", { headers });
  }

  return { user, headers, session };
}
