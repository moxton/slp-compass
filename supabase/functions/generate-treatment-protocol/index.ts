import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
// goals not provided in this function //
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
      primaryDisorderArea,
      secondaryDisorderArea,
      description
    } = patientData;

    const prompt = `
You are an expert pediatric speech-language pathologist (SLP) with at least 10 years of clinical experience, deep knowledge of evidence-based and developmentally appropriate practices, and a commitment to clear, detailed, actionable documentation suitable for IEPs and progress reports.

PATIENT INFO:
- Age: ${age}
- Primary Disorder Area: ${primaryDisorderArea}
${secondaryDisorderArea ? `- Secondary Disorder Area: ${secondaryDisorderArea}` : ""}
- Description: ${description}
- Existing Long-Term Goal: ${manualGoals.longTermGoal}
- Existing Objectives: ${manualGoals.objectives.join("; ")}

TASKS:
Based on the information and user-provided goals/objectives:

1️⃣ For EACH deficit area and its corresponding user-provided long-term goal:
- Create a separate, clearly labeled evidence-based treatment protocol.
  - Name the protocol (Example protocols - Van Riper, Cycles, minimal pairs, maximal opposition, etc - those are just some examples to give you context for what I mean).
  - For each protocol created, include: example targets, a detailed treatment hierarchy with clear criteria for advancement and generalization, explicit fading instructions (describe when and how to fade supports as accuracy improves), and at least one peer-reviewed source.

2️⃣ Provide 3 creative, age-appropriate, specific engagement ideas. Each idea must describe the actual activity, not just a theme. Include materials or props if helpful. Be specific and detailed and creative. 

3️⃣ Write a short, 2–3 sentence patient summary, including how family/teachers can support generalization.

✅ MUST-HAVES:
- Never blend protocols across deficits.
- Use precise clinical terminology. Do not oversimplify.
- Identify and address all relevant subcategories or error patterns for the disorder area. For example, for /r/ articulation, distinguish between postvocalic /r/ and /r/ blends if age-appropriate.
- Do not oversimplify. Be detailed and specific and reference the user input as much as possible. 
- Ensure all recommendations are consistent with current clinical standards for pediatric SLP.

Please provide your response as a JSON object with the following structure:
{
  "treatmentProtocols": [
    {
      "deficitArea": "...",
      "name": "...",
      "targets": ["..."],
      "hierarchy": ["..."],
      "fadingSupports": "...",
      "references": ["..."]
    }
  ],
  "engagementIdeas": ["...", "...", "..."],
  "summary": "..."
}
`;

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
          { role: "system", content: "You are an expert SLP creating therapy plans." },
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
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in AI response");
    const aiOutput = JSON.parse(jsonMatch[0]);

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
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
}); 