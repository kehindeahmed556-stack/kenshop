// Static exchange rates relative to USD
// Replace with a live API (e.g. exchangerate.host) for production
export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.1,
  MXN: 17.15,
  BRL: 4.97,
  KRW: 1325,
  SGD: 1.34,
  HKD: 7.82,
  NOK: 10.56,
  SEK: 10.42,
  DKK: 6.88,
  NZD: 1.63,
  ZAR: 18.63,
  NGN: 1580,
}

export const CURRENCIES = Object.keys(EXCHANGE_RATES)

export function convertPrice(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount
  const inUSD = amount / (EXCHANGE_RATES[fromCurrency] || 1)
  return inUSD * (EXCHANGE_RATES[toCurrency] || 1)
}

export function formatPrice(amount, currency) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${Number(amount).toFixed(2)}`
  }
}
