export interface Update {
  /** ISO date used for the <time> element */
  date: string;
  label: string;
  tag: "New" | "Improved";
  title: string;
  body: string;
}

export const UPDATES: Update[] = [
  {
    date: "2026-07-10",
    label: "Jul 10, 2026",
    tag: "New",
    title: "Poképendium",
    body: "A new way to explore the Pokémon universe. Search for every Pokémon by name, browse by type, region, or regional Pokedex, and dive into full stats, abilities, and special forms.",
  },
];
