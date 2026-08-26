import { notFound } from "next/navigation";
import { Suspense } from "react";
import { findPokedexFamily } from "@/lib/pokedexFamilies";
import { getPokedexByName } from "@/lib/server-queries";
import { getPokedexes } from "@/providers/NavigationDataProvider";
import PokedexHero, { PokedexHeroSkeleton } from "./components/PokedexHero";
import PokedexPokemon from "./components/PokedexPokemon";
import styles from "./page.module.css";

async function PokedexHeroContent({ name }: { name: string }) {
  // The dex list is what the sidebar above already fetched this request, so the
  // Apollo cache answers this one — it is here for the revisions of this dex's
  // place, which only the whole list can tell us.
  const [pokedex, pokedexes] = await Promise.all([getPokedexByName(name), getPokedexes()]);

  if (!pokedex) {
    notFound();
  }

  return <PokedexHero pokedex={pokedex} family={findPokedexFamily(pokedexes, pokedex.name)} />;
}

export default async function Page(props: { params: Promise<{ name: string }> }) {
  const { name } = await props.params;
  const pokedex = decodeURIComponent(name);

  return (
    <div className={styles.container}>
      {/* The profile streams in on its own; the list below fetches on the
          client and doesn't wait for it. */}
      <Suspense fallback={<PokedexHeroSkeleton />}>
        <PokedexHeroContent name={pokedex} />
      </Suspense>

      {/* Keyed by pokedex so moving between dexes starts on page 1 */}
      <PokedexPokemon key={pokedex} pokedex={pokedex} />
    </div>
  );
}
