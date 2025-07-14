export interface PatientData {
  age: number;
  disorderArea: string;
  deficits: string;
  specificErrors: string;
  strengths: string;
  hobbies: string;
  secondaryDisorderArea?: string;
  patientInitials?: string;
  additionalDetails?: string;
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
  name?: string;
  duration: string;
  frequency: string;
  targets: string[];
  hierarchy: string[];
  prompts: string[];
  references: string[];
  fadingSupports?: string;
}

export interface DeficitCard {
  id: string;
  deficitName: string;
  longTermGoal: string;
  shortTermObjectives: string[];
  evidenceBasedProtocol: {
    name: string;
    duration: string;
    frequency: string;
    exampleTargets: string;
    hierarchy: string;
    cuesAndFading: string;
    citation: string;
  };
  engagementIdeas: string[];
}

export interface TherapyPlanData {
  id: string;
  patientData: PatientData;
  patientSummary: string;
  deficitCards: DeficitCard[];
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
