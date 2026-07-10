import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ApolloWrapper from "@/layout/ApolloWrapper";
import AppShell from "@/layout/AppShellLayout";
import NavigationDataProvider from "./providers/NavigationDataProvider";
import QueryProvider from "./providers/QueryProvider";
import "./globals.css";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigationData = await NavigationDataProvider();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryProvider>
          <ApolloWrapper>
            <AppShell navigationData={navigationData}>{children}</AppShell>
          </ApolloWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
