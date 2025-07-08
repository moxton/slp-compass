
export interface PatientData {
  age: number;
  disorderArea: string;
  description: string;
}

export interface Objective {
  id: string;
  text: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timebound: string;
}

export interface TreatmentProtocol {
  duration: string;
  frequency: string;
  targets: string[];
  hierarchy: string[];
  prompts: string[];
}

export interface TherapyPlanData {
  id: string;
  patientData: PatientData;
  longTermGoal: string;
  objectives: Objective[];
  treatmentProtocol: TreatmentProtocol;
  createdAt: string;
}
