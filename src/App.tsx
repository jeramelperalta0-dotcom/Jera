import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GradeId, SectionId, MissionStats } from './types';
import { GRADES_CONFIG } from './data/gradesData';
import { sounds } from './utils/audio';
import { Header } from './components/Header';
import { GradeSelector } from './components/GradeSelector';
import { WarmupStage } from './components/WarmupStage';
import { JumpChallenge } from './components/JumpChallenge';
import { BalanceChallenge } from './components/BalanceChallenge';
import { RaceChallenge } from './components/RaceChallenge';
import { VictoryStage } from './components/VictoryStage';
import { ConfettiCanvas } from './components/ConfettiCanvas';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedGrade, setSelectedGrade] = useState<GradeId>('4to Grado');
  const [selectedSection, setSelectedSection] = useState<SectionId>('A');
  const [studentName, setStudentName] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Completed stats storage
  const [missionStats, setMissionStats] = useState<MissionStats>({
    grade: '4to Grado',
    section: 'A',
    studentName: '',
    jumpsDone: 20,
    mathAnsweredCorrectly: true,
    balanceCompletedSeconds: 20,
    peWord: 'MOVIMIENTO',
    raceTime: '00:00.0',
    scienceTopic: 'Botánica & Biología',
    starsCaught: 5,
  });

  const gradeConfig = GRADES_CONFIG[selectedGrade];

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  const handleReset = () => {
    sounds.playClick();
    setCurrentStep(0);
  };

  // Step names for progress header
  const stepTitles = [
    'Configuración de Grado',
    'Calentamiento de Reflejos',
    'Reto 1: Saltos + Matemáticas',
    'Reto 2: Equilibrio + Léxico',
    'Reto 3: Carrera + Ciencias',
    'Gran Premiación 🏆',
  ];

  const progressPercent = (currentStep / (stepTitles.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50/40 to-amber-50/30 flex flex-col font-sans">
      {/* Celebration Confetti */}
      <ConfettiCanvas active={currentStep === 5} />

      {/* Top Bar Contract */}
      <Header
        currentStep={currentStep}
        gradeConfig={gradeConfig}
        section={selectedSection}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onReset={handleReset}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* Global Progress Bar Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-2">
            <span className="flex items-center gap-1.5 text-slate-800">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Etapa {currentStep + 1} de {stepTitles.length}:</span>
              <span className="text-indigo-600 font-extrabold">{stepTitles[currentStep]}</span>
            </span>
            <span className="text-slate-500 font-mono">{Math.round(progressPercent)}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Dynamic Animated Steps with Framer Motion */}
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <GradeSelector
                selectedGrade={selectedGrade}
                selectedSection={selectedSection}
                studentName={studentName}
                onSelectGrade={(grade) => {
                  setSelectedGrade(grade);
                  setMissionStats((prev) => ({
                    ...prev,
                    grade,
                    jumpsDone: GRADES_CONFIG[grade].jumpsTarget,
                    balanceCompletedSeconds: GRADES_CONFIG[grade].balanceSeconds,
                  }));
                }}
                onSelectSection={(sec) => {
                  setSelectedSection(sec);
                  setMissionStats((prev) => ({ ...prev, section: sec }));
                }}
                onChangeStudentName={(name) => {
                  setStudentName(name);
                  setMissionStats((prev) => ({ ...prev, studentName: name }));
                }}
                onStartWarmup={() => {
                  setCurrentStep(1);
                }}
              />
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <WarmupStage
                gradeConfig={gradeConfig}
                onComplete={() => setCurrentStep(2)}
                onBack={() => setCurrentStep(0)}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <JumpChallenge
                gradeConfig={gradeConfig}
                onComplete={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <BalanceChallenge
                gradeConfig={gradeConfig}
                onComplete={(wordFound) => {
                  setMissionStats((prev) => ({
                    ...prev,
                    peWord: wordFound,
                    balanceCompletedSeconds: gradeConfig.balanceSeconds,
                  }));
                  setCurrentStep(4);
                }}
                onBack={() => setCurrentStep(2)}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <RaceChallenge
                gradeConfig={gradeConfig}
                onComplete={(raceTime, scienceTopic) => {
                  setMissionStats((prev) => ({
                    ...prev,
                    raceTime,
                    scienceTopic,
                    jumpsDone: gradeConfig.jumpsTarget,
                    studentName: studentName || prev.studentName,
                    completedAt: new Date().toLocaleTimeString(),
                  }));
                  setCurrentStep(5);
                }}
                onBack={() => setCurrentStep(3)}
              />
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <VictoryStage
                gradeConfig={gradeConfig}
                stats={missionStats}
                onRestart={() => {
                  setCurrentStep(0);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Subtle Footer */}
      <footer className="mt-8 border-t border-slate-200/80 py-4 text-center text-xs text-slate-500 font-medium print:hidden">
        <p>Mueve Tu Mente · Programa Interactivo de Educación Física y Aprendizaje Motriz</p>
      </footer>
    </div>
  );
}
