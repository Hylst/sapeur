import React from 'react';
import { motion } from 'framer-motion';
import { X, Info } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-purple-500/30 bg-slate-900 shadow-2xl shadow-purple-500/10"
      >
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 p-6 text-white">
          <div className="flex items-center gap-3">
            <Info className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-bold tracking-wide">Comment ce jeu a été fait</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 text-slate-300 text-sm leading-relaxed">
          <p><strong className="text-white">Stack :</strong> React 19, TypeScript 5.9, Tailwind CSS 4, Vite 7, compilé en un seul fichier HTML, aucune dépendance chargée depuis l'extérieur. Animations via Framer Motion, icônes via Lucide.</p>
          <p><strong className="text-white">Graphismes :</strong> pas de Canvas, la grille est une grille CSS de cellules HTML, animée avec Framer Motion (apparition des chiffres, explosion, transitions de vue campagne/libre).</p>
          <p><strong className="text-white">Musique &amp; sons :</strong> synthétisés en direct avec l'API Web Audio, aucun fichier audio chargé.</p>
          <p><strong className="text-white">Interactions :</strong> clic gauche pour révéler, clic droit pour marquer un drapeau, chording (clic sur un chiffre déjà résolu pour ouvrir ses voisins d'un coup), plus 5 armes à charges limitées (Bouclier, Missile, Radar, Chronostop, Sonde Sûre) pour lever un doute sans deviner.</p>
          <p><strong className="text-white">Architecture :</strong> composants séparés (grille, en-tête, barre d'armes, modales), 24 missions de campagne définies dans une table de données dédiée, mode libre avec 5 niveaux de difficulté et une configuration personnalisée.</p>
          <p><strong className="text-white">Algorithmes notables :</strong> la grille n'est générée qu'au premier clic, en protégeant tout son voisinage 3×3 (jamais de mine sur ni autour de la case cliquée en premier), propagation en cascade des zones sans mine voisine, chording avec vérification du nombre de drapeaux adjacents.</p>
        </div>

        <div className="bg-slate-950 p-4 text-center border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-500 transition"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
};
