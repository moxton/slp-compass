
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisorderAreaInput } from "./DisorderAreaInput";

interface PatientBasicInfoProps {
  formData: {
    patientInitials: string;
    age: string;
    disorderArea: string;
    secondaryDisorderArea: string;
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
          <p className="text-xs text-gray-500">Use initials or pseudonyms only. Do not enter identifying info. Maximum 10 characters, letters and periods only.</p>
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
    </>
  );
};
