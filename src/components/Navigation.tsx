
import { Button } from "@/components/ui/button";
import { History, Brain } from "lucide-react";

interface NavigationProps {
  onHistoryClick: () => void;
}

export const Navigation = ({ onHistoryClick }: NavigationProps) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-semibold text-slate-800">AI Therapy Planner</span>
          </div>
          
          <Button
            variant="outline"
            onClick={onHistoryClick}
            className="flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            History
          </Button>
        </div>
      </div>
    </nav>
  );
};
