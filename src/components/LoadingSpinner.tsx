
import { Card, CardContent } from "@/components/ui/card";
import CompassLogo from '/compass.svg';
import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="py-12">
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <img src={CompassLogo} alt="Compass Logo" className="w-16 h-16 mb-2" />
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">
              Generating Therapy Plan
            </h3>
            <p className="text-slate-600">
              Analyzing patient information and creating evidence-based recommendations...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
