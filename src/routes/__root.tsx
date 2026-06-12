import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingCTAs } from "@/components/site/FloatingCTAs";

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pearl px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-bold text-primary">404</h1>
        <p className="mt-3 text-muted-foreground">This page could not be found.</p>
        <Link to="/" className="inline-block mt-6 bg-gold-gradient text-primary font-semibold px-6 py-3 rounded-full shadow-gold">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-pearl px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-bold text-primary">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-6 bg-primary text-white font-semibold px-6 py-3 rounded-full">
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dang Dream Property - Dang's Most Trusted Real Estate Partner" },
      {
        name: "description",
        content:
          "Premium real estate, construction, design and finance services in Dang, Nepal. Houses, land, apartments and commercial properties.",
      },
      { name: "theme-color", content: "#0A1F5C" },
      { name: "author", content: "Dang Dream Property" },
      { property: "og:site_name", content: "Dang Dream Property" },
      { property: "og:title", content: "Dang Dream Property" },
      { property: "og:description", content: "Your Dream Property, Our Promise - Dang's trusted real estate company." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <Navbar />
          <main>
            <Outlet />
          </main>
          <Footer />
          <FloatingCTAs />
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

