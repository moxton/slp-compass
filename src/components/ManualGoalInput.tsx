
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";

interface ManualGoalInputProps {
  onSubmit: (goals: { longTermGoal: string; objectives: string[] }) => void;
}

export const ManualGoalInput = ({ onSubmit }: ManualGoalInputProps) => {
  const [longTermGoal, setLongTermGoal] = useState("");
  const [objectives, setObjectives] = useState(["", "", ""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!longTermGoal.trim() || objectives.every(obj => !obj.trim())) {
      return;
    }

    const filteredObjectives = objectives.filter(obj => obj.trim());
    onSubmit({
      longTermGoal: longTermGoal.trim(),
      objectives: filteredObjectives,
    });
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

  const isFormValid = longTermGoal.trim() && objectives.some(obj => obj.trim());

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Manual Goal Input</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="longTermGoal">Long-term Goal</Label>
            <Textarea
              id="longTermGoal"
              placeholder="Enter the long-term goal for this patient..."
              value={longTermGoal}
              onChange={(e) => setLongTermGoal(e.target.value)}
              className="min-h-24 text-base"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Short-term Objectives</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addObjective}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
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
                    className="text-base"
                  />
                </div>
                {objectives.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeObjective(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={!isFormValid}
          >
            Generate Treatment Protocol & Engagement Ideas
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
