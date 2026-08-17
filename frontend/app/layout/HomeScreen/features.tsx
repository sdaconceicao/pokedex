import { BarChart01, FilterFunnel01, SearchLg, Stars02 } from "@untitled-ui/icons-react";
import type { FeatureTileAccent } from "@/components/FeatureTile";

export const FEATURES: Array<{
  icon: React.ReactNode;
  accent: FeatureTileAccent;
  title: string;
  body: string;
}> = [
  {
    icon: <SearchLg />,
    accent: "red",
    title: "Search instantly",
    body: "Type a name, or just part of one, into the search bar above to jump straight to any Pokémon.",
  },
  {
    icon: <FilterFunnel01 />,
    accent: "blue",
    title: "Browse your way",
    body: "Filter the full list of Pokémon by type, region, or regional Pokédex from the sidebar. ",
  },
  {
    icon: <Stars02 />,
    accent: "purple",
    title: "Discover special forms",
    body: "Find all Gigantamax and Mega Evolutions in one place.",
  },
  {
    icon: <BarChart01 />,
    accent: "green",
    title: "Go deep on stats",
    body: "Open any Pokémon to see HP, Attack, and Defense, plus abilities.",
  },
];
