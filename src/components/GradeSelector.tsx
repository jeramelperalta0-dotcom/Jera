import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, ArrowRight, Zap, Target, HeartHandshake, Dumbbell } from 'lucide-react';
import { GradeConfig, GradeId, SectionId } from '../types';
import { GRADES_CONFIG, HERO_IMAGE } from '../data/gradesData';
import { sounds } from '../utils/audio';

interface GradeSelectorProps {
  selectedGrade: GradeId;
  selectedSection: SectionId;
  studentName: string;
  onSelectGrade: (grade: GradeId) => void;
  onSelectSection: (section: SectionId) => void;
  onChangeStudentName: (name: string) => void;
  onStartWarmup: () => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  selectedGrade,
  selectedSection,
  studentName,
  onSelectGrade,
  onSelectSection,
  onChangeStudentName,
  onStartWarmup,
}) => {
  const currentConfig = GRADES_CONFIG[selectedGrade];
  const gradesList = Object.keys(GRADES_CONFIG) as GradeId[];
  const sections: SectionId[] = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="space-y-6">
      {/* Hero Visual Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900">
        <div className="relative h-48 sm:h-64 w-full overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="Niños activos en movimiento y aprendizaje"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-95 transform transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wide">
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              Retos Adaptativos 1º a 6º de Primaria
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Activa tu Cuerpo, Despierta tu Mente
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl font-normal leading-relaxed">
            Combina agilidad motriz, equilibrio dinámico y velocidad atlética con cálculo mental, vocabulario y ciencias adaptadas a tu nivel escolar.
          </p>
        </div>
      </div>

      {/* Main Grade & Section Selection Deck */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Paso 1 · Registro de Equipo o Estudiante
          </span>
          <h3 className="text-2xl font-bold text-slate-900">
            Configura tu Nivel Escolar
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Cada grado cuenta con su propia figura atlética, metas físicas ajustadas y desafíos académicos calibrados.
          </p>
        </div>

        {/* Grade Chips Grid */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
            Selecciona tu Grado de Primaria:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {gradesList.map((grade) => {
              const config = GRADES_CONFIG[grade];
              const isSelected = selectedGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => {
                    sounds.playClick();
                    onSelectGrade(grade);
                  }}
                  className={`relative p-3 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-slate-800">{grade.split(' ')[0]}</span>
                    {isSelected && <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 line-clamp-1">
                    {config.mascot.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mascot Figure Spotlight Card */}
        <motion.div
          key={currentConfig.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white mb-6 border border-indigo-900/60 shadow-md relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Mascot Character Image */}
            <div className="relative shrink-0 group">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-3 border-amber-400/90 shadow-2xl bg-indigo-900/50">
                <img
                  src={currentConfig.mascot.image}
                  alt={currentConfig.mascot.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {currentConfig.mascot.levelBadge}
              </div>
            </div>

            {/* Mascot Info & Target Goals */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 block mb-1">
                  Tu Figura Guía y Entrenador:
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-white">
                  {currentConfig.mascot.name}
                </h4>
                <p className="text-xs font-semibold text-indigo-200">
                  {currentConfig.mascot.title}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                "{currentConfig.mascot.description}"
              </p>

              {/* Target Metrics Pills */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">Saltos Meta</span>
                  <span className="text-lg sm:text-xl font-black text-white">{currentConfig.jumpsTarget}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-cyan-300 block">Equilibrio</span>
                  <span className="text-lg sm:text-xl font-black text-white">{currentConfig.balanceSeconds}s</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block">Agilidad</span>
                  <span className="text-xs sm:text-sm font-black text-white pt-1 block">{currentConfig.starCatchSpeed}ms</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Picker & Student Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Sección Escolar:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {sections.map((sec) => {
                const isSelected = selectedSection === sec;
                return (
                  <button
                    key={sec}
                    onClick={() => {
                      sounds.playClick();
                      onSelectSection(sec);
                    }}
                    className={`py-3 rounded-xl font-black text-base transition-all duration-150 border-2 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-102'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {sec}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Nombre del Estudiante o Equipo (Opcional):
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => onChangeStudentName(e.target.value)}
              placeholder="Ej: Sofía o Los Rayos del 4to A"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onStartWarmup();
            }}
            className="w-full group py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer transform active:scale-98"
          >
            <span>¡Comenzar Calentamiento con {currentConfig.mascot.name.split(' ')[0]}!</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
