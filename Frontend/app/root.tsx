import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";
import { useEffect } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import { handleOAuthCallbackUrl, isMobileApp } from "src/utils/oauth";

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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMobileApp()) return;

    let isMounted = true;
    let appListener: { remove: () => Promise<void> } | undefined;

    const processUrl = (url: string) => {
      if (!isMounted) return;

      const result = handleOAuthCallbackUrl(url);
      if (!result) return;

     
      void import("@capacitor/browser").then(({ Browser }) => Browser.close()).catch(() => {});

      if (result.token) {
        localStorage.setItem("token", result.token);
        navigate("/dashboard/profile", { replace: true });
        return;
      }

      navigate("/?error=oauth_failed", { replace: true });
    };

    void import("@capacitor/app").then(async ({ App }) => {
      const launchUrl = await App.getLaunchUrl();
      if (launchUrl?.url) {
        processUrl(launchUrl.url);
      }

      appListener = await App.addListener("appUrlOpen", ({ url }) => {
        processUrl(url);
      });
    }).catch(() => {});

    return () => {
      isMounted = false;
      void appListener?.remove();
    };
  }, [navigate]);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
