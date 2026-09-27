export type Currency = {
  code: string
  name: string
  flag: string
  /** Fixed multiplier vs EUR (official CFA peg). */
  pegToEur?: number
  region?: 'maghreb' | 'africa' | 'world'
}

/** Maghreb first, then CFA / world. Rates from open.er-api.com (covers MAD/TND/DZD/EGP). */
export const CURRENCIES: Currency[] = [
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', region: 'world' },
  { code: 'USD', name: 'Dollar américain', flag: '🇺🇸', region: 'world' },
  { code: 'MAD', name: 'Dirham marocain', flag: '🇲🇦', region: 'maghreb' },
  { code: 'TND', name: 'Dinar tunisien', flag: '🇹🇳', region: 'maghreb' },
  { code: 'DZD', name: 'Dinar algérien', flag: '🇩🇿', region: 'maghreb' },
  { code: 'EGP', name: 'Livre égyptienne', flag: '🇪🇬', region: 'maghreb' },
  { code: 'XOF', name: 'Franc CFA (BCEAO)', flag: '🇸🇳', pegToEur: 655.957, region: 'africa' },
  { code: 'XAF', name: 'Franc CFA (BEAC)', flag: '🇨🇲', pegToEur: 655.957, region: 'africa' },
  { code: 'GBP', name: 'Livre sterling', flag: '🇬🇧', region: 'world' },
  { code: 'CAD', name: 'Dollar canadien', flag: '🇨🇦', region: 'world' },
  { code: 'CHF', name: 'Franc suisse', flag: '🇨🇭', region: 'world' },
  { code: 'JPY', name: 'Yen japonais', flag: '🇯🇵', region: 'world' },
  { code: 'CNY', name: 'Yuan chinois', flag: '🇨🇳', region: 'world' },
  { code: 'SAR', name: 'Riyal saoudien', flag: '🇸🇦', region: 'world' },
  { code: 'AED', name: 'Dirham des EAU', flag: '🇦🇪', region: 'world' },
  { code: 'TRY', name: 'Livre turque', flag: '🇹🇷', region: 'world' },
  { code: 'ZAR', name: 'Rand sud-africain', flag: '🇿🇦', region: 'africa' },
  { code: 'AUD', name: 'Dollar australien', flag: '🇦🇺', region: 'world' },
  { code: 'INR', name: 'Roupie indienne', flag: '🇮🇳', region: 'world' },
  { code: 'BRL', name: 'Real brésilien', flag: '🇧🇷', region: 'world' },
  { code: 'SEK', name: 'Couronne suédoise', flag: '🇸🇪', region: 'world' },
  { code: 'NOK', name: 'Couronne norvégienne', flag: '🇳🇴', region: 'world' },
  { code: 'DKK', name: 'Couronne danoise', flag: '🇩🇰', region: 'world' },
  { code: 'PLN', name: 'Zloty polonais', flag: '🇵🇱', region: 'world' },
  { code: 'MXN', name: 'Peso mexicain', flag: '🇲🇽', region: 'world' },
  { code: 'SGD', name: 'Dollar de Singapour', flag: '🇸🇬', region: 'world' },
  { code: 'HKD', name: 'Dollar de Hong Kong', flag: '🇭🇰', region: 'world' },
  { code: 'KRW', name: 'Won sud-coréen', flag: '🇰🇷', region: 'world' },
  { code: 'NZD', name: 'Dollar néo-zélandais', flag: '🇳🇿', region: 'world' },
  { code: 'THB', name: 'Baht thaïlandais', flag: '🇹🇭', region: 'world' },
  { code: 'IDR', name: 'Rupiah indonésienne', flag: '🇮🇩', region: 'world' },
  { code: 'PHP', name: 'Peso philippin', flag: '🇵🇭', region: 'world' },
  { code: 'CZK', name: 'Couronne tchèque', flag: '🇨🇿', region: 'world' },
  { code: 'HUF', name: 'Forint hongrois', flag: '🇭🇺', region: 'world' },
  { code: 'ILS', name: 'Shekel israélien', flag: '🇮🇱', region: 'world' },
  { code: 'RON', name: 'Leu roumain', flag: '🇷🇴', region: 'world' },
  { code: 'MYR', name: 'Ringgit malaisien', flag: '🇲🇾', region: 'world' },
  { code: 'ISK', name: 'Couronne islandaise', flag: '🇮🇸', region: 'world' },
]

export const MAGHREB_CODES = CURRENCIES.filter((c) => c.region === 'maghreb').map((c) => c.code)

export const CURRENCY_MAP = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c]),
) as Record<string, Currency>

export const DEFAULT_FROM = 'EUR'
export const DEFAULT_TO = 'MAD'
