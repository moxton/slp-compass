import type { PatientData, TherapyPlanData } from "@/types";

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateTherapyPlan = async (patientData: PatientData): Promise<TherapyPlanData> => {
  const apiKey = localStorage.getItem('openai_api_key');
  
  if (!apiKey) {
    const userApiKey = prompt('Please enter your OpenAI API key:');
    if (!userApiKey) {
      throw new Error('OpenAI API key is required');
    }
    localStorage.setItem('openai_api_key', userApiKey);
  }

  const therapyPrompt = createTherapyPlanPrompt(patientData);

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey || localStorage.getItem('openai_api_key')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert pediatric speech-language pathologist with extensive experience in creating evidence-based therapy plans for children with communication disorders. You create detailed, clinically appropriate goals and treatment protocols.'
        },
        {
          role: 'user',
          content: therapyPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  const planText = data.choices[0]?.message?.content;

  if (!planText) {
    throw new Error('No response from AI service');
  }

  return parseTherapyPlan(planText, patientData);
};

export const generateTreatmentProtocol = async (data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }): Promise<TherapyPlanData> => {
  const apiKey = localStorage.getItem('openai_api_key');
  
  if (!apiKey) {
    const userApiKey = prompt('Please enter your OpenAI API key:');
    if (!userApiKey) {
      throw new Error('OpenAI API key is required');
    }
    localStorage.setItem('openai_api_key', userApiKey);
  }

  const treatmentPrompt = createTreatmentProtocolPrompt(data);

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey || localStorage.getItem('openai_api_key')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert pediatric speech-language pathologist with extensive experience in creating evidence-based therapy plans for children with communication disorders. You create detailed, clinically appropriate treatment protocols and engagement strategies.'
        },
        {
          role: 'user',
          content: treatmentPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const responseData = await response.json();
  const planText = responseData.choices[0]?.message?.content;

  if (!planText) {
    throw new Error('No response from AI service');
  }

  return parseManualGoalsPlan(planText, data);
};

const createTherapyPlanPrompt = (patientData: PatientData): string => {
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
  const secondaryArea = patientData.secondaryDisorderArea 
    ? ` with secondary concerns in ${disorderAreaMap[patientData.secondaryDisorderArea] || patientData.secondaryDisorderArea}`
    : '';

  return `Create a comprehensive therapy plan for a ${patientData.age}-year-old child with ${primaryArea}${secondaryArea}.

Patient Description: ${patientData.description}

Please provide:

1. ONE long-term goal (6-12 months) that is comprehensive and measurable

2. THREE SMART short-term objectives that break down the long-term goal:
   - Each objective should be clearly formatted with SMART components
   - Format: "OBJECTIVE: [clear objective statement]"
   - Then provide: SPECIFIC: [what exactly], MEASURABLE: [how measured], ACHIEVABLE: [why realistic], RELEVANT: [why important], TIME-BOUND: [timeframe]

3. Evidence-based treatment protocol including:
   - Duration and frequency of sessions
   - 5-7 specific target skills or behaviors
   - 4-5 step treatment hierarchy (progression from easier to harder)
   - 4-5 specific prompts, cues, and scaffolding strategies

Format your response clearly with headers and bullet points for easy reading.`;
};

const createTreatmentProtocolPrompt = (data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }): string => {
  const disorderAreaMap: Record<string, string> = {
    'articulation-phonology': 'articulation and phonological disorders',
    'fluency': 'fluency disorders (stuttering)',
    'expressive-language': 'expressive language disorders',
    'receptive-language': 'receptive language disorders',
    'social-pragmatics': 'social-pragmatic communication disorders',
    'executive-function': 'executive function difficulties',
    'literacy': 'literacy and reading disorders',
  };

  const primaryArea = disorderAreaMap[data.disorderArea] || data.disorderArea;
  const secondaryArea = data.secondaryDisorderArea 
    ? ` with secondary concerns in ${disorderAreaMap[data.secondaryDisorderArea] || data.secondaryDisorderArea}`
    : '';

  return `Create an evidence-based treatment protocol and engagement ideas for a ${data.age}-year-old child with ${primaryArea}${secondaryArea}.

Patient Description: ${data.description}

Long-term Goal: ${data.manualGoals.longTermGoal}

Short-term Objectives:
${data.manualGoals.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

Please provide:

1. Evidence-based treatment protocol including:
   - Duration and frequency of sessions
   - 5-7 specific target skills or behaviors
   - 4-5 step treatment hierarchy (progression from easier to harder)
   - 4-5 specific prompts, cues, and scaffolding strategies

2. 2-4 creative, age-appropriate engagement ideas such as themes, games, toys, crafts, or manipulatives tailored to the child's age and goals.

Format your response clearly with headers and bullet points for easy reading.`;
};

const parseTherapyPlan = (planText: string, patientData: PatientData): TherapyPlanData => {
  const lines = planText.split('\n').filter(line => line.trim());
  
  const goalIndex = lines.findIndex(line => 
    line.toLowerCase().includes('long-term goal') || 
    line.toLowerCase().includes('long term goal')
  );
  const longTermGoal = lines[goalIndex + 1] || "Long-term goal will be established based on comprehensive assessment.";

  const objectives = [
    {
      id: '1',
      text: `Patient will demonstrate improved ${patientData.disorderArea.replace('-', ' ')} skills in structured activities.`,
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

  const treatmentProtocol = {
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
  };

  return {
    id: Date.now().toString(),
    patientData,
    longTermGoal: longTermGoal.replace(/^\d+\.\s*/, '').trim(),
    objectives,
    treatmentProtocol,
    createdAt: new Date().toISOString(),
  };
};

const parseManualGoalsPlan = (planText: string, data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }): TherapyPlanData => {
  const objectives = data.manualGoals.objectives.map((obj, index) => ({
    id: (index + 1).toString(),
    text: obj,
    specific: 'User-defined objective',
    measurable: 'As specified by clinician',
    achievable: 'Based on clinical judgment',
    relevant: 'Addresses identified needs',
    timebound: 'Per treatment timeline'
  }));

  const treatmentProtocol = {
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
  };

  return {
    id: Date.now().toString(),
    patientData: data,
    longTermGoal: data.manualGoals.longTermGoal,
    objectives,
    treatmentProtocol,
    createdAt: new Date().toISOString(),
  };
};
