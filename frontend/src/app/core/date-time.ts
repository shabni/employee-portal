export function asDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return value;
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return null;
  return new Date(numeric < 100_000_000_000 ? numeric * 1000 : numeric);
}

export function unixSeconds(value: Date | string | number): number {
  const date = value instanceof Date ? value : new Date(value);
  return Math.floor(date.getTime() / 1000);
}
