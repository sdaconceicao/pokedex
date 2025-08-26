import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import ApolloWrapper from "@/ui/ApolloWrapper";
import QueryProvider from "./providers/QueryProvider";
import NavigationDataProvider from "./providers/NavigationDataProvider";
import { SearchBar } from "@/ui/Search";
import AuthButtons from "@/ui/AuthButtons";
import Navbar from "@/ui/Navbar";
import styles from "./layout.module.css";
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
            <div className={styles.container}>
              <header className={styles.header}>
                <h1 className={styles.heading}>Pokédex</h1>
                <Suspense fallback={<div>Loading search...</div>}>
                  <SearchBar />
                </Suspense>
                <Suspense fallback={<div>Loading auth...</div>}>
                  <AuthButtons />
                </Suspense>
              </header>
              <div className={styles.content}>
                <Suspense fallback={<div>Loading navigation...</div>}>
                  <Navbar navigationData={navigationData} />
                </Suspense>
                <main className={styles.main}>{children}</main>
              </div>
            </div>
          </ApolloWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
