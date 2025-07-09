
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PatientInput } from "@/components/PatientInput";
import { TherapyPlan } from "@/components/TherapyPlan";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ExamplePlans } from "@/components/ExamplePlans";
import { generateTherapyPlan, generateTreatmentProtocol } from "@/services/aiService";
import { saveTherapyPlan } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";
import type { PatientData, TherapyPlanData } from "@/types";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'loading' | 'output'>('input');
  const [therapyPlan, setTherapyPlan] = useState<TherapyPlanData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGeneratePlan = async (patientData: PatientData) => {
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
      console.error('Error generating therapy plan:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate therapy plan. Please check your API key and try again.",
        variant: "destructive",
      });
      setCurrentStep('input');
    }
  };

  const handleManualGoalSubmit = async (data: PatientData & { manualGoals: { longTermGoal: string; objectives: string[] } }) => {
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
      console.error('Error generating treatment protocol:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate treatment protocol. Please check your API key and try again.",
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
      <Navigation onHistoryClick={() => navigate('/history')} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              SLP Compass
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Generate evidence-based therapy plans and SMART objectives for pediatric patients with communication disorders
            </p>
          </div>

          {currentStep === 'input' && (
            <div className="space-y-12">
              <PatientInput 
                onSubmit={handleGeneratePlan}
                onManualSubmit={handleManualGoalSubmit}
              />
              <ExamplePlans />
            </div>
          )}

          {currentStep === 'loading' && (
            <LoadingSpinner />
          )}

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

export default Index;
