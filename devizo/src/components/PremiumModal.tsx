import './PremiumModal.css'

type Props = {
  open: boolean
  onClose: () => void
  onActivate: () => void
}

export function PremiumModal({ open, onClose, onActivate }: Props) {
  if (!open) return null

  return (
    <div className="premium-backdrop" onClick={onClose} role="presentation">
      <div
        className="premium-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="premium-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="premium-kicker">Devizo Premium</p>
        <h2 id="premium-title">Sans pubs. Plus rapide.</h2>
        <ul>
          <li>Suppression des publicités</li>
          <li>Favoris illimités</li>
          <li>Historique étendu</li>
        </ul>
        <p className="premium-note">
          Démo locale : l’achat réel (Play Store / App Store) sera branché plus tard.
        </p>
        <div className="premium-actions">
          <button type="button" className="btn-primary" onClick={onActivate}>
            Activer Premium (démo)
          </button>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Plus tard
          </button>
        </div>
      </div>
    </div>
  )
}
