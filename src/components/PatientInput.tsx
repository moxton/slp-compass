
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { DisorderAreaInput } from "./DisorderAreaInput";
import type { PatientData } from "@/types";

interface PatientInputProps {
  onSubmit: (data: PatientData) => void;
  onManualSubmit: (data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }) => void;
}

export const PatientInput = ({ onSubmit, onManualSubmit }: PatientInputProps) => {
  const [formData, setFormData] = useState({
    patientInitials: "",
    age: "",
    disorderArea: "",
    secondaryDisorderArea: "",
    description: "",
  });

  const [goalOption, setGoalOption] = useState<string>("");
  const [longTermGoal, setLongTermGoal] = useState("");
  const [objectives, setObjectives] = useState(["", "", ""]);
  const [createProtocol, setCreateProtocol] = useState(false);
  const [createEngagement, setCreateEngagement] = useState(false);
  const [createDataSheets, setCreateDataSheets] = useState(false);

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

  const isBasicFormValid = formData.age && formData.disorderArea && formData.description.trim();
  const hasSelections = goalOption || createProtocol || createEngagement || createDataSheets;
  const canSubmit = isBasicFormValid && hasSelections && 
    (goalOption !== "manual" || (longTermGoal.trim() && objectives.some(obj => obj.trim())));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) return;

    const patientData: PatientData = {
      age: parseInt(formData.age),
      disorderArea: formData.disorderArea,
      secondaryDisorderArea: formData.secondaryDisorderArea === 'none' ? undefined : formData.secondaryDisorderArea || undefined,
      description: formData.description.trim(),
      patientInitials: formData.patientInitials || undefined,
    };

    if (goalOption === "manual" && longTermGoal.trim() && objectives.some(obj => obj.trim())) {
      onManualSubmit({
        ...patientData,
        manualGoals: {
          longTermGoal: longTermGoal.trim(),
          objectives: objectives.filter(obj => obj.trim()),
        },
      });
    } else {
      onSubmit(patientData);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Top row - Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="initials">Patient Initials (Optional)</Label>
              <Input
                id="initials"
                type="text"
                placeholder="e.g. J.S."
                value={formData.patientInitials}
                onChange={(e) => setFormData(prev => ({ ...prev, patientInitials: e.target.value }))}
                className="text-lg h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Patient Age *</Label>
              <Input
                id="age"
                type="number"
                min="2"
                max="18"
                placeholder="Enter age (2-18)"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="text-lg h-12"
                required
              />
            </div>
          </div>

          {/* Middle row - Disorder areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DisorderAreaInput
              label="Primary Disorder Area *"
              value={formData.disorderArea}
              onChange={(value) => setFormData(prev => ({ ...prev, disorderArea: value }))}
              placeholder="Select primary disorder area"
            />

            <DisorderAreaInput
              label="Secondary Disorder Area"
              value={formData.secondaryDisorderArea}
              onChange={(value) => setFormData(prev => ({ ...prev, secondaryDisorderArea: value }))}
              placeholder="Select secondary area (optional)"
              includeNone={true}
            />
          </div>

          {/* Bottom section - Description */}
          <div className="space-y-3">
            <Label htmlFor="description">Patient Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the patient's symptoms, strengths, and specific needs. Include relevant background information, current abilities, and areas of concern."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-32 text-base resize-none"
              required
            />
            <p className="text-sm text-slate-500">
              Provide detailed information to help generate more accurate therapy plans
            </p>
          </div>

          {/* Output Selection Section */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-6">Select Outputs to Generate</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Goals and Objectives</Label>
                <Select value={goalOption} onValueChange={setGoalOption}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose an option for goals and objectives" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create">Create long-term goals and SMART objectives</SelectItem>
                    <SelectItem value="manual">I want to enter my own goals and objectives</SelectItem>
                  </SelectContent>
                </Select>

                {goalOption === "manual" && (
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
          </div>

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
