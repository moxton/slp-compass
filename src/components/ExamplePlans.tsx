
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink } from "lucide-react";
import { examplePlans } from "@/data/examplePlans";

export const ExamplePlans = () => {
  const formatDisorderArea = (area: string) => {
    return area.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Example Therapy Plans
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examplePlans.map((plan, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <div>Example Plan</div>
                      <div className="text-sm font-normal text-slate-600">
                        ({formatDisorderArea(plan.disorderArea)})
                      </div>
                    </div>
                  </CardTitle>
                </div>
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
