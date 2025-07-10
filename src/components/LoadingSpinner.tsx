
import { Card, CardContent } from "@/components/ui/card";
<<<<<<< HEAD
import CompassLogo from '/compass.svg';
import { Loader2 } from "lucide-react";
=======
import { Brain, Loader2 } from "lucide-react";
>>>>>>> 794405e8a914d62f126e1039bf32d31ac0ace405

export const LoadingSpinner = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="py-12">
        <div className="text-center space-y-4">
<<<<<<< HEAD
          <div className="flex flex-col items-center justify-center gap-4">
            <img src={CompassLogo} alt="Compass Logo" className="w-16 h-16 mb-2" />
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
=======
          <div className="flex justify-center">
            <div className="relative">
              <Brain className="w-12 h-12 text-blue-600" />
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin absolute -top-1 -right-1" />
            </div>
>>>>>>> 794405e8a914d62f126e1039bf32d31ac0ace405
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">
              Generating Therapy Plan
            </h3>
            <p className="text-slate-600">
<<<<<<< HEAD
              Analyzing patient information and creating evidence-based recommendations...
=======
              AI is analyzing patient information and creating evidence-based recommendations...
>>>>>>> 794405e8a914d62f126e1039bf32d31ac0ace405
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
