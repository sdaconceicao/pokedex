import type { ReactNode } from "react";

interface PokedexLayoutProps {
  children: ReactNode;
  /** The @detail slot: a Pokemon opened from this pokedex's list. Renders over
   *  the list, so the list keeps its page and its data while the detail is up
   *  and Back simply drops the detail. */
  detail: ReactNode;
}

export default function PokedexLayout({ children, detail }: PokedexLayoutProps) {
  return (
    <>
      {children}
      {detail}
    </>
  );
}
