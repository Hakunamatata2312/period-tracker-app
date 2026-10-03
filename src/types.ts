export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type PregnancyChance = 'very_high' | 'high' | 'medium' | 'low' | 'none';

export type FlowIntensity = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';

export type CervicalMucusType = 'dry' | 'sticky' | 'creamy' | 'watery' | 'egg_white';

export type LHTestResult = 'none' | 'negative' | 'low' | 'high' | 'peak';

export type PregnancyTestResult = 'none' | 'negative' | 'faint_positive' | 'positive';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  flow: FlowIntensity;
  bbt?: number; // Basal body temperature in Celsius (e.g. 36.45)
  cervicalMucus?: CervicalMucusType;
  lhTest?: LHTestResult;
  pregnancyTest?: PregnancyTestResult;
  intimacy?: 'none' | 'protected' | 'unprotected';
  moods: string[];
  symptoms: string[];
  waterGlasses?: number;
  notes?: string;
  tookVitamins?: boolean;
}

export interface PastCycle {
  id: string;
  startDate: string; // YYYY-MM-DD
  periodDuration: number; // days
  cycleLength: number; // total days until next cycle
}

export interface UserCycleSettings {
  lastPeriodDate: string; // YYYY-MM-DD
  periodDuration: number; // default 5 days
  cycleLength: number; // default 28 days
  lutealPhaseDuration: number; // default 14 days
  isIrregular: boolean;
  goal: 'track' | 'conceive' | 'avoid';
  userName?: string;
}

export interface ReminderConfig {
  id: string;
  title: string;
  description: string;
  time: string; // HH:mm
  enabled: boolean;
  category: 'period' | 'ovulation' | 'bbt' | 'medication' | 'lifestyle';
}

export interface MedicalArticle {
  id: string;
  title: string;
  category: 'cycle' | 'fertility' | 'diseases' | 'pregnancy' | 'mental' | 'red_flags';
  categoryLabelAr: string;
  author: {
    name: string;
    specialty: string;
    hospital: string;
    credentials: string;
  };
  reviewer: string;
  readTimeMinutes: number;
  lastUpdated: string;
  summary: string;
  keyPoints: string[];
  sections: {
    heading: string;
    content: string;
    bulletPoints?: string[];
  }[];
  clinicalGuidelines: string[];
  sources: string[];
}

export interface SmartPredictionResult {
  predictedCycleLength: number; // e.g. 28.6 days
  predictedPeriodDuration: number; // e.g. 5 days
  confidenceScore: number; // percentage 0-100%
  marginOfErrorDays: number; // e.g. ±1.2 days
  predictedNextPeriodDate: string; // YYYY-MM-DD
  predictedOvulationDate: string; // YYYY-MM-DD
  predictedFertileStart: string; // YYYY-MM-DD
  predictedFertileEnd: string; // YYYY-MM-DD
  weightsUsed: { cycle1: number; cycle2: number; cycle3: number };
  recentCycleLengths: number[];
  standardDeviation: number;
  clinicalInterpretation: string;
}

export interface FertilityMedication {
  id: string;
  genericName: string;
  brandNames: string[];
  category: 'oral_inducer' | 'injectable_gonadotropin' | 'trigger_shot' | 'insulin_sensitizer' | 'luteal_support' | 'adjuvant_supplement';
  categoryLabelAr: string;
  mechanismOfActionAr: string;
  standardProtocolAr: string;
  successRatesAr: string;
  monitoringRequirementsAr: string;
  sideEffectsAndRisksAr: string[];
  ohssRiskLevel: 'none' | 'low' | 'moderate' | 'high';
  clinicalRecommendationsAr: string[];
}

export interface ClinicalStudy {
  id: string;
  title: string;
  journal: string;
  year: number;
  category: 'ovulation' | 'supplements' | 'pcos' | 'endometrium' | 'circadian' | 'pain_symptoms';
  categoryLabelAr: string;
  authors: string;
  doiOrCitation: string;
  studyDesign: string;
  sampleSize: string;
  summaryAr: string;
  keyFindings: string[];
  clinicalTakeaway: string;
  evidenceGrade: string;
}

export interface DayCycleInfo {
  date: string;
  cycleDay: number; // 1-indexed day of current cycle
  phase: CyclePhase;
  phaseNameAr: string;
  phaseDescriptionAr: string;
  chance: PregnancyChance;
  chanceLabelAr: string;
  isPeriod: boolean;
  isFertileWindow: boolean;
  isOvulationDay: boolean;
  daysUntilNextPeriod: number;
}
