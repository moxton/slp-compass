
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { usePatientForm } from "@/hooks/usePatientForm";
import { ValidationErrors } from "./ValidationErrors";
import { PatientBasicInfo } from "./PatientBasicInfo";
import { PatientDescription } from "./PatientDescription";
import { OutputSelectionSection } from "./OutputSelectionSection";
import type { PatientData } from "@/types";

interface PatientInputProps {
  onSubmit: (data: PatientData) => void;
  onManualSubmit: (data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }) => void;
}

export const PatientInput = ({ onSubmit, onManualSubmit }: PatientInputProps) => {
  const {
    formData,
    setFormData,
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
    validationErrors,
    handleSubmit,
    canSubmit,
  } = usePatientForm({ onSubmit, onManualSubmit });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ValidationErrors errors={validationErrors} />

        <form onSubmit={handleSubmit} className="space-y-8">
          <PatientBasicInfo formData={formData} setFormData={setFormData} />
          
          <PatientDescription 
            description={formData.description} 
            setFormData={setFormData} 
          />

          <OutputSelectionSection
            goalOption={goalOption}
            setGoalOption={setGoalOption}
            longTermGoal={longTermGoal}
            setLongTermGoal={setLongTermGoal}
            objectives={objectives}
            updateObjective={updateObjective}
            addObjective={addObjective}
            removeObjective={removeObjective}
            createProtocol={createProtocol}
            setCreateProtocol={setCreateProtocol}
            createEngagement={createEngagement}
            setCreateEngagement={setCreateEngagement}
            createDataSheets={createDataSheets}
            setCreateDataSheets={setCreateDataSheets}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            disabled={!canSubmit}
          >
            Generate Selected Outputs
          </button>
        </form>
      </CardContent>
    </Card>
  );
};
