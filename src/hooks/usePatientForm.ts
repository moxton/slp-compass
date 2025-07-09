
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validatePatientData, validateManualGoals, ValidationError } from "@/utils/validation";
import type { PatientData } from "@/types";

interface PatientInputProps {
  onSubmit: (data: PatientData) => void;
  onManualSubmit: (data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }) => void;
}

export const usePatientForm = ({ onSubmit, onManualSubmit }: PatientInputProps) => {
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
      if (!formData.age || !formData.disorderArea || !formData.description.trim()) {
        throw new ValidationError("Required fields are missing");
      }

      const patientData: PatientData = {
        age: parseInt(formData.age),
        disorderArea: formData.disorderArea,
        secondaryDisorderArea: formData.secondaryDisorderArea === 'none' ? undefined : formData.secondaryDisorderArea || undefined,
        description: formData.description.trim(),
        patientInitials: formData.patientInitials || undefined,
      };

      const validatedPatientData = validatePatientData(patientData);

      if (goalOption === "manual" && longTermGoal.trim() && objectives.some(obj => obj.trim())) {
        if (!longTermGoal.trim()) {
          throw new ValidationError("Long-term goal is required");
        }
        
        const filteredObjectives = objectives.filter(obj => obj.trim());
        if (filteredObjectives.length === 0) {
          throw new ValidationError("At least one objective is required");
        }

        const manualGoals = {
          longTermGoal: longTermGoal.trim(),
          objectives: filteredObjectives,
        };

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

  const isBasicFormValid = formData.age && formData.disorderArea && formData.description.trim();
  const hasSelections = goalOption || createProtocol || createEngagement || createDataSheets;
  const canSubmit = isBasicFormValid && hasSelections && 
    (goalOption !== "manual" || (longTermGoal.trim() && objectives.some(obj => obj.trim())));

  return {
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
  };
};
