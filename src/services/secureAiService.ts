
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
  // Handle new structure with patientSummary and deficitCards
  if (aiOutput.patientSummary && aiOutput.deficitCards && Array.isArray(aiOutput.deficitCards)) {
    const deficitCards = aiOutput.deficitCards.map((card: any, index: number) => ({
      id: (index + 1).toString(),
      deficitName: card.deficitName || `Deficit ${index + 1}`,
      longTermGoal: card.longTermGoal || '',
      shortTermObjectives: card.shortTermObjectives || [],
      evidenceBasedProtocol: {
        name: card.evidenceBasedProtocol?.name || '',
        duration: card.evidenceBasedProtocol?.duration || '',
        frequency: card.evidenceBasedProtocol?.frequency || '',
        exampleTargets: card.evidenceBasedProtocol?.exampleTargets || '',
        hierarchy: card.evidenceBasedProtocol?.hierarchy || '',
        cuesAndFading: card.evidenceBasedProtocol?.cuesAndFading || '',
        citation: card.evidenceBasedProtocol?.citation || ''
      },
      engagementIdeas: card.engagementIdeas || []
    }));

    return {
      id: Date.now().toString(),
      patientData,
      patientSummary: aiOutput.patientSummary,
      deficitCards,
      createdAt: new Date().toISOString(),
    };
  }

  // Fallback for previous structure
  // Transform objectives from string array to Objective objects
  const objectives = aiOutput.objectives?.map((obj: string, index: number) => ({
    id: (index + 1).toString(),
    text: obj,
    specific: 'AI-generated objective',
    measurable: 'As specified in objective',
    achievable: 'Based on clinical assessment',
    relevant: 'Addresses identified needs',
    timebound: 'Per treatment timeline'
  })) || [];

  // Transform treatment protocols (array or single)
  const treatmentProtocols = Array.isArray(aiOutput.treatmentProtocols)
    ? aiOutput.treatmentProtocols
    : aiOutput.treatmentProtocols ? [aiOutput.treatmentProtocols] : [];

  // Create fallback deficit card from old structure
  const fallbackDeficitCard = {
    id: '1',
    deficitName: patientData.disorderArea.replace('-', ' '),
    longTermGoal: aiOutput.longTermGoal || `Patient will improve ${patientData.disorderArea.replace('-', ' ')} skills.`,
    shortTermObjectives: objectives.map(obj => obj.text),
    evidenceBasedProtocol: {
      name: treatmentProtocols[0]?.name || 'Evidence-Based Protocol',
      duration: treatmentProtocols[0]?.duration || '45-minute sessions',
      frequency: treatmentProtocols[0]?.frequency || '2-3 times per week',
      exampleTargets: treatmentProtocols[0]?.targets?.join(', ') || 'Target specific communication behaviors',
      hierarchy: treatmentProtocols[0]?.hierarchy?.join(' → ') || 'Isolated skill practice → Structured activities → Semi-structured practice → Natural conversation → Independent use',
      cuesAndFading: treatmentProtocols[0]?.fadingSupports || 'Visual cues and modeling demonstrations; fade to independent production',
      citation: treatmentProtocols[0]?.references?.[0] || 'American Speech-Language-Hearing Association (ASHA) Clinical Guidelines'
    },
    engagementIdeas: aiOutput.engagementIdeas || [
      'Use age-appropriate games and activities',
      'Incorporate patient interests and hobbies',
      'Provide positive reinforcement and encouragement'
    ]
  };

  return {
    id: Date.now().toString(),
    patientData,
    patientSummary: aiOutput.summary || `${patientData.patientInitials || 'Patient'} will target ${patientData.disorderArea.replace('-', ' ')} using evidence-based protocols with clear hierarchies and cues. These goals will increase speech intelligibility and functional communication. Parents and teachers can support generalization through home practice and modeling target skills during daily activities.`,
    deficitCards: [fallbackDeficitCard],
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
  const { data: { user } } = await supabase.auth.getUser();
  const clientId = user?.id || 'anonymous';
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
  const { data: { user } } = await supabase.auth.getUser();
  const clientId = user?.id || 'anonymous';
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

  const deficitCard = {
    id: '1',
    deficitName: primaryArea.replace('-', ' '),
    longTermGoal: `Patient will improve ${primaryArea} skills to support effective communication in academic and social settings within 6-12 months.`,
    shortTermObjectives: [
      `Patient will demonstrate improved ${primaryArea.replace('-', ' ')} skills in structured activities.`,
      `Patient will generalize skills to classroom/home environment.`,
      `Patient will increase independence in communication attempts.`
    ],
    evidenceBasedProtocol: {
      name: 'Evidence-Based Protocol',
      duration: '45-minute sessions',
      frequency: '2-3 times per week',
      exampleTargets: 'Improve accuracy of target sounds/skills, Increase spontaneous use of target behaviors, Develop self-monitoring abilities',
      hierarchy: 'Isolated skill practice with maximum support → Structured activities with moderate prompting → Semi-structured practice with minimal cues → Natural conversation with occasional support → Independent use in various contexts',
      cuesAndFading: 'Visual cues and modeling demonstrations; fade to independent production as accuracy improves',
      citation: 'American Speech-Language-Hearing Association (ASHA) Clinical Guidelines'
    },
    engagementIdeas: [
      'Use age-appropriate games and activities',
      'Incorporate patient interests and hobbies',
      'Provide positive reinforcement and encouragement'
    ]
  };

  return {
    id: Date.now().toString(),
    patientData,
    patientSummary: `${patientData.patientInitials || 'Patient'} will target ${primaryArea.replace('-', ' ')} using evidence-based protocols with clear hierarchies and cues. These goals will increase speech intelligibility and functional communication. Parents and teachers can support generalization through home practice and modeling target skills during daily activities.`,
    deficitCards: [deficitCard],
    createdAt: new Date().toISOString(),
  };
};

const createMockTreatmentProtocol = (
  data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }
): TherapyPlanData => {
  const deficitCard = {
    id: '1',
    deficitName: 'Goal Area',
    longTermGoal: data.manualGoals.longTermGoal,
    shortTermObjectives: data.manualGoals.objectives,
    evidenceBasedProtocol: {
      name: 'Evidence-Based Protocol',
      duration: '45-minute sessions',
      frequency: '2-3 times per week',
      exampleTargets: 'Improve accuracy of target sounds/skills, Increase spontaneous use of target behaviors, Develop self-monitoring abilities',
      hierarchy: 'Isolated skill practice with maximum support → Structured activities with moderate prompting → Semi-structured practice with minimal cues → Natural conversation with occasional support → Independent use in various contexts',
      cuesAndFading: 'Visual cues and modeling demonstrations; fade to independent production as accuracy improves',
      citation: 'American Speech-Language-Hearing Association (ASHA) Clinical Guidelines'
    },
    engagementIdeas: [
      'Use age-appropriate games and activities',
      'Incorporate patient interests and hobbies',
      'Provide positive reinforcement and encouragement'
    ]
  };

  return {
    id: Date.now().toString(),
    patientData: data,
    patientSummary: `${data.patientInitials || 'Patient'} will target ${data.disorderArea.replace('-', ' ')} using evidence-based protocols with clear hierarchies and cues. These goals will increase speech intelligibility and functional communication. Parents and teachers can support generalization through home practice and modeling target skills during daily activities.`,
    deficitCards: [deficitCard],
    createdAt: new Date().toISOString(),
  };
};
