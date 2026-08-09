import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTypeByName } from "@/lib/server-queries";
import TypeHero, { TypeHeroSkeleton } from "./components/TypeHero";
import TypePokemon from "./components/TypePokemon";
import styles from "./page.module.css";

async function TypeHeroContent({ name }: { name: string }) {
  const type = await getTypeByName(name);

  if (!type) {
    notFound();
  }

  return <TypeHero type={type} />;
}

export default async function Page(props: { params: Promise<{ name: string }> }) {
  const { name } = await props.params;
  const type = decodeURIComponent(name);

  return (
    <div className={styles.container}>
      {/* The profile streams in on its own; the list below fetches on the
          client and doesn't wait for it. */}
      <Suspense fallback={<TypeHeroSkeleton />}>
        <TypeHeroContent name={type} />
      </Suspense>

      {/* Keyed by type so moving between types starts on page 1 */}
      <TypePokemon key={type} type={type} />
    </div>
  );
}
