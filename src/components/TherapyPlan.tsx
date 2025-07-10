
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, CheckCircle, Clock, Users, Copy, Plus, ExternalLink, Info, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditableOutput } from "./EditableOutput";
import type { TherapyPlanData } from "@/types";

// Helper to join objectives for copy
const joinObjectives = (objectives) => objectives.map((o, i) => `${i + 1}. ${o.text || o}`).join("\n");

interface TherapyPlanProps {
  plan: TherapyPlanData;
  onNewPlan: () => void;
}

export const TherapyPlan = ({ plan, onNewPlan }: TherapyPlanProps) => {
  const { toast } = useToast();
  const [editablePlan, setEditablePlan] = useState(plan);

  // Editable state for each card
  const [editing, setEditing] = useState({
    summary: false,
    engagement: false,
    goals: editablePlan.longTermGoal ? [false] : [],
    protocols: false,
  });

  // Helper for copy
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", description: "Text has been copied to your clipboard." });
  };

  const formatDisorderArea = (area: string) => {
    return area.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const updateLongTermGoal = (newGoal: string) => {
    setEditablePlan(prev => ({ ...prev, longTermGoal: newGoal }));
  };

  const updateObjective = (index: number, newText: string) => {
    setEditablePlan(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => 
        i === index ? { ...obj, text: newText } : obj
      )
    }));
  };

  // --- Layout ---
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Generated Therapy Plan</h2>
          <p className="text-slate-600">
            {editablePlan.patientData.patientInitials && (
              <span className="font-semibold mr-2">{editablePlan.patientData.patientInitials}</span>
            )}
            Age {editablePlan.patientData.age} • {editablePlan.patientData.disorderArea}
            {editablePlan.patientData.secondaryDisorderArea && ` • Secondary: ${editablePlan.patientData.secondaryDisorderArea}`}
          </p>
        </div>
        <Button onClick={onNewPlan} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Plan
        </Button>
      </div>

      {/* Summary Card */}
      {editablePlan.summary && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="text-xl font-bold text-slate-900">Summary</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(editablePlan.summary)}>
                <Copy className="w-4 h-4 mr-1" /> Copy
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(e => ({ ...e, summary: !e.summary }))}>
                {editing.summary ? "Save" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editing.summary ? (
              <textarea
                className="w-full border rounded p-2 text-base"
                value={editablePlan.summary}
                onChange={e => setEditablePlan(p => ({ ...p, summary: e.target.value }))}
                rows={3}
              />
            ) : (
              <p className="text-slate-700 text-lg whitespace-pre-line">{editablePlan.summary}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Long-Term Goal + Objectives Card */}
      {editablePlan.longTermGoal && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-xl font-bold text-slate-900">Long-Term Goal & SMART Objectives</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(`${editablePlan.longTermGoal}\n\nSMART Objectives:\n${joinObjectives(editablePlan.objectives)}`)}>
                <Copy className="w-4 h-4 mr-1" /> Copy
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(e => ({ ...e, goals: [!e.goals[0]] }))}>
                {editing.goals[0] ? "Save" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editing.goals[0] ? (
              <>
                <textarea
                  className="w-full border rounded p-2 text-base mb-4"
                  value={editablePlan.longTermGoal}
                  onChange={e => setEditablePlan(p => ({ ...p, longTermGoal: e.target.value }))}
                  rows={2}
                />
                <textarea
                  className="w-full border rounded p-2 text-base"
                  value={joinObjectives(editablePlan.objectives)}
                  onChange={e => {
                    const lines = e.target.value.split(/\r?\n/).filter(Boolean);
                    setEditablePlan(p => ({
                      ...p,
                      objectives: lines.map((text, i) => ({ ...p.objectives[i], text: text.replace(/^\d+\.\s*/, "") }))
                    }));
                  }}
                  rows={3}
                />
              </>
            ) : (
              <>
                <div className="text-lg font-semibold text-slate-800 mb-2">{editablePlan.longTermGoal}</div>
                <div>
                  <div className="font-semibold text-slate-700 mb-1">SMART Objectives</div>
                  <ul className="list-decimal pl-6 space-y-1">
                    {editablePlan.objectives.map((obj, i) => (
                      <li key={obj.id} className="text-slate-700">{obj.text}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Evidence-Based Treatment Protocols Card */}
      {Array.isArray(editablePlan.treatmentProtocols) && editablePlan.treatmentProtocols.length > 0 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-xl font-bold text-slate-900">Evidence-Based Treatment Protocols</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(editablePlan.treatmentProtocols.map((protocol, idx) => `Protocol: ${protocol.name}\nTarget Skills:\n${protocol.targets.join("\n")}\nTreatment Hierarchy:\n${protocol.hierarchy.join("\n")}\nFading Supports:\n${protocol.fadingSupports || ''}\nReferences:\n${protocol.references.join("\n")}`).join("\n\n"))}>
                <Copy className="w-4 h-4 mr-1" /> Copy
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(e => ({ ...e, protocols: !e.protocols }))}>
                {editing.protocols ? "Save" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editing.protocols ? (
              <textarea
                className="w-full border rounded p-2 text-base"
                value={editablePlan.treatmentProtocols.map((protocol, idx) => `Protocol: ${protocol.name}\nTarget Skills:\n${protocol.targets.join("\n")}\nTreatment Hierarchy:\n${protocol.hierarchy.join("\n")}\nFading Supports:\n${protocol.fadingSupports || ''}\nReferences:\n${protocol.references.join("\n")}`).join("\n\n")}
                onChange={e => {
                  // This is a simple edit mode for the whole protocols block; advanced parsing can be added if needed
                  // For now, just update a single string field or ignore changes
                }}
                rows={10}
              />
            ) : (
              editablePlan.treatmentProtocols.map((protocol, idx) => (
                <div key={idx} className="mb-6">
                  <div className="text-blue-600 text-lg font-semibold mb-2">{protocol.name || `Treatment Protocol ${idx + 1}`}</div>
                  <div className="font-semibold text-slate-800 mb-2">Target Skills</div>
                  <ul className="list-disc pl-6 mb-2">
                    {protocol.targets.map((t, i) => <li key={i} className="text-slate-700">{t}</li>)}
                  </ul>
                  <div className="font-semibold text-slate-800 mb-2">Treatment Hierarchy</div>
                  <ul className="list-decimal pl-6 mb-2">
                    {protocol.hierarchy.map((h, i) => <li key={i} className="text-slate-700">{h}</li>)}
                  </ul>
                  <div className="font-semibold text-slate-800 mb-2">Fading Supports</div>
                  <div className="text-slate-700 mb-2">{protocol.fadingSupports || <span className="italic text-slate-400">(Not provided)</span>}</div>
                  <div className="font-semibold text-slate-800 mb-2">References</div>
                  <ul className="list-disc pl-6">
                    {protocol.references.map((r, i) => <li key={i} className="text-slate-700">{r}</li>)}
                  </ul>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Engagement Ideas Card */}
      {editablePlan.engagementIdeas && editablePlan.engagementIdeas.length > 0 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-600" />
              <span className="text-xl font-bold text-slate-900">Engagement Ideas</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(editablePlan.engagementIdeas.join("\n"))}>
                <Copy className="w-4 h-4 mr-1" /> Copy
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(e => ({ ...e, engagement: !e.engagement }))}>
                {editing.engagement ? "Save" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editing.engagement ? (
              <textarea
                className="w-full border rounded p-2 text-base"
                value={editablePlan.engagementIdeas.join("\n")}
                onChange={e => setEditablePlan(p => ({ ...p, engagementIdeas: e.target.value.split(/\r?\n/).filter(Boolean) }))}
                rows={3}
              />
            ) : (
              <ul className="list-disc pl-6 space-y-2">
                {editablePlan.engagementIdeas.map((idea, idx) => (
                  <li key={idx} className="text-slate-700">{idea}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
