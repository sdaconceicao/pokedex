export const SPECIALS = ["gmax", "mega"] as const;
export type Special = (typeof SPECIALS)[number];

export const SPECIAL_TITLES: Record<Special, string> = {
  gmax: "Gigantamax",
  mega: "Mega Evolve",
};

export const parseSpecial = (value: string | undefined): Special | undefined => {
  const special = value?.trim().toLowerCase();
  return SPECIALS.includes(special as Special) ? (special as Special) : undefined;
};
