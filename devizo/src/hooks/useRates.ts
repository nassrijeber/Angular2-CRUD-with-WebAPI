import { useCallback, useEffect, useState } from 'react'
import { fetchRates, type RatesSnapshot } from '../services/rates'

export function useRates() {
  const [snapshot, setSnapshot] = useState<RatesSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (force = false) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRates(force)
      setSnapshot(data)
    } catch {
      setError('Impossible de charger les taux. Vérifie ta connexion.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh(false)
  }, [refresh])

  return { snapshot, loading, error, refresh }
}
