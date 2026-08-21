export interface GroupValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateGroupName(name: unknown): GroupValidationResult {
  const errors: string[] = [];

  if (typeof name !== 'string') {
    errors.push('Name is required');
    return { isValid: false, errors };
  }

  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > 50) {
    errors.push('Name must be between 1 and 50 characters');
  }

  return { isValid: errors.length === 0, errors };
}

const POKEMON_REF_REGEX = /^[A-Za-z0-9-]+$/;

export function validatePokemonRef(
  value: unknown,
  field: string,
): GroupValidationResult {
  const errors: string[] = [];

  if (typeof value !== 'string' || value.length === 0) {
    errors.push(`${field} is required`);
  } else if (value.length > 64 || !POKEMON_REF_REGEX.test(value)) {
    errors.push(`${field} must be alphanumeric and at most 64 characters`);
  }

  return { isValid: errors.length === 0, errors };
}
