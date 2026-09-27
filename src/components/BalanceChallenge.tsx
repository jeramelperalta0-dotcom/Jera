import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowRight, CheckCircle2, Sparkles, AlertCircle, BookOpen, HeartPulse } from 'lucide-react';
import { GradeConfig } from '../types';
import { PE_DICTIONARY } from '../data/gradesData';
import { sounds } from '../utils/audio';

interface BalanceChallengeProps {
  gradeConfig: GradeConfig;
  onComplete: (wordFound: string) => void;
  onBack: () => void;
}

export const BalanceChallenge: React.FC<BalanceChallengeProps> = ({
  gradeConfig,
  onComplete,
  onBack,
}) => {
  const targetSeconds = gradeConfig.balanceSeconds;
  const [timeLeft, setTimeLeft] = useState(targetSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [balanceCompleted, setBalanceCompleted] = useState(false);

  // Vocabulary challenge state
  const alphabetLetters = Object.keys(PE_DICTIONARY);
  const [targetLetter] = useState<string>(() => {
    return alphabetLetters[Math.floor(Math.random() * alphabetLetters.length)];
  });
  const [wordInput, setWordInput] = useState('');
  const [wordSubmitted, setWordSubmitted] = useState<string | null>(null);
  const [wordFeedback, setWordFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startBalanceTimer = () => {
    sounds.playClick();
    setIsTimerRunning(true);
    setTimeLeft(targetSeconds);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          sounds.playCorrect();
          setIsTimerRunning(false);
          setBalanceCompleted(true);
          return 0;
        }
        sounds.playTick();
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleValidateWord = (wordToCheck?: string) => {
    const rawWord = (wordToCheck !== undefined ? wordToCheck : wordInput)
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (!rawWord) return;

    if (!rawWord.startsWith(targetLetter)) {
      sounds.playWrong();
      setWordFeedback({
        isCorrect: false,
        message: `La palabra debe comenzar obligatoriamente con la letra "${targetLetter}".`,
      });
      return;
    }

    const dict = PE_DICTIONARY[targetLetter];
    const isKnownPeWord = dict?.words.some((w) => rawWord.includes(w) || w.includes(rawWord));

    sounds.playCorrect();
    setWordSubmitted(rawWord);

    if (isKnownPeWord) {
      setWordFeedback({
        isCorrect: true,
        message: `¡Extraordinario! "${rawWord}" es un concepto fundamental de Educación Física, Salud y Movimiento.`,
      });
    } else {
      setWordFeedback({
        isCorrect: true,
        message: `¡Excelente pensamiento! "${rawWord}" inicia con la letra "${targetLetter}" y aporta a la agilidad del equipo.`,
      });
    }
  };

  // SVG Circular progress math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = (targetSeconds - timeLeft) / targetSeconds;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xl">
              2
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">
                Reto 🔵 2 · Equilibrio & Vocabulario Deportivo
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {targetSeconds}s de Equilibrio + Conceptos de Salud
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold border border-cyan-200">
              {gradeConfig.id}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              Estabilidad Postural
            </span>
          </div>
        </div>

        {/* SECTION 1: PHYSICAL BALANCE RETO */}
        <div className="mt-6 bg-gradient-to-br from-cyan-50/70 via-sky-50/40 to-slate-50 rounded-3xl p-6 border border-cyan-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Mascot Balance Posture Visualizer */}
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-3 border-cyan-400 shadow-md bg-white shrink-0">
                <img
                  src={gradeConfig.mascot.image}
                  alt={gradeConfig.mascot.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 bg-cyan-900/80 backdrop-blur-xs text-[10px] text-center font-bold text-cyan-100 py-0.5">
                  Pose Flamenco 🦩
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-800">
                  Instrucción de {gradeConfig.mascot.name.split(' ')[0]}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Párate en un solo pie durante {targetSeconds} segundos
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm">
                  Abre los brazos como alas de avión, fija la mirada en un punto quieto al frente y respira con calma.
                </p>
              </div>
            </div>

            {/* Circular Timer & Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="#E2E8F0"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="#0EA5E9"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black text-slate-900 tabular-nums">
                    {timeLeft}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Segundos
                  </span>
                </div>
              </div>

              <div>
                {!balanceCompleted ? (
                  <button
                    onClick={startBalanceTimer}
                    disabled={isTimerRunning}
                    className={`py-4 px-7 rounded-2xl font-black text-base shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                      isTimerRunning
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white active:scale-95'
                    }`}
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>{isTimerRunning ? '¡Mantén el Equilibrio!' : `Iniciar Reto (${targetSeconds}s)`}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-md">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>¡Equilibrio de {targetSeconds}s Superado!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PHYSICAL EDUCATION & BODY VOCABULARY */}
        <div
          className={`mt-6 rounded-3xl p-6 border transition-all duration-300 ${
            balanceCompleted
              ? 'bg-slate-50 border-purple-200 shadow-xs'
              : 'bg-slate-50/50 border-slate-200 opacity-50 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h4 className="text-lg font-bold text-slate-900">
                Parte 2 · Vocabulario de Educación Física, Salud y Escuela
              </h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase">
              Reto Léxico
            </span>
          </div>

          <div className="bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200 text-center">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700 block mb-1">
              Letra Asignada para tu Grado:
            </span>
            <div className="text-6xl font-black text-purple-900 tracking-wider my-1 font-fun drop-shadow-xs">
              {targetLetter}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-purple-900 max-w-lg mx-auto">
              Escribe una palabra relacionada a la <strong>Educación Física, el Deporte, el Cuerpo Humano o la Escuela</strong> que empiece con la letra <strong>{targetLetter}</strong>.
            </p>
          </div>

          {/* Word Input Form */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleValidateWord();
              }}
              placeholder={`Escribe aquí tu palabra con "${targetLetter}"...`}
              className="flex-1 bg-white border-2 border-purple-200 rounded-2xl px-5 py-3.5 font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 text-lg uppercase transition-all"
            />
            <button
              onClick={() => handleValidateWord()}
              className="py-3.5 px-7 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base shadow-md transition-all duration-150 cursor-pointer active:scale-95 shrink-0"
            >
              Validar Palabra
            </button>
          </div>

          {/* Suggested vocabulary hints pills for kids to discover words */}
          {PE_DICTIONARY[targetLetter] && (
            <div className="mt-4 pt-3 border-t border-purple-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Ideas o sugerencias si necesitas inspiración:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PE_DICTIONARY[targetLetter].words.slice(0, 5).map((word) => (
                  <button
                    key={word}
                    onClick={() => {
                      setWordInput(word);
                      handleValidateWord(word);
                    }}
                    className="text-xs font-semibold px-3 py-1 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback message */}
          <AnimatePresence>
            {wordFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 p-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                  wordFeedback.isCorrect
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-100 text-rose-900 border border-rose-200'
                }`}
              >
                {wordFeedback.isCorrect ? (
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span>{wordFeedback.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step Completion Action Button */}
        <div className="mt-6 pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onComplete(wordSubmitted || wordInput);
            }}
            disabled={!balanceCompleted || !wordSubmitted}
            className={`w-full py-4 px-6 rounded-2xl font-black text-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3 ${
              balanceCompleted && wordSubmitted
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white cursor-pointer shadow-lg hover:shadow-xl transform active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>¡Reto 2 Completado! Pasar al Reto 3: Carrera</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 flex justify-between items-center text-xs font-semibold text-slate-500">
          <button onClick={onBack} className="hover:text-slate-800 transition-colors">
            ← Volver al Reto 1
          </button>
        </div>
      </div>
    </div>
  );
};
