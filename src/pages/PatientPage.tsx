import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PatientInput } from "@/components/PatientInput";
import { TherapyPlan } from "@/components/TherapyPlan";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { generateTherapyPlan, generateTreatmentProtocol, ApiKeyError, RateLimitError, ValidationError } from "@/services/secureAiService";
import { saveTherapyPlan } from "@/services/secureStorageService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { PatientData, TherapyPlanData } from "@/types";

const CompassLogo = () => (
  <img src="/compass.svg" alt="Compass Logo" className="w-10 h-10 inline-block align-middle mr-2" />
);

const PatientPage = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'loading' | 'output'>('input');
  const [therapyPlan, setTherapyPlan] = useState<TherapyPlanData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGeneratePlan = async (patientData: PatientData) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to generate therapy plans.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setCurrentStep('loading');
    try {
      const plan = await generateTherapyPlan(patientData);
      setTherapyPlan(plan);
      saveTherapyPlan(plan);
      setCurrentStep('output');
      toast({
        title: "Therapy Plan Generated",
        description: "Your individualized therapy plan has been created successfully.",
      });
    } catch (error) {
      let errorMessage = "Failed to generate therapy plan. Please try again.";
      if (error instanceof ApiKeyError) {
        errorMessage = "API configuration error. Please check your setup.";
      } else if (error instanceof RateLimitError) {
        errorMessage = "Too many requests. Please wait a moment before trying again.";
      } else if (error instanceof ValidationError) {
        errorMessage = "Invalid input data. Please check your form entries.";
      }
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setCurrentStep('input');
    }
  };

  const handleManualGoalSubmit = async (data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to generate treatment protocols.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setCurrentStep('loading');
    try {
      const plan = await generateTreatmentProtocol(data);
      setTherapyPlan(plan);
      saveTherapyPlan(plan);
      setCurrentStep('output');
      toast({
        title: "Treatment Protocol Generated",
        description: "Your treatment protocol and engagement ideas have been created successfully.",
      });
    } catch (error) {
      let errorMessage = "Failed to generate treatment protocol. Please try again.";
      if (error instanceof ApiKeyError) {
        errorMessage = "API configuration error. Please check your setup.";
      } else if (error instanceof RateLimitError) {
        errorMessage = "Too many requests. Please wait a moment before trying again.";
      } else if (error instanceof ValidationError) {
        errorMessage = "Invalid input data. Please check your form entries.";
      }
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setCurrentStep('input');
    }
  };

  const handleNewPlan = () => {
    setCurrentStep('input');
    setTherapyPlan(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-blue-600 mb-4 flex items-center justify-center gap-3">
              <CompassLogo />
              <span>SLP Compass</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Effortless, evidence-based therapy planning for speech-language pathologists
            </p>
          </div>
          {currentStep === 'input' && (
            <PatientInput 
              onSubmit={handleGeneratePlan}
              onManualSubmit={handleManualGoalSubmit}
            />
          )}
          {currentStep === 'loading' && <LoadingSpinner />}
          {currentStep === 'output' && therapyPlan && (
            <TherapyPlan 
              plan={therapyPlan} 
              onNewPlan={handleNewPlan}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientPage; 