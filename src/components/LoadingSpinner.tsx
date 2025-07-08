
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="py-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Brain className="w-12 h-12 text-blue-600" />
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin absolute -top-1 -right-1" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">
              Generating Therapy Plan
            </h3>
            <p className="text-slate-600">
              AI is analyzing patient information and creating evidence-based recommendations...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
