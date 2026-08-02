# Changelog de Sapeur

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versionnage
[SemVer](https://semver.org/lang/fr/).

## [1.1.0] 2026-08-02

### Ajouté
- Modale « ℹ️ Infos » (bouton dans l'en-tête, `InfoModal.tsx`) expliquant la stack, les
  graphismes, la musique, les interactions (chording, 5 armes), l'architecture et les
  algorithmes notables (grille générée seulement au premier clic, zone 3×3 protégée).
  Étape 15 du chantier de retrofit décrit dans `todo.md` racine du monorepo.

### Vérifié
- Build propre, modale testée à l'ouverture/fermeture (après avoir traversé l'overlay
  d'onboarding), aucune erreur console, aucun débordement horizontal en 390×844.

## [1.0.0] 2026-07-31

Première version intégrable à Hylst.Games, partie d'un export brut audité puis corrigé.

### Ajouté
- Bloc SEO complet dans `index.html` (description, keywords, og, twitter, robots, canonical,
  theme-color) et `lang="fr"`
- `favicon.png` 32×32, `og-image.png` 1024×576 (vraie capture de gameplay) et sa variante
  `og-image.webp`, `icon.webp` 128×128 pour la carte du menu
- `base: '/sapeur/'` dans `vite.config.ts`
- La doc : `about.md`, `README.md`, `structure.md`, `features.md`, `todo.md`, `changelog.md`

### Modifié
- Renommé en **Sapeur**. Le nom précédent, « DÉMINEUR Édition Deluxe », sonnait généré par
  IA. Titre, en-tête, onboarding, manuel de règles, clés `localStorage`.
- `package.json` : `react-vite-tailwind` v0.0.0 devenu `sapeur` v1.0.0

### Corrigé
- Un clic groupé (chord-click) fatal sans bouclier disponible effaçait les cases sûres
  révélées par ce même clic de l'écran de fin de partie : la branche de défaite lisait
  l'ancien plateau (via une fermeture React) au lieu du plateau local qui contenait ces
  révélations. Corrigé, vérifié en navigateur avec un scénario déterministe (mine forcée,
  bouclier à zéro) : les cases sûres restent bien affichées comme révélées après l'explosion.
