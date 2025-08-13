import Navbar from "@/ui/Navbar/Navbar";
import PokemonDataFetcher from "@/ui/PokemonDataFetcher";
import { SearchBar } from "@/ui/Search";
import styles from "./page.module.css";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    pokedex?: string;
    region?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.heading}>Pokédex</h1>
        <SearchBar />
        <PokemonDataFetcher
          searchQuery={params.q}
          selectedType={params.type}
          selectedPokedex={params.pokedex}
          selectedRegion={params.region}
        />
      </main>
    </div>
  );
}
