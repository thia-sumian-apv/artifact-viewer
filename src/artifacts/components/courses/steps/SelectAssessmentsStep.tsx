import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { Assessment } from "../../AssessmentCard";
import { Brain } from "lucide-react";
import { HeadCircuit } from "@phosphor-icons/react";

const assessmentOptions = {
  cognitive: [
    {
      id: "sart",
      title: "SART",
      type: "cognitive",
      description: "",
      status: "active",
    },
    {
      id: "visual-rxn",
      title: "Visual RXN",
      type: "cognitive",
      description: "",
      status: "active",
    },
    {
      id: "spatial-planning",
      title: "Spatial Planning",
      type: "cognitive",
      description: "",
      status: "active",
    },
  ],
  psychological: [
    {
      id: "ml360",
      title: "ML360",
      type: "psychological",
      description: "",
      status: "active",
    },
    {
      id: "team-resilience",
      title: "Team Resilience",
      type: "psychological",
      description: "",
      status: "active",
    },
    {
      id: "self-determination",
      title: "Self-Determination",
      type: "psychological",
      description: "",
      status: "active",
    },
  ],
} satisfies Record<string, Assessment[]>;

interface AssessmentItemProps {
  assessment: Assessment;
  isSelected: boolean;
  onToggle: () => void;
}

function AssessmentItem({
  assessment,
  isSelected,
  onToggle,
}: AssessmentItemProps) {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 bg-teal-50 dark:bg-teal-900/30 rounded p-1">
            <div className="flex items-center justify-center text-teal-600 dark:text-teal-400">
              {assessment.type === "cognitive" ? (
                <Brain className="w-[18px] h-[18px] text-teal-600 dark:text-teal-400" />
              ) : (
                <HeadCircuit
                  className="w-[18px] h-[18px] text-teal-600 dark:text-teal-400"
                  weight="bold"
                />
              )}
            </div>
          </div>
          <span className="font-medium text-sm">{assessment.title}</span>
        </div>
        <Switch
          checked={isSelected}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-teal-600 dark:data-[state=checked]:bg-teal-500"
        />
      </div>
    </Card>
  );
}

interface SelectAssessmentsStepProps {
  selected: Assessment[];
  onUpdate: (assessments: Assessment[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SelectAssessmentsStep({
  selected,
  onUpdate,
}: SelectAssessmentsStepProps) {
  const handleToggle = (assessment: Assessment) => {
    if (selected.some((s) => s.id === assessment.id)) {
      onUpdate(selected.filter((s) => s.id !== assessment.id));
    } else {
      onUpdate([...selected, assessment]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Cognitive Assessments</h3>
          <div className="space-y-2">
            {assessmentOptions.cognitive.map((assessment) => (
              <AssessmentItem
                key={assessment.id}
                assessment={assessment}
                isSelected={selected.some((s) => s.id === assessment.id)}
                onToggle={() => handleToggle(assessment)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">
            Psychological Assessments
          </h3>
          <div className="space-y-2">
            {assessmentOptions.psychological.map((assessment) => (
              <AssessmentItem
                key={assessment.id}
                assessment={assessment}
                isSelected={selected.some((s) => s.id === assessment.id)}
                onToggle={() => handleToggle(assessment)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
