export type ConversionRecord = {
  id: string
  amount: number
  from: string
  to: string
  result: number
  at: number
}

const HISTORY_KEY = 'devizo_history_v1'
const FAVORITES_KEY = 'devizo_favorites_v1'
const PREMIUM_KEY = 'devizo_premium_v1'
const MAX_FREE_HISTORY = 8
const MAX_PREMIUM_HISTORY = 40

export function loadHistory(): ConversionRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as ConversionRecord[]) : []
  } catch {
    return []
  }
}

export function saveHistory(items: ConversionRecord[], premium: boolean) {
  const limit = premium ? MAX_PREMIUM_HISTORY : MAX_FREE_HISTORY
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, limit)))
}

export function pushHistory(
  record: Omit<ConversionRecord, 'id' | 'at'>,
  premium: boolean,
): ConversionRecord[] {
  const next: ConversionRecord = {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: Date.now(),
  }
  const items = [
    next,
    ...loadHistory().filter(
      (h) => !(h.from === next.from && h.to === next.to && h.amount === next.amount),
    ),
  ]
  saveHistory(items, premium)
  return loadHistory()
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

export function loadFavorites(): string[] {
  const defaults = ['EUR', 'MAD', 'TND', 'DZD', 'EGP']
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? (JSON.parse(raw) as string[]) : defaults
  } catch {
    return defaults
  }
}

export function saveFavorites(codes: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(codes))
}

export function loadPremium(): boolean {
  return localStorage.getItem(PREMIUM_KEY) === '1'
}

export function setPremium(value: boolean) {
  localStorage.setItem(PREMIUM_KEY, value ? '1' : '0')
}
