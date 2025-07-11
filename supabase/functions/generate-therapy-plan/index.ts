import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) throw new Error("OpenAI API key not configured");

    const { patientData } = await req.json();
    if (!patientData) {
      throw new Error("Request body must include a 'patientData' object.");
    }
    const {
      age,
      disorderArea,
      secondaryDisorderArea,
      deficits,
      specificErrors,
      strengths,
      hobbies,
      additionalDetails,
      patientInitials,
      existingGoals // { longTermGoal: string, objectives: string[] } | undefined
    } = patientData;

    const skipGoals = !!(existingGoals && existingGoals.longTermGoal && existingGoals.objectives && existingGoals.objectives.length > 0);

    const prompt = `
You are an expert pediatric speech-language pathologist (SLP) with deep knowledge of evidence-based, developmentally appropriate best practices.

---

INPUT:
- Patient Initials: ${patientInitials || '[Initials or pseudonym only]'}
- Age: ${age}
- Primary Disorder Area: ${disorderArea}
- Secondary Disorder Area: ${secondaryDisorderArea || ''}
- Deficits: ${deficits || ''}
- Specific Errors: ${specificErrors || ''}
- Strengths: ${strengths || ''}
- Hobbies & Interests: ${hobbies || ''}
- Additional Details (optional): ${additionalDetails || ''}

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

    // Call OpenAI
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert SLP creating therapy plans. You must respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });
    if (!openaiResponse.ok) throw new Error(`OpenAI error: ${openaiResponse.statusText}`);
    const openaiData = await openaiResponse.json();
    const aiContent = openaiData.choices[0]?.message?.content;
    
    // Log the raw AI content for debugging
    console.log("AI Content:", aiContent);
    
    // Parse AI response (extract JSON, robust to code blocks)
    const cleaned = aiContent.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in AI response: " + aiContent);
    const aiOutput = JSON.parse(jsonMatch[0]);

    // Validate the structure
    if (!aiOutput.patientSummary || !aiOutput.deficitCards || !Array.isArray(aiOutput.deficitCards)) {
      throw new Error("Invalid JSON structure: missing patientSummary or deficitCards");
    }

    // Save to Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { error } = await supabase
      .from("therapy_plans")
      .insert([{
        patient_data: patientData,
        ai_output: aiOutput,
      }]);
    if (error) throw error;

    // Return the AI output
    return new Response(
      JSON.stringify({ success: true, data: aiOutput }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Edge Function Error:", error && (error.message || JSON.stringify(error)));
    return new Response(
      JSON.stringify({ success: false, error: error && (error.message || JSON.stringify(error)) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
}); 