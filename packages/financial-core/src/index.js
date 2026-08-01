function assertFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be a finite number`);
}

export function money(amountMinor, currency = 'USD') {
  assertFinite(amountMinor, 'amountMinor');
  const normalizedCurrency = String(currency || '').trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(normalizedCurrency)) throw new TypeError('currency must be a 3-letter ISO code');
  return Object.freeze({ amountMinor: Math.trunc(amountMinor), currency: normalizedCurrency });
}

export function sumMoney(values) {
  if (!Array.isArray(values) || values.length === 0) return money(0, 'USD');
  const currency = values[0].currency;
  const total = values.reduce((sum, value) => {
    if (value.currency !== currency) throw new TypeError('cannot sum mixed currencies without an exchange-rate policy');
    return sum + value.amountMinor;
  }, 0);
  return money(total, currency);
}

export function calculateMonthlyBurn({ openingCashMinor, closingCashMinor, months }) {
  [openingCashMinor, closingCashMinor, months].forEach((value, index) => assertFinite(value, ['openingCashMinor', 'closingCashMinor', 'months'][index]));
  if (months <= 0) throw new RangeError('months must be greater than zero');
  return Math.max(0, (openingCashMinor - closingCashMinor) / months);
}

export function calculateRunwayMonths({ cashMinor, monthlyBurnMinor }) {
  assertFinite(cashMinor, 'cashMinor');
  assertFinite(monthlyBurnMinor, 'monthlyBurnMinor');
  if (cashMinor < 0) return 0;
  if (monthlyBurnMinor <= 0) return null;
  return cashMinor / monthlyBurnMinor;
}

export function createEvidenceRef({ sourceType, sourceId, observedAt, checksum = null }) {
  if (!sourceType || !sourceId || !observedAt) throw new TypeError('sourceType, sourceId, and observedAt are required');
  return Object.freeze({ sourceType, sourceId, observedAt, checksum });
}
