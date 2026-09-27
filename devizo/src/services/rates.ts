import { CURRENCIES, type Currency } from '../data/currencies'

const CACHE_KEY = 'devizo_rates_v2'
const CACHE_TTL_MS = 60 * 60 * 1000

export type RatesSnapshot = {
  base: 'EUR'
  date: string
  rates: Record<string, number>
  fetchedAt: number
  fromCache: boolean
  source: string
}

type OpenErApiResponse = {
  result: string
  base_code: string
  time_last_update_utc?: string
  rates: Record<string, number>
}

type CurrencyApiResponse = {
  date?: string
  eur: Record<string, number>
}

function peggedCodes(): Currency[] {
  return CURRENCIES.filter((c) => c.pegToEur != null)
}

function applyPegs(rates: Record<string, number>): Record<string, number> {
  const next = { ...rates, EUR: 1 }
  for (const c of peggedCodes()) {
    // Prefer live rate when available; keep official peg as fallback.
    if (c.pegToEur != null && next[c.code] == null) next[c.code] = c.pegToEur
  }
  return next
}

function pickNeededRates(all: Record<string, number>): Record<string, number> {
  const needed: Record<string, number> = { EUR: 1 }
  for (const c of CURRENCIES) {
    const value = all[c.code] ?? all[c.code.toLowerCase()]
    if (typeof value === 'number') needed[c.code] = value
  }
  return applyPegs(needed)
}

function parseUtcDate(raw?: string): string {
  if (!raw) return new Date().toISOString().slice(0, 10)
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw.slice(0, 10)
  return d.toISOString().slice(0, 10)
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

async function fetchOpenErApi(): Promise<RatesSnapshot> {
  const res = await fetch('https://open.er-api.com/v6/latest/EUR')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as OpenErApiResponse
  if (data.result !== 'success' || !data.rates) throw new Error('Invalid ER API payload')
  return {
    base: 'EUR',
    date: parseUtcDate(data.time_last_update_utc),
    rates: pickNeededRates(data.rates),
    fetchedAt: Date.now(),
    fromCache: false,
    source: 'Open ER API',
  }
}

async function fetchCurrencyApiFallback(): Promise<RatesSnapshot> {
  const res = await fetch('https://latest.currency-api.pages.dev/v1/currencies/eur.json')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as CurrencyApiResponse
  if (!data.eur) throw new Error('Invalid currency-api payload')
  const upper: Record<string, number> = {}
  for (const [k, v] of Object.entries(data.eur)) {
    upper[k.toUpperCase()] = v
  }
  return {
    base: 'EUR',
    date: data.date ?? new Date().toISOString().slice(0, 10),
    rates: pickNeededRates(upper),
    fetchedAt: Date.now(),
    fromCache: false,
    source: 'Currency API',
  }
}

export async function fetchRates(force = false): Promise<RatesSnapshot> {
  const cached = readCache()
  const fresh = cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS

  if (!force && fresh && cached) {
    return { ...cached, fromCache: true }
  }

  try {
    const snapshot = await fetchOpenErApi()
    writeCache(snapshot)
    return snapshot
  } catch {
    try {
      const snapshot = await fetchCurrencyApiFallback()
      writeCache(snapshot)
      return snapshot
    } catch (err) {
      if (cached) return { ...cached, fromCache: true }
      throw err
    }
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
