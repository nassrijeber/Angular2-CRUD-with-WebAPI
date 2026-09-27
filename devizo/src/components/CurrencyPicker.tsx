import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { CURRENCIES, CURRENCY_MAP } from '../data/currencies'
import { loadFavorites, saveFavorites } from '../services/storage'
import './CurrencyPicker.css'

type Props = {
  open: boolean
  title: string
  selected: string
  favorites: string[]
  premium: boolean
  onClose: () => void
  onSelect: (code: string) => void
  onFavoritesChange: (codes: string[]) => void
  onNeedPremium: () => void
}

const FREE_FAVORITE_LIMIT = 4

export function CurrencyPicker({
  open,
  title,
  selected,
  favorites,
  premium,
  onClose,
  onSelect,
  onFavoritesChange,
  onNeedPremium,
}: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    setQuery('')
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = !q
      ? CURRENCIES
      : CURRENCIES.filter(
          (c) =>
            c.code.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q),
        )
    return [...filtered].sort((a, b) => {
      const af = favorites.includes(a.code) ? 0 : 1
      const bf = favorites.includes(b.code) ? 0 : 1
      if (af !== bf) return af - bf
      return a.code.localeCompare(b.code)
    })
  }, [query, favorites])

  if (!open) return null

  const toggleFavorite = (code: string) => {
    if (favorites.includes(code)) {
      onFavoritesChange(favorites.filter((c) => c !== code))
      return
    }
    if (!premium && favorites.length >= FREE_FAVORITE_LIMIT) {
      onNeedPremium()
      return
    }
    onFavoritesChange([...favorites, code])
  }

  return (
    <div className="picker-backdrop" onClick={onClose} role="presentation">
      <div
        className="picker-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="picker-grab" />
        <header className="picker-header">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </header>
        <input
          ref={inputRef}
          className="picker-search"
          placeholder="Rechercher une devise…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className="picker-list">
          {list.map((c) => {
            const isFav = favorites.includes(c.code)
            return (
              <li key={c.code}>
                <button
                  type="button"
                  className={`picker-item ${selected === c.code ? 'is-selected' : ''}`}
                  onClick={() => {
                    onSelect(c.code)
                    onClose()
                  }}
                >
                  <span className="picker-flag" aria-hidden>
                    {c.flag}
                  </span>
                  <span className="picker-meta">
                    <strong>{c.code}</strong>
                    <span>{c.name}</span>
                  </span>
                </button>
                <button
                  type="button"
                  className={`fav-btn ${isFav ? 'is-on' : ''}`}
                  aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  onClick={() => toggleFavorite(c.code)}
                >
                  {isFav ? '★' : '☆'}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export function useFavoritesState() {
  const [favorites, setFavorites] = useState(loadFavorites)
  const update = (codes: string[]) => {
    setFavorites(codes)
    saveFavorites(codes)
  }
  return [favorites, update] as const
}

export function CurrencyChip({ code, onClick }: { code: string; onClick: () => void }) {
  const c = CURRENCY_MAP[code]
  return (
    <button type="button" className="currency-chip" onClick={onClick}>
      <span aria-hidden>{c?.flag ?? '💱'}</span>
      <strong>{code}</strong>
      <span className="chev" aria-hidden>
        ▾
      </span>
    </button>
  )
}
