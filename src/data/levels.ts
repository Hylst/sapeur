import { LevelConfig } from '../types/game';

export const CAMPAIGN_LEVELS: LevelConfig[] = [
  // --- Chapitre 1 ---
  {
    id: 1,
    title: 'Niveau 1',
    subtitle: 'Initiation Douce',
    rows: 6,
    cols: 6,
    mines: 3,
    objectives: [
      { type: 'clear', description: 'Dévoilez toutes les cases sûres' },
      { type: 'no_mistakes', description: 'Ne faites exploser aucune mine' }
    ],
    rewards: {
      bonuses: { shield: 2, safeScan: 1 },
      xp: 100
    }
  },
  {
    id: 2,
    title: 'Niveau 2',
    subtitle: 'Premiers Pas Tactiques',
    rows: 8,
    cols: 8,
    mines: 7,
    objectives: [
      { type: 'clear', description: 'Dévoilez la zone' },
      { type: 'find_bonuses', description: 'Récupérez les bonus cachés' }
    ],
    rewards: {
      bonuses: { radar: 2 },
      xp: 150
    }
  },
  {
    id: 3,
    title: 'Niveau 3',
    subtitle: 'Découverte du Radar',
    rows: 9,
    cols: 9,
    mines: 10,
    objectives: [
      { type: 'clear', description: 'Nettoyez la zone' },
      { type: 'use_bonus', description: 'Utilisez un scan Radar pour repérer le danger' }
    ],
    rewards: {
      bonuses: { missile: 1, shield: 1 },
      xp: 200
    }
  },
  {
    id: 4,
    title: 'Niveau 4',
    subtitle: 'Contre-la-montre : Échauffement',
    rows: 10,
    cols: 10,
    mines: 12,
    timeLimit: 120,
    objectives: [
      { type: 'clear', description: 'Nettoyez la grille' },
      { type: 'time', value: 120, description: 'Terminez en moins de 2 minutes' }
    ],
    rewards: {
      bonuses: { chronostop: 2, radar: 1 },
      xp: 250
    }
  },
  {
    id: 5,
    title: 'Niveau 5',
    subtitle: 'Arsenal en Action',
    rows: 10,
    cols: 12,
    mines: 16,
    objectives: [
      { type: 'clear', description: 'Sécurisez le périmètre' },
      { type: 'no_mistakes', description: 'Zéro explosion autorisée' }
    ],
    rewards: {
      bonuses: { missile: 2, safeScan: 2 },
      xp: 300
    }
  },
  {
    id: 6,
    title: 'Niveau 6',
    subtitle: 'Examen de l’Académie',
    rows: 12,
    cols: 12,
    mines: 20,
    timeLimit: 150,
    objectives: [
      { type: 'clear', description: 'Triomphez de la grille' },
      { type: 'time', value: 150, description: 'Temps max : 2 minutes 30s' }
    ],
    rewards: {
      bonuses: { shield: 2, radar: 2, chronostop: 1 },
      xp: 400
    }
  },

  // --- Chapitre 2 ---
  {
    id: 7,
    title: 'Niveau 7',
    subtitle: 'La Frontière Magnétique',
    rows: 12,
    cols: 14,
    mines: 24,
    objectives: [
      { type: 'clear', description: 'Avancez en territoire risqué' }
    ],
    rewards: {
      bonuses: { missile: 2, radar: 1 },
      xp: 500
    }
  },
  {
    id: 8,
    title: 'Niveau 8',
    subtitle: 'Désamorçage à Haute Pression',
    rows: 14,
    cols: 14,
    mines: 30,
    timeLimit: 180,
    objectives: [
      { type: 'clear', description: 'Sécurisez la base' },
      { type: 'time', value: 180, description: 'Moins de 3 minutes' }
    ],
    rewards: {
      bonuses: { chronostop: 2, shield: 1 },
      xp: 600
    }
  },
  {
    id: 9,
    title: 'Niveau 9',
    subtitle: 'Densité Élevée',
    rows: 14,
    cols: 16,
    mines: 38,
    objectives: [
      { type: 'clear', description: 'Repoussez les limites' },
      { type: 'no_mistakes', description: 'Précision chirurgicale requise' }
    ],
    rewards: {
      bonuses: { safeScan: 3, missile: 1 },
      xp: 700
    }
  },
  {
    id: 10,
    title: 'Niveau 10',
    subtitle: 'Pluie de Bonus',
    rows: 14,
    cols: 18,
    mines: 42,
    objectives: [
      { type: 'clear', description: 'Fouillez le sous-sol' },
      { type: 'find_bonuses', description: 'Récupérez tous les artefacts' }
    ],
    rewards: {
      bonuses: { radar: 3, chronostop: 2 },
      xp: 800
    }
  },
  {
    id: 11,
    title: 'Niveau 11',
    subtitle: 'Opération Éclair',
    rows: 15,
    cols: 20,
    mines: 50,
    timeLimit: 240,
    objectives: [
      { type: 'clear', description: 'Désamorcez tout' },
      { type: 'time', value: 240, description: 'Terminez en moins de 4 minutes' }
    ],
    rewards: {
      bonuses: { missile: 3, shield: 2 },
      xp: 900
    }
  },
  {
    id: 12,
    title: 'Niveau 12',
    subtitle: 'Boss de la Frontière',
    rows: 16,
    cols: 22,
    mines: 60,
    objectives: [
      { type: 'clear', description: 'Nettoyez la gigantesque structure' }
    ],
    rewards: {
      bonuses: { safeScan: 3, radar: 3, missile: 2 },
      xp: 1100
    }
  },

  // --- Chapitre 3 ---
  {
    id: 13,
    title: 'Niveau 13',
    subtitle: 'Les Terres Interdites',
    rows: 16,
    cols: 24,
    mines: 70,
    objectives: [
      { type: 'clear', description: 'Pénétrez le secteur inconnu' }
    ],
    rewards: {
      bonuses: { shield: 2, chronostop: 2 },
      xp: 1300
    }
  },
  {
    id: 14,
    title: 'Niveau 14',
    subtitle: 'Urgence',
    rows: 16,
    cols: 24,
    mines: 75,
    timeLimit: 210,
    objectives: [
      { type: 'clear', description: 'Objectif alpha' },
      { type: 'time', value: 210, description: 'Rythme infernal : 3m30s' }
    ],
    rewards: {
      bonuses: { radar: 3, missile: 2 },
      xp: 1500
    }
  },
  {
    id: 15,
    title: 'Niveau 15',
    subtitle: 'Le Labyrinthe Miné',
    rows: 16,
    cols: 26,
    mines: 82,
    objectives: [
      { type: 'clear', description: 'Progressez sans trébucher' },
      { type: 'no_mistakes', description: 'Aucun bouclier de sauvetage toléré (sans échec)' }
    ],
    rewards: {
      bonuses: { safeScan: 4, shield: 3 },
      xp: 1700
    }
  },
  {
    id: 16,
    title: 'Niveau 16',
    subtitle: 'Frappe de Précision',
    rows: 16,
    cols: 28,
    mines: 90,
    objectives: [
      { type: 'clear', description: 'Exploitez vos armes tactiques' }
    ],
    rewards: {
      bonuses: { missile: 4, radar: 2 },
      xp: 1900
    }
  },
  {
    id: 17,
    title: 'Niveau 17',
    subtitle: 'Guerre Temporelle',
    rows: 16,
    cols: 30,
    mines: 99,
    timeLimit: 260,
    objectives: [
      { type: 'clear', description: 'Restez de marbre face au chronomètre' }
    ],
    rewards: {
      bonuses: { chronostop: 4, radar: 3 },
      xp: 2200
    }
  },
  {
    id: 18,
    title: 'Niveau 18',
    subtitle: 'La Porte du Réseau',
    rows: 18,
    cols: 30,
    mines: 110,
    objectives: [
      { type: 'clear', description: 'Débloquez l’accès final' }
    ],
    rewards: {
      bonuses: { safeScan: 5, missile: 3, shield: 3 },
      xp: 2500
    }
  },

  // --- Chapitre 4 ---
  {
    id: 19,
    title: 'Niveau 19',
    subtitle: 'Le Cœur de l’IA',
    rows: 18,
    cols: 32,
    mines: 125,
    objectives: [
      { type: 'clear', description: 'Pénétrez la matrice de défense' }
    ],
    rewards: {
      bonuses: { radar: 4, shield: 2 },
      xp: 3000
    }
  },
  {
    id: 20,
    title: 'Niveau 20',
    subtitle: 'Surcharge Synaptique',
    rows: 18,
    cols: 32,
    mines: 135,
    timeLimit: 300,
    objectives: [
      { type: 'clear', description: 'Gardez le contrôle' }
    ],
    rewards: {
      bonuses: { chronostop: 3, missile: 3 },
      xp: 3500
    }
  },
  {
    id: 21,
    title: 'Niveau 21',
    subtitle: 'Champ de Force Cybernétique',
    rows: 20,
    cols: 34,
    mines: 150,
    objectives: [
      { type: 'clear', description: 'Percez les lignes adverses' }
    ],
    rewards: {
      bonuses: { safeScan: 4, radar: 4 },
      xp: 4000
    }
  },
  {
    id: 22,
    title: 'Niveau 22',
    subtitle: 'Armageddon Numérique',
    rows: 20,
    cols: 36,
    mines: 170,
    objectives: [
      { type: 'clear', description: 'Une épreuve légendaire' }
    ],
    rewards: {
      bonuses: { missile: 5, shield: 4 },
      xp: 5000
    }
  },
  {
    id: 23,
    title: 'Niveau 23',
    subtitle: 'L’Avant-Dernier Protocole',
    rows: 20,
    cols: 38,
    mines: 190,
    timeLimit: 360,
    objectives: [
      { type: 'clear', description: 'Survivez au compte à rebours' }
    ],
    rewards: {
      bonuses: { chronostop: 5, radar: 5, safeScan: 5 },
      xp: 6500
    }
  },
  {
    id: 24,
    title: 'Niveau 24',
    subtitle: 'Victoire finale',
    rows: 22,
    cols: 40,
    mines: 220,
    objectives: [
      { type: 'clear', description: 'Démolissez l’entité suprême et gravez votre nom' },
      { type: 'no_mistakes', description: 'La perfection absolue' }
    ],
    rewards: {
      bonuses: { shield: 10, missile: 10, radar: 10, chronostop: 10, safeScan: 10 },
      xp: 10000
    }
  }
];
