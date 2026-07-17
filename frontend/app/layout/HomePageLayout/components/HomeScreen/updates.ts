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
    date: "2025-08-24",
    label: "Aug 24, 2025",
    tag: "New",
    title: "Trainer accounts",
    body: "Create an account and sign in from the app bar to make the Pokédex your own.",
  },
];
