
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ManualGoalsSection } from "./ManualGoalsSection";

interface OutputSelectionSectionProps {
  goalOption: string;
  setGoalOption: (value: string) => void;
  longTermGoal: string;
  setLongTermGoal: (value: string) => void;
  objectives: string[];
  updateObjective: (index: number, value: string) => void;
  addObjective: () => void;
  removeObjective: (index: number) => void;
  createProtocol: boolean;
  setCreateProtocol: (value: boolean) => void;
  createEngagement: boolean;
  setCreateEngagement: (value: boolean) => void;
  createDataSheets: boolean;
  setCreateDataSheets: (value: boolean) => void;
}

export const OutputSelectionSection = ({
  goalOption,
  setGoalOption,
  longTermGoal,
  setLongTermGoal,
  objectives,
  updateObjective,
  addObjective,
  removeObjective,
  createProtocol,
  setCreateProtocol,
  createEngagement,
  setCreateEngagement,
  createDataSheets,
  setCreateDataSheets,
}: OutputSelectionSectionProps) => {
  return (
    <div className="border-t pt-8">
      <h3 className="text-lg font-semibold mb-6">Select Outputs to Generate</h3>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="create-goals"
            checked={goalOption === 'create'}
            onCheckedChange={(checked) => setGoalOption(checked ? 'create' : '')}
          />
          <Label htmlFor="create-goals" className="text-sm font-medium">
            Create long-term goals and SMART objectives
          </Label>
        </div>

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

        <div className="flex items-center space-x-3 opacity-50 cursor-not-allowed">
          <Checkbox
            id="create-data-sheets"
            checked={createDataSheets}
            onCheckedChange={() => {}}
            disabled
          />
          <Label htmlFor="create-data-sheets" className="text-sm font-medium">
            Create spreadsheets that correspond with objectives for data collection
            <span className="text-red-600 font-semibold ml-2">(Coming Soon)</span>
          </Label>
        </div>
      </div>
    </div>
  );
};
