import { getPokemonById } from "@/lib/server-queries";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const pokemon = await getPokemonById(params.id);

    return (
      <div>
        <h2>{pokemon.name}</h2>
        <div>{pokemon.stats.hp}</div>
      </div>
    );
  } catch (error) {
    console.log("error", error);
    return <div>Error loading Pokemon</div>;
  }
}
