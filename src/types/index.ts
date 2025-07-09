export interface PatientData {
  age: number;
  disorderArea: string;
  secondaryDisorderArea?: string;
  description: string;
  patientInitials?: string;
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
  references: string[];
}

export interface TherapyPlanData {
  id: string;
  patientData: PatientData;
  longTermGoal: string;
  objectives: Objective[];
  treatmentProtocol: TreatmentProtocol;
  createdAt: string;
}

export interface ExamplePlan {
  disorderArea: string;
  longTermGoal: string;
  objectives: string[];
  treatmentProtocol: {
    duration: string;
    frequency: string;
    targets: string[];
    references: string[];
  };
  engagementIdeas: string[];
}
