
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "@/components/auth/UserMenu";

interface NavigationProps {
  onHistoryClick?: () => void;
}

const CompassLogo = () => (
  <img src="/compass.svg" alt="Compass Logo" className="w-8 h-8" />
);

export const Navigation = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2 no-underline hover:no-underline focus:no-underline">
              <CompassLogo />
              <span className="text-xl font-semibold text-blue-600">SLP Compass</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              History
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setShowContact(true)}
            >
              Contact Us
            </Button>
            {user ? (
              <UserMenu />
            ) : (
              <Button
                variant="outline"
                onClick={() => window.location.href = '/auth'}
                className="flex items-center gap-2"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
            <p className="mb-4">The history feature is coming soon!</p>
            <Button onClick={() => setShowHistory(false)} className="w-full">Close</Button>
          </div>
        </div>
      )}
      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-2">Contact Us</h2>
            <p className="mb-4">Email: <a href="mailto:helloslpcompass@gmail.com" className="text-blue-600 underline">helloslpcompass@gmail.com</a></p>
            <Button onClick={() => setShowContact(false)} className="w-full">Close</Button>
          </div>
        </div>
      )}
    </nav>
  );
};
