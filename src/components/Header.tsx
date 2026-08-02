import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Difficulty, GameMode } from '../types/game';
import { audio } from '../services/audio';
import { Maximize2, Minimize2, Volume2, VolumeX, Music, BookOpen, Map, Sliders, RefreshCw, Sparkles, Info } from 'lucide-react';

interface Props {
  gameMode: GameMode;
  difficulty: Difficulty;
  onSelectDifficulty: (diff: Difficulty) => void;
  onOpenRules: () => void;
  onOpenInfo: () => void;
  onOpenCustom: () => void;
  onReset: () => void;
  onSwitchMode: () => void;
}

export const Header: React.FC<Props> = ({
  gameMode,
  difficulty,
  onSelectDifficulty,
  onOpenRules,
  onOpenInfo,
  onOpenCustom,
  onReset,
  onSwitchMode,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMusicActive, setIsMusicActive] = useState(audio.getMusicStatus());
  const [isSfxActive, setIsSfxActive] = useState(audio.getSfxStatus());

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleMusic = () => {
    const newState = audio.toggleMusic();
    setIsMusicActive(newState);
  };

  const toggleSfx = () => {
    const newState = audio.toggleSfx();
    setIsSfxActive(newState);
  };

  const difficulties: { id: Difficulty; label: string }[] = [
    { id: 'very_easy', label: 'Très Facile' },
    { id: 'easy', label: 'Facile' },
    { id: 'medium', label: 'Moyen' },
    { id: 'hard', label: 'Difficile' },
    { id: 'extreme', label: 'Extrême' },
  ];

  return (
    <header className="relative w-full border-b border-slate-800/80 bg-slate-900/90 shadow-xl backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left: Brand / App Creator Credits */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/20 border border-white/20">
              <Sparkles className="h-7 w-7 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  SAPEUR <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent font-extrabold text-lg uppercase tracking-widest px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20">Campagne</span>
                </h1>
              </div>
              <div className="mt-0.5 text-xs text-slate-400 flex items-center gap-1 font-medium">
                <span>Créateur de l'app :</span>
                <strong className="text-indigo-400 font-bold">Hylst - Geoffroy</strong>
                <span>avec l'aide d'une IA</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center/Right controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-between sm:justify-end">
          
          {/* Game Mode Selector / Return to Campaign */}
          <button
            onClick={onSwitchMode}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-xs uppercase tracking-wider transition ${
              gameMode === 'campaign'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <Map className="h-4 w-4" />
            <span>{gameMode === 'campaign' ? 'Mode Expédition' : 'Mode Libre ⚡'}</span>
          </button>

          {/* Quick difficulties for Free mode */}
          {gameMode === 'free' && (
            <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-950/60 p-1 border border-slate-800">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  onClick={() => onSelectDifficulty(d.id)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                    difficulty === d.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {d.label}
                </button>
              ))}

              <button
                onClick={onOpenCustom}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                  difficulty === 'custom'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Perso</span>
              </button>
            </div>
          )}

          {/* Refresh/Reset active map */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 font-bold text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition active:rotate-180 border border-slate-700"
            title="Relancer cette mission"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden md:inline">Recommencer</span>
          </button>

          {/* Audio controls */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={toggleMusic}
              className={`rounded-lg p-2 transition ${isMusicActive ? 'text-indigo-400 hover:bg-indigo-500/20' : 'text-slate-600 hover:text-slate-400'}`}
              title={isMusicActive ? 'Couper la musique' : "Activer la musique d'ambiance"}
            >
              <Music className="h-4 w-4" />
            </button>
            <button
              onClick={toggleSfx}
              className={`rounded-lg p-2 transition ${isSfxActive ? 'text-purple-400 hover:bg-purple-500/20' : 'text-slate-600 hover:text-slate-400'}`}
              title={isSfxActive ? 'Couper les bruitages' : 'Activer les bruitages'}
            >
              {isSfxActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>

          {/* Rules manual */}
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 rounded-xl bg-purple-500/10 px-3 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 hover:text-white transition border border-purple-500/20"
          >
            <BookOpen className="h-4 w-4" />
            <span>Règles</span>
          </button>

          {/* Comment ce jeu a ete fait */}
          <button
            onClick={onOpenInfo}
            title="Comment ce jeu a été fait"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-500/10 px-3 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition border border-indigo-500/20"
          >
            <Info className="h-4 w-4" />
            <span>Infos</span>
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center rounded-xl bg-slate-800 p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition border border-slate-700"
            title={isFullscreen ? 'Quitter le plein écran' : 'Mode Plein écran'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

        </div>
      </div>
    </header>
  );
};
