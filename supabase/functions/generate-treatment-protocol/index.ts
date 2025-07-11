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

    const { patientData, manualGoals } = await req.json();
    const {
      age,
      disorderArea,
      secondaryDisorderArea,
      deficits,
      specificErrors,
      strengths,
      hobbies,
      additionalDetails,
      patientInitials
    } = patientData;

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

Long-term Goal: ${manualGoals.longTermGoal}

Short-term Objectives:
${manualGoals.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

---

Please provide an evidence-based treatment protocol and engagement ideas for this goal.

**CRITICAL: You must respond with valid JSON only. Use this exact structure:**

{
  "patientSummary": "2-3 sentence summary of how this goal will improve communication and how family/teachers can help",
  "deficitCards": [
    {
      "deficitName": "Goal Area",
      "longTermGoal": "${manualGoals.longTermGoal}",
      "shortTermObjectives": ${JSON.stringify(manualGoals.objectives)},
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

    // Call OpenAI
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: "You are an expert SLP creating therapy plans. You must respond with valid JSON only." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!openaiResponse.ok) throw new Error(`OpenAI error: ${openaiResponse.statusText}`);
    const openaiData = await openaiResponse.json();
    const aiContent = openaiData.choices[0]?.message?.content;

    // Parse AI response (extract JSON)
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
        patient_data: { ...patientData, manualGoals },
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