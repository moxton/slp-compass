
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle } from "lucide-react";
import { DisorderAreaInput } from "./DisorderAreaInput";
import { validatePatientData, validateManualGoals, ValidationError } from "@/utils/validation";
import { useToast } from "@/hooks/use-toast";
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { toast } = useToast();

  const updateObjective = (index: number, value: string) => {
    // Limit objective length for security
    if (value.length > 500) {
      toast({
        title: "Input Too Long",
        description: "Each objective must be less than 500 characters.",
        variant: "destructive",
      });
      return;
    }
    setObjectives(prev => prev.map((obj, i) => i === index ? value : obj));
  };

  const addObjective = () => {
    if (objectives.length >= 10) {
      toast({
        title: "Maximum Objectives Reached",
        description: "You can add a maximum of 10 objectives.",
        variant: "destructive",
      });
      return;
    }
    setObjectives(prev => [...prev, ""]);
  };

  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      setObjectives(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    setValidationErrors([]);

    // Basic form validation
    if (!formData.age || parseInt(formData.age) < 2 || parseInt(formData.age) > 18) {
      errors.push("Patient age must be between 2 and 18 years");
    }

    if (!formData.disorderArea) {
      errors.push("Primary disorder area is required");
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errors.push("Patient description must be at least 10 characters");
    }

    if (formData.description.length > 2000) {
      errors.push("Patient description must be less than 2000 characters");
    }

    if (!goalOption) {
      errors.push("Please select how you want to handle goals and objectives");
    }

    if (goalOption === "manual") {
      if (!longTermGoal.trim() || longTermGoal.trim().length < 10) {
        errors.push("Long-term goal must be at least 10 characters");
      }
      if (longTermGoal.length > 1000) {
        errors.push("Long-term goal must be less than 1000 characters");
      }
      if (!objectives.some(obj => obj.trim())) {
        errors.push("At least one objective is required");
      }
    }

    if (!createProtocol && !createEngagement && !createDataSheets && !goalOption) {
      errors.push("Please select at least one output to generate");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return false;
    }

    return true;
  };

  const isBasicFormValid = formData.age && formData.disorderArea && formData.description.trim();
  const hasSelections = goalOption || createProtocol || createEngagement || createDataSheets;
  const canSubmit = isBasicFormValid && hasSelections && 
    (goalOption !== "manual" || (longTermGoal.trim() && objectives.some(obj => obj.trim())));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Ensure all required fields are properly typed and validated
      if (!formData.age || !formData.disorderArea || !formData.description.trim()) {
        throw new ValidationError("Required fields are missing");
      }

      // Create PatientData with explicit required properties
      const patientData: PatientData = {
        age: parseInt(formData.age),
        disorderArea: formData.disorderArea,
        secondaryDisorderArea: formData.secondaryDisorderArea === 'none' ? undefined : formData.secondaryDisorderArea || undefined,
        description: formData.description.trim(),
        patientInitials: formData.patientInitials || undefined,
      };

      // Validate using our secure validation utility
      const validatedPatientData = validatePatientData(patientData);

      if (goalOption === "manual" && longTermGoal.trim() && objectives.some(obj => obj.trim())) {
        // Ensure manual goals have required values
        if (!longTermGoal.trim()) {
          throw new ValidationError("Long-term goal is required");
        }
        
        const filteredObjectives = objectives.filter(obj => obj.trim());
        if (filteredObjectives.length === 0) {
          throw new ValidationError("At least one objective is required");
        }

        // Create manual goals with explicit required properties
        const manualGoals: { longTermGoal: string; objectives: string[] } = {
          longTermGoal: longTermGoal.trim(),
          objectives: filteredObjectives,
        };

        // Validate manual goals
        const validatedManualGoals = validateManualGoals(manualGoals);

        onManualSubmit({
          ...validatedPatientData,
          manualGoals: validatedManualGoals,
        });
      } else {
        onSubmit(validatedPatientData);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        toast({
          title: "Invalid Input",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
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
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
            </div>
            <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

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
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 10) {
                    setFormData(prev => ({ ...prev, patientInitials: value }));
                  }
                }}
                className="text-lg h-12"
                maxLength={10}
              />
              <p className="text-xs text-gray-500">Maximum 10 characters, letters and periods only</p>
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
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 2000) {
                  setFormData(prev => ({ ...prev, description: value }));
                }
              }}
              className="min-h-32 text-base resize-none"
              maxLength={2000}
              required
            />
            <p className="text-sm text-slate-500">
              Provide detailed information to help generate more accurate therapy plans ({formData.description.length}/2000 characters)
            </p>
          </div>

          {/* Output Selection Section */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-6">Select Outputs to Generate</h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <RadioGroup value={goalOption} onValueChange={setGoalOption}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="create" id="create-goals" />
                    <Label htmlFor="create-goals" className="text-sm font-medium">
                      Create long-term goals and SMART objectives
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual-goals" />
                    <Label htmlFor="manual-goals" className="text-sm font-medium">
                      I want to enter my own goals and objectives
                    </Label>
                  </div>
                </RadioGroup>

                {goalOption === "manual" && (
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
