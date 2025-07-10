
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

interface NavigationProps {
  onHistoryClick: () => void;
}

const CompassLogo = () => (
  <img src="/compass.svg" alt="Compass Logo" className="w-8 h-8" />
);

export const Navigation = ({ onHistoryClick }: NavigationProps) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <CompassLogo />
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
