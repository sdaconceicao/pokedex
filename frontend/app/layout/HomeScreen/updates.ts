export interface Update {
  /** ISO date used for the <time> element */
  date: string;
  label: string;
  tag?: "New" | "Improved";
  tags?: string[];
  title: string;
  body: string;
}

export const UPDATES: Update[] = [
  {
    date: "2026-08-18",
    label: "Aug 18, 2026",
    tags: ["New"],
    title: "Forms and Multifaceted Search",
    body: "Forms have now been added to each Pokémon's page. You can now see all Gigantamax and Mega Evolutions in one place. Multifaceted search is also now available.",
  },
  {
    date: "2026-07-10",
    label: "Jul 10, 2026",
    title: "Poképendium",
    body: "A new way to explore the Pokémon universe. Search for every Pokémon by name, browse by type, region, or regional Pokedex, and dive into full stats, abilities, and special forms.",
  },
];
