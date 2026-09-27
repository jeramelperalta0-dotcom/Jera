export type GradeId = '1er Grado' | '2do Grado' | '3er Grado' | '4to Grado' | '5to Grado' | '6to Grado';
export type SectionId = 'A' | 'B' | 'C' | 'D' | 'E';

export interface MascotInfo {
  name: string;
  title: string;
  description: string;
  image: string;
  tagline: string;
  levelBadge: string;
  specialAbility: string;
  primaryColor: string;
  accentColor: string;
}

export interface MathQuestion {
  question: string;
  answer: number;
  options: number[];
  hint?: string;
}

export interface ScienceQuestion {
  question: string;
  options: string[];
  correct: number;
  topic: string;
  explanation: string;
}

export interface GradeConfig {
  id: GradeId;
  label: string;
  subtitle: string;
  mascot: MascotInfo;
  jumpsTarget: number;
  balanceSeconds: number;
  starCatchSpeed: number; // in ms
  mathQuestions: MathQuestion[];
  scienceQuestions: ScienceQuestion[];
}

export interface MissionStats {
  grade: GradeId;
  section: SectionId;
  studentName?: string;
  jumpsDone: number;
  mathAnsweredCorrectly: boolean;
  balanceCompletedSeconds: number;
  peWord: string;
  raceTime: string;
  scienceTopic: string;
  starsCaught: number;
  completedAt?: string;
}
