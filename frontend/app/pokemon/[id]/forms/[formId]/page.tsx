import PokemonDetailContent from "@/pokemon/[id]/components/PokemonDetailContent";

export default async function Page(props: { params: Promise<{ formId: string }> }) {
  const { formId } = await props.params;

  return <PokemonDetailContent id={formId} />;
}
