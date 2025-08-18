import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ApolloWrapper from "@/ui/ApolloWrapper";
import { SearchBar } from "@/ui/Search";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ApolloWrapper>
          <div className={styles.container}>
            <header className={styles.header}>
              <h1 className={styles.heading}>Pokédex</h1>
              <SearchBar />
            </header>
            <div className={styles.content}>
              <Navbar />
              <main className={styles.main}>{children}</main>
            </div>
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}
