
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface OutputSelectionProps {
  onSubmit: (selections: {
    createGoals: boolean;
    manualGoals?: { longTermGoal: string; objectives: string[] };
    createProtocol: boolean;
    createEngagement: boolean;
    createDataSheets: boolean;
  }) => void;
}

export const OutputSelection = ({ onSubmit }: OutputSelectionProps) => {
  const [createGoals, setCreateGoals] = useState(false);
  const [enterOwnGoals, setEnterOwnGoals] = useState(false);
  const [createProtocol, setCreateProtocol] = useState(false);
  const [createEngagement, setCreateEngagement] = useState(false);
  const [createDataSheets, setCreateDataSheets] = useState(false);
  
  const [longTermGoal, setLongTermGoal] = useState("");
  const [objectives, setObjectives] = useState(["", "", ""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selections: any = {
      createGoals,
      createProtocol,
      createEngagement,
      createDataSheets,
    };

    if (enterOwnGoals && longTermGoal.trim() && objectives.some(obj => obj.trim())) {
      selections.manualGoals = {
        longTermGoal: longTermGoal.trim(),
        objectives: objectives.filter(obj => obj.trim()),
      };
    }

    onSubmit(selections);
  };

  const updateObjective = (index: number, value: string) => {
    setObjectives(prev => prev.map((obj, i) => i === index ? value : obj));
  };

  const addObjective = () => {
    setObjectives(prev => [...prev, ""]);
  };

  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      setObjectives(prev => prev.filter((_, i) => i !== index));
    }
  };

  const hasSelections = createGoals || createProtocol || createEngagement || createDataSheets || enterOwnGoals;
  const canSubmit = hasSelections && (!enterOwnGoals || (longTermGoal.trim() && objectives.some(obj => obj.trim())));

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Select Outputs to Generate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="create-goals"
                checked={createGoals}
                onCheckedChange={(checked) => {
                  setCreateGoals(!!checked);
                  if (checked) setEnterOwnGoals(false);
                }}
              />
              <Label htmlFor="create-goals" className="text-sm font-medium">
                Create long-term goals and SMART objectives
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="enter-goals"
                checked={enterOwnGoals}
                onCheckedChange={(checked) => {
                  setEnterOwnGoals(!!checked);
                  if (checked) setCreateGoals(false);
                }}
              />
              <Label htmlFor="enter-goals" className="text-sm font-medium">
                I want to enter my own goals and objectives
              </Label>
            </div>

            {enterOwnGoals && (
              <div className="ml-6 space-y-4 p-4 bg-slate-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="longTermGoal">Long-term Goal</Label>
                  <Textarea
                    id="longTermGoal"
                    placeholder="Enter the long-term goal for this patient..."
                    value={longTermGoal}
                    onChange={(e) => setLongTermGoal(e.target.value)}
                    className="min-h-20 text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Short-term Objectives</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addObjective}
                      className="text-xs"
                    >
                      Add Objective
                    </Button>
                  </div>
                  
                  {objectives.map((objective, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder={`Objective ${index + 1}`}
                          value={objective}
                          onChange={(e) => updateObjective(index, e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      {objectives.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeObjective(index)}
                          className="text-xs"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Checkbox
                id="create-protocol"
                checked={createProtocol}
                onCheckedChange={(checked) => setCreateProtocol(!!checked)}
              />
              <Label htmlFor="create-protocol" className="text-sm font-medium">
                Create evidence-based treatment protocols with specifics (duration, frequency, targets, hierarchy, prompts, etc)
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="create-engagement"
                checked={createEngagement}
                onCheckedChange={(checked) => setCreateEngagement(!!checked)}
              />
              <Label htmlFor="create-engagement" className="text-sm font-medium">
                Create ideas for age appropriate implementation to make therapy fun and engaging (thematic materials, games, toys, manipulatives, etc)
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="create-data-sheets"
                checked={createDataSheets}
                onCheckedChange={(checked) => setCreateDataSheets(!!checked)}
              />
              <Label htmlFor="create-data-sheets" className="text-sm font-medium">
                Create spreadsheets that correspond with objectives for data collection
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={!canSubmit}
          >
            Generate Selected Outputs
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
