
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ManualGoalsSectionProps {
  longTermGoal: string;
  setLongTermGoal: (value: string) => void;
  objectives: string[];
  updateObjective: (index: number, value: string) => void;
  addObjective: () => void;
  removeObjective: (index: number) => void;
}

export const ManualGoalsSection = ({
  longTermGoal,
  setLongTermGoal,
  objectives,
  updateObjective,
  addObjective,
  removeObjective,
}: ManualGoalsSectionProps) => {
  return (
    <div className="ml-6 space-y-4 p-4 bg-slate-50 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="longTermGoal">Long-term Goal</Label>
        <Textarea
          id="longTermGoal"
          placeholder="Enter the long-term goal for this patient..."
          value={longTermGoal}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 1000) {
              setLongTermGoal(value);
            }
          }}
          className="min-h-20 text-sm"
          maxLength={1000}
        />
        <p className="text-xs text-gray-500">{longTermGoal.length}/1000 characters</p>
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
            disabled={objectives.length >= 10}
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
                maxLength={500}
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
  );
};
