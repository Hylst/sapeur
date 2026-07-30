import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Board, Cell, GameStatus, LevelConfig, BonusType } from '../types/game';
import { Shield, Sparkles, AlertTriangle, Target } from 'lucide-react';

interface Props {
  board: Board;
  status: GameStatus;
  minesRemaining: number;
  time: number;
  face: string;
  activeBonus: BonusType | null;
  levelConfig?: LevelConfig;
  onCellLeftClick: (r: number, c: number) => void;
  onCellRightClick: (r: number, c: number, e: React.MouseEvent) => void;
  onReset: () => void;
}

const NUMBER_COLORS: Record<number, string> = {
  1: 'text-sky-400 font-extrabold',
  2: 'text-emerald-400 font-extrabold',
  3: 'text-rose-400 font-extrabold',
  4: 'text-indigo-400 font-extrabold',
  5: 'text-amber-400 font-extrabold',
  6: 'text-teal-400 font-extrabold',
  7: 'text-fuchsia-400 font-extrabold',
  8: 'text-zinc-300 font-extrabold',
};

export const BoardView: React.FC<Props> = ({
  board,
  status,
  minesRemaining,
  time,
  face,
  activeBonus,
  levelConfig,
  onCellLeftClick,
  onCellRightClick,
  onReset,
}) => {
  const [hoveredCoord, setHoveredCoord] = useState<[number, number] | null>(null);
  const [cellSize, setCellSize] = useState(42);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const rows = board.length;
  const cols = board[0]?.length || 0;

  // Responsive dynamic cell size calculation
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const maxWidth = window.innerWidth - 32;
      const maxHeight = window.innerHeight - 340; // Space for Header, HUD, Toolbar
      const sizeW = Math.floor(maxWidth / cols);
      const sizeH = Math.floor(maxHeight / rows);
      const computed = Math.max(26, Math.min(48, sizeW, sizeH));
      setCellSize(computed);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cols, rows]);

  // Determine if a cell is highlighted by 3x3 Radar tool hover
  const isRadarHighlighted = (r: number, c: number) => {
    if (activeBonus !== 'radar' || !hoveredCoord) return false;
    const [hr, hc] = hoveredCoord;
    return Math.abs(r - hr) <= 1 && Math.abs(c - hc) <= 1;
  };

  const padNum = (n: number) => {
    const s = n < 0 ? '-' : '';
    const val = Math.min(Math.abs(n), 999);
    return s + val.toString().padStart(3, '0');
  };

  return (
    <div className="flex flex-col items-center w-full gap-6 pb-28 select-none">
      
      {/* Upper HUD / Dashboard */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-wrap items-center justify-between w-full max-w-3xl gap-4 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md"
      >
        {/* Left: Remaining Mines Counter */}
        <div className="flex items-center gap-3 bg-slate-950 px-5 py-2.5 rounded-2xl border border-slate-800/80 shadow-inner">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mines</span>
            <span className="font-mono text-2xl font-black text-rose-500 tracking-wider tabular-nums">{padNum(minesRemaining)}</span>
          </div>
        </div>

        {/* Center: Interactive Mood Face & Status */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9, rotate: -10 }}
          onClick={onReset}
          className={`flex items-center justify-center w-16 h-16 text-3xl rounded-2xl border shadow-xl transition cursor-pointer ${
            status === 'won'
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 shadow-emerald-500/20 animate-bounce'
              : status === 'lost'
                ? 'bg-gradient-to-br from-rose-600 to-red-700 border-rose-400 shadow-rose-500/20'
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 shadow-indigo-500/20'
          }`}
          title="Relancer le niveau"
        >
          <span>{face}</span>
        </motion.button>

        {/* Right: Chronometer */}
        <div className="flex items-center gap-3 bg-slate-950 px-5 py-2.5 rounded-2xl border border-slate-800/80 shadow-inner">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Temps</span>
            <span className="font-mono text-2xl font-black text-amber-400 tracking-wider tabular-nums">{padNum(time)}</span>
          </div>
        </div>
      </motion.div>

      {/* Level Campaign objectives reminder if active */}
      {levelConfig && (
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 max-w-xl text-center">
          <span className="font-bold text-indigo-400">Objectifs de mission :</span>
          {levelConfig.objectives.map((obj, i) => (
            <span key={i} className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 flex items-center gap-1 text-slate-200">
              <Sparkles className="h-3 w-3 text-yellow-400" />
              {obj.description}
            </span>
          ))}
        </div>
      )}

      {/* Active Bonus Target Notice */}
      <AnimatePresence>
        {activeBonus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-wide shadow-lg shadow-purple-500/30 animate-pulse border border-purple-400"
          >
            {activeBonus === 'radar' && <><Target className="h-4 w-4" /> Sélectionnez une zone pour le Sonar 3x3</>}
            {activeBonus === 'missile' && <><Target className="h-4 w-4" /> Visez une case pour envoyer le Missile de précision</>}
            {activeBonus === 'safeScan' && <><Sparkles className="h-4 w-4" /> Sonde Sûre en cours d'initialisation...</>}
            {activeBonus === 'chronostop' && <><Sparkles className="h-4 w-4" /> Champ de force temporel déployé</>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Minefield Board */}
      <div
        ref={containerRef}
        className={`relative inline-block p-2.5 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl transition duration-150 ${
          status === 'lost' ? 'animate-shake' : ''
        }`}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: '3px',
        }}
        onMouseLeave={() => setHoveredCoord(null)}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isRadarLit = isRadarHighlighted(r, c);

            return (
              <CellComponent
                key={cell.id}
                cell={cell}
                size={cellSize}
                isRadarLit={isRadarLit}
                isMissileLit={activeBonus === 'missile' && hoveredCoord?.[0] === r && hoveredCoord?.[1] === c}
                onMouseEnter={() => setHoveredCoord([r, c])}
                onLeftClick={() => onCellLeftClick(r, c)}
                onRightClick={(e) => onCellRightClick(r, c, e)}
              />
            );
          })
        )}
      </div>

      {/* Outcome banners */}
      <AnimatePresence>
        {status === 'won' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white px-8 py-4 rounded-3xl font-black text-lg tracking-wide shadow-2xl shadow-emerald-500/30 border border-emerald-300 mt-2"
          >
            <Sparkles className="h-6 w-6 text-yellow-300 animate-spin-slow" />
            <span>MISSION VALIDÉE AVEC SUCCÈS !</span>
          </motion.div>
        )}

        {status === 'lost' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="flex items-center gap-3 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white px-8 py-4 rounded-3xl font-black text-lg tracking-wide shadow-2xl shadow-rose-500/30 border border-rose-300 mt-2"
          >
            <AlertTriangle className="h-6 w-6 text-yellow-300 animate-bounce" />
            <span>DÉTONATION FATALE ! MISSION AVORTÉE.</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Tile / Cell interactive sub-component
interface CellProps {
  cell: Cell;
  size: number;
  isRadarLit: boolean;
  isMissileLit: boolean;
  onMouseEnter: () => void;
  onLeftClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

const CellComponent: React.FC<CellProps> = React.memo(({
  cell,
  size,
  isRadarLit,
  isMissileLit,
  onMouseEnter,
  onLeftClick,
  onRightClick,
}) => {
  const { isRevealed, isMine, isFlagged, neighborMines, isExploded, bonus, isScanned } = cell;

  // Background styling
  let bg = 'bg-slate-800 hover:bg-slate-700 shadow-[inset_0_2px_0_rgba(255,255,255,0.1),inset_0_-2px_0_rgba(0,0,0,0.4)] cursor-pointer';
  let content: React.ReactNode = null;
  let textClass = '';

  if (isRevealed) {
    bg = 'bg-slate-900 shadow-inner border border-slate-800/80 cursor-default';
    if (isExploded) {
      bg = 'bg-rose-600 animate-pulse border-rose-400 shadow-rose-500/50';
      content = '💥';
    } else if (isMine) {
      bg = 'bg-slate-800 border-rose-500/40';
      content = '💣';
    } else if (bonus) {
      bg = 'bg-indigo-950 border-indigo-400';
      content = bonus === 'shield' ? <Shield className="h-5 w-5 text-blue-400 animate-bounce" /> : '🎁';
    } else if (neighborMines > 0) {
      content = neighborMines;
      textClass = NUMBER_COLORS[neighborMines] || 'text-slate-300';
    }
  } else if (isFlagged) {
    content = <span className="animate-scale-in">⚡</span>; // Or Flag icon
  } else if (isScanned) {
    // Revealed purely by Radar without detonating
    bg = 'bg-purple-950 border border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.3)] cursor-pointer';
    content = isMine ? '⚠️' : neighborMines > 0 ? neighborMines : '✓';
    textClass = isMine ? 'text-rose-400 font-black text-xs' : 'text-purple-300 font-bold text-xs';
  }

  // Active Radar highlight
  if (isRadarLit && !isRevealed) {
    bg = 'bg-purple-600/80 border-purple-400 ring-2 ring-purple-400 animate-pulse shadow-lg shadow-purple-500/50';
  }

  // Active Missile targeting highlight
  if (isMissileLit && !isRevealed) {
    bg = 'bg-rose-600 border-rose-400 ring-2 ring-rose-400 animate-pulse shadow-lg shadow-rose-500/50 cursor-crosshair';
  }

  const fontSize = Math.max(12, Math.floor(size * 0.55));

  return (
    <motion.div
      whileTap={!isRevealed ? { scale: 0.88 } : undefined}
      onMouseEnter={onMouseEnter}
      onClick={onLeftClick}
      onContextMenu={onRightClick}
      className={`relative flex items-center justify-center font-black rounded-xl transition-colors select-none ${bg} ${textClass}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${fontSize}px`,
      }}
    >
      {content}

      {/* Subtle overlay reflection */}
      {!isRevealed && !isFlagged && !isRadarLit && !isMissileLit && !isScanned && (
        <div className="absolute top-1 left-1 right-1 h-1/3 bg-white/5 rounded-t-lg pointer-events-none" />
      )}
    </motion.div>
  );
});
