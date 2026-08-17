import PokemonDetailContent from "@/pokemon/[id]/components/PokemonDetailContent";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  return <PokemonDetailContent id={id} />;
}
