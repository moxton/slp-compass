
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisorderAreaInput } from "./DisorderAreaInput";
import { Textarea } from "@/components/ui/textarea";

interface PatientBasicInfoProps {
  formData: {
    patientInitials: string;
    age: string;
    disorderArea: string;
    secondaryDisorderArea: string;
    deficits: string;
    specificErrors: string;
    strengths: string;
    hobbies: string;
    additionalDetails: string;
  };
  setFormData: (updater: (prev: any) => any) => void;
}

export const PatientBasicInfo = ({ formData, setFormData }: PatientBasicInfoProps) => {
  return (
    <>
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
              let value = e.target.value;
              // Only allow letters and periods
              value = value.replace(/[^a-zA-Z.]/g, "");
              if (value.length <= 10) {
                setFormData(prev => ({ ...prev, patientInitials: value }));
              }
            }}
            className="text-lg h-12"
            maxLength={10}
          />
          <p className="text-xs text-gray-500">Maximum 10 characters. Letters and periods only.</p>
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

      {/* New fields for deficits, errors, strengths, hobbies, additional details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-2">
          <Label htmlFor="deficits">Deficits</Label>
          <Textarea
            id="deficits"
            placeholder="e.g. Fronting, cluster reduction, mild stopping, etc."
            value={formData.deficits}
            onChange={e => setFormData(prev => ({ ...prev, deficits: e.target.value }))}
            className="min-h-20 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specificErrors">Specific Errors</Label>
          <Textarea
            id="specificErrors"
            placeholder="e.g. /k/ for /t/, omits /s/ in ‘stop’"
            value={formData.specificErrors}
            onChange={e => setFormData(prev => ({ ...prev, specificErrors: e.target.value }))}
            className="min-h-20 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="strengths">Strengths</Label>
          <Textarea
            id="strengths"
            placeholder="e.g. Highly verbal, social, etc."
            value={formData.strengths}
            onChange={e => setFormData(prev => ({ ...prev, strengths: e.target.value }))}
            className="min-h-20 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hobbies">Hobbies & Interests</Label>
          <Textarea
            id="hobbies"
            placeholder="e.g. Dinosaurs, cars, baseball, puzzles, etc."
            value={formData.hobbies}
            onChange={e => setFormData(prev => ({ ...prev, hobbies: e.target.value }))}
            className="min-h-20 text-base"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="additionalDetails">Any additional details that are relevant?</Label>
          <Textarea
            id="additionalDetails"
            placeholder="e.g. Functional impact, parent/teacher input, etc."
            value={formData.additionalDetails}
            onChange={e => setFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
            className="min-h-20 text-base"
          />
        </div>
      </div>
    </>
  );
};
