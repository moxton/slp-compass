
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, CheckCircle, Clock, Users, Copy, Plus, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditableOutput } from "./EditableOutput";
import type { TherapyPlanData } from "@/types";

interface TherapyPlanProps {
  plan: TherapyPlanData;
  onNewPlan: () => void;
}

export const TherapyPlan = ({ plan, onNewPlan }: TherapyPlanProps) => {
  const { toast } = useToast();
  const [editablePlan, setEditablePlan] = useState(plan);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  const formatDisorderArea = (area: string) => {
    return area.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const updateLongTermGoal = (newGoal: string) => {
    setEditablePlan(prev => ({ ...prev, longTermGoal: newGoal }));
  };

  const updateObjective = (index: number, newText: string) => {
    setEditablePlan(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => 
        i === index ? { ...obj, text: newText } : obj
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Generated Therapy Plan</h2>
          <p className="text-slate-600">
            Age {editablePlan.patientData.age} • {formatDisorderArea(editablePlan.patientData.disorderArea)}
            {editablePlan.patientData.secondaryDisorderArea && 
              ` • Secondary: ${formatDisorderArea(editablePlan.patientData.secondaryDisorderArea)}`
            }
          </p>
        </div>
        <Button onClick={onNewPlan} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Plan
        </Button>
      </div>

      {/* Long-term Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Long-term Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EditableOutput
            content={editablePlan.longTermGoal}
            onSave={updateLongTermGoal}
            minRows={3}
          />
        </CardContent>
      </Card>

      {/* SMART Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            SMART Objectives
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {editablePlan.objectives.map((objective, index) => (
            <div key={objective.id} className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  {index + 1}
                </Badge>
                <div className="flex-1">
                  <EditableOutput
                    content={objective.text}
                    onSave={(newText) => updateObjective(index, newText)}
                    minRows={2}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mt-4">
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-600">Specific:</span>
                      <p className="text-slate-700">{objective.specific}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-600">Measurable:</span>
                      <p className="text-slate-700">{objective.measurable}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-600">Achievable:</span>
                      <p className="text-slate-700">{objective.achievable}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-600">Relevant:</span>
                      <p className="text-slate-700">{objective.relevant}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-600">Time-bound:</span>
                      <p className="text-slate-700">{objective.timebound}</p>
                    </div>
                  </div>
                </div>
              </div>
              {index < editablePlan.objectives.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Treatment Protocol */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Evidence-based Treatment Protocol
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Duration & Frequency</h4>
              <p className="text-slate-700">{editablePlan.treatmentProtocol.duration}</p>
              <p className="text-slate-700">{editablePlan.treatmentProtocol.frequency}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Target Skills</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {editablePlan.treatmentProtocol.targets.map((target, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-slate-700">{target}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Treatment Hierarchy</h4>
            <div className="space-y-2">
              {editablePlan.treatmentProtocol.hierarchy.map((level, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">
                    {index + 1}
                  </Badge>
                  <span className="text-slate-700">{level}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Prompts & Scaffolding</h4>
            <div className="space-y-2">
              {editablePlan.treatmentProtocol.prompts.map((prompt, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{prompt}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-slate-800 mb-3">References & Evidence Base</h4>
            <div className="space-y-2">
              {editablePlan.treatmentProtocol.references.map((reference, index) => (
                <div key={index} className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{reference}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              onClick={() => copyToClipboard(
                `Duration & Frequency: ${editablePlan.treatmentProtocol.duration}, ${editablePlan.treatmentProtocol.frequency}\n\n` +
                `Target Skills:\n${editablePlan.treatmentProtocol.targets.map(t => `• ${t}`).join('\n')}\n\n` +
                `Treatment Hierarchy:\n${editablePlan.treatmentProtocol.hierarchy.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n` +
                `Prompts & Scaffolding:\n${editablePlan.treatmentProtocol.prompts.map(p => `• ${p}`).join('\n')}\n\n` +
                `References:\n${editablePlan.treatmentProtocol.references.map(r => `• ${r}`).join('\n')}`
              )}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Protocol
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
