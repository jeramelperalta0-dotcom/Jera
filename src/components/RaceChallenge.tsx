import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Flag, CheckCircle2, Sparkles, AlertCircle, Microscope, Zap, Award } from 'lucide-react';
import { GradeConfig, ScienceQuestion } from '../types';
import { sounds } from '../utils/audio';

interface RaceChallengeProps {
  gradeConfig: GradeConfig;
  onComplete: (raceTime: string, scienceTopic: string) => void;
  onBack: () => void;
}

export const RaceChallenge: React.FC<RaceChallengeProps> = ({
  gradeConfig,
  onComplete,
  onBack,
}) => {
  const [isRaceRunning, setIsRaceRunning] = useState(false);
  const [raceElapsed, setRaceElapsed] = useState(0);
  const [raceCompleted, setRaceCompleted] = useState(false);
  const [finalTimeStr, setFinalTimeStr] = useState('00:00.0');

  // Science question state
  const [scienceQuestion] = useState<ScienceQuestion>(() => {
    const questions = gradeConfig.scienceQuestions;
    return questions[Math.floor(Math.random() * questions.length)];
  });
  const [selectedScienceOption, setSelectedScienceOption] = useState<number | null>(null);
  const [scienceCompleted, setScienceCompleted] = useState(false);
  const [scienceFeedback, setScienceFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatStopwatch = (msTotal: number) => {
    const totalSeconds = msTotal / 1000;
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (Math.floor(totalSeconds) % 60).toString().padStart(2, '0');
    const msTenth = Math.floor((msTotal % 1000) / 100);
    return `${mins}:${secs}.${msTenth}`;
  };

  const handleToggleStopwatch = () => {
    if (!isRaceRunning) {
      // Start Race
      sounds.playFanfare();
      setIsRaceRunning(true);
      setRaceCompleted(false);
      startTimeRef.current = Date.now();

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setRaceElapsed(elapsed);
        setFinalTimeStr(formatStopwatch(elapsed));
      }, 75);
    } else {
      // Stop Race (Finish line)
      if (intervalRef.current) clearInterval(intervalRef.current);
      sounds.playCorrect();
      setIsRaceRunning(false);
      setRaceCompleted(true);
      const finalElapsed = Date.now() - startTimeRef.current;
      setRaceElapsed(finalElapsed);
      setFinalTimeStr(formatStopwatch(finalElapsed));
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSelectScience = (index: number) => {
    sounds.playClick();
    setSelectedScienceOption(index);

    if (index === scienceQuestion.correct) {
      sounds.playCorrect();
      setScienceCompleted(true);
      setScienceFeedback({
        isCorrect: true,
        message: `¡Respuesta Correcta! ${scienceQuestion.explanation}`,
      });
    } else {
      sounds.playWrong();
      setScienceCompleted(false);
      setScienceFeedback({
        isCorrect: false,
        message: `Piénsalo un poco más. Analiza cómo funciona el cuerpo o la naturaleza y prueba otra opción.`,
      });
    }
  };

  // Track position percentage calculation (runner moves between 0% and 88%)
  const trackPosition = isRaceRunning
    ? Math.min((raceElapsed / 8000) * 88, 88)
    : raceCompleted
    ? 88
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              3
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Reto 🟡 3 · Velocidad & Ciencias Naturales
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Carrera de Ida y Vuelta + Pregunta Científica
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
              {gradeConfig.id}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              Velocidad & Biología
            </span>
          </div>
        </div>

        {/* SECTION 1: RACE STOPWATCH & TRACK SIMULATION */}
        <div className="mt-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white border border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Mascot Coach info */}
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md bg-indigo-900/40 shrink-0">
                <img
                  src={gradeConfig.mascot.image}
                  alt={gradeConfig.mascot.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  {gradeConfig.mascot.name.split(' ')[0]} en la Pista:
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  ¡Corre a máxima velocidad hasta el punto fijado!
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-sm">
                  Presiona el botón para <strong>INICIAR</strong> la salida y vuelve a pulsarlo al momento exacto de la <strong>LLEGADA</strong>.
                </p>
              </div>
            </div>

            {/* Stopwatch Display */}
            <div className="text-center bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-amber-400/40 shrink-0">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 block mb-0.5">
                ⏱️ Tiempo Oficial
              </span>
              <span className="text-4xl sm:text-5xl font-mono font-black text-yellow-300 tracking-wider tabular-nums">
                {finalTimeStr}
              </span>
            </div>
          </div>

          {/* Olympic Running Track Simulation Visual */}
          <div className="mt-6 bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2 px-1">
              <div className="flex items-center gap-1 text-emerald-400">
                <span>🏁</span>
                <span>Línea de Salida (0m)</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <span>🚩</span>
                <span>Punto de Retorno / Meta</span>
              </div>
            </div>

            {/* Red Tartan Track with lane markings */}
            <div className="relative h-12 bg-gradient-to-r from-red-950 via-rose-900 to-red-950 rounded-xl overflow-hidden border border-red-800 flex items-center px-4">
              {/* Lane dashes */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/20" />
              
              {/* Runner Avatar Sprite */}
              <motion.div
                animate={{ left: `${trackPosition}%` }}
                transition={{ duration: 0.25, ease: 'linear' }}
                className="absolute top-1/2 -translate-y-1/2 text-2xl select-none filter drop-shadow-md"
              >
                {isRaceRunning ? (
                  <span className="inline-block animate-bounce">🏃‍♂️💨</span>
                ) : raceCompleted ? (
                  <span>🏆🏃</span>
                ) : (
                  <span>🏃</span>
                )}
              </motion.div>
            </div>
          </div>

          {/* Single Toggle Stopwatch Button */}
          <div className="mt-6 text-center">
            {!raceCompleted ? (
              <button
                onClick={handleToggleStopwatch}
                className={`py-4 px-10 rounded-2xl font-black text-lg sm:text-xl shadow-xl transition-all duration-150 inline-flex items-center justify-center gap-3 cursor-pointer ${
                  isRaceRunning
                    ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white animate-pulse'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 transform hover:scale-105 active:scale-95'
                }`}
              >
                {isRaceRunning ? (
                  <>
                    <Flag className="w-6 h-6 fill-white" />
                    <span>¡REGISTRAR LLEGADA AHORA!</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-slate-950" />
                    <span>¡INICIAR CARRERA!</span>
                  </>
                )}
              </button>
            ) : (
              <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black text-base shadow-md">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>Tiempo de Carrera Registrado: {finalTimeStr}</span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: ADAPTIVE NATURAL SCIENCES CHALLENGE */}
        <div
          className={`mt-6 rounded-3xl p-6 border transition-all duration-300 ${
            raceCompleted
              ? 'bg-slate-50 border-emerald-200 shadow-xs'
              : 'bg-slate-50/50 border-slate-200 opacity-50 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Microscope className="w-5 h-5 text-emerald-600" />
              <h4 className="text-lg font-bold text-slate-900">
                Parte 2 · Pregunta de Ciencias Naturales
              </h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase">
              {scienceQuestion.topic}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-emerald-100 text-center shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Desafío de Exploración:
            </span>
            <div className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {scienceQuestion.question}
            </div>
          </div>

          {/* Options Grid (4 clear choices) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {scienceQuestion.options.map((opt, idx) => {
              const isSelected = selectedScienceOption === idx;
              const isCorrectChoice = idx === scienceQuestion.correct;
              let btnClass = 'bg-white border-2 border-slate-200 text-slate-800 hover:border-emerald-400 hover:bg-emerald-50/40';

              if (isSelected) {
                if (isCorrectChoice) {
                  btnClass = 'bg-emerald-500 border-emerald-600 text-white shadow-md ring-2 ring-emerald-300';
                } else {
                  btnClass = 'bg-rose-50 border-rose-300 text-rose-800';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectScience(idx)}
                  className={`p-4 rounded-2xl font-bold text-sm sm:text-base text-left transition-all duration-150 shadow-xs cursor-pointer flex items-center gap-3 ${btnClass}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                      isSelected && isCorrectChoice
                        ? 'bg-white text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback message */}
          <AnimatePresence>
            {scienceFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 p-4 rounded-xl text-sm font-semibold flex items-start gap-2.5 ${
                  scienceFeedback.isCorrect
                    ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                    : 'bg-rose-100 text-rose-900 border border-rose-200'
                }`}
              >
                {scienceFeedback.isCorrect ? (
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{scienceFeedback.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step Completion Action Button */}
        <div className="mt-6 pt-2">
          <button
            onClick={() => {
              sounds.playFanfare();
              onComplete(finalTimeStr, scienceQuestion.topic);
            }}
            disabled={!raceCompleted || !scienceCompleted}
            className={`w-full py-4 px-6 rounded-2xl font-black text-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3 ${
              raceCompleted && scienceCompleted
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 cursor-pointer shadow-lg hover:shadow-xl transform active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Award className="w-6 h-6" />
            <span>¡Misión Cumplida! Ver Gran Premiación y Diploma 🏆</span>
          </button>
        </div>

        <div className="mt-4 flex justify-between items-center text-xs font-semibold text-slate-500">
          <button onClick={onBack} className="hover:text-slate-800 transition-colors">
            ← Volver al Reto 2
          </button>
        </div>
      </div>
    </div>
  );
};
