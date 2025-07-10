
import type { PatientData, TherapyPlanData } from "@/types";
import { validatePatientData, validateManualGoals, apiRateLimiter } from "@/utils/validation";
import { supabase } from "@/integrations/supabase/client";

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

// Transform Edge Function response to match TherapyPlanData format
const transformEdgeFunctionResponse = (aiOutput: any, patientData: PatientData): TherapyPlanData => {
  // Handle new structure with longTermGoals array
  if (aiOutput.longTermGoals && Array.isArray(aiOutput.longTermGoals)) {
    // For now, flatten all objectives and protocols for display
    const firstGoal = aiOutput.longTermGoals[0];
    const objectives = firstGoal.objectives?.map((obj: string, index: number) => ({
      id: (index + 1).toString(),
      text: obj,
      specific: 'AI-generated objective',
      measurable: 'As specified in objective',
      achievable: 'Based on clinical assessment',
      relevant: 'Addresses identified needs',
      timebound: 'Per treatment timeline'
    })) || [];

    // Map all protocols
    const treatmentProtocols = aiOutput.longTermGoals.map((goal: any) => ({
      name: goal.treatmentProtocol?.name || '',
      targets: goal.treatmentProtocol?.targets || [],
      hierarchy: goal.treatmentProtocol?.hierarchy || [],
      references: goal.treatmentProtocol?.references || [],
      fadingSupports: goal.treatmentProtocol?.fadingSupports || '',
    }));

    return {
      id: Date.now().toString(),
      patientData,
      longTermGoal: firstGoal.longTermGoal || '',
      objectives,
      treatmentProtocol: treatmentProtocols[0] || {},
      treatmentProtocols,
      summary: aiOutput.summary || '',
      engagementIdeas: aiOutput.engagementIdeas || [],
      createdAt: new Date().toISOString(),
    };
  }

  // Fallback for previous structure
  // Transform objectives from string array to Objective objects
  const objectives = aiOutput.objectives.map((obj: string, index: number) => ({
    id: (index + 1).toString(),
    text: obj,
    specific: 'AI-generated objective',
    measurable: 'As specified in objective',
    achievable: 'Based on clinical assessment',
    relevant: 'Addresses identified needs',
    timebound: 'Per treatment timeline'
  }));

  // Transform treatment protocols (array or single)
  const treatmentProtocols = Array.isArray(aiOutput.treatmentProtocols)
    ? aiOutput.treatmentProtocols
    : aiOutput.treatmentProtocols ? [aiOutput.treatmentProtocols] : [];

  // Fallback for legacy single protocol
  const treatmentProtocol = treatmentProtocols[0] || {
    duration: '45-minute sessions',
    frequency: '2-3 times per week',
    targets: [],
    hierarchy: [],
    prompts: [],
    references: []
  };

  return {
    id: Date.now().toString(),
    patientData,
    longTermGoal: aiOutput.longTermGoal,
    objectives,
    treatmentProtocol, // for legacy fallback
    treatmentProtocols, // for new UI
    summary: aiOutput.summary || '',
    engagementIdeas: aiOutput.engagementIdeas || [],
    createdAt: new Date().toISOString(),
  };
};

// Secure therapy plan generation using Supabase Edge Functions
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

  try {
    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-therapy-plan', {
      body: { patientData }
    });

    if (error) {
      console.error('Supabase Edge Function error:', error);
      throw new Error(error.message || 'Failed to generate therapy plan');
    }

    if (!data || !data.success) {
      throw new Error(data?.error || 'Failed to generate therapy plan');
    }

    // Transform the response to match expected format
    return transformEdgeFunctionResponse(data.data, patientData);
  } catch (error) {
    console.error('Error calling AI service:', error);
    
    // Fallback to mock data if Edge Function is not available
    if (error.message?.includes('Function not found') || error.message?.includes('Failed to fetch')) {
      console.warn('Edge Function not available, using fallback data');
      return createMockTherapyPlan(patientData);
    }
    
    throw error;
  }
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

  try {
    // Call Supabase Edge Function for treatment protocol
    const { data: responseData, error } = await supabase.functions.invoke('generate-treatment-protocol', {
      body: { 
        patientData: data,
        manualGoals: data.manualGoals
      }
    });

    if (error) {
      console.error('Supabase Edge Function error:', error);
      throw new Error(error.message || 'Failed to generate treatment protocol');
    }

    if (!responseData || !responseData.success) {
      throw new Error(responseData?.error || 'Failed to generate treatment protocol');
    }

    // Transform the response to match expected format
    return transformEdgeFunctionResponse(responseData.data, data);
  } catch (error) {
    console.error('Error calling AI service:', error);
    
    // Fallback to mock data if Edge Function is not available
    if (error.message?.includes('Function not found') || error.message?.includes('Failed to fetch')) {
      console.warn('Edge Function not available, using fallback data');
      return createMockTreatmentProtocol(data);
    }
    
    throw error;
  }
};

// Secure mock response generator (fallback when Edge Functions are not available)
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
