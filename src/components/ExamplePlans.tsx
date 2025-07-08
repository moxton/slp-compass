
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, BookOpen, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { examplePlans } from "@/data/examplePlans";

export const ExamplePlans = () => {
  const { toast } = useToast();

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Example plan has been copied to your clipboard.",
    });
  };

  const formatDisorderArea = (area: string) => {
    return area.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getFullPlanText = (plan: any) => {
    return `EXAMPLE THERAPY PLAN - ${formatDisorderArea(plan.disorderArea).toUpperCase()}\n\n` +
           `LONG-TERM GOAL:\n${plan.longTermGoal}\n\n` +
           `OBJECTIVES:\n${plan.objectives.map((obj: string, i: number) => `${i + 1}. ${obj}`).join('\n')}\n\n` +
           `TREATMENT PROTOCOL:\n` +
           `Duration & Frequency: ${plan.treatmentProtocol.duration}, ${plan.treatmentProtocol.frequency}\n\n` +
           `Target Skills:\n${plan.treatmentProtocol.targets.map((t: string) => `• ${t}`).join('\n')}\n\n` +
           `ENGAGEMENT IDEAS:\n${plan.engagementIdeas.map((idea: string) => `• ${idea}`).join('\n')}\n\n` +
           `REFERENCES:\n${plan.treatmentProtocol.references.map((r: string) => `• ${r}`).join('\n')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Example Therapy Plans & Goal Bank
        </h2>
        <p className="text-slate-600">
          Browse sample goals and treatment protocols to get started quickly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examplePlans.map((plan, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    {formatDisorderArea(plan.disorderArea)}
                  </CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    Example Plan
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(getFullPlanText(plan))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Long-term Goal:</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">
                  {plan.longTermGoal}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Sample Objectives:</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  {plan.objectives.slice(0, 2).map((objective, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Treatment Focus:</h4>
                <div className="flex flex-wrap gap-1">
                  {plan.treatmentProtocol.targets.slice(0, 3).map((target, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {target}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Engagement Ideas:</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  {plan.engagementIdeas.slice(0, 2).map((idea, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">References:</h4>
                <div className="space-y-1">
                  {plan.treatmentProtocol.references.map((ref, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ExternalLink className="w-3 h-3 text-slate-500 mt-1 flex-shrink-0" />
                      <p className="text-xs text-slate-600">{ref}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
