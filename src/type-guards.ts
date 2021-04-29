export function isInteger(maybeNumber: unknown): maybeNumber is number {
  return Number.isInteger(maybeNumber);
}

export function isObject(
  maybeObject: unknown,
): maybeObject is Record<string, unknown> {
  return typeof maybeObject === 'object' && maybeObject !== null;
}
