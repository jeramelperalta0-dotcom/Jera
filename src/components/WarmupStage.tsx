import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { GradeConfig } from '../types';
import { sounds } from '../utils/audio';

interface WarmupStageProps {
  gradeConfig: GradeConfig;
  onComplete: () => void;
  onBack: () => void;
}

export const WarmupStage: React.FC<WarmupStageProps> = ({
  gradeConfig,
  onComplete,
  onBack,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [starsCaught, setStarsCaught] = useState(0);
  const [starPos, setStarPos] = useState({ top: 40, left: 50 });
  const [coachSpeech, setCoachSpeech] = useState(
    `¡Hola! Soy ${gradeConfig.mascot.name.split(' ')[0]}. Vamos a activar tus reflejos oculares y motrices.`
  );
  const [lastPopup, setLastPopup] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const targetStars = 5;

  const moveStarRandomly = () => {
    // Keep star safely inside boundaries (15% to 75% for top, 10% to 80% for left)
    const newTop = Math.floor(Math.random() * 60) + 15;
    const newLeft = Math.floor(Math.random() * 70) + 15;
    setStarPos({ top: newTop, left: newLeft });
  };

  const startWarmup = () => {
    sounds.playClick();
    setIsPlaying(true);
    setStarsCaught(0);
    setCoachSpeech('¡Atrapa la estrella brillante en cuanto aparezca!');
    moveStarRandomly();

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(moveStarRandomly, gradeConfig.starCatchSpeed);
  };

  const handleCatchStar = () => {
    if (!isPlaying) return;
    sounds.playStar();
    const nextCount = starsCaught + 1;
    setStarsCaught(nextCount);

    const cheers = [
      '¡Velocidad pura! ⚡',
      '¡Reflejos de campeón! 🌟',
      '¡Excelente coordinación! 🎯',
      '¡Imparable! 🚀',
      '¡Increíble agilidad visual! 💫',
    ];
    const cheer = cheers[Math.min(nextCount - 1, cheers.length - 1)];
    setLastPopup(cheer);
    setTimeout(() => setLastPopup(null), 700);

    if (nextCount >= targetStars) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      sounds.playCorrect();
      setIsPlaying(false);
      setCoachSpeech(`¡Excelente trabajo! Has atrapado las 5 estrellas y tu cerebro está 100% activo.`);
    } else {
      setCoachSpeech(`¡Llevas ${nextCount} de ${targetStars}! ¡Sigue así!`);
      moveStarRandomly();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const progressPercent = Math.min((starsCaught / targetStars) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Fase Inicial · Calentamiento Visual & Motor
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Caza de Estrellas Veloz
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              Meta: 5 Estrellas
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
              Velocidad: {gradeConfig.starCatchSpeed}ms
            </span>
          </div>
        </div>

        {/* Mascot Coach speech strip */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/80 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 border-indigo-300 shadow-xs">
            <img
              src={gradeConfig.mascot.image}
              alt={gradeConfig.mascot.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="flex-1">
            <div className="text-xs font-extrabold text-indigo-900 uppercase tracking-wide">
              {gradeConfig.mascot.name.split(' ')[0]} dice:
            </div>
            <p className="text-sm font-semibold text-slate-700 leading-snug">
              {coachSpeech}
            </p>
          </div>
        </div>

        {/* Progress Strip */}
        <div className="mt-5">
          <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1.5">
            <span>Progreso de Reflejos</span>
            <span className="text-indigo-600 font-black">{starsCaught} / {targetStars}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Interactive Fast Star Arena */}
        <div className="relative mt-6 w-full h-72 sm:h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 border-2 border-indigo-900/60 shadow-inner flex items-center justify-center select-none">
          {/* Subtle grid and decorative rings */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Catch counter badge inside arena */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-black text-amber-400 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Atrapadas: {starsCaught} de {targetStars}</span>
          </div>

          {/* Cheer Toast */}
          <AnimatePresence>
            {lastPopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="absolute z-30 bg-amber-400 text-slate-950 font-black text-sm px-4 py-2 rounded-2xl shadow-xl border border-yellow-200"
              >
                {lastPopup}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Idle start prompt if not playing */}
          {!isPlaying && starsCaught < targetStars && (
            <div className="relative z-20 text-center space-y-3 p-4">
              <button
                onClick={startWarmup}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black text-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>¡Iniciar Desafío de Estrellas!</span>
              </button>
              <p className="text-xs text-slate-400 font-medium">
                Toca la estrella tan rápido como aparezca en la pantalla
              </p>
            </div>
          )}

          {/* The Moving Energy Star Button */}
          {isPlaying && (
            <motion.button
              onClick={handleCatchStar}
              animate={{
                top: `${starPos.top}%`,
                left: `${starPos.left}%`,
                scale: [1, 1.15, 1],
              }}
              transition={{
                top: { duration: 0.18, ease: 'easeOut' },
                left: { duration: 0.18, ease: 'easeOut' },
                scale: { duration: 0.6, repeat: Infinity },
              }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 p-3 group focus:outline-none cursor-pointer"
              aria-label="Atrapar estrella"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                {/* Glow ring */}
                <div className="absolute inset-0 bg-yellow-400/40 rounded-full blur-xl group-hover:bg-yellow-300/60 transition-all duration-150 animate-pulse" />
                <span className="text-5xl sm:text-6xl drop-shadow-[0_0_15px_rgba(250,204,21,0.9)] select-none transform transition-transform group-hover:scale-125 group-active:scale-90">
                  ⭐
                </span>
              </div>
            </motion.button>
          )}

          {/* Completed State Overlay inside Arena */}
          {starsCaught >= targetStars && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-20 text-center space-y-4 p-6 bg-slate-950/90 backdrop-blur-md rounded-3xl border border-emerald-500/40 max-w-sm"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-black">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xl font-black text-white">¡Calentamiento Superado!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Tus reflejos están calibrados para el Reto 1 de saltos continuos y cálculo mental.
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  onComplete();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102"
              >
                <span>¡Pasar al Reto 1: Saltos!</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Back navigation button */}
        <div className="mt-6 flex justify-between items-center pt-2">
          <button
            onClick={onBack}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Cambiar de Grado o Sección
          </button>
        </div>
      </div>
    </div>
  );
};
