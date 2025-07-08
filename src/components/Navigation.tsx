
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

interface NavigationProps {
  onHistoryClick: () => void;
}

const SpeechLogo = () => (
  <div className="relative w-8 h-8">
    <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-3 bg-white rounded-sm"></div>
    <div className="absolute top-1/2 right-1 w-2 h-1 bg-blue-600 transform -translate-y-1/2 rounded-full"></div>
    <div className="absolute top-1/2 right-0 w-1 h-1 bg-blue-600 transform -translate-y-1/2 rounded-full"></div>
  </div>
);

export const Navigation = ({ onHistoryClick }: NavigationProps) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <SpeechLogo />
            <span className="text-xl font-semibold text-slate-800">Speech Plan</span>
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
