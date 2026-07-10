/* eslint-disable no-console */
// Console-based logger: works on Node, Vercel, and Workers runtimes,
// which capture stdout/stderr natively (no writable filesystem required).
const prefix = (level: string) =>
  `${new Date().toISOString()} [pokedex-api] ${level}:`;

export const logger = {
  info: (...args: unknown[]) => console.log(prefix("info"), ...args),
  warn: (...args: unknown[]) => console.warn(prefix("warn"), ...args),
  error: (...args: unknown[]) => console.error(prefix("error"), ...args),
};
