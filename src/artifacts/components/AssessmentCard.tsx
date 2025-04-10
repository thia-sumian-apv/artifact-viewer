import { Clock, Play, Calendar, Info, type LucideIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export type AssessmentType = "cognitive" | "psychological" | "physical";

export interface Assessment {
  id: string;
  title: string;
  description: string;
  status: "available" | "completed" | "in_progress" | "future" | string;
  icon?: LucideIcon; // Changed from ReactNode to LucideIcon
  duration?: string;
  date?: string;
  progress?: number;
  score?: number;
  type: AssessmentType;
  futureDate?: string;
}

interface AssessmentCardProps {
  assessment: Assessment;
  startAssessment: (id: string) => void;
  viewReport: (id: string) => void;
  disabled?: boolean;
}

const AssessmentCard = ({
  assessment,
  startAssessment,
  disabled = false,
}: AssessmentCardProps) => {
  const getStatusBadge = () => {
    if (assessment.status === "future") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
          Upcoming
        </span>
      );
    }
    if (assessment.status === "available") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
          Available
        </span>
      );
    }
    if (assessment.status === "completed") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300">
          Completed
        </span>
      );
    }
    if (assessment.status === "in_progress") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
          In Progress
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
        Unavailable
      </span>
    );
  };

  return (
    <Card
      className={`transition-shadow duration-300 border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-hidden 
		${disabled ? "opacity-50 pointer-events-none" : "hover:shadow-lg"} 
		${
      assessment.status === "future"
        ? "border-amber-200 dark:border-amber-800"
        : assessment.status === "completed"
        ? "border-teal-200 dark:border-teal-800 bg-teal-50/30 dark:bg-teal-900/10"
        : "bg-white dark:bg-gray-800"
    }`}
    >
      <CardHeader className="p-4 h-20 space-y-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0 pr-2">
            <div
              className={`flex-shrink-0 rounded-lg p-2 ${
                assessment.status === "future"
                  ? "bg-amber-50 dark:bg-amber-900/30"
                  : assessment.status === "completed"
                  ? "bg-teal-50 dark:bg-teal-900/30"
                  : "bg-teal-50 dark:bg-teal-900/30"
              }`}
            >
              <div
                className={`${
                  assessment.status === "future"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-teal-600 dark:text-teal-400"
                }`}
              >
                {assessment.icon && <assessment.icon className="h-6 w-6" />}{" "}
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                {assessment.title}
              </h3>
            </div>
          </div>
          <div className="flex-shrink-0 self-center">{getStatusBadge()}</div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-2 pt-0 flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 h-12">
          {assessment.description}
        </p>

        <div className="mt-3 space-y-2">
          {assessment.duration && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="flex-shrink-0 h-3 w-3 text-gray-400 dark:text-gray-500" />
              <span className="ml-1">{assessment.duration}</span>
            </div>
          )}
          {assessment.date && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="flex-shrink-0 h-3 w-3 text-gray-400 dark:text-gray-500" />
              <span className="ml-1">Completed: {assessment.date}</span>
            </div>
          )}
          {assessment.futureDate && (
            <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
              <Calendar className="flex-shrink-0 h-3 w-3 text-amber-500 dark:text-amber-400" />
              <span className="ml-1">Available: {assessment.futureDate}</span>
            </div>
          )}
        </div>

        {assessment.progress !== undefined && assessment.progress > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4">
            <div
              className={`h-1.5 rounded-full ${
                assessment.progress === 100
                  ? "bg-teal-500 dark:bg-teal-400"
                  : "bg-blue-500 dark:bg-blue-400"
              }`}
              style={{ width: `${assessment.progress}%` }}
            />
          </div>
        )}

        {assessment.score && (
          <div className="flex items-center mt-3">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Score:
            </div>
            <div className="ml-2 text-sm font-medium text-teal-600 dark:text-teal-400">
              {assessment.score}/100
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 mt-auto">
        {assessment.status === "completed" ? (
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 p-2 flex items-center justify-center">
            <Info className="h-3 w-3 mr-1 text-teal-500 dark:text-teal-400" />
            View detailed results in the Reports tab
          </div>
        ) : assessment.status === "future" ? (
          <div className="text-xs text-center text-amber-600 dark:text-amber-400 p-2">
            This assessment will be available from {assessment.futureDate}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => startAssessment(assessment.id)}
            className="w-full flex justify-center items-center px-3 py-2 border border-transparent rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            disabled={disabled}
          >
            <Play className="h-3 w-3 mr-1" />
            {assessment.status === "in_progress"
              ? "Continue"
              : "Start Assessment"}
          </button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;
