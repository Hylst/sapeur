import React from 'react';
import { motion } from 'framer-motion';
import { Inventory, BonusType } from '../types/game';
import { Shield, Crosshair, Rocket, Clock, CheckSquare } from 'lucide-react';

interface Props {
  inventory: Inventory;
  activeBonus: BonusType | null;
  onSelectBonus: (b: BonusType | null) => void;
  isStasisActive: boolean;
}

export const BonusToolbar: React.FC<Props> = ({ inventory, activeBonus, onSelectBonus, isStasisActive }) => {
  const tools: { id: BonusType; name: string; icon: React.ReactNode; color: string; bg: string; count: number; desc: string }[] = [
    {
      id: 'shield',
      name: 'Bouclier',
      icon: <Shield className="h-5 w-5" />,
      color: 'text-blue-400 border-blue-500/40',
      bg: 'from-blue-900/20 to-blue-950/40',
      count: inventory.shield,
      desc: 'Bouclier auto-activé à la 1ère erreur',
    },
    {
      id: 'radar',
      name: 'Sonar 3x3',
      icon: <Crosshair className="h-5 w-5" />,
      color: 'text-purple-400 border-purple-500/40',
      bg: 'from-purple-900/20 to-purple-950/40',
      count: inventory.radar,
      desc: 'Cliquez une zone pour scanner sans détonation',
    },
    {
      id: 'missile',
      name: 'Missile',
      icon: <Rocket className="h-5 w-5" />,
      color: 'text-pink-400 border-pink-500/40',
      bg: 'from-pink-900/20 to-pink-950/40',
      count: inventory.missile,
      desc: 'Cliquez et pulvérisez 1 mine confirmée',
    },
    {
      id: 'chronostop',
      name: 'Stase 15s',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-amber-400 border-amber-500/40',
      bg: 'from-amber-900/20 to-amber-950/40',
      count: inventory.chronostop,
      desc: 'Gèle le compte à rebours 15 secondes',
    },
    {
      id: 'safeScan',
      name: 'Sonde Sûre',
      icon: <CheckSquare className="h-5 w-5" />,
      color: 'text-emerald-400 border-emerald-500/40',
      bg: 'from-emerald-900/20 to-emerald-950/40',
      count: inventory.safeScan,
      desc: 'Dévoile de suite 3 cases sûres au hasard',
    },
  ];

  const handleToolClick = (id: BonusType, count: number) => {
    if (id === 'shield') return; // Passive behavior
    if (count <= 0) return;
    if (activeBonus === id) {
      onSelectBonus(null);
    } else {
      onSelectBonus(id);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-slate-900/90 p-3 shadow-2xl backdrop-blur-md border border-slate-800">
        
        <div className="hidden md:flex items-center gap-2 border-r border-slate-800 pr-3 py-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">ARSENAL :</span>
        </div>

        {tools.map((t) => {
          const isActive = activeBonus === t.id;
          const isPassive = t.id === 'shield';
          const isEmpty = t.count <= 0;

          return (
            <motion.button
              key={t.id}
              whileHover={!isEmpty && !isPassive ? { scale: 1.05 } : undefined}
              whileTap={!isEmpty && !isPassive ? { scale: 0.95 } : undefined}
              onClick={() => handleToolClick(t.id, t.count)}
              disabled={isEmpty || isPassive}
              className={`relative flex items-center gap-2.5 rounded-xl border p-2.5 sm:px-4 sm:py-2.5 transition text-left ${
                isActive
                  ? 'ring-4 ring-purple-500 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-lg shadow-purple-500/30'
                  : isEmpty
                    ? 'border-slate-800/50 bg-slate-950/40 text-slate-600 cursor-not-allowed'
                    : `bg-gradient-to-br ${t.bg} ${t.color} hover:bg-slate-800/80`
              }`}
            >
              {/* Status Badge */}
              <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 font-mono text-xs font-black text-white shadow ring-2 ring-slate-800">
                {t.count}
              </div>

              <div className={`flex items-center justify-center shrink-0 ${isEmpty ? 'opacity-40' : ''}`}>
                {t.icon}
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-black tracking-wide uppercase leading-tight sm:text-sm">
                  {t.name}
                </span>
                <span className="text-[10px] text-slate-400 hidden lg:inline max-w-40 truncate">
                  {t.desc}
                </span>
              </div>

              {isStasisActive && t.id === 'chronostop' && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-2 py-0.5 font-mono text-[9px] font-black text-black animate-pulse uppercase tracking-wider">
                  Actif
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
