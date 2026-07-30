# Structure de Sapeur

## Arborescence

```
sapeur-game-development/
├── index.html              # template Vite + bloc SEO (lang=fr)
├── package.json            # sapeur v1.0.0
├── vite.config.ts          # base '/sapeur/', react + tailwind + singlefile
├── tsconfig.json
├── .gitignore                # deps, secrets, fichiers d'agents IA
├── about.md / README.md / structure.md / features.md / todo.md / changelog.md
├── og-image.png / favicon.png
├── public/
│   ├── favicon.png
│   ├── og-image.png / og-image.webp
│   └── icon.webp             # carte du menu, 128x128
└── src/
    ├── main.tsx
    ├── App.tsx                # etat global : navigation, plateau, inventaire, stats
    ├── types/
    │   └── game.ts            # Cell, Board, Inventory, LevelConfig, etc.
    ├── data/
    │   └── levels.ts           # les 24 missions de la campagne (4 chapitres de 6)
    ├── services/
    │   └── audio.ts            # classe AudioService : musique + SFX synthetises
    └── components/
        ├── Header.tsx           # navigation, difficulte, audio, plein ecran
        ├── BoardView.tsx        # plateau + HUD + rendu des cellules
        ├── BonusToolbar.tsx     # barre d'arsenal fixe en bas d'ecran
        ├── CampaignView.tsx     # ecran de selection de mission par chapitre
        ├── OnboardingModal.tsx
        ├── RulesModal.tsx
        └── CustomGameModal.tsx  # reglage de grille personnalisee
```

## Contrairement aux autres jeux du hub

Ce jeu (comme sa variante « Mine de Rien ») n'a pas de module `engine.ts` unique : la logique
de plateau vit directement dans `App.tsx` (fonctions `createEmptyGrid`, `computeNeighbors`,
`populateMines`, `floodReveal`, `checkWinCondition`), toutes des `useCallback` sans dependance
a l'etat React (elles prennent le plateau en parametre). L'architecture est plus modulaire que
Mine de Rien : composants separes par responsabilite, types centralises dans `types/game.ts`,
donnees de niveaux dans un fichier dedie.

## Points d'attention pour l'audit futur

- **`populateMines`** protege une zone 3x3 autour du premier clic, place les mines, puis
  ajoute 2 a 4 bonus caches sur des cases sures aleatoires.
- **`floodReveal`** est le point d'entree UNIQUE pour reveler des cellules (clic simple, clic
  groupe, Missile, Sonde Sure) — et gere lui-meme la collecte des bonus caches (`if
  (cell.bonus) setInventory(...)`) directement pendant le parcours, PAS via un passage de
  comparaison apres coup. C'est plus robuste que l'approche de Mine de Rien (qui necessitait
  un correctif specifique pour ce probleme) : tant que toute revelation passe par
  `floodReveal`, les bonus sont toujours ramasses correctement.
- **Clic groupe (`executeCellClick`, section "Chord Execution")** : construit un plateau
  local `currentB` en accumulant les reveleations, et detecte `fatalHit` en cours de route.
  **Piege corrige pendant l'audit** : la branche "pas de bouclier, partie perdue" doit
  construire l'etat final a partir de `currentB` (pas de l'etat React `board` via une
  fermeture) — sinon les cases sures revelees par ce meme clic disparaissent de l'ecran final.
- **`handleResetMatch`** accorde les recompenses de la mission de campagne DES le lancement
  (pas a la reussite) — voir todo.md, comportement a confirmer avec l'auteur original.

## Rendu

Chaque cellule est un `motion.div` (framer-motion) avec anti-hover/tap scale, pas de classe
CSS custom pour les animations (contrairement aux autres jeux du hub qui utilisent des
`@keyframes` maison) — ce jeu s'appuie sur framer-motion pour ses transitions.

## Build

`vite-plugin-singlefile` inline le JS et le CSS dans `index.html` (~448 Ko, le plus lourd du
hub a ce jour du fait de framer-motion + canvas-confetti + lucide-react, mais largement sous
la limite de 3 Mo). `base: '/sapeur/'` fait resoudre les assets sous
`https://games.hylst.fr/sapeur/`.
