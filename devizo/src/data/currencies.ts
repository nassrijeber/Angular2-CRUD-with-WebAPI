export type Currency = {
  code: string
  name: string
  flag: string
  /** Fixed multiplier vs EUR when not provided by Frankfurter (e.g. CFA franc). */
  pegToEur?: number
}

/**
 * Frankfurter (BCE) currencies + CFA pegs.
 * Unsupported codes are omitted so conversion never silently fails.
 */
export const CURRENCIES: Currency[] = [
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'USD', name: 'Dollar américain', flag: '🇺🇸' },
  { code: 'XOF', name: 'Franc CFA (BCEAO)', flag: '🇸🇳', pegToEur: 655.957 },
  { code: 'XAF', name: 'Franc CFA (BEAC)', flag: '🇨🇲', pegToEur: 655.957 },
  { code: 'GBP', name: 'Livre sterling', flag: '🇬🇧' },
  { code: 'CAD', name: 'Dollar canadien', flag: '🇨🇦' },
  { code: 'CHF', name: 'Franc suisse', flag: '🇨🇭' },
  { code: 'JPY', name: 'Yen japonais', flag: '🇯🇵' },
  { code: 'CNY', name: 'Yuan chinois', flag: '🇨🇳' },
  { code: 'ZAR', name: 'Rand sud-africain', flag: '🇿🇦' },
  { code: 'AUD', name: 'Dollar australien', flag: '🇦🇺' },
  { code: 'INR', name: 'Roupie indienne', flag: '🇮🇳' },
  { code: 'BRL', name: 'Real brésilien', flag: '🇧🇷' },
  { code: 'TRY', name: 'Livre turque', flag: '🇹🇷' },
  { code: 'SEK', name: 'Couronne suédoise', flag: '🇸🇪' },
  { code: 'NOK', name: 'Couronne norvégienne', flag: '🇳🇴' },
  { code: 'DKK', name: 'Couronne danoise', flag: '🇩🇰' },
  { code: 'PLN', name: 'Zloty polonais', flag: '🇵🇱' },
  { code: 'MXN', name: 'Peso mexicain', flag: '🇲🇽' },
  { code: 'SGD', name: 'Dollar de Singapour', flag: '🇸🇬' },
  { code: 'HKD', name: 'Dollar de Hong Kong', flag: '🇭🇰' },
  { code: 'KRW', name: 'Won sud-coréen', flag: '🇰🇷' },
  { code: 'NZD', name: 'Dollar néo-zélandais', flag: '🇳🇿' },
  { code: 'THB', name: 'Baht thaïlandais', flag: '🇹🇭' },
  { code: 'IDR', name: 'Rupiah indonésienne', flag: '🇮🇩' },
  { code: 'PHP', name: 'Peso philippin', flag: '🇵🇭' },
  { code: 'CZK', name: 'Couronne tchèque', flag: '🇨🇿' },
  { code: 'HUF', name: 'Forint hongrois', flag: '🇭🇺' },
  { code: 'ILS', name: 'Shekel israélien', flag: '🇮🇱' },
  { code: 'RON', name: 'Leu roumain', flag: '🇷🇴' },
  { code: 'MYR', name: 'Ringgit malaisien', flag: '🇲🇾' },
  { code: 'ISK', name: 'Couronne islandaise', flag: '🇮🇸' },
]

export const CURRENCY_MAP = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c]),
) as Record<string, Currency>

export const DEFAULT_FROM = 'EUR'
export const DEFAULT_TO = 'XOF'
