
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Edit3, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditableOutputProps {
  content: string;
  onSave: (newContent: string) => void;
  className?: string;
  minRows?: number;
}

export const EditableOutput = ({ 
  content, 
  onSave, 
  className = "", 
  minRows = 3 
}: EditableOutputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(editedContent);
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your edits have been saved successfully.",
    });
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };

  if (isEditing) {
    return (
      <div className={`space-y-3 ${className}`}>
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className={`min-h-[${minRows * 1.5}rem] text-base leading-relaxed`}
          rows={minRows}
        />
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={handleCancel} variant="outline" size="sm">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="bg-slate-50 p-4 rounded-lg border">
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => setIsEditing(true)}
          variant="outline"
          size="sm"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="sm"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </div>
    </div>
  );
};
