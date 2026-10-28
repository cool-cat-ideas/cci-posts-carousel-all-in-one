/** Older integrations can preserve numeric PHP array keys when filtering results. */
export function searchResults(payload) {
  if (Array.isArray(payload)) return payload;
  if (
    payload &&
    typeof payload === 'object' &&
    Object.keys(payload).every((key) => /^(0|[1-9]\d*)$/.test(key))
  ) {
    return Object.values(payload);
  }
  throw new Error('Invalid search response.');
}
