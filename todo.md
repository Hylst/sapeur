# TODO de Sapeur

Audit fait le 2026-07-31 sur l'export brut (`build-minesweeper-web-game vB.zip`), suivi d'une
passe QA navigateur (Playwright + Chromium) avec vérification déterministe du bug le plus
sérieux trouvé.

---

## ✅ Corrigé — bugs

- [x] **Un clic groupé (chord-click) fatal sans bouclier effaçait les cases sûres révélées
  par ce même clic.** Quand un clic groupé sur un chiffre révèle plusieurs voisins d'un coup
  et que l'un d'eux est une mine non désamorcée, le code construisait un plateau local
  `currentB` (avec les cases sûres déjà marquées révélées), mais la branche « pas de bouclier,
  partie perdue » écrivait `setBoard(curr => curr.map(...))` — `curr` provenant de la
  fermeture React, donc l'**ancien** plateau d'avant le clic, pas `currentB`. Résultat :
  l'écran de fin de partie « oubliait » les cases sûres pourtant révélées à l'instant, comme
  si ce dernier clic n'avait jamais eu lieu (à part la mine, marquée explosée). Corrigé en
  utilisant `currentB` comme source de la carte finale. **Vérifié en navigateur** : avec une
  mine forcée et un bouclier à 0, les 6 cases sûres voisines révélées par le clic groupé
  restent bien affichées comme révélées sur l'écran « DÉTONATION FATALE », alors qu'avant le
  correctif elles seraient réapparues couvertes.

## ✅ Corrigé — cohérence et intégration

- [x] Renommé en **Sapeur** — l'ancien nom, « DÉMINEUR Édition Deluxe », sonnait généré par
  IA. « Sapeur » est le terme militaire réel pour un soldat du génie spécialisé dans le
  déminage — collision thématique parfaite, sans reprendre de marque déposée.
- [x] `base: '/sapeur/'` ajouté dans `vite.config.ts`, il n'y en avait aucun.
- [x] `index.html` : `lang="en"` corrigé en `lang="fr"`, titre générique « Minesweeper »
  remplacé, bloc SEO complet (description, keywords, og, twitter, robots, canonical,
  theme-color), `<link rel="icon">`.
- [x] `package.json` : `react-vite-tailwind` v0.0.0 devenu `sapeur` v1.0.0.
- [x] Clés `localStorage` renommées (`dng_stats`/`dng_inv`/`dng_onboarded` →
  `sapeur_stats`/`sapeur_inv`/`sapeur_onboarded`).

## ✅ La passe QA navigateur

- [x] 0 erreur console, 0 exception non gérée
- [x] Mode Expédition (campagne, 24 missions) et Mode Libre (5 difficultés + personnalisé)
- [x] Révélation d'une cellule sûre, flood-fill, chiffres corrects
- [x] Poser et retirer un drapeau
- [x] **Vérification déterministe du fix clic groupé fatal** (mine forcée, bouclier à 0,
  cases sûres confirmées toujours révélées sur l'écran de défaite)
- [x] Viewport mobile 390×844 : aucun débordement horizontal
- [x] Screenshot de gameplay réel capturé pour `og-image.png`/`.webp` et `icon.webp`

---

## ⬜ Idées d'amélioration

### Game design / cohérence
- [ ] **Les récompenses de mission sont accordées au lancement, pas à la réussite.**
  `handleResetMatch` ajoute les `rewards.bonuses` de la mission dès qu'elle démarre (y compris
  au premier chargement de l'app, avant même le premier clic). Une mission qu'on relance
  plusieurs fois (bouton « Recommencer ») redonne donc ses récompenses à chaque tentative,
  pas seulement à la réussite. À vérifier si c'est le comportement voulu — sinon, déplacer
  l'octroi dans `handleWin`.
- [ ] Sur un clic groupé fatal avec bouclier disponible, la mine qui a déclenché le
  `fatalHit` n'est jamais explicitement révélée ni marquée dans la branche « bouclier
  absorbe » — elle reste couverte comme si le clic n'avait pas touché cette case. Cohérent
  avec « le bouclier a intercepté l'impact avant qu'il ne se produise », mais à confirmer.
- [ ] Sur un clic groupé fatal, **toutes** les mines non-drapées sont marquées "explosées"
  (💥) sur l'écran de fin, alors qu'un clic simple fatal n'en marque qu'**une seule** comme
  explosée (les autres mines restent affichées en 💣 simple). Incohérence visuelle mineure
  entre les deux chemins de défaite.
- [ ] Le mode mobile est un peu à l'étroit : l'en-tête (assez haut, plusieurs lignes) et la
  barre d'arsenal fixe en bas se partagent l'espace vertical avec le plateau, qui a moins de
  place qu'il ne pourrait sur un petit écran.

### Fonctionnalités
- [ ] Un mode « classique » sans arsenal tactique pour les puristes du démineur
- [ ] Sauvegarde de la grille en cours (actuellement seuls stats/inventaire/onboarding sont
  persistés — recommencer l'app en cours de partie perd la grille active)

### Technique
- [ ] Aucun test automatisé sur la logique pure (`populateMines`, `floodReveal`,
  `checkWinCondition`, `computeNeighbors`), qui s'y prêterait bien puisqu'elle ne dépend pas
  de React.
- [ ] `CustomGameModal` recalcule `maxMines`/`safeMines` à chaque rendu à partir de l'état
  `mines` brut (jamais remis à zéro), ce qui fonctionne mais duplique un peu de logique de
  clamp qui pourrait vivre directement dans `setMines`.
