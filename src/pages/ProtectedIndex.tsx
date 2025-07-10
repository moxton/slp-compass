import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./Index";

const ProtectedIndex = () => {
  return (
    <ProtectedRoute>
      <Index />
    </ProtectedRoute>
  );
};

export default ProtectedIndex; 