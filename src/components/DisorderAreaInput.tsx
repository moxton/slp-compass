
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Edit3 } from "lucide-react";
import type { ReactNode } from "react";

interface DisorderAreaInputProps {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  includeNone?: boolean;
}

const disorderAreas = [
  { value: "articulation-phonology", label: "Articulation/Phonology" },
  { value: "fluency", label: "Fluency" },
  { value: "expressive-language", label: "Expressive Language" },
  { value: "receptive-language", label: "Receptive Language" },
  { value: "social-pragmatics", label: "Social-Pragmatics" },
  { value: "executive-function", label: "Executive Function" },
  { value: "literacy", label: "Literacy" },
];

export const DisorderAreaInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "Select disorder area",
  includeNone = false 
}: DisorderAreaInputProps) => {
  const [inputMode, setInputMode] = useState<'dropdown' | 'text'>('dropdown');

  const handleModeToggle = () => {
    setInputMode(inputMode === 'dropdown' ? 'text' : 'dropdown');
    if (inputMode === 'text') {
      // When switching back to dropdown, clear custom text if it doesn't match predefined options
      const foundOption = disorderAreas.find(area => 
        area.label.toLowerCase() === value.toLowerCase() || 
        area.value === value
      );
      if (!foundOption && !includeNone) {
        onChange('');
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleModeToggle}
          className="h-6 px-2 text-xs"
        >
          {inputMode === 'dropdown' ? (
            <>
              <Edit3 className="w-3 h-3 mr-1" />
              Type custom
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              Use dropdown
            </>
          )}
        </Button>
      </div>

      {inputMode === 'dropdown' ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {includeNone && (
              <SelectItem value="none">Not applicable</SelectItem>
            )}
            {disorderAreas.map((area) => (
              <SelectItem key={area.value} value={area.value}>
                {area.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type="text"
          placeholder="Enter custom disorder area"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-base"
        />
      )}
    </div>
  );
};
