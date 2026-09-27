# Devizo

Convertisseur de devises mobile-first (React + Vite).

## Lancer en local

```bash
cd devizo
npm install
npm run dev
```

Ouvre l’URL affichée (ex. `http://localhost:5173`).

## Fonctionnalités

- Conversion instantanée (API Frankfurter, gratuite)
- Francs CFA (XOF / XAF) via parité fixe EUR
- Inversion des devises, recherche, favoris
- Cache local 1 h (mode hors-ligne avec derniers taux)
- Historique des conversions
- Bannière pub + Premium démo (sans pubs, favoris illimités)

## Build

```bash
cd devizo
npm run build
npm run preview
```

## Suite mobile

Cette app web peut être empaquetée pour Android/iOS avec **Capacitor** (ou migrée en Flutter plus tard).
