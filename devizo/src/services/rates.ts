import { CURRENCIES, type Currency } from '../data/currencies'

const CACHE_KEY = 'devizo_rates_v1'
const CACHE_TTL_MS = 60 * 60 * 1000

export type RatesSnapshot = {
  base: 'EUR'
  date: string
  rates: Record<string, number>
  fetchedAt: number
  fromCache: boolean
}

type FrankfurterLatest = {
  amount: number
  base: string
  date: string
  rates: Record<string, number>
}

function peggedCodes(): Currency[] {
  return CURRENCIES.filter((c) => c.pegToEur != null)
}

function applyPegs(rates: Record<string, number>): Record<string, number> {
  const next = { ...rates, EUR: 1 }
  for (const c of peggedCodes()) {
    if (c.pegToEur != null) next[c.code] = c.pegToEur
  }
  return next
}

function readCache(): RatesSnapshot | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as RatesSnapshot
  } catch {
    return null
  }
}

function writeCache(snapshot: RatesSnapshot) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ ...snapshot, fromCache: true }))
}

function frankfurterSymbols(): string {
  return CURRENCIES.filter((c) => c.pegToEur == null && c.code !== 'EUR')
    .map((c) => c.code)
    .join(',')
}

export async function fetchRates(force = false): Promise<RatesSnapshot> {
  const cached = readCache()
  const fresh = cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS

  if (!force && fresh && cached) {
    return { ...cached, fromCache: true }
  }

  try {
    // Use api.frankfurter.dev directly (api.frankfurter.app 301-redirects and breaks browser CORS).
    const url = `https://api.frankfurter.dev/v1/latest?base=EUR&symbols=${frankfurterSymbols()}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as FrankfurterLatest
    const snapshot: RatesSnapshot = {
      base: 'EUR',
      date: data.date,
      rates: applyPegs(data.rates),
      fetchedAt: Date.now(),
      fromCache: false,
    }
    writeCache(snapshot)
    return snapshot
  } catch (err) {
    if (cached) return { ...cached, fromCache: true }
    throw err
  }
}

export function convert(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
): number {
  if (!Number.isFinite(amount)) return 0
  const fromRate = rates[from]
  const toRate = rates[to]
  if (!fromRate || !toRate) return NaN
  const inEur = amount / fromRate
  return inEur * toRate
}

export function formatMoney(value: number, code: string): string {
  if (!Number.isFinite(value)) return '—'
  const abs = Math.abs(value)
  const fractionDigits = abs >= 1000 ? 2 : abs >= 1 ? 2 : abs >= 0.01 ? 4 : 6
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: code,
      currencyDisplay: 'code',
      maximumFractionDigits: fractionDigits,
    }).format(value)
  } catch {
    return `${value.toLocaleString('fr-FR', { maximumFractionDigits: fractionDigits })} ${code}`
  }
}

export function formatRate(from: string, to: string, rates: Record<string, number>): string {
  const value = convert(1, from, to, rates)
  if (!Number.isFinite(value)) return '—'
  return `1 ${from} = ${value.toLocaleString('fr-FR', { maximumFractionDigits: 4 })} ${to}`
}
