export function normalizeRecord(input) { return { id: String(input?.id ?? ''), value: String(input?.value ?? '').trim() }; }
