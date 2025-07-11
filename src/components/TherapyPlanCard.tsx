
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { TherapyPlanData } from "@/types";

interface TherapyPlanCardProps {
  plan: TherapyPlanData;
}

export const TherapyPlanCard = ({ plan }: TherapyPlanCardProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Therapy plan has been copied to your clipboard.",
    });
  };

  const formatDisorderArea = (area: string) => {
    return area.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFullPlanText = () => {
    return `THERAPY PLAN\n\n` +
           `Patient: Age ${plan.patientData.age}\n` +
           `Disorder Area: ${formatDisorderArea(plan.patientData.disorderArea)}\n\n` +
           `LONG-TERM GOAL:\n${plan.longTermGoal}\n\n` +
           `SMART OBJECTIVES:\n${plan.objectives.map((obj, i) => `${i + 1}. ${obj.text}`).join('\n')}\n\n` +
           `TREATMENT PROTOCOL:\n` +
           `Duration & Frequency: ${plan.treatmentProtocol.duration}, ${plan.treatmentProtocol.frequency}\n\n` +
           `Target Skills:\n${plan.treatmentProtocol.targets.map(t => `• ${t}`).join('\n')}\n\n` +
           `Treatment Hierarchy:\n${plan.treatmentProtocol.hierarchy.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n` +
           `Prompts & Scaffolding:\n${plan.treatmentProtocol.prompts.map(p => `• ${p}`).join('\n')}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-xl">
              Age {plan.patientData.age} • {formatDisorderArea(plan.patientData.disorderArea)}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              {formatDate(plan.createdAt)}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(getFullPlanText())}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div>
          <p className="text-sm text-slate-600 mb-2">Long-term Goal:</p>
          <p className="text-slate-700 font-medium">
            {plan.longTermGoal}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {plan.objectives.length} Objectives
          </Badge>
          <Badge variant="outline">
            {plan.treatmentProtocol.targets.length} Target Skills
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
