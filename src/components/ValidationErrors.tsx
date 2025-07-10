
import { AlertTriangle } from "lucide-react";

interface ValidationErrorsProps {
  errors: string[];
}

export const ValidationErrors = ({ errors }: ValidationErrorsProps) => {
  if (errors.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-red-600" />
        <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
      </div>
      <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};
