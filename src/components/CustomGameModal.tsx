import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sliders, Play, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStart: (rows: number, cols: number, mines: number) => void;
}

export const CustomGameModal: React.FC<Props> = ({ isOpen, onClose, onStart }) => {
  const [rows, setRows] = useState(16);
  const [cols, setCols] = useState(16);
  const [mines, setMines] = useState(40);

  if (!isOpen) return null;

  const maxMines = Math.floor((rows * cols) * 0.85); // Prevent fully unplayable boards
  const safeMines = Math.min(mines, maxMines);

  const handleStart = () => {
    onStart(rows, cols, safeMines);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-indigo-500/30 bg-slate-900 shadow-2xl shadow-indigo-500/10"
      >
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 p-6 text-white">
          <div className="flex items-center gap-3">
            <Sliders className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-bold tracking-wide">Paramètres sur Mesure</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-slate-300">
          {/* Rows */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Hauteur (Lignes) :</span>
              <span className="font-mono text-indigo-400">{rows}</span>
            </div>
            <input
              type="range"
              min="5"
              max="24"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Cols */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Largeur (Colonnes) :</span>
              <span className="font-mono text-indigo-400">{cols}</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Mines */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Nombre de Mines :</span>
              <span className="font-mono text-red-400">{safeMines}</span>
            </div>
            <input
              type="range"
              min="1"
              max={maxMines}
              value={safeMines}
              onChange={(e) => setMines(Number(e.target.value))}
              className="w-full accent-red-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> Max recommandé pour cette taille : {maxMines}
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-6 flex justify-end gap-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-indigo-500/20 transition active:scale-95"
          >
            <span>Lancer la mission</span>
            <Play className="h-4 w-4 fill-white" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
