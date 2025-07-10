
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { TherapyPlanCard } from "@/components/TherapyPlanCard";
import { getTherapyPlans } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import type { TherapyPlanData } from "@/types";

<<<<<<< HEAD
// Entire file can be commented out or replaced with a placeholder for now.
export default function History() {
  return (
    <div className="text-center text-slate-500 py-20 text-lg">
      Therapy plan history is coming soon.
    </div>
  );
}
=======
const History = () => {
  const [therapyPlans, setTherapyPlans] = useState<TherapyPlanData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const plans = getTherapyPlans();
    setTherapyPlans(plans);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation onHistoryClick={() => navigate('/history')} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Planner
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Therapy Plan History</h1>
              <p className="text-slate-600">View and manage your previous therapy plans</p>
            </div>
          </div>

          {therapyPlans.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No therapy plans yet</h3>
              <p className="text-slate-500 mb-6">Create your first therapy plan to see it here</p>
              <Button onClick={() => navigate('/')}>
                Create New Plan
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {therapyPlans.map((plan) => (
                <TherapyPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;
>>>>>>> 794405e8a914d62f126e1039bf32d31ac0ace405
