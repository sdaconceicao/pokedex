import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getRegionByName } from "@/lib/server-queries";
import RegionHero, { RegionHeroSkeleton } from "./components/RegionHero";
import RegionPokemon from "./components/RegionPokemon";
import styles from "./page.module.css";

async function RegionHeroContent({ name }: { name: string }) {
  const region = await getRegionByName(name);

  if (!region) {
    notFound();
  }

  return <RegionHero region={region} />;
}

export default async function Page(props: { params: Promise<{ name: string }> }) {
  const { name } = await props.params;
  const region = decodeURIComponent(name);

  return (
    <div className={styles.container}>
      {/* The profile streams in on its own; the list below fetches on the
          client and doesn't wait for it. */}
      <Suspense fallback={<RegionHeroSkeleton />}>
        <RegionHeroContent name={region} />
      </Suspense>

      {/* Keyed by region so moving between regions starts on page 1 */}
      <RegionPokemon key={region} region={region} />
    </div>
  );
}
