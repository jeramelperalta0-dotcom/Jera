import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, ArrowRight, CheckCircle2, Calculator, Sparkles, AlertCircle } from 'lucide-react';
import { GradeConfig, MathQuestion } from '../types';
import { sounds } from '../utils/audio';

interface JumpChallengeProps {
  gradeConfig: GradeConfig;
  onComplete: () => void;
  onBack: () => void;
}

export const JumpChallenge: React.FC<JumpChallengeProps> = ({
  gradeConfig,
  onComplete,
  onBack,
}) => {
  const [jumpsDone, setJumpsDone] = useState(0);
  const [isJumpingAnim, setIsJumpingAnim] = useState(false);
  const [mathCompleted, setMathCompleted] = useState(false);
  const [selectedMathOption, setSelectedMathOption] = useState<number | null>(null);
  const [mathFeedback, setMathFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  
  // Pick random question from grade config
  const [mathQuestion] = useState<MathQuestion>(() => {
    const questions = gradeConfig.mathQuestions;
    return questions[Math.floor(Math.random() * questions.length)];
  });

  const jumpsTarget = gradeConfig.jumpsTarget;
  const isJumpsCompleted = jumpsDone >= jumpsTarget;

  const handleRegisterJump = () => {
    if (jumpsDone >= jumpsTarget) return;
    sounds.playJump();
    const nextJumps = jumpsDone + 1;
    setJumpsDone(nextJumps);

    // Trigger visual squash & stretch animation on mascot
    setIsJumpingAnim(true);
    setTimeout(() => setIsJumpingAnim(false), 240);

    if (nextJumps === jumpsTarget) {
      sounds.playCorrect();
    }
  };

  const handleSelectMath = (option: number) => {
    sounds.playClick();
    setSelectedMathOption(option);

    if (option === mathQuestion.answer) {
      sounds.playCorrect();
      setMathCompleted(true);
      setMathFeedback({
        isCorrect: true,
        message: `¡Brillante! ${option} es la respuesta correcta. ¡Tu mente calculó con máxima precisión!`,
      });
    } else {
      sounds.playWrong();
      setMathCompleted(false);
      setMathFeedback({
        isCorrect: false,
        message: `Casi lo tienes. Revisa bien la operación y vuelve a intentarlo.`,
      });
    }
  };

  const progressPercent = Math.min((jumpsDone / jumpsTarget) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">
              1
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Reto 🟢 1 · Físico + Intelectual
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {jumpsTarget} Saltos Continuos + Matemáticas
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              {gradeConfig.id}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              Potencia de Piernas
            </span>
          </div>
        </div>

        {/* SECTION 1: PHYSICAL JUMPS */}
        <div className="mt-6 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50 rounded-3xl p-6 border border-emerald-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Mascot Character leaping in sync! */}
            <div className="flex items-center gap-4">
              <motion.div
                animate={isJumpingAnim ? { y: -24, scaleY: 1.08, scaleX: 0.95 } : { y: 0, scaleY: 1, scaleX: 1 }}
                transition={{ type: 'spring', stiffness: 450, damping: 18 }}
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-3 border-emerald-400 shadow-md bg-white shrink-0"
              >
                <img
                  src={gradeConfig.mascot.image}
                  alt={gradeConfig.mascot.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                {isJumpingAnim && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-emerald-400/20 pointer-events-none flex items-center justify-center font-black text-white text-xs"
                  >
                    ¡SALTO!
                  </motion.div>
                )}
              </motion.div>

              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                  Compañero de Salto: {gradeConfig.mascot.name.split(' ')[0]}
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  ¡Realiza un salto real por cada toque!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm">
                  Impúlsate con la punta de los pies, flexiona las rodillas y mantén el ritmo hasta completar la meta.
                </p>
              </div>
            </div>

            {/* Jump Counter & Big Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto justify-center">
              <div className="text-center shrink-0">
                <motion.div
                  key={jumpsDone}
                  initial={{ scale: 1.25 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center font-black text-5xl shadow-inner border-4 transition-colors ${
                    isJumpsCompleted
                      ? 'bg-emerald-500 text-white border-emerald-300'
                      : 'bg-white text-emerald-600 border-emerald-300'
                  }`}
                >
                  {jumpsDone}
                </motion.div>
                <span className="text-xs font-bold text-emerald-800 mt-1 block">
                  / {jumpsTarget} Saltos Requeridos
                </span>
              </div>

              {!isJumpsCompleted ? (
                <button
                  onClick={handleRegisterJump}
                  className="w-full sm:w-auto py-5 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xl shadow-lg hover:shadow-xl transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer border-b-4 border-emerald-700"
                >
                  <ArrowUp className="w-6 h-6 stroke-[3]" />
                  <span>¡DAR UN SALTO!</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>¡Meta de saltos completada!</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5">
            <div className="w-full h-3 rounded-full bg-emerald-200/60 overflow-hidden p-0.5">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ADAPTIVE MATH CHALLENGE */}
        <div
          className={`mt-6 rounded-3xl p-6 border transition-all duration-300 ${
            isJumpsCompleted
              ? 'bg-slate-50 border-indigo-200 shadow-xs'
              : 'bg-slate-50/50 border-slate-200 opacity-50 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h4 className="text-lg font-bold text-slate-900">
                Parte 2 · Desafío de Cálculo Mental
              </h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase">
              {gradeConfig.id}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-indigo-100 text-center shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Pregunta de cálculo mental:
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-wide font-fun">
              {mathQuestion.question}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {mathQuestion.options.map((opt) => {
              const isSelected = selectedMathOption === opt;
              const isCorrectChoice = opt === mathQuestion.answer;
              let btnClass = 'bg-white border-2 border-slate-200 text-slate-800 hover:border-indigo-400 hover:bg-indigo-50/40';

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
                  onClick={() => handleSelectMath(opt)}
                  className={`py-4 px-6 rounded-2xl font-black text-2xl transition-all duration-150 shadow-xs cursor-pointer ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback message */}
          <AnimatePresence>
            {mathFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 p-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                  mathFeedback.isCorrect
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-100 text-rose-900 border border-rose-200'
                }`}
              >
                {mathFeedback.isCorrect ? (
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span>{mathFeedback.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step Completion Action Button */}
        <div className="mt-6 pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onComplete();
            }}
            disabled={!isJumpsCompleted || !mathCompleted}
            className={`w-full py-4 px-6 rounded-2xl font-black text-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3 ${
              isJumpsCompleted && mathCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white cursor-pointer shadow-lg hover:shadow-xl transform active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>¡Reto 1 Completado! Pasar al Reto 2: Equilibrio</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 flex justify-between items-center text-xs font-semibold text-slate-500">
          <button onClick={onBack} className="hover:text-slate-800 transition-colors">
            ← Volver al Calentamiento
          </button>
        </div>
      </div>
    </div>
  );
};
