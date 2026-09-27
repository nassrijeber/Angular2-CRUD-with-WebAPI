import './AdBanner.css'

type Props = {
  premium: boolean
  onUpgrade: () => void
}

export function AdBanner({ premium, onUpgrade }: Props) {
  if (premium) return null

  return (
    <aside className="ad-banner" aria-label="Publicité">
      <div className="ad-label">Publicité</div>
      <p>
        Passe à <strong>Devizo Premium</strong> pour retirer les pubs et garder plus de favoris.
      </p>
      <button type="button" onClick={onUpgrade}>
        Essayer Premium
      </button>
    </aside>
  )
}
