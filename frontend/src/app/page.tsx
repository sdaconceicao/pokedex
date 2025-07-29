import TypesSidebar from "../components/TypesSidebar";
import PokemonList from "../components/PokemonList";
import styles from "./page.module.css";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className={styles.container}>
      <TypesSidebar />
      <main className={styles.main}>
        <h1 className={styles.heading}>Pokédex</h1>
        <PokemonList selectedType={params.type} />
      </main>
    </div>
  );
}
