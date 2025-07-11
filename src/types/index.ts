export interface PatientData {
  age: number;
  disorderArea: string;
  secondaryDisorderArea?: string;
  patientInitials?: string;
  deficits?: string;
  specificErrors?: string;
  strengths?: string;
  hobbies?: string;
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

export interface TherapyPlanData {
  id: string;
  patientData: PatientData;
  longTermGoal: string;
  objectives: Objective[];
  treatmentProtocol: TreatmentProtocol;
  treatmentProtocols?: TreatmentProtocol[]; // for multiple protocols
  summary?: string;
  engagementIdeas?: string[];
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
