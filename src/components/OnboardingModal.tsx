import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Crosshair, Rocket, Clock, CheckSquare, Sparkles, Flag, MousePointer } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-900 shadow-2xl shadow-indigo-500/10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-center text-white">
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center rounded-full bg-white/20 p-3 shadow-inner backdrop-blur-md"
          >
            <Sparkles className="h-8 w-8 text-yellow-300" />
          </motion.div>
          <h2 className="mt-3 text-2xl font-black tracking-wide sm:text-3xl">
            Bienvenue dans Sapeur
          </h2>
          <p className="mt-1 text-sm font-medium text-indigo-100 sm:text-base">
            L'expérience tactique de déminage ultime, dotée d'armes technologiques et de bonus.
          </p>
        </div>

        {/* Scrollable content */}
        <div className="space-y-6 overflow-y-auto p-6 text-slate-300">
          {/* Section 1: Les contrôles */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white border-b border-slate-800 pb-2">
              <MousePointer className="h-5 w-5 text-indigo-400" />
              Les Contrôles Clés
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-3">
                <span className="font-bold text-indigo-300">Clic Gauche :</span>
                <p className="mt-1 text-sm text-slate-400">Révéler une case. Le premier clic est toujours 100% sécurisé !</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-3">
                <span className="font-bold text-pink-300">Clic Droit (ou Mode Drapeau) :</span>
                <p className="mt-1 text-sm text-slate-400">Poser ou retirer un drapeau d'alerte pour marquer une mine suspecte.</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-3">
                <span className="font-bold text-yellow-300">Raccourci Espace :</span>
                <p className="mt-1 text-sm text-slate-400">Bascule instantanément entre le mode de fouille et le mode de marquage au drapeau (idéal sur mobile/laptop).</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-3">
                <span className="font-bold text-emerald-300">Clic Rapide (Chord) :</span>
                <p className="mt-1 text-sm text-slate-400">Clic gauche sur un chiffre dont les voisins ont le bon nombre de drapeaux pour révéler tout le reste d'un coup !</p>
              </div>
            </div>
          </div>

          {/* Section 2: Arsenal tactique et bonus */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white border-b border-slate-800 pb-2">
              <Rocket className="h-5 w-5 text-purple-400" />
              Projectiles et Bonus Tactiques
            </h3>
            <p className="text-sm">
              Lors de vos missions dans le <strong className="text-white font-semibold">Mode Campagne</strong> ou en ramassant des caisses de ravitaillement, vous obtenez des armes ultra-performantes pour vaincre les situations bloquantes :
            </p>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3">
                <Shield className="h-6 w-6 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-300">Bouclier Électromagnétique</h4>
                  <p className="mt-0.5 text-xs text-slate-400">Vous protège automatiquement d'une explosion fatale si vous commettez une erreur.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-purple-500/20 bg-purple-950/20 p-3">
                <Crosshair className="h-6 w-6 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-purple-300">Scan Sonar 3x3</h4>
                  <p className="mt-0.5 text-xs text-slate-400">Révèle temporairement les mines dans une zone de 3x3 cases sans aucun risque de détonation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-pink-500/20 bg-pink-950/20 p-3">
                <Rocket className="h-6 w-6 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-pink-300">Missile de Précision</h4>
                  <p className="mt-0.5 text-xs text-slate-400">Cible et détruit instantanément une mine que vous visez, en y posant automatiquement un drapeau certifié.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-950/20 p-3">
                <Clock className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-300">Chrono-Stase (15s)</h4>
                  <p className="mt-0.5 text-xs text-slate-400">Gèle l'écoulement du chronomètre pendant 15 secondes afin de reprendre votre souffle sous pression.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 sm:col-span-2">
                <CheckSquare className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-300">Sonde de Découverte Sûre</h4>
                  <p className="mt-0.5 text-xs text-slate-400">Sélectionne de façon autonome 3 cases sans danger sur la carte et les dévoile instantanément pour vous débloquer.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Modes de jeu */}
          <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700/60">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Flag className="h-5 w-5 text-yellow-400" />
              Deux Modes de Jeu
            </h4>
            <p className="mt-1 text-sm text-slate-300">
              Lancez-vous dans le <strong>Mode Campagne</strong> avec 24 niveaux à difficulté progressive ou profitez de parties sur-mesure dans le <strong>Mode Libre</strong> (Très Facile à Extrême).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 text-center border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-left">
            App créée par : <strong className="text-indigo-400">Hylst - Geoffroy</strong> avec l'aide d'une IA.
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 transition"
          >
            Lancer l'Aventure !
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
