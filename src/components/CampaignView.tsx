import React from 'react';
import { motion } from 'framer-motion';
import { LevelConfig, UserStats } from '../types/game';
import { CAMPAIGN_LEVELS } from '../data/levels';
import { Lock, Play, Star, Award, ShieldAlert, Zap } from 'lucide-react';

interface Props {
  stats: UserStats;
  onSelectLevel: (lvl: LevelConfig) => void;
  onSwitchMode: () => void;
}

export const CampaignView: React.FC<Props> = ({ stats, onSelectLevel, onSwitchMode }) => {
  const chapters = [
    { title: "Chapitre I : L'Académie de Démolition", levels: CAMPAIGN_LEVELS.slice(0, 6), color: 'from-blue-600 to-indigo-600', icon: ShieldAlert },
    { title: "Chapitre II : La Frontière Magnétique", levels: CAMPAIGN_LEVELS.slice(6, 12), color: 'from-indigo-600 to-purple-600', icon: Zap },
    { title: "Chapitre III : Les Terres Interdites", levels: CAMPAIGN_LEVELS.slice(12, 18), color: 'from-purple-600 to-pink-600', icon: Award },
    { title: "Chapitre IV : Le Cœur de l'IA", levels: CAMPAIGN_LEVELS.slice(18, 24), color: 'from-pink-600 to-red-600', icon: Star },
  ];

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-8">
      {/* Overview Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 border border-indigo-500/30 shadow-2xl shadow-indigo-500/10"
      >
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-4 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
            <span>MODE EXPÉDITION (CAMPAGNE)</span>
          </div>
          <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
            Progression Tactique
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Relevez les missions de plus en plus intenses pour accumuler de l'XP, débloquer les chapitres suivants et faire le plein de technologies de déminage.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-800/80 p-4 border border-slate-700 min-w-32 shadow-inner">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Niveau Débloqué</span>
            <span className="text-3xl font-black text-indigo-400 mt-1">{stats.campaignProgress} <span className="text-sm text-slate-500 font-normal">/ 24</span></span>
          </div>

          <button
            onClick={onSwitchMode}
            className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-4 text-white hover:opacity-90 transition shadow-lg shadow-indigo-500/20 min-w-32"
          >
            <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider">Partie Personnalisée</span>
            <span className="text-lg font-bold mt-1">Mode Libre ⚡</span>
          </button>
        </div>
      </motion.div>

      {/* Chapter lists */}
      <div className="space-y-12">
        {chapters.map((chapter, chapIdx) => {
          const ChapterIcon = chapter.icon;
          const isChapterUnlocked = chapIdx === 0 || CAMPAIGN_LEVELS[chapIdx * 6].id <= stats.campaignProgress;

          return (
            <motion.div
              key={chapter.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chapIdx * 0.1 }}
              className={`rounded-3xl border p-6 sm:p-8 transition ${
                isChapterUnlocked
                  ? 'border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl'
                  : 'border-slate-800/40 bg-slate-950/40 opacity-75'
              }`}
            >
              {/* Chapter Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br ${chapter.color} p-3 text-white shadow-md`}>
                    <ChapterIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">{chapter.title}</h3>
                    <p className="text-xs text-slate-400 sm:text-sm">
                      {isChapterUnlocked ? 'Missions opérationnelles et accessibles' : 'Débloquez les missions précédentes pour entrer dans ce secteur'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid Levels */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {chapter.levels.map((lvl) => {
                  const isUnlocked = lvl.id <= stats.campaignProgress;
                  const isCompleted = lvl.id < stats.campaignProgress;

                  return (
                    <motion.div
                      key={lvl.id}
                      whileHover={isUnlocked ? { scale: 1.02, translateY: -4 } : undefined}
                      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition ${
                        isUnlocked
                          ? isCompleted
                            ? 'border-indigo-500/40 bg-gradient-to-br from-slate-800/90 to-indigo-950/40 shadow-lg shadow-indigo-500/5'
                            : 'border-purple-500 bg-gradient-to-br from-purple-950/40 to-indigo-900/40 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/30'
                          : 'border-slate-800/60 bg-slate-900/30 text-slate-600'
                      }`}
                    >
                      {/* Top content */}
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`font-mono text-sm font-bold ${isUnlocked ? 'text-indigo-400' : 'text-slate-600'}`}>
                            MISSION #{lvl.id}
                          </span>
                          {isUnlocked ? (
                            isCompleted ? (
                              <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded text-xs font-bold border border-yellow-400/20">
                                <Star className="h-3 w-3 fill-yellow-400" /> Complété
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-bold border border-emerald-400/20 animate-pulse">
                                <Play className="h-3 w-3 fill-emerald-400" /> Prêt
                              </div>
                            )
                          ) : (
                            <Lock className="h-4 w-4 text-slate-600" />
                          )}
                        </div>

                        <h4 className={`mt-2 text-lg font-black ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                          {lvl.subtitle}
                        </h4>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                          <span className="rounded bg-slate-800 px-2 py-1 border border-slate-700">
                            Grille : <strong>{lvl.rows}×{lvl.cols}</strong>
                          </span>
                          <span className="rounded bg-slate-800 px-2 py-1 border border-slate-700">
                            💣 <strong>{lvl.mines}</strong>
                          </span>
                          {lvl.timeLimit && (
                            <span className="rounded bg-slate-800 px-2 py-1 border border-slate-700 text-amber-300">
                              ⏱️ <strong>{lvl.timeLimit}s</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom launch button */}
                      <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                        <div className="text-xs text-slate-400">
                          XP à gagner : <span className="font-bold text-purple-400">+{lvl.rewards.xp}</span>
                        </div>

                        {isUnlocked && (
                          <button
                            onClick={() => onSelectLevel(lvl)}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-white shadow-md transition active:scale-95 ${
                              isCompleted
                                ? 'bg-slate-700 hover:bg-slate-600'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-purple-500/25'
                            }`}
                          >
                            <span>Lancer</span>
                            <Play className="h-4 w-4 fill-white" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
