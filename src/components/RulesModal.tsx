import React from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, Bomb, Shield, HelpCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<Props> = ({ isOpen, onClose }) => {
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
            <BookOpen className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold tracking-wide">Manuel Opératoire du Sapeur</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 text-slate-300 text-sm">
          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <HelpCircle className="h-5 w-5 text-indigo-400" />
              1. L'Objectif
            </h3>
            <p className="leading-relaxed">
              Le but est de nettoyer entièrement un champ de mines sans faire exploser une seule d'entre elles. Les cases dévoilées affichent un chiffre qui indique très précisément le nombre de mines dissimulées dans les 8 cases voisines (horizontales, verticales et diagonales).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Bomb className="h-5 w-5 text-red-400" />
              2. Astuces de Déduction
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <strong>Les coins évidents :</strong> Si un chiffre 1 ne touche qu'une seule case non dévoilée, cette case est obligatoirement une mine !
              </li>
              <li>
                <strong>Marquage (Drapeau) :</strong> Posez un drapeau sur chaque mine confirmée afin de sécuriser vos clics futurs.
              </li>
              <li>
                <strong>Nettoyage de zone (Chord) :</strong> Quand le bon nombre de drapeaux entoure un chiffre, un clic sur ce chiffre libère d'un coup toutes les autres cases voisines adjacentes.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              3. Gestion de Votre Arsenal
            </h3>
            <p className="leading-relaxed">
              Ne restez pas bloqué sur une supposition au hasard (50/50). Utilisez vos armes en bas de l'écran (Missiles, Scans Radar, Boucliers ou Sondes) pour obtenir la certitude absolue et faire exploser les scores sans commettre la moindre faute !
            </p>
          </section>
        </div>

        <div className="bg-slate-950 p-4 text-center border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-500 transition"
          >
            Compris, au travail !
          </button>
        </div>
      </motion.div>
    </div>
  );
};
