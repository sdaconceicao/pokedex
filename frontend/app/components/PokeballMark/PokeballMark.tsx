import type { FunctionComponent } from "react";

interface PokeballMarkProps {
  className?: string;
}

/**
 * A minimal ring-style pokéball outline, drawn in `currentColor` so it can be
 * tinted and layered as a decorative watermark (hero backdrops, card corners).
 * For the solid, full-color pokéball glyph, see `Pokeball`.
 */
export const PokeballMark: FunctionComponent<PokeballMarkProps> = ({ className }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    aria-hidden="true"
    focusable="false"
    data-testid="pokeball-mark"
  >
    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="6" />
    <path d="M4 50h32M64 50h32" stroke="currentColor" strokeWidth="6" />
    <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="6" />
  </svg>
);

export default PokeballMark;
