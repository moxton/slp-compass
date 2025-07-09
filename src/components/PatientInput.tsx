
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { DisorderAreaInput } from "./DisorderAreaInput";
import { OutputSelection } from "./OutputSelection";
import type { PatientData } from "@/types";

interface PatientInputProps {
  onSubmit: (data: PatientData) => void;
  onManualSubmit: (data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }) => void;
}

export const PatientInput = ({ onSubmit, onManualSubmit }: PatientInputProps) => {
  const [showOutputSelection, setShowOutputSelection] = useState(false);
  const [formData, setFormData] = useState({
    patientInitials: "",
    age: "",
    disorderArea: "",
    secondaryDisorderArea: "",
    description: "",
  });

  const handleOutputSelection = (selections: any) => {
    if (!formData.age || !formData.disorderArea || !formData.description.trim()) {
      return;
    }

    const patientData: PatientData = {
      age: parseInt(formData.age),
      disorderArea: formData.disorderArea,
      secondaryDisorderArea: formData.secondaryDisorderArea === 'none' ? undefined : formData.secondaryDisorderArea || undefined,
      description: formData.description.trim(),
      patientInitials: formData.patientInitials || undefined,
    };

    if (selections.manualGoals) {
      onManualSubmit({
        ...patientData,
        manualGoals: selections.manualGoals,
      });
    } else {
      onSubmit(patientData);
    }
  };

  const isBasicFormValid = formData.age && formData.disorderArea && formData.description.trim();

  const handleBasicFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBasicFormValid) {
      setShowOutputSelection(true);
    }
  };

  if (showOutputSelection) {
    return (
      <div className="space-y-6">
        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600 mb-4">
              <strong>Patient:</strong> {formData.patientInitials || 'Not specified'} | 
              <strong> Age:</strong> {formData.age} | 
              <strong> Primary Area:</strong> {formData.disorderArea}
              {formData.secondaryDisorderArea && formData.secondaryDisorderArea !== 'none' && (
                <span> | <strong>Secondary Area:</strong> {formData.secondaryDisorderArea}</span>
              )}
            </div>
            <button
              onClick={() => setShowOutputSelection(false)}
              className="text-blue-600 text-sm hover:underline"
            >
              ← Edit patient information
            </button>
          </CardContent>
        </Card>
        <OutputSelection onSubmit={handleOutputSelection} />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBasicFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="initials">Patient Initials (Optional)</Label>
              <Input
                id="initials"
                type="text"
                placeholder="e.g. J.S."
                value={formData.patientInitials}
                onChange={(e) => setFormData(prev => ({ ...prev, patientInitials: e.target.value }))}
                className="text-lg"
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
                className="text-lg"
                required
              />
            </div>

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

          <div className="space-y-2">
            <Label htmlFor="description">Patient Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the patient's symptoms, strengths, and specific needs. Include relevant background information, current abilities, and areas of concern."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-32 text-base"
              required
            />
            <p className="text-sm text-slate-500">
              Provide detailed information to help generate more accurate therapy plans
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isBasicFormValid}
          >
            Continue to Output Selection
          </button>
        </form>
      </CardContent>
    </Card>
  );
};
