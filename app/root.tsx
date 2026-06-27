import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function meta(): Route.MetaDescriptors {
  return [
    { title: "Portfolio — Full-Stack Developer" },
    {
      name: "description",
      content:
        "Portfolio profesional seorang full-stack developer. Membangun aplikasi web modern dengan React, TypeScript, dan teknologi terkini.",
    },
    { name: "theme-color", content: "#0a0a0f" },
    { property: "og:title", content: "Portfolio — Full-Stack Developer" },
    {
      property: "og:description",
      content:
        "Portfolio profesional seorang full-stack developer. Membangun aplikasi web modern dengan React, TypeScript, dan teknologi terkini.",
    },
    { property: "og:type", content: "website" },
  ];
}

/**
 * Root loader passes public env vars to the client
 * so the Supabase browser client can initialize.
 */
export function loader() {
  return {
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
      GITHUB_URL: process.env.GITHUB_URL ?? "https://github.com",
      LINKEDIN_URL: process.env.LINKEDIN_URL ?? "https://linkedin.com",
      EMAIL: process.env.EMAIL ?? "hello@example.com",
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Outlet />
      {/* Inject public env vars for the Supabase browser client */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(loaderData.ENV)}`,
        }}
      />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Terjadi kesalahan yang tidak terduga.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "Halaman yang kamu cari tidak ditemukan."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-4">
        <h1 className="text-6xl font-bold gradient-text">{message}</h1>
        <p className="text-gray-400">{details}</p>
        {stack && (
          <pre className="mt-4 w-full p-4 overflow-x-auto text-left text-xs bg-white/5 rounded-lg border border-white/10">
            <code className="text-gray-500">{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
