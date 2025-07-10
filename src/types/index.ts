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
<<<<<<< HEAD
  name?: string;
=======
>>>>>>> 794405e8a914d62f126e1039bf32d31ac0ace405
  duration: string;
  frequency: string;
  targets: string[];
  hierarchy: string[];
  prompts: string[];
  references: string[];
<<<<<<< HEAD
  fadingSupports?: string;
=======
>>>>>>> 794405e8a914d62f126e1039bf32d31ac0ace405
}

export interface TherapyPlanData {
  id: string;
  patientData: PatientData;
  longTermGoal: string;
  objectives: Objective[];
  treatmentProtocol: TreatmentProtocol;
<<<<<<< HEAD
  treatmentProtocols?: TreatmentProtocol[]; // for multiple protocols
  summary?: string;
  engagementIdeas?: string[];
=======
>>>>>>> 794405e8a914d62f126e1039bf32d31ac0ace405
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
