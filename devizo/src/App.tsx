import { useEffect, useMemo, useState } from 'react'
import { CURRENCY_MAP, DEFAULT_FROM, DEFAULT_TO, MAGHREB_CODES } from './data/currencies'
import { useRates } from './hooks/useRates'
import { convert, formatMoney, formatRate } from './services/rates'
import {
  clearHistory,
  loadHistory,
  loadPremium,
  pushHistory,
  setPremium,
  type ConversionRecord,
} from './services/storage'
import { AdBanner } from './components/AdBanner'
import { CurrencyChip, CurrencyPicker, useFavoritesState } from './components/CurrencyPicker'
import { PremiumModal } from './components/PremiumModal'
import './App.css'

type PickerTarget = 'from' | 'to' | null

export default function App() {
  const { snapshot, loading, error, refresh } = useRates()
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState(DEFAULT_FROM)
  const [to, setTo] = useState(DEFAULT_TO)
  const [picker, setPicker] = useState<PickerTarget>(null)
  const [premium, setPremiumState] = useState(loadPremium)
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [history, setHistory] = useState<ConversionRecord[]>(loadHistory)
  const [favorites, setFavorites] = useFavoritesState()
  const [swapping, setSwapping] = useState(false)

  const numericAmount = useMemo(() => {
    const normalized = amount.replace(',', '.').replace(/\s/g, '')
    const n = Number(normalized)
    return Number.isFinite(n) ? n : 0
  }, [amount])

  const result = useMemo(() => {
    if (!snapshot) return NaN
    return convert(numericAmount, from, to, snapshot.rates)
  }, [snapshot, numericAmount, from, to])

  const rateLabel = useMemo(() => {
    if (!snapshot) return 'Chargement des taux…'
    return formatRate(from, to, snapshot.rates)
  }, [snapshot, from, to])

  useEffect(() => {
    if (!snapshot || !Number.isFinite(result) || numericAmount <= 0) return
    const handle = window.setTimeout(() => {
      setHistory(pushHistory({ amount: numericAmount, from, to, result }, premium))
    }, 700)
    return () => window.clearTimeout(handle)
  }, [snapshot, numericAmount, from, to, result, premium])

  const swap = () => {
    setSwapping(true)
    setFrom(to)
    setTo(from)
    window.setTimeout(() => setSwapping(false), 280)
  }

  const activatePremium = () => {
    setPremium(true)
    setPremiumState(true)
    setPremiumOpen(false)
  }

  const statusText = error
    ? error
    : loading && !snapshot
      ? 'Mise à jour des taux…'
      : snapshot
        ? `${snapshot.fromCache ? 'Cache' : 'En ligne'} · ${snapshot.source} · ${snapshot.date}`
        : ''

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="brand">Devizo</p>
          <p className="tagline">Maghreb & monde, en un clin d’œil</p>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => void refresh(true)}
            aria-label="Actualiser les taux"
            title="Actualiser"
          >
            ↻
          </button>
          {premium ? (
            <span className="premium-badge">Premium</span>
          ) : (
            <button type="button" className="ghost-btn accent" onClick={() => setPremiumOpen(true)}>
              Premium
            </button>
          )}
        </div>
      </header>

      <main className="converter">
        <section className={`panel ${swapping ? 'is-swapping' : ''}`}>
          <label className="field">
            <span>Montant</span>
            <div className="amount-row">
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="Montant à convertir"
              />
              <CurrencyChip code={from} onClick={() => setPicker('from')} />
            </div>
          </label>

          <button type="button" className="swap-btn" onClick={swap} aria-label="Inverser les devises">
            ⇄
          </button>

          <label className="field">
            <span>Tu obtiens</span>
            <div className="amount-row result-row">
              <output className="result" aria-live="polite">
                {loading && !snapshot ? '…' : formatMoney(result, to)}
              </output>
              <CurrencyChip code={to} onClick={() => setPicker('to')} />
            </div>
          </label>

          <p className="rate-line">{rateLabel}</p>
          <p className={`status ${error ? 'is-error' : ''}`}>{statusText}</p>
        </section>

        <section className="maghreb" aria-label="Devises du Maghreb">
          <h2>Maghreb</h2>
          <div className="maghreb-row">
            {MAGHREB_CODES.map((code) => {
              const c = CURRENCY_MAP[code]
              const active = to === code
              return (
                <button
                  key={code}
                  type="button"
                  className={`maghreb-chip ${active ? 'is-active' : ''}`}
                  onClick={() => setTo(code)}
                >
                  <span aria-hidden>{c.flag}</span>
                  {code}
                </button>
              )
            })}
          </div>
        </section>

        <AdBanner premium={premium} onUpgrade={() => setPremiumOpen(true)} />

        <section className="history">
          <div className="history-head">
            <h2>Historique</h2>
            {history.length > 0 && (
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  clearHistory()
                  setHistory([])
                }}
              >
                Effacer
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="empty">Tes conversions récentes apparaîtront ici.</p>
          ) : (
            <ul>
              {history.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setAmount(String(h.amount))
                      setFrom(h.from)
                      setTo(h.to)
                    }}
                  >
                    <strong>
                      {h.amount.toLocaleString('fr-FR')} {h.from}
                    </strong>
                    <span>→ {formatMoney(h.result, h.to)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <CurrencyPicker
        open={picker != null}
        title={picker === 'from' ? 'Devise source' : 'Devise cible'}
        selected={picker === 'from' ? from : to}
        favorites={favorites}
        premium={premium}
        onClose={() => setPicker(null)}
        onSelect={(code) => {
          if (picker === 'from') setFrom(code)
          else setTo(code)
        }}
        onFavoritesChange={setFavorites}
        onNeedPremium={() => setPremiumOpen(true)}
      />

      <PremiumModal
        open={premiumOpen}
        onClose={() => setPremiumOpen(false)}
        onActivate={activatePremium}
      />
    </div>
  )
}
