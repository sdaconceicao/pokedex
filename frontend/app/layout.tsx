import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ApolloWrapper from "@/layout/ApolloWrapper";
import AppShell from "@/layout/AppShellLayout";
import AddToGroupProvider from "./providers/AddToGroupProvider";
import AuthModalProvider from "./providers/AuthModalProvider";
import LagoProvider from "./providers/LagoProvider";
import NavigationDataProvider from "./providers/NavigationDataProvider";
import QueryProvider from "./providers/QueryProvider";

// reset.css writes into the `reset` layer lago declares, so it sits below the
// design system wherever it is imported. globals.css and typePalette.css are
// unlayered and so cascade last, which is what makes the theme overrides win.
import "./reset.css";
import "@code-x/lago/styles";
import "./globals.css";
import "./typePalette.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex",
  description: "A Pokémon database with GraphQL API",
};

/* `ThemeProvider` can only add the `dark-mode` class once React has hydrated,
 * which is at least one paint too late — the first frame renders with the light
 * tokens and flashes white. This runs synchronously while the parser is still
 * ahead of any painted content, so the class is on `<html>` before the first
 * pixel. It has to mirror the provider's own defaults exactly: storage key
 * `ui-theme`, class `dark-mode`, and an absent key meaning "follow the OS"
 * (the provider *removes* the key for the system theme rather than storing it).
 * `<html>` then differs from what the server sent, hence `suppressHydrationWarning`. */
const themeScript = `(function(){try{var t=localStorage.getItem("ui-theme");document.documentElement.classList.toggle("dark-mode",t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches))}catch(e){}})()`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigationData = await NavigationDataProvider();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, build-time constant — the pre-paint theme script */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <LagoProvider>
          <QueryProvider>
            <ApolloWrapper>
              <AuthModalProvider>
                <AddToGroupProvider>
                  <AppShell navigationData={navigationData}>
                    {children}
                    <Analytics />
                  </AppShell>
                </AddToGroupProvider>
              </AuthModalProvider>
            </ApolloWrapper>
          </QueryProvider>
        </LagoProvider>
      </body>
    </html>
  );
}
