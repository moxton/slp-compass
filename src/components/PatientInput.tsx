
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import type { PatientData } from "@/types";

interface PatientInputProps {
  onSubmit: (data: PatientData) => void;
}

const disorderAreas = [
  { value: "articulation-phonology", label: "Articulation/Phonology" },
  { value: "fluency", label: "Fluency" },
  { value: "expressive-language", label: "Expressive Language" },
  { value: "receptive-language", label: "Receptive Language" },
  { value: "social-pragmatics", label: "Social-Pragmatics" },
  { value: "executive-function", label: "Executive Function" },
  { value: "literacy", label: "Literacy" },
];

export const PatientInput = ({ onSubmit }: PatientInputProps) => {
  const [formData, setFormData] = useState({
    age: "",
    disorderArea: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.age || !formData.disorderArea || !formData.description.trim()) {
      return;
    }

    onSubmit({
      age: parseInt(formData.age),
      disorderArea: formData.disorderArea,
      description: formData.description.trim(),
    });
  };

  const isFormValid = formData.age && formData.disorderArea && formData.description.trim();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="space-y-2">
              <Label htmlFor="disorder">Primary Disorder Area</Label>
              <Select
                value={formData.disorderArea}
                onValueChange={(value) => setFormData(prev => ({ ...prev, disorderArea: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select disorder area" />
                </SelectTrigger>
                <SelectContent>
                  {disorderAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={!isFormValid}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Therapy Plan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
