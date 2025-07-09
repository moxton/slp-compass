
import type { PatientData, TherapyPlanData } from "@/types";
import { validatePatientData, validateManualGoals, apiRateLimiter } from "@/utils/validation";

// Error classes for better error handling
export class ApiKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiKeyError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Secure therapy plan generation (removes client-side API key handling)
export const generateTherapyPlan = async (patientData: PatientData): Promise<TherapyPlanData> => {
  // Validate and sanitize input data
  try {
    validatePatientData(patientData);
  } catch (error) {
    throw new ValidationError('Invalid patient data provided');
  }

  // Check rate limiting
  const clientId = 'anonymous'; // In future, use authenticated user ID
  if (!apiRateLimiter.isAllowed(clientId)) {
    throw new RateLimitError('Too many requests. Please wait before trying again.');
  }

  // TODO: Replace with Supabase Edge Function call
  // For now, return a secure mock response to prevent API key exposure
  console.warn('SECURITY NOTICE: AI service temporarily disabled for security. Please integrate Supabase.');
  
  return createMockTherapyPlan(patientData);
};

export const generateTreatmentProtocol = async (
  data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }
): Promise<TherapyPlanData> => {
  // Validate patient data
  try {
    validatePatientData(data);
    validateManualGoals(data.manualGoals);
  } catch (error) {
    throw new ValidationError('Invalid data provided');
  }

  // Check rate limiting
  const clientId = 'anonymous';
  if (!apiRateLimiter.isAllowed(clientId)) {
    throw new RateLimitError('Too many requests. Please wait before trying again.');
  }

  // TODO: Replace with Supabase Edge Function call
  console.warn('SECURITY NOTICE: AI service temporarily disabled for security. Please integrate Supabase.');
  
  return createMockTreatmentProtocol(data);
};

// Secure mock response generator (temporary until Supabase integration)
const createMockTherapyPlan = (patientData: PatientData): TherapyPlanData => {
  const disorderAreaMap: Record<string, string> = {
    'articulation-phonology': 'articulation and phonological disorders',
    'fluency': 'fluency disorders (stuttering)',
    'expressive-language': 'expressive language disorders',
    'receptive-language': 'receptive language disorders',
    'social-pragmatics': 'social-pragmatic communication disorders',
    'executive-function': 'executive function difficulties',
    'literacy': 'literacy and reading disorders',
  };

  const primaryArea = disorderAreaMap[patientData.disorderArea] || patientData.disorderArea;

  const objectives = [
    {
      id: '1',
      text: `Patient will demonstrate improved ${primaryArea.replace('-', ' ')} skills in structured activities.`,
      specific: 'Target specific communication behaviors during therapy sessions',
      measurable: 'Achieve 80% accuracy across 3 consecutive sessions',
      achievable: 'Based on current skill level and developmental stage',
      relevant: 'Directly addresses primary area of concern',
      timebound: '3-month timeframe with weekly progress monitoring'
    },
    {
      id: '2',
      text: `Patient will generalize skills to classroom/home environment.`,
      specific: 'Apply learned skills in natural communication contexts',
      measurable: 'Demonstrate skills in 4 out of 5 opportunities',
      achievable: 'With appropriate scaffolding and support',
      relevant: 'Essential for functional communication',
      timebound: '6-month timeframe with monthly assessments'
    },
    {
      id: '3',
      text: `Patient will increase independence in communication attempts.`,
      specific: 'Initiate communication without prompting',
      measurable: 'Self-initiate 5 times per 30-minute session',
      achievable: 'Progressive reduction of prompts over time',
      relevant: 'Promotes confident communication',
      timebound: '4-month timeframe with bi-weekly reviews'
    }
  ];

  return {
    id: Date.now().toString(),
    patientData,
    longTermGoal: `Patient will improve ${primaryArea} skills to support effective communication in academic and social settings within 6-12 months.`,
    objectives,
    treatmentProtocol: {
      duration: '45-minute sessions',
      frequency: '2-3 times per week',
      targets: [
        'Improve accuracy of target sounds/skills',
        'Increase spontaneous use of target behaviors',
        'Develop self-monitoring abilities',
        'Enhance communication confidence',
        'Strengthen foundational skills',
        'Promote generalization across contexts'
      ],
      hierarchy: [
        'Isolated skill practice with maximum support',
        'Structured activities with moderate prompting',
        'Semi-structured practice with minimal cues',
        'Natural conversation with occasional support',
        'Independent use in various contexts'
      ],
      prompts: [
        'Visual cues and modeling demonstrations',
        'Verbal prompts and phonetic placement cues',
        'Tactile feedback and kinesthetic support',
        'Positive reinforcement and encouraging feedback',
        'Self-monitoring checklists and visual supports'
      ],
      references: [
        'American Speech-Language-Hearing Association (ASHA) Clinical Guidelines',
        'Evidence-Based Practice in Communication Disorders (ASHA, 2023)'
      ]
    },
    createdAt: new Date().toISOString(),
  };
};

const createMockTreatmentProtocol = (
  data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }
): TherapyPlanData => {
  const objectives = data.manualGoals.objectives.map((obj, index) => ({
    id: (index + 1).toString(),
    text: obj,
    specific: 'User-defined objective',
    measurable: 'As specified by clinician',
    achievable: 'Based on clinical judgment',
    relevant: 'Addresses identified needs',
    timebound: 'Per treatment timeline'
  }));

  return {
    id: Date.now().toString(),
    patientData: data,
    longTermGoal: data.manualGoals.longTermGoal,
    objectives,
    treatmentProtocol: {
      duration: '45-minute sessions',
      frequency: '2-3 times per week',
      targets: [
        'Improve accuracy of target sounds/skills',
        'Increase spontaneous use of target behaviors',
        'Develop self-monitoring abilities',
        'Enhance communication confidence',
        'Strengthen foundational skills',
        'Promote generalization across contexts'
      ],
      hierarchy: [
        'Isolated skill practice with maximum support',
        'Structured activities with moderate prompting',
        'Semi-structured practice with minimal cues',
        'Natural conversation with occasional support',
        'Independent use in various contexts'
      ],
      prompts: [
        'Visual cues and modeling demonstrations',
        'Verbal prompts and phonetic placement cues',
        'Tactile feedback and kinesthetic support',
        'Positive reinforcement and encouraging feedback',
        'Self-monitoring checklists and visual supports'
      ],
      references: [
        'American Speech-Language-Hearing Association (ASHA) Clinical Guidelines',
        'Evidence-Based Practice in Communication Disorders (ASHA, 2023)'
      ]
    },
    createdAt: new Date().toISOString(),
  };
};
