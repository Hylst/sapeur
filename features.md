# Fonctionnalités de Sapeur

## Gameplay

- ✅ Démineur classique : révélation, drapeaux, clic groupé (chord-click)
- ✅ Premier clic toujours sûr
- ✅ Campagne de 24 missions en 4 chapitres, avec objectifs et déblocage progressif
- ✅ Mode libre : 5 difficultés + grille personnalisée (taille et mines)
- ✅ 5 outils tactiques : Bouclier, Sonar 3×3, Missile, Stase 15s, Sonde Sûre
- ✅ Caisses de ravitaillement cachées (outils supplémentaires en cours de partie)
- ⬜ Mode classique sans arsenal tactique

## Score et progression

- ✅ XP et progression de campagne sauvegardés en local
- ✅ Score basé sur le temps de complétion
- ✅ Confettis et fanfare à la victoire
- ⬜ Les récompenses de mission sont accordées au lancement, pas à la réussite (voir todo.md)

## Audio

- ✅ Tout est synthétisé en Web Audio, aucun fichier son
- ✅ Musique d'ambiance générative (gamme pentatonique, notes aléatoires)
- ✅ SFX pour chaque action : révélation, drapeau, bonus, missile, sonar, bouclier, victoire, explosion
- ✅ Coupure indépendante musique / effets sonores

## Interface

- ✅ Écran de sélection de mission (campagne) avec chapitres et objectifs
- ✅ HUD façon démineur classique (compteur de mines, chrono, smiley réactif)
- ✅ Bannière d'outil actif avec instructions de ciblage
- ✅ Bascule tactile Fouille / Drapeau (touche Espace ou bouton)
- ✅ Mode plein écran
- ✅ Aucun débordement horizontal, y compris en 390×844
- ⬜ Mise en page mobile un peu à l'étroit (en-tête + arsenal prennent beaucoup de hauteur)

## Technique

- ✅ Build en un seul fichier (~448 Ko), fonctionne hors ligne
- ✅ TypeScript strict
- ✅ Architecture modulaire (composants séparés, types dédiés, données de niveaux séparées)
- ✅ Bloc SEO complet, favicon, og-image (capture réelle du jeu)
- ⬜ Tests unitaires sur la logique de plateau (`populateMines`, `floodReveal`, `checkWinCondition`)
- ⬜ Pas de sauvegarde de la grille en cours (seuls stats/inventaire persistent)
