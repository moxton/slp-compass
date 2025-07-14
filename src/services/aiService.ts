import type { PatientData, TherapyPlanData, DeficitCard } from "@/types";

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
          content: 'You are an expert pediatric speech-language pathologist with extensive experience in creating evidence-based therapy plans for children with communication disorders. You create detailed, clinically appropriate goals and treatment protocols. You must respond with valid JSON only.'
        },
        {
          role: 'user',
          content: therapyPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
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
          content: 'You are an expert pediatric speech-language pathologist with extensive experience in creating evidence-based therapy plans for children with communication disorders. You create detailed, clinically appropriate treatment protocols and engagement strategies. You must respond with valid JSON only.'
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
  return `You are an expert pediatric speech-language pathologist (SLP) with deep knowledge of evidence-based, developmentally appropriate best practices.

---

INPUT:
- Patient Initials: ${patientData.patientInitials || '[Initials or pseudonym only]'}
- Age: ${patientData.age}
- Primary Disorder Area: ${patientData.disorderArea}
- Secondary Disorder Area: ${patientData.secondaryDisorderArea || ''}
- Deficits: ${patientData.deficits || ''}
- Specific Errors: ${patientData.specificErrors || ''}
- Strengths: ${patientData.strengths || ''}
- Hobbies & Interests: ${patientData.hobbies || ''}
- Additional Details (optional): ${patientData.additionalDetails || ''}

---

TASKS:

1️⃣ **Analyze the input and identify each distinct communication disorder or skill deficit.**

2️⃣ **Generate a patient summary (2-3 sentences) describing how the goals will improve daily communication and how family/teachers can help generalize new skills.**

3️⃣ **For each identified deficit, generate:**
- A clear, individualized long-term goal that is detailed, specific, and relevant to daily communication
- 3 short-term objectives as a numbered list, each demonstrating SMART qualities
- An evidence-based treatment protocol including:
  - Protocol name and description
  - Duration and frequency
  - Example targets
  - Treatment hierarchy
  - Cues and fading strategies
  - Citation
- 3 creative, age-appropriate engagement ideas

---

**CRITICAL: You must respond with valid JSON only. Use this exact structure:**

{
  "patientSummary": "2-3 sentence summary of how goals will improve communication and how family/teachers can help",
  "deficitCards": [
    {
      "deficitName": "Name of the deficit (e.g., 'Velar Fronting', 'Cluster Reduction')",
      "longTermGoal": "Detailed long-term goal statement",
      "shortTermObjectives": [
        "Objective 1 with SMART criteria",
        "Objective 2 with SMART criteria", 
        "Objective 3 with SMART criteria"
      ],
      "evidenceBasedProtocol": {
        "name": "Protocol name (e.g., 'Cycles Phonological Remediation Approach')",
        "duration": "Session duration (e.g., '30-minute sessions')",
        "frequency": "Frequency (e.g., '2x/week for 6-8 weeks per cycle')",
        "exampleTargets": "Specific examples (e.g., '/k/ and /g/ in isolation, syllables, words, short phrases')",
        "hierarchy": "Treatment progression (e.g., 'Auditory bombardment → production practice in isolation → word → phrase → short sentence → generalization')",
        "cuesAndFading": "Cue strategies and fading (e.g., 'Use tactile cues for tongue placement and visual models; fade to independent production as stimulability increases')",
        "citation": "Citation (e.g., 'Hodson, B.W. (2010). Cycles Phonological Remediation Approach.')"
      },
      "engagementIdeas": [
        "Engagement idea 1",
        "Engagement idea 2",
        "Engagement idea 3"
      ]
    }
  ]
}

**Guidelines:**
- Use precise clinical language and current best practices
- Each goal and objective must be fully SMART
- If any input is missing, infer reasonable details based on age and disorder norms
- Format for easy copy-paste into clinical documents
- Respond with ONLY the JSON object, no additional text
`;
};

const createTreatmentProtocolPrompt = (data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }): string => {
  return `You are an expert pediatric speech-language pathologist (SLP) with deep knowledge of evidence-based, developmentally appropriate best practices.

---

INPUT:
- Patient Initials: ${data.patientInitials || '[Initials or pseudonym only]'}
- Age: ${data.age}
- Primary Disorder Area: ${data.disorderArea}
- Secondary Disorder Area: ${data.secondaryDisorderArea || ''}
- Deficits: ${data.deficits || ''}
- Specific Errors: ${data.specificErrors || ''}
- Strengths: ${data.strengths || ''}
- Hobbies & Interests: ${data.hobbies || ''}
- Additional Details (optional): ${data.additionalDetails || ''}

---

Long-term Goal: ${data.manualGoals.longTermGoal}

Short-term Objectives:
${data.manualGoals.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

---

Please provide an evidence-based treatment protocol and engagement ideas for this goal.

**CRITICAL: You must respond with valid JSON only. Use this exact structure:**

{
  "patientSummary": "2-3 sentence summary of how this goal will improve communication and how family/teachers can help",
  "deficitCards": [
    {
      "deficitName": "Goal Area",
      "longTermGoal": "${data.manualGoals.longTermGoal}",
      "shortTermObjectives": ${JSON.stringify(data.manualGoals.objectives)},
      "evidenceBasedProtocol": {
        "name": "Protocol name",
        "duration": "Session duration",
        "frequency": "Frequency",
        "exampleTargets": "Specific examples",
        "hierarchy": "Treatment progression",
        "cuesAndFading": "Cue strategies and fading",
        "citation": "Citation"
      },
      "engagementIdeas": [
        "Engagement idea 1",
        "Engagement idea 2", 
        "Engagement idea 3"
      ]
    }
  ]
}

Respond with ONLY the JSON object, no additional text.`;
};

const parseTherapyPlan = (planText: string, patientData: PatientData): TherapyPlanData => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = planText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.patientSummary || !parsed.deficitCards) {
      throw new Error('Invalid JSON structure');
    }

    const deficitCards: DeficitCard[] = parsed.deficitCards.map((card: any, index: number) => ({
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
      patientSummary: parsed.patientSummary,
      deficitCards,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error parsing therapy plan:', error);
    console.error('Raw response:', planText);
    
    // Fallback to default structure
    return {
      id: Date.now().toString(),
      patientData,
      patientSummary: `${patientData.patientInitials || 'Patient'} will target ${patientData.disorderArea.replace('-', ' ')} using evidence-based protocols with clear hierarchies and cues. These goals will increase speech intelligibility and functional communication. Parents and teachers can support generalization through home practice and modeling target skills during daily activities.`,
      deficitCards: [{
        id: '1',
        deficitName: patientData.disorderArea.replace('-', ' '),
        longTermGoal: `Patient will demonstrate improved ${patientData.disorderArea.replace('-', ' ')} skills in structured activities.`,
        shortTermObjectives: [
          `Patient will demonstrate improved ${patientData.disorderArea.replace('-', ' ')} skills in structured activities.`,
          `Patient will generalize skills to classroom/home environment.`,
          `Patient will increase independence in communication attempts.`
        ],
        evidenceBasedProtocol: {
          name: 'Evidence-Based Protocol',
          duration: '45-minute sessions',
          frequency: '2-3 times per week',
          exampleTargets: 'Target specific communication behaviors',
          hierarchy: 'Isolated skill practice → Structured activities → Semi-structured practice → Natural conversation → Independent use',
          cuesAndFading: 'Visual cues and modeling demonstrations; fade to independent production',
          citation: 'American Speech-Language-Hearing Association (ASHA) Clinical Guidelines'
        },
        engagementIdeas: [
          'Use age-appropriate games and activities',
          'Incorporate patient interests and hobbies',
          'Provide positive reinforcement and encouragement'
        ]
      }],
      createdAt: new Date().toISOString(),
    };
  }
};

const parseManualGoalsPlan = (planText: string, data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }): TherapyPlanData => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = planText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.patientSummary || !parsed.deficitCards) {
      throw new Error('Invalid JSON structure');
    }

    const deficitCards: DeficitCard[] = parsed.deficitCards.map((card: any, index: number) => ({
      id: (index + 1).toString(),
      deficitName: card.deficitName || `Goal Area`,
      longTermGoal: card.longTermGoal || data.manualGoals.longTermGoal,
      shortTermObjectives: card.shortTermObjectives || data.manualGoals.objectives,
      evidenceBasedProtocol: {
        name: card.evidenceBasedProtocol?.name || 'Evidence-Based Protocol',
        duration: card.evidenceBasedProtocol?.duration || '45-minute sessions',
        frequency: card.evidenceBasedProtocol?.frequency || '2-3 times per week',
        exampleTargets: card.evidenceBasedProtocol?.exampleTargets || 'Target specific communication behaviors',
        hierarchy: card.evidenceBasedProtocol?.hierarchy || 'Isolated skill practice → Structured activities → Semi-structured practice → Natural conversation → Independent use',
        cuesAndFading: card.evidenceBasedProtocol?.cuesAndFading || 'Visual cues and modeling demonstrations; fade to independent production',
        citation: card.evidenceBasedProtocol?.citation || 'American Speech-Language-Hearing Association (ASHA) Clinical Guidelines'
      },
      engagementIdeas: card.engagementIdeas || [
        'Use age-appropriate games and activities',
        'Incorporate patient interests and hobbies',
        'Provide positive reinforcement and encouragement'
      ]
    }));

    return {
      id: Date.now().toString(),
      patientData: data,
      patientSummary: parsed.patientSummary,
      deficitCards,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error parsing manual goals plan:', error);
    console.error('Raw response:', planText);
    
    // Fallback to default structure
    return {
      id: Date.now().toString(),
      patientData: data,
      patientSummary: `${data.patientInitials || 'Patient'} will target ${data.disorderArea.replace('-', ' ')} using evidence-based protocols with clear hierarchies and cues. These goals will increase speech intelligibility and functional communication. Parents and teachers can support generalization through home practice and modeling target skills during daily activities.`,
      deficitCards: [{
        id: '1',
        deficitName: 'Goal Area',
        longTermGoal: data.manualGoals.longTermGoal,
        shortTermObjectives: data.manualGoals.objectives,
        evidenceBasedProtocol: {
          name: 'Evidence-Based Protocol',
          duration: '45-minute sessions',
          frequency: '2-3 times per week',
          exampleTargets: 'Target specific communication behaviors',
          hierarchy: 'Isolated skill practice → Structured activities → Semi-structured practice → Natural conversation → Independent use',
          cuesAndFading: 'Visual cues and modeling demonstrations; fade to independent production',
          citation: 'American Speech-Language-Hearing Association (ASHA) Clinical Guidelines'
        },
        engagementIdeas: [
          'Use age-appropriate games and activities',
          'Incorporate patient interests and hobbies',
          'Provide positive reinforcement and encouragement'
        ]
      }],
      createdAt: new Date().toISOString(),
    };
  }
};
