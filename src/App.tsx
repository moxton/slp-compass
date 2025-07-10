
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { AuthPage } from "./components/auth/AuthPage";
import PatientPage from "./pages/PatientPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/patient" element={<PatientPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/history" element={<History />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <footer className="w-full bg-slate-50 border-t mt-12 py-6 flex justify-center">
          <div className="max-w-2xl w-full px-4">
            <div className="rounded-lg border bg-white p-4 shadow-sm text-xs text-slate-600 text-left">
              <strong>SLP Compass</strong> is an educational planning tool for licensed professionals. It does not store protected health information and does not provide medical or therapeutic services. Users are solely responsible for maintaining compliance with all privacy and confidentiality laws applicable in their practice settings.
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4 text-sm text-slate-500">
              <span>&copy; {new Date().getFullYear()} SLP Compass</span>
              <a href="/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              <a href="/terms" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</a>
            </div>
          </div>
        </footer>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
