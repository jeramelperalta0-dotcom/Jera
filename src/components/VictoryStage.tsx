import React from 'react';
import { motion } from 'motion/react';
import { Trophy, CheckCircle, RotateCcw, Printer, Share2, Award, Zap, Activity } from 'lucide-react';
import { GradeConfig, MissionStats } from '../types';
import { TROPHY_IMAGE } from '../data/gradesData';
import { sounds } from '../utils/audio';

interface VictoryStageProps {
  gradeConfig: GradeConfig;
  stats: MissionStats;
  onRestart: () => void;
}

export const VictoryStage: React.FC<VictoryStageProps> = ({
  gradeConfig,
  stats,
  onRestart,
}) => {
  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const studentDisplay = stats.studentName?.trim() || `Equipo de ${stats.grade} - Sección ${stats.section}`;

  return (
    <div className="space-y-6">
      {/* Victory Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 text-center relative overflow-hidden"
      >
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-500" />

        {/* Mascot & Golden Trophy Showcase */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 my-3">
          {/* Mascot Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-amber-400 shadow-xl bg-indigo-950">
              <img
                src={gradeConfig.mascot.image}
                alt={gradeConfig.mascot.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="absolute -bottom-2.5 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] uppercase shadow-md">
              {gradeConfig.mascot.name.split(' ')[0]}
            </span>
          </div>

          {/* Golden Trophy Image Render */}
          <div className="relative group animate-bounce-slow">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl bg-amber-50">
              <img
                src={TROPHY_IMAGE}
                alt="Trofeo de Victoria Mueve Tu Mente"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <span className="absolute -bottom-2.5 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase shadow-md flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              ¡Campeón!
            </span>
          </div>
        </div>

        {/* Titles */}
        <div className="mt-5 space-y-1">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-xs font-black uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-purple-700" />
            {stats.grade} · Sección {stats.section}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight pt-2">
            ¡Misión Física y Mental Cumplida!
          </h2>
          <p className="text-base sm:text-lg font-bold text-indigo-600">
            {studentDisplay}
          </p>
        </div>

        {/* Celebratory Message */}
        <div className="mt-5 max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200 text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
          🌟 "¡Felicitaciones! Has demostrado una sincronía perfecta entre agilidad motriz, resistencia cardiovascular y resolución analítica. ¡El movimiento potencia tu inteligencia!" 🌟
        </div>

        {/* Achievement Badges Grid */}
        <div className="mt-8 text-left max-w-3xl mx-auto">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3 text-center sm:text-left">
            Resumen de Logros Alcanzados:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1: Warmup */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 font-black">
                ⭐
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Calentamiento</span>
              <span className="text-base font-black text-slate-900 block mt-0.5">5 Estrellas</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">Reflejos al 100%</span>
            </div>

            {/* Card 2: Jumps & Math */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 font-black">
                🟢
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Saltos + Cálculo</span>
              <span className="text-base font-black text-slate-900 block mt-0.5">{stats.jumpsDone} Saltos</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">Matemática Superada ✔️</span>
            </div>

            {/* Card 3: Balance & Word */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2 font-black">
                🔵
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Equilibrio + Léxico</span>
              <span className="text-base font-black text-slate-900 block mt-0.5">{stats.balanceCompletedSeconds}s Postura</span>
              <span className="text-[10px] text-purple-700 font-black block mt-1 truncate">"{stats.peWord}"</span>
            </div>

            {/* Card 4: Race & Science */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center mb-2 font-black">
                🟡
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Carrera + Ciencias</span>
              <span className="text-base font-black text-slate-900 block mt-0.5">{stats.raceTime}</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1 truncate">{stats.scienceTopic}</span>
            </div>
          </div>
        </div>

        {/* Printable Certificate Template (Visible in normal view and styled for clean print) */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl border-4 border-amber-300 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/40 text-center max-w-2xl mx-auto shadow-inner print:block">
          <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4">
            <span className="text-xs font-black uppercase text-amber-700">Mueve Tu Mente · Certificación Oficial</span>
            <span className="text-xs font-bold text-slate-500">{new Date().toLocaleDateString('es-ES')}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Diploma de Mérito Físico e Intelectual
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Se otorga este reconocimiento especial a:
          </p>
          <div className="text-2xl font-black text-indigo-700 my-2 underline decoration-amber-400 decoration-4 underline-offset-4">
            {studentDisplay}
          </div>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Por completar con excelencia los desafíos de saltos continuos, cálculo mental, equilibrio postural y carrera de velocidad adaptados al <strong>{stats.grade}</strong>.
          </p>

          <div className="mt-6 pt-4 border-t border-amber-200 flex justify-between items-center text-xs text-slate-500">
            <div>
              <span className="block font-bold text-slate-800">Prof. Educación Física</span>
              <span>Docente Evaluador</span>
            </div>
            <div className="text-2xl">🏅</div>
            <div>
              <span className="block font-bold text-slate-800">Dirección Académica</span>
              <span>Primaria Activa</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all duration-150 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Diploma</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onRestart();
            }}
            className="py-3.5 px-7 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md transition-all duration-150 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Reiniciar para Siguiente Estudiante</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
