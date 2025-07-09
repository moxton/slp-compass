
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

interface NavigationProps {
  onHistoryClick: () => void;
}

const SpeechLogo = () => (
  <div className="relative w-8 h-8">
    {/* Speech bubble outline */}
    <div className="absolute inset-0 border-2 border-blue-600 rounded-lg bg-white"></div>
    {/* Speech bubble tail */}
    <div className="absolute -bottom-1 left-2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-blue-600"></div>
    <div className="absolute -bottom-0.5 left-2.5 w-0 h-0 border-l-3 border-l-transparent border-r-3 border-r-transparent border-t-3 border-t-white"></div>
    {/* Checkmark */}
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-blue-600">
        <path 
          d="M11.5 4L5.5 10L2.5 7" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

export const Navigation = ({ onHistoryClick }: NavigationProps) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <SpeechLogo />
            <span className="text-xl font-semibold text-blue-600">SLP Compass</span>
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
