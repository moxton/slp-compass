
import type { PatientData, TherapyPlanData } from "@/types";

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateTherapyPlan = async (patientData: PatientData): Promise<TherapyPlanData> => {
  const apiKey = localStorage.getItem('openai_api_key');
  
  if (!apiKey) {
    // Show API key input if not found
    const userApiKey = prompt('Please enter your OpenAI API key:');
    if (!userApiKey) {
      throw new Error('OpenAI API key is required');
    }
    localStorage.setItem('openai_api_key', userApiKey);
  }

  const prompt = createTherapyPlanPrompt(patientData);

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
          content: prompt
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

  return `Create a comprehensive therapy plan for a ${patientData.age}-year-old child with ${disorderAreaMap[patientData.disorderArea] || patientData.disorderArea}.

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

const parseTherapyPlan = (planText: string, patientData: PatientData): TherapyPlanData => {
  // This is a simplified parser - in production, you'd want more robust parsing
  const lines = planText.split('\n').filter(line => line.trim());
  
  // Extract long-term goal
  const goalIndex = lines.findIndex(line => 
    line.toLowerCase().includes('long-term goal') || 
    line.toLowerCase().includes('long term goal')
  );
  const longTermGoal = lines[goalIndex + 1] || "Long-term goal will be established based on comprehensive assessment.";

  // Generate mock objectives for demo (in production, parse from AI response)
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

  // Generate treatment protocol
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
