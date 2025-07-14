
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Copy, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { TherapyPlanData } from "@/types";

interface TherapyPlanProps {
  plan: TherapyPlanData;
  onNewPlan: () => void;
}

export const TherapyPlan = ({ plan, onNewPlan }: TherapyPlanProps) => {
  const { toast } = useToast();
  const [editablePlan] = useState(plan);

  // Helper for copy
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", description: "Text has been copied to your clipboard." });
  };

  // Helper to copy all
  const copyAllText = () => {
    let text = '';
    // Patient Summary
    text += `✅ Patient Summary\n`;
    text += `${editablePlan.patientSummary}\n\n`;
    // Deficit Cards
    editablePlan.deficitCards.forEach((card) => {
      text += `🗂️ Deficit: ${card.deficitName}\n`;
      text += `\n📈 Long-Term Goal:\n${card.longTermGoal}\n`;
      card.shortTermObjectives.forEach((objective) => {
        text += `- ${objective}\n`;
      });
      text += `\n📚 Evidence-Based Protocol:\n`;
      text += `- Name: ${card.evidenceBasedProtocol.name}\n`;
      text += `- Duration & Frequency: ${card.evidenceBasedProtocol.duration}, ${card.evidenceBasedProtocol.frequency}\n`;
      text += `- Example Targets: ${card.evidenceBasedProtocol.exampleTargets}\n`;
      text += `- Hierarchy: ${card.evidenceBasedProtocol.hierarchy}\n`;
      text += `- Cues & Fading: ${card.evidenceBasedProtocol.cuesAndFading}\n`;
      text += `- Citation: ${card.evidenceBasedProtocol.citation}\n`;
      text += `\n🎲 Engagement Ideas:\n`;
      card.engagementIdeas.forEach((idea) => {
        text += `- ${idea}\n`;
      });
      text += `\n`;
    });
    return text;
  };

  const formatDisorderArea = (area: string) => {
    return area.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto mt-0"> {/* reduced top margin */}
      {/* Header and patient info */}
      <div className="pt-0 pb-0"> {/* reduced top padding */}
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Generated Therapy Plan</h2> {/* reduced from mb-2 */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-semibold text-slate-700 flex flex-wrap items-center gap-2">
            {editablePlan.patientData.patientInitials && (
              <span>{editablePlan.patientData.patientInitials}</span>
            )}
            <span>Age {editablePlan.patientData.age}</span>
            {editablePlan.patientData.disorderArea && (
              <>
                <span>•</span>
                <span>Primary Disorder:</span>
                <span>{formatDisorderArea(editablePlan.patientData.disorderArea)}</span>
              </>
            )}
            {editablePlan.patientData.secondaryDisorderArea && (
              <>
                <span>•</span>
                <span>Secondary Disorder:</span>
                <span>{formatDisorderArea(editablePlan.patientData.secondaryDisorderArea)}</span>
              </>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={() => { copyToClipboard(copyAllText()); }}>
            <Copy className="w-4 h-4 mr-1" /> Copy All
          </Button>
        </div>
      </div>

      {/* Patient Summary Card */}
      <Card className="max-w-4xl mx-auto border bg-white/90 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <span className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <span role="img" aria-label="check">✅</span> Patient Summary
          </span>
          <Button size="sm" variant="outline" onClick={() => copyToClipboard(editablePlan.patientSummary)}>
            <Copy className="w-4 h-4 mr-1" /> Copy
          </Button>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
            {editablePlan.patientSummary}
          </p>
        </CardContent>
      </Card>

      {/* Deficit Cards */}
      {editablePlan.deficitCards.map((card) => (
        <Card key={card.id} className="max-w-4xl mx-auto border bg-white/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <span role="img" aria-label="deficit">🗂️</span> Deficit: {card.deficitName}
            </span>
            <Button size="sm" variant="outline" onClick={() => {
              const cardText = `🗂️ Deficit: ${card.deficitName}\n\n📈 Long-Term Goal:\n${card.longTermGoal}\n${card.shortTermObjectives.map(obj => `- ${obj}`).join('\n')}\n\n📚 Evidence-Based Protocol:\n- Name: ${card.evidenceBasedProtocol.name}\n- Duration & Frequency: ${card.evidenceBasedProtocol.duration}, ${card.evidenceBasedProtocol.frequency}\n- Example Targets: ${card.evidenceBasedProtocol.exampleTargets}\n- Hierarchy: ${card.evidenceBasedProtocol.hierarchy}\n- Cues & Fading: ${card.evidenceBasedProtocol.cuesAndFading}\n- Citation: ${card.evidenceBasedProtocol.citation}\n\n🎲 Engagement Ideas:\n${card.engagementIdeas.map(idea => `- ${idea}`).join('\n')}`;
              copyToClipboard(cardText);
            }}>
              <Copy className="w-4 h-4 mr-1" /> Copy
            </Button>
          </CardHeader>
          <CardContent className="pt-0 pb-4 space-y-6">
            {/* Long-Term Goal and Short-Term Objectives */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span role="img" aria-label="chart">📈</span>
                <span className="font-semibold text-lg text-slate-800">Long-Term Goal</span>
              </div>
              <div className="text-slate-700 leading-relaxed text-base font-medium mb-2">{card.longTermGoal}</div>
              <ul className="list-disc pl-8 space-y-1">
                {card.shortTermObjectives.map((objective, objIndex) => (
                  <li key={objIndex} className="text-slate-700 leading-relaxed">{objective}</li>
                ))}
              </ul>
            </div>

            {/* Evidence-Based Protocol */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span role="img" aria-label="book">📚</span>
                <span className="font-semibold text-lg text-slate-800">Evidence-Based Protocol</span>
              </div>
              <ul className="list-disc pl-8 space-y-1">
                <li><span className="font-medium text-slate-700">Name:</span> <span className="text-slate-700">{card.evidenceBasedProtocol.name}</span></li>
                <li><span className="font-medium text-slate-700">Duration & Frequency:</span> <span className="text-slate-700">{card.evidenceBasedProtocol.duration}, {card.evidenceBasedProtocol.frequency}</span></li>
                <li><span className="font-medium text-slate-700">Example Targets:</span> <span className="text-slate-700">{card.evidenceBasedProtocol.exampleTargets}</span></li>
                <li><span className="font-medium text-slate-700">Hierarchy:</span> <span className="text-slate-700">{card.evidenceBasedProtocol.hierarchy}</span></li>
                <li><span className="font-medium text-slate-700">Cues & Fading:</span> <span className="text-slate-700">{card.evidenceBasedProtocol.cuesAndFading}</span></li>
                <li><span className="font-medium text-slate-700">Citation:</span> <span className="text-slate-700">{card.evidenceBasedProtocol.citation}</span></li>
              </ul>
            </div>

            {/* Engagement Ideas */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span role="img" aria-label="dice">🎲</span>
                <span className="font-semibold text-lg text-slate-800">Engagement Ideas</span>
              </div>
              <ul className="list-disc pl-8 space-y-1">
                {card.engagementIdeas.map((idea, ideaIndex) => (
                  <li key={ideaIndex} className="text-slate-700 leading-relaxed">{idea}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* New Plan Button at Bottom */}
      <div className="flex justify-center mt-8">
        <Button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onNewPlan(); }} className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-4 rounded-md flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Plan
        </Button>
      </div>
    </div>
  );
};
