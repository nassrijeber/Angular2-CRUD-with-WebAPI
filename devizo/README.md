# Devizo

Convertisseur de devises mobile-first (**React + Vite + Capacitor**).

Compatible **Android** et **iOS** (projets natifs dans `android/` et `ios/`).

## Devises Maghreb

- 🇲🇦 **MAD** — Dirham marocain  
- 🇹🇳 **TND** — Dinar tunisien  
- 🇩🇿 **DZD** — Dinar algérien  
- 🇪🇬 **EGP** — Livre égyptienne  

(+ CFA, EUR, USD et devises mondiales)

## Lancer en local (web)

```bash
cd devizo
npm install
npm run dev
```

## Android / iOS

```bash
cd devizo
npm install
npm run mobile:sync
```

Puis :

- **Android** : `npm run mobile:android` (ouvre Android Studio) → Run sur émulateur / téléphone  
- **iOS** : `npm run mobile:ios` (sur un Mac avec Xcode) → Run sur simulateur / iPhone  

L’app web est aussi installable en **PWA** (Ajouter à l’écran d’accueil).

## Fonctionnalités

- Conversion instantanée (API gratuite, Maghreb inclus)
- Raccourcis Maghreb (MAD / TND / DZD / EGP)
- Inversion, recherche, favoris
- Cache local 1 h
- Historique
- Pubs + Premium démo

## Build web

```bash
cd devizo
npm run build
npm run preview
```
