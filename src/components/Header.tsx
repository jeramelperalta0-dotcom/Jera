import React from 'react';
import { Volume2, VolumeX, RotateCcw, Activity } from 'lucide-react';
import { GradeConfig, SectionId } from '../types';

interface HeaderProps {
  currentStep: number;
  gradeConfig: GradeConfig;
  section: SectionId;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onSelectStep?: (step: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  gradeConfig,
  section,
  soundEnabled,
  onToggleSound,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-xs">
            <Activity className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-tight">
              Mueve Tu Mente
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Educación Física + Retos Mentales Interactivos
            </p>
          </div>
        </div>

        {/* Center / Current Status */}
        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{gradeConfig.id}</span>
              <span className="text-slate-400">·</span>
              <span className="text-indigo-600 font-bold">Sec. {section}</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            title={soundEnabled ? 'Sonido Activado' : 'Sonido Silenciado'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Reset Button */}
          {currentStep > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Reiniciar desafío"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reiniciar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
