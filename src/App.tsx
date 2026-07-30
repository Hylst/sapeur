import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Board, Cell, Difficulty, GameMode, GameStatus, Inventory, LevelConfig, BonusType, UserStats } from './types/game';
import { CAMPAIGN_LEVELS } from './data/levels';
import { audio } from './services/audio';
import { Header } from './components/Header';
import { BonusToolbar } from './components/BonusToolbar';
import { BoardView } from './components/BoardView';
import { CampaignView } from './components/CampaignView';
import { OnboardingModal } from './components/OnboardingModal';
import { RulesModal } from './components/RulesModal';
import { CustomGameModal } from './components/CustomGameModal';
import { Flag } from 'lucide-react';

const INITIAL_INVENTORY: Inventory = {
  shield: 2,
  radar: 2,
  missile: 2,
  chronostop: 2,
  safeScan: 2,
};

const INITIAL_STATS: UserStats = {
  campaignProgress: 1, // Max unlocked mission
  score: 0,
  xp: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  minesFlagged: 0,
  bonusesUsed: 0,
};

const DIFFICULTIES_MAP: Record<string, { rows: number; cols: number; mines: number }> = {
  very_easy: { rows: 8, cols: 8, mines: 8 },
  easy: { rows: 10, cols: 10, mines: 15 },
  medium: { rows: 14, cols: 14, mines: 30 },
  hard: { rows: 16, cols: 20, mines: 60 },
  extreme: { rows: 20, cols: 30, mines: 130 },
};

const FACE_IDLE = '🙂';
const FACE_PLAYING = '🤠';
const FACE_WON = '😎';
const FACE_LOST = '😵';

export default function App() {
  // --- Persistent Storage & Stats ---
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('sapeur_stats');
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const [inventory, setInventory] = useState<Inventory>(() => {
    try {
      const saved = localStorage.getItem('sapeur_inv');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  // Save changes
  useEffect(() => {
    localStorage.setItem('sapeur_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('sapeur_inv', JSON.stringify(inventory));
  }, [inventory]);

  // --- App Global Navigation State ---
  const [gameMode, setGameMode] = useState<GameMode>('campaign');
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(() => CAMPAIGN_LEVELS[0] || null);
  const [difficulty, setDifficulty] = useState<Difficulty>('very_easy');
  const [customParams, setCustomParams] = useState({ rows: 14, cols: 14, mines: 30 });

  // --- Board & Match State ---
  const [board, setBoard] = useState<Board>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [flagCount, setFlagCount] = useState(0);
  const [time, setTime] = useState(0);
  const [face, setFace] = useState<string>(FACE_IDLE);

  // --- Tactical Tools / Weapons ---
  const [activeBonus, setActiveBonus] = useState<BonusType | null>(null);
  const [stasisSeconds, setStasisSeconds] = useState(0);
  const [isFlagMode, setIsFlagMode] = useState(false); // Spacebar active tool toggling

  // --- Modals ---
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return !localStorage.getItem('sapeur_onboarded');
  });
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // Refs
  const timerRef = useRef<number | null>(null);
  const isFirstClickRef = useRef(true);

  // Mark onboarding
  const handleCloseOnboarding = () => {
    localStorage.setItem('sapeur_onboarded', 'true');
    setIsOnboardingOpen(false);
    audio.startAmbientMusic();
  };

  // --- Generator Functions ---
  const createEmptyGrid = useCallback((rows: number, cols: number): Board => {
    const newBoard: Board = [];
    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          id: `${r}-${c}`,
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newBoard.push(row);
    }
    return newBoard;
  }, []);

  // Compute neighboring mines
  const computeNeighbors = useCallback((b: Board): Board => {
    const rows = b.length;
    const cols = b[0]?.length || 0;

    return b.map((row, r) =>
      row.map((cell, c) => {
        if (cell.isMine) return { ...cell, neighborMines: 0 };
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && b[nr]?.[nc]?.isMine) {
              count++;
            }
          }
        }
        return { ...cell, neighborMines: count };
      })
    );
  }, []);

  // Place mines securely around safe initial click point
  const populateMines = useCallback((
    baseBoard: Board,
    targetMines: number,
    safeR: number,
    safeC: number
  ): Board => {
    const rows = baseBoard.length;
    const cols = baseBoard[0]?.length || 0;
    const board = baseBoard.map(r => r.map(c => ({ ...c })));

    // Protect 3x3 neighborhood around first click
    const protectedZone = new Set<string>();
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = safeR + dr;
        const nc = safeC + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          protectedZone.add(`${nr}-${nc}`);
        }
      }
    }

    const allPositions: { r: number; c: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!protectedZone.has(`${r}-${c}`)) {
          allPositions.push({ r, c });
        }
      }
    }

    // Shuffle positions
    for (let i = allPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
    }

    // Distribute mines
    const placedCount = Math.min(targetMines, allPositions.length);
    for (let i = 0; i < placedCount; i++) {
      const { r, c } = allPositions[i]!;
      board[r]![c]!.isMine = true;
    }

    // Add randomized hidden supply boxes (2 to 4 bonuses per map)
    const hiddenBonusCount = Math.floor(Math.random() * 3) + 2;
    const availableSafeCells: { r: number; c: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!board[r]?.[c]?.isMine && `${r}-${c}` !== `${safeR}-${safeC}`) {
          availableSafeCells.push({ r, c });
        }
      }
    }

    // Shuffle and pick for bonuses
    for (let i = availableSafeCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableSafeCells[i], availableSafeCells[j]] = [availableSafeCells[j], availableSafeCells[i]];
    }

    const bonusTypes: BonusType[] = ['shield', 'radar', 'missile', 'chronostop', 'safeScan'];
    for (let i = 0; i < Math.min(hiddenBonusCount, availableSafeCells.length); i++) {
      const { r, c } = availableSafeCells[i]!;
      const randBonus = bonusTypes[Math.floor(Math.random() * bonusTypes.length)]!;
      board[r]![c]!.bonus = randBonus;
    }

    return computeNeighbors(board);
  }, [computeNeighbors]);

  // Current active rows, cols, mines depending on settings
  const getCurrentParams = useCallback(() => {
    if (gameMode === 'campaign' && activeLevel) {
      return { rows: activeLevel.rows, cols: activeLevel.cols, mines: activeLevel.mines };
    }
    if (difficulty === 'custom') {
      return customParams;
    }
    return DIFFICULTIES_MAP[difficulty] || DIFFICULTIES_MAP.very_easy!;
  }, [activeLevel, customParams, difficulty, gameMode]);

  // --- Clock / Timer Management ---
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = window.setInterval(() => {
      // If Stasis/Chronostop tool is deployed, skip incrementing
      setStasisSeconds(s => {
        if (s > 0) return s - 1;
        setTime(t => (t < 999 ? t + 1 : 999));
        return 0;
      });
    }, 1000);
  }, []);

  // --- Match Initialization / Reset ---
  const handleResetMatch = useCallback(() => {
    stopTimer();
    const { rows, cols } = getCurrentParams();
    setBoard(createEmptyGrid(rows, cols));
    setStatus('idle');
    setFlagCount(0);
    setTime(0);
    setStasisSeconds(0);
    setActiveBonus(null);
    setFace(FACE_IDLE);
    isFirstClickRef.current = true;

    // Give bonus rewards upon start of Campaign mission
    if (gameMode === 'campaign' && activeLevel) {
      const startBonuses = activeLevel.rewards.bonuses;
      if (startBonuses) {
        setInventory(inv => {
          const newInv = { ...inv };
          Object.entries(startBonuses).forEach(([k, val]) => {
            if (val) newInv[k as BonusType] += val;
          });
          return newInv;
        });
      }
    }
  }, [stopTimer, getCurrentParams, createEmptyGrid, gameMode, activeLevel]);

  // Trigger match reset on game settings updates
  useEffect(() => {
    handleResetMatch();
  }, [gameMode, activeLevel, difficulty, customParams, handleResetMatch]);

  // Handle victory completion and stat updates
  const handleWin = useCallback((currentScoreTime: number) => {
    setStatus('won');
    setFace(FACE_WON);
    stopTimer();
    audio.playVictory();
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });

    setStats(prev => {
      let nXp = prev.xp + 50;
      let nextProgress = prev.campaignProgress;
      if (gameMode === 'campaign' && activeLevel) {
        nXp += activeLevel.rewards.xp;
        if (activeLevel.id === prev.campaignProgress && prev.campaignProgress < 24) {
          nextProgress = prev.campaignProgress + 1;
        }
      }
      return {
        ...prev,
        score: prev.score + Math.max(10, 1000 - currentScoreTime * 5),
        xp: nXp,
        campaignProgress: nextProgress,
        gamesWon: prev.gamesWon + 1,
        gamesPlayed: prev.gamesPlayed + 1,
      };
    });
  }, [stopTimer, gameMode, activeLevel]);

  // Check if grid is fully cleared of non-mine cells
  const checkWinCondition = useCallback((b: Board, totalMines: number): boolean => {
    let unrevealedOrMine = 0;
    for (const row of b) {
      for (const cell of row) {
        if (!cell.isRevealed) {
          if (!cell.isMine) return false; // Found unrevealed safe cell
          unrevealedOrMine++;
        }
      }
    }
    return unrevealedOrMine === totalMines;
  }, []);

  // Flood fill blank safe cells
  const floodReveal = useCallback((baseBoard: Board, startR: number, startC: number): Board => {
    const rows = baseBoard.length;
    const cols = baseBoard[0]?.length || 0;
    const nextBoard = baseBoard.map(r => r.map(c => ({ ...c })));
    const stack: [number, number][] = [[startR, startC]];

    while (stack.length > 0) {
      const [cr, cc] = stack.pop()!;
      const cell = nextBoard[cr]?.[cc];
      if (!cell || cell.isRevealed || cell.isFlagged) continue;

      cell.isRevealed = true;
      // If bonus hidden in cell
      if (cell.bonus) {
        const found = cell.bonus;
        setInventory(prev => ({ ...prev, [found]: prev[found] + 1 }));
        audio.playBonus();
      }

      if (cell.neighborMines === 0 && !cell.isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = cr + dr;
            const nc = cc + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              const nCell = nextBoard[nr]?.[nc];
              if (nCell && !nCell.isRevealed && !nCell.isFlagged && !nCell.isMine) {
                stack.push([nr, nc]);
              }
            }
          }
        }
      }
    }
    return nextBoard;
  }, []);

  // --- Key events (Spacebar tool swap) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on spacebar
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        setIsFlagMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Click & Tool Operations ---

  const executeCellClick = useCallback((r: number, c: number) => {
    if (status === 'won' || status === 'lost') return;
    const { mines } = getCurrentParams();

    // 1. Tactical Tool: 3x3 Sonar Radar
    if (activeBonus === 'radar') {
      audio.playRadar();
      setActiveBonus(null);
      setInventory(prev => ({ ...prev, radar: Math.max(0, prev.radar - 1) }));
      setStats(prev => ({ ...prev, bonusesUsed: prev.bonusesUsed + 1 }));

      setBoard(currBoard => {
        const nb = currBoard.map(row => row.map(cl => ({ ...cl })));
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            const tgt = nb[nr]?.[nc];
            if (tgt && !tgt.isRevealed) {
              tgt.isScanned = true;
              if (tgt.isMine && !tgt.isFlagged) {
                tgt.isFlagged = true; // Flawlessly auto-flags detected mine
                setFlagCount(f => f + 1);
              }
            }
          }
        }
        return nb;
      });
      return;
    }

    // 2. Tactical Tool: Precision Missile
    if (activeBonus === 'missile') {
      audio.playMissile();
      setActiveBonus(null);
      setInventory(prev => ({ ...prev, missile: Math.max(0, prev.missile - 1) }));
      setStats(prev => ({ ...prev, bonusesUsed: prev.bonusesUsed + 1 }));

      let nextBoard = board.map(row => row.map(cl => ({ ...cl })));
      const tgt = nextBoard[r]?.[c];
      if (tgt && !tgt.isRevealed) {
        if (tgt.isMine) {
          // Pulverize & secure mine
          tgt.isRevealed = true;
          tgt.isExploded = false; // Secured
          // Safe certification
          if (!tgt.isFlagged) {
            tgt.isFlagged = true;
            setFlagCount(f => f + 1);
          }
        } else {
          // Just safe flood fill
          nextBoard = floodReveal(nextBoard, r, c);
        }
      }
      setBoard(nextBoard);
      if (checkWinCondition(nextBoard, mines)) {
        handleWin(time);
      }
      return;
    }

    // 3. Normal Execution or Spacebar Flag toggling
    const cell = board[r]?.[c];
    if (!cell) return;

    // If Spacebar Flag Mode is Active and cell is not revealed, perform Flag operation
    if (isFlagMode && !cell.isRevealed) {
      audio.playFlag();
      setBoard(prev => {
        const nb = prev.map(row => row.map(cl => ({ ...cl })));
        const tgt = nb[r]![c]!;
        tgt.isFlagged = !tgt.isFlagged;
        setFlagCount(f => (tgt.isFlagged ? f + 1 : Math.max(0, f - 1)));
        return nb;
      });
      return;
    }

    // Normal Click on Revealed Cell => Chord Execution (Quick clear neighbors if flags match)
    if (cell.isRevealed) {
      if (cell.neighborMines > 0) {
        let flagCountSurrounding = 0;
        const rowsCount = board.length;
        const colsCount = board[0]?.length || 0;

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rowsCount && nc >= 0 && nc < colsCount && board[nr]?.[nc]?.isFlagged) {
              flagCountSurrounding++;
            }
          }
        }

        if (flagCountSurrounding === cell.neighborMines) {
          audio.playReveal();
          let currentB = board;
          let fatalHit = false;

          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              const ncl = currentB[nr]?.[nc];
              if (ncl && !ncl.isRevealed && !ncl.isFlagged) {
                if (ncl.isMine) {
                  fatalHit = true;
                } else {
                  currentB = floodReveal(currentB, nr, nc);
                }
              }
            }
          }

          if (fatalHit) {
            // Trigger explosion or shield block
            if (inventory.shield > 0) {
              audio.playShieldBlock();
              setInventory(prev => ({ ...prev, shield: prev.shield - 1 }));
              // Keep playing safely!
              setBoard(currentB);
            } else {
              audio.playExplosion();
              setStatus('lost');
              setFace(FACE_LOST);
              stopTimer();
              // currentB (pas board) : sinon les cases sures deja revelees par ce
              // meme clic groupe disparaissent, l'ecran de fin les remontre couvertes
              setBoard(currentB.map(rw => rw.map(cl => ({ ...cl, isRevealed: cl.isRevealed || cl.isMine, isExploded: cl.isMine && !cl.isFlagged }))));
            }
            return;
          }

          setBoard(currentB);
          if (checkWinCondition(currentB, mines)) {
            handleWin(time);
          }
        }
      }
      return;
    }

    // Normal click on covered cell
    if (cell.isFlagged) return;

    // A. First Click Safety Deployment
    let workingBoard = board;
    if (isFirstClickRef.current) {
      isFirstClickRef.current = false;
      workingBoard = populateMines(workingBoard, mines, r, c);
      setStatus('playing');
      setFace(FACE_PLAYING);
      startTimer();
    }

    const hitCell = workingBoard[r]?.[c];
    if (!hitCell) return;

    // B. Mine Detonation Event
    if (hitCell.isMine) {
      // Emergency Tactical Shield Block Rescue check
      if (inventory.shield > 0) {
        audio.playShieldBlock();
        setInventory(prev => ({ ...prev, shield: prev.shield - 1 }));
        setStats(prev => ({ ...prev, bonusesUsed: prev.bonusesUsed + 1 }));
        
        // Defuse & reveal hit cell safely
        const updated = workingBoard.map(row => row.map(cl => ({ ...cl })));
        const rescued = updated[r]![c]!;
        rescued.isRevealed = true;
        rescued.isFlagged = true; // Auto-flag
        rescued.isExploded = false;
        setBoard(updated);
        setFlagCount(f => f + 1);

        if (checkWinCondition(updated, mines)) {
          handleWin(time);
        }
        return;
      }

      // Final Fatality
      audio.playExplosion();
      setStatus('lost');
      setFace(FACE_LOST);
      stopTimer();
      setStats(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));

      const allRevealed = workingBoard.map(row =>
        row.map(cl => ({
          ...cl,
          isRevealed: cl.isRevealed || cl.isMine,
          isExploded: cl.id === hitCell.id ? true : cl.isExploded,
        }))
      );
      setBoard(allRevealed);
      return;
    }

    // C. Regular Safe Cell Reveal
    audio.playReveal();
    workingBoard = floodReveal(workingBoard, r, c);
    setBoard(workingBoard);

    if (checkWinCondition(workingBoard, mines)) {
      handleWin(time);
    }
  }, [status, getCurrentParams, activeBonus, board, isFlagMode, checkWinCondition, time, inventory.shield, handleWin, populateMines, startTimer, stopTimer, floodReveal]);

  // Right Click Flag Operation
  const handleCellRightClick = useCallback((r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (status === 'won' || status === 'lost') return;
    const cell = board[r]?.[c];
    if (!cell || cell.isRevealed) return;

    setBoard(prev => {
      const nb = prev.map(row => row.map(cl => ({ ...cl })));
      const tgt = nb[r]![c]!;
      tgt.isFlagged = !tgt.isFlagged;
      if (tgt.isFlagged) {
        audio.playFlag();
        setFlagCount(f => f + 1);
        setStats(st => ({ ...st, minesFlagged: st.minesFlagged + 1 }));
      } else {
        audio.playUnflag();
        setFlagCount(f => Math.max(0, f - 1));
      }
      return nb;
    });
  }, [board, status]);

  // --- Toolbar Immediate Bonus Operations (Chronostop Stasis & SafeScan Probe) ---
  const handleToolbarBonusSelect = useCallback((bonusType: BonusType | null) => {
    if (status === 'won' || status === 'lost') return;

    // 1. Safe Scan Probe Deployment (Instant clickless action)
    if (bonusType === 'safeScan') {
      if (inventory.safeScan <= 0) return;
      audio.playBonus();
      setInventory(prev => ({ ...prev, safeScan: Math.max(0, prev.safeScan - 1) }));
      setStats(prev => ({ ...prev, bonusesUsed: prev.bonusesUsed + 1 }));

      // If game is not playing yet (first click missing), initialize board securely at (0,0) or center
      let activeB = board;
      const { rows, cols, mines } = getCurrentParams();
      if (isFirstClickRef.current) {
        isFirstClickRef.current = false;
        const midR = Math.floor(rows / 2);
        const midC = Math.floor(cols / 2);
        activeB = populateMines(board, mines, midR, midC);
        setStatus('playing');
        setFace(FACE_PLAYING);
        startTimer();
      }

      // Find all unrevealed safe cells
      const candidateCells: [number, number][] = [];
      activeB.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (!cell.isRevealed && !cell.isMine && !cell.isFlagged) {
            candidateCells.push([r, c]);
          }
        });
      });

      // Reveal up to 3 candidate safe cells
      for (let i = candidateCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidateCells[i], candidateCells[j]] = [candidateCells[j], candidateCells[i]];
      }

      const probesToReveal = candidateCells.slice(0, 3);
      probesToReveal.forEach(([pr, pc]) => {
        activeB = floodReveal(activeB, pr, pc);
      });

      setBoard(activeB);
      if (checkWinCondition(activeB, mines)) {
        handleWin(time);
      }
      return;
    }

    // 2. Chronostop Stasis Force Field Deployment
    if (bonusType === 'chronostop') {
      if (inventory.chronostop <= 0 || stasisSeconds > 0) return;
      audio.playBonus();
      setInventory(prev => ({ ...prev, chronostop: Math.max(0, prev.chronostop - 1) }));
      setStats(prev => ({ ...prev, bonusesUsed: prev.bonusesUsed + 1 }));
      setStasisSeconds(15);
      return;
    }

    // Normal Targeting Selection (Radar / Missile)
    setActiveBonus(bonusType);
  }, [status, inventory.safeScan, inventory.chronostop, stasisSeconds, board, getCurrentParams, checkWinCondition, handleWin, time, populateMines, startTimer, floodReveal]);

  // Remaining total targets
  const computedMinesRemaining = getCurrentParams().mines - flagCount;

  return (
    <div className="relative flex flex-col min-h-screen font-sans bg-slate-950 text-slate-100 select-none">
      
      {/* Upper Navigation Header */}
      <Header
        gameMode={gameMode}
        difficulty={difficulty}
        onSelectDifficulty={(diff) => {
          setDifficulty(diff);
          setGameMode('free');
        }}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenCustom={() => setIsCustomOpen(true)}
        onReset={handleResetMatch}
        onSwitchMode={() => {
          if (gameMode === 'campaign') {
            setGameMode('free');
            setDifficulty('medium');
          } else {
            setGameMode('campaign');
          }
        }}
      />

      {/* Main Responsive Body View */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 w-full max-w-[1600px] mx-auto overflow-x-auto">
        
        {/* Spacebar Flagging Indicator Pill */}
        <div className="flex items-center gap-2 mb-4 bg-slate-900/90 px-4 py-1.5 rounded-full border border-slate-800 shadow-lg text-xs font-bold">
          <span>Action tactile (Espace) :</span>
          <button
            onClick={() => setIsFlagMode(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full transition cursor-pointer ${
              isFlagMode
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md animate-pulse'
                : 'bg-slate-800 text-indigo-300 hover:bg-slate-700'
            }`}
          >
            <Flag className="h-3.5 w-3.5" />
            <span>{isFlagMode ? 'MODE DRAPEAU (Marquage)' : 'MODE FOUILLE (Révélation)'}</span>
          </button>
        </div>

        {gameMode === 'campaign' && status === 'idle' && isFirstClickRef.current ? (
          // Tactical Expedition Select Map View
          <CampaignView
            stats={stats}
            onSelectLevel={(lvl) => {
              setActiveLevel(lvl);
              setGameMode('campaign');
            }}
            onSwitchMode={() => {
              setGameMode('free');
              setDifficulty('medium');
            }}
          />
        ) : (
          // Live Board Playground View
          <BoardView
            board={board}
            status={status}
            minesRemaining={computedMinesRemaining}
            time={time}
            face={face}
            activeBonus={activeBonus}
            levelConfig={gameMode === 'campaign' && activeLevel ? activeLevel : undefined}
            onCellLeftClick={executeCellClick}
            onCellRightClick={handleCellRightClick}
            onReset={handleResetMatch}
          />
        )}
      </main>

      {/* Bottom Tactical Toolkit */}
      {(status === 'playing' || status === 'idle') && (
        <BonusToolbar
          inventory={inventory}
          activeBonus={activeBonus}
          onSelectBonus={handleToolbarBonusSelect}
          isStasisActive={stasisSeconds > 0}
        />
      )}

      {/* Persistent Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <CustomGameModal
        isOpen={isCustomOpen}
        onClose={() => setIsCustomOpen(false)}
        onStart={(r, c, m) => {
          setCustomParams({ rows: r, cols: c, mines: m });
          setDifficulty('custom');
          setGameMode('free');
        }}
      />

    </div>
  );
}
