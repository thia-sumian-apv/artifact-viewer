import { LucideIcon, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { dummyAssessmentRunData } from "../types/assessmentRun";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import psychologicalBg from "@/assets/images/psychological-background-image.jpg";
import cognitiveBg from "@/assets/images/cognitive-background-image.jpg";

interface ProgressData {
  count: number;
  percentage: number;
}

interface AssessmentLaunchCardProps {
  title: string;
  description: string;
  type: "psychological" | "cognitive";
  progress: ProgressData;
  icon: LucideIcon;
  selectedRunId: string;
  onStart: () => void;
}

const AssessmentLaunchCard = ({
  title,
  description,
  type,
  progress,
  icon: Icon,
  selectedRunId,
  onStart,
}: AssessmentLaunchCardProps) => {
  const [isActiveRun, setIsActiveRun] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    const selectedRun = dummyAssessmentRunData.find(
      (run) => run.id === selectedRunId
    );
    if (selectedRun) {
      const now = new Date();
      const runStartDate = new Date(selectedRun.startDate);
      const runEndDate = new Date(selectedRun.endDate);
      setIsActiveRun(now >= runStartDate && now <= runEndDate);
      setStartDate(runStartDate);
    }
  }, [selectedRunId]);

  const getBackgroundImage = () => {
    return type === "psychological" ? psychologicalBg : cognitiveBg;
  };

  const getGradientClasses = () => {
    if (type === "psychological") {
      return "from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700";
    }
    return "from-teal-500 to-blue-600 dark:from-teal-600 dark:to-blue-700";
  };

  const getProgressBarClasses = () => {
    if (type === "psychological") {
      return "[&>div]:bg-indigo-600 dark:[&>div]:bg-indigo-500";
    }
    return "[&>div]:bg-teal-600 dark:[&>div]:bg-teal-500";
  };

  const getButtonClasses = () => {
    if (type === "psychological") {
      return "bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white";
    }
    return "bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 text-white";
  };

  return (
    <Card
      className={`overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 ${
        !isActiveRun ? "opacity-75" : ""
      }`}
    >
      {/* Rest of the card implementation remains the same */}
      <div
        className={`h-40 bg-gradient-to-r ${getGradientClasses()} relative overflow-hidden`}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('${getBackgroundImage()}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute bottom-4 left-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="text-white/80 text-sm">Assessment</p>
        </div>
        <Icon className="absolute top-4 right-4 h-8 w-8 text-white/80" />

        {!isActiveRun && startDate && (
          <div className="absolute top-4 left-4 flex items-center bg-amber-500/90 rounded-full px-3 py-1">
            <Calendar className="h-4 w-4 text-white mr-2" />
            <span className="text-xs font-medium text-white">
              Available {format(startDate, "MMMM d, yyyy")}
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
          {description}
        </p>
        <div className="flex justify-between items-center">
          {isActiveRun ? (
            <>
              <div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Completed: {progress.count}
                </span>
                <Progress
                  value={progress.percentage}
                  className={`w-32 h-1.5 mt-1.5 ${getProgressBarClasses()}`}
                />
              </div>
              <Button
                onClick={onStart}
                className={getButtonClasses()}
                size="sm"
              >
                Start Assessment
              </Button>
            </>
          ) : (
            <div className="w-full">
              <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                This assessment will be available when the assessment run begins
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentLaunchCard;
