import { Link, NavLink, Outlet, redirect, useSubmit } from "react-router";
import type { Route } from "./+types/layout";
import { requireAuth } from "~/lib/auth.server";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getUnreadCount } from "~/services/message.service";
import { cn } from "~/utils/helpers";
import { useEffect, useState } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  const { user, session } = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  const unreadCount = await getUnreadCount(supabase);
  
  // Pass session timestamp for client-side idle timeout
  return { 
    user, 
    unreadCount,
    sessionTimestamp: Date.now()
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "logout") {
    const { supabase, headers } = createSupabaseServerClient(request);
    await supabase.auth.signOut();
    
    // Force clear all auth cookies
    const responseHeaders = new Headers(headers);
    responseHeaders.append('Set-Cookie', 'sb-access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
    responseHeaders.append('Set-Cookie', 'sb-refresh-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
    
    return redirect("/login", { headers: responseHeaders });
  }

  return null;
}

const sidebarLinks = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    end: true,
    prefetch: "intent" as const,
  },
  {
    to: "/admin/projects",
    label: "Projects",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
    prefetch: "intent" as const,
  },
  {
    to: "/admin/messages",
    label: "Messages",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    showBadge: true,
    prefetch: "intent" as const,
  },
  {
    to: "/admin/profile",
    label: "Profile",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    prefetch: "intent" as const,
  },
];

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  const { user, unreadCount, sessionTimestamp } = loaderData;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const submit = useSubmit();

  // Client-side idle timeout (30 minutes)
  useEffect(() => {
    const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
    let idleTimer: NodeJS.Timeout;
    let lastActivity = Date.now();

    const resetIdleTimer = () => {
      lastActivity = Date.now();
      clearTimeout(idleTimer);
      
      idleTimer = setTimeout(() => {
        const now = Date.now();
        const idleTime = now - lastActivity;
        
        // If idle for 30 minutes, force logout
        if (idleTime >= IDLE_TIMEOUT) {
          alert('Your session has expired due to inactivity. Please log in again.');
          const formData = new FormData();
          formData.append('intent', 'logout');
          submit(formData, { method: 'post' });
        }
      }, IDLE_TIMEOUT);
    };

    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetIdleTimer);
    });

    // Initialize timer
    resetIdleTimer();

    // Cleanup
    return () => {
      clearTimeout(idleTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [submit]);

  // Handle logout with confirmation
  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      const formData = new FormData();
      formData.append('intent', 'logout');
      // Submit to current route (layout) without explicit action
      submit(formData, { method: 'post' });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-gray-950/95 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <Link to="/admin" className="text-lg font-bold text-white" onClick={() => setIsSidebarOpen(false)}>
            <span className="text-indigo-400">&lt;</span>
            Luthfi Admin
            <span className="text-indigo-400"> /&gt;</span>
          </Link>
          {/* Mobile Close Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1" aria-label="Admin navigation">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              prefetch={link.prefetch}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                )
              }
            >
              {link.icon}
              {link.label}
              {link.showBadge && unreadCount > 0 && (
                <span className="ml-auto inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-bold text-white bg-indigo-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-3">
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Logout
          </button>

          {/* Back to site */}
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 w-full">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-20 h-16 flex items-center justify-between px-4 border-b border-white/10 bg-gray-950/95 backdrop-blur-xl">
          <button
            type="button"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-bold text-white">Admin Panel</span>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
