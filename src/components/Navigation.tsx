
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

interface NavigationProps {
  onHistoryClick: () => void;
}

const SpeechLogo = () => (
  <div className="relative w-8 h-8">
    {/* Speech bubble */}
    <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
    <div className="absolute top-1 left-1 w-5 h-4 bg-white rounded-lg"></div>
    {/* Speech dots */}
    <div className="absolute top-2 left-2 w-1 h-1 bg-blue-600 rounded-full"></div>
    <div className="absolute top-2 left-3.5 w-1 h-1 bg-blue-600 rounded-full"></div>
    <div className="absolute top-2 left-5 w-1 h-1 bg-blue-600 rounded-full"></div>
    {/* Small speech tail */}
    <div className="absolute bottom-0 right-1 w-2 h-2 bg-blue-600 rounded-full transform rotate-45"></div>
    <div className="absolute bottom-0.5 right-1.5 w-1 h-1 bg-white rounded-full"></div>
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
