
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Sparkles, PenTool } from "lucide-react";
import { DisorderAreaInput } from "./DisorderAreaInput";
import { ManualGoalInput } from "./ManualGoalInput";
import type { PatientData } from "@/types";

interface PatientInputProps {
  onSubmit: (data: PatientData) => void;
  onManualSubmit: (data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }) => void;
}

export const PatientInput = ({ onSubmit, onManualSubmit }: PatientInputProps) => {
  const [useManualGoals, setUseManualGoals] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    disorderArea: "",
    secondaryDisorderArea: "",
    description: "",
  });

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.age || !formData.disorderArea || !formData.description.trim()) {
      return;
    }

    onSubmit({
      age: parseInt(formData.age),
      disorderArea: formData.disorderArea,
      secondaryDisorderArea: formData.secondaryDisorderArea === 'none' ? undefined : formData.secondaryDisorderArea || undefined,
      description: formData.description.trim(),
    });
  };

  const handleManualGoalSubmit = (goals: { longTermGoal: string; objectives: string[] }) => {
    if (!formData.age || !formData.disorderArea || !formData.description.trim()) {
      return;
    }

    onManualSubmit({
      age: parseInt(formData.age),
      disorderArea: formData.disorderArea,
      secondaryDisorderArea: formData.secondaryDisorderArea === 'none' ? undefined : formData.secondaryDisorderArea || undefined,
      description: formData.description.trim(),
      manualGoals: goals,
    });
  };

  const isBasicFormValid = formData.age && formData.disorderArea && formData.description.trim();

  return (
    <div className="space-y-6">
      {/* Basic Patient Information */}
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Patient Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="2"
                  max="18"
                  placeholder="Enter age (2-18)"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="text-lg"
                />
              </div>

              <DisorderAreaInput
                label="Primary Disorder Area"
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

            <div className="space-y-2">
              <Label htmlFor="description">Patient Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the patient's symptoms, strengths, and specific needs. Include relevant background information, current abilities, and areas of concern."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-32 text-base"
              />
              <p className="text-sm text-slate-500">
                Provide detailed information to help generate more accurate therapy plans
              </p>
            </div>

            {/* Goal Input Toggle */}
            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
              <Switch
                id="manual-goals"
                checked={useManualGoals}
                onCheckedChange={setUseManualGoals}
              />
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-slate-600" />
                <Label htmlFor="manual-goals" className="text-sm font-medium">
                  I want to input my own goals and objectives
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Input Section */}
      {useManualGoals && isBasicFormValid ? (
        <ManualGoalInput onSubmit={handleManualGoalSubmit} />
      ) : !useManualGoals ? (
        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <Button
              onClick={handleAISubmit}
              className="w-full text-lg py-6"
              disabled={!isBasicFormValid}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Complete Therapy Plan
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};
