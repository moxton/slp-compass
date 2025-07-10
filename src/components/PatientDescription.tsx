
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PatientDescriptionProps {
  description: string;
  setFormData: (updater: (prev: any) => any) => void;
}

export const PatientDescription = ({ description, setFormData }: PatientDescriptionProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="description">Patient Description *</Label>
      <Textarea
        id="description"
<<<<<<< HEAD
        placeholder="Describe the patient using the guidelines below."
=======
        placeholder="Describe the patient's symptoms, strengths, and specific needs. Include relevant background information, current abilities, and areas of concern."
>>>>>>> 794405e8a914d62f126e1039bf32d31ac0ace405
        value={description}
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
<<<<<<< HEAD
        Consider symptoms, deficits, strengths, abilities, specific needs, relevant parent or teacher input, relevant background information, hobbies, and interests. Provide detailed information to help generate more accurate therapy plans ({description.length}/2000 characters)
=======
        Provide detailed information to help generate more accurate therapy plans ({description.length}/2000 characters)
>>>>>>> 794405e8a914d62f126e1039bf32d31ac0ace405
      </p>
    </div>
  );
};
