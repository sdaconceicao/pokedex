import type { FunctionComponent } from "react";

interface PokeballProps {
  size?: number;
  className?: string;
}

export const Pokeball: FunctionComponent<PokeballProps> = ({ size = 24, className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      data-testid="pokeball"
    >
      <circle cx="50" cy="50" r="45" fill="#fff" />
      <path d="M5 50a45 45 0 0 1 90 0Z" fill="#e8352e" />
      <path d="M5 50h90" stroke="#2f2f2f" strokeWidth="8" />
      <circle cx="50" cy="50" r="45" fill="none" stroke="#2f2f2f" strokeWidth="8" />
      <circle cx="50" cy="50" r="16" fill="#fff" stroke="#2f2f2f" strokeWidth="8" />
      <circle cx="50" cy="50" r="6" fill="#e2e2e6" />
    </svg>
  );
};

export default Pokeball;
