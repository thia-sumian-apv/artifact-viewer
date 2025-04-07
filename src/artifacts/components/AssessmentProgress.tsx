import {
  Activity,
  Brain,
  Calendar,
  Clock,
  Dumbbell,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dummyAssessmentRunData } from "../types/assessmentRun";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface ProgressData {
  count: number;
  percentage: number;
}

interface AssessmentProgressProps {
  cognitiveProgress: ProgressData;
  psychologicalProgress: ProgressData;
  getPhysicalProgress: () => ProgressData;
  overallProgress: ProgressData;
  setActiveTab: (tab: string) => void;
  // Add these new props
  selectedRunId: string;
  onRunChange: (runId: string) => void;
}

// ... existing code ...

const AssessmentProgress = ({
  cognitiveProgress,
  psychologicalProgress,
  getPhysicalProgress,
  overallProgress,
  setActiveTab,
  selectedRunId,
  onRunChange,
}: AssessmentProgressProps) => {
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

  const getZeroProgress = (): ProgressData => ({
    count: 0,
    percentage: 0,
  });

  return (
    <Card className="mb-6 shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 relative z-10">
      <CardHeader className="pb-2 p-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Assessment Progress
          </CardTitle>
          <div className="flex items-center space-x-2 pr-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Assessment Run:
            </span>
            <div className="w-64 relative z-20">
              <Select value={selectedRunId} onValueChange={onRunChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select assessment run" />
                </SelectTrigger>
                <SelectContent>
                  {dummyAssessmentRunData.map((run) => (
                    <SelectItem key={run.id} value={run.id}>
                      {run.name} ({format(new Date(run.startDate), "MMM d")} -{" "}
                      {format(new Date(run.endDate), "MMM d, yyyy")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {/* Progress Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs font-medium">Physical</p>
                  <p className="text-lg font-semibold">
                    {isActiveRun
                      ? getPhysicalProgress().count
                      : getZeroProgress().count}
                    /3
                  </p>
                </div>
                <Dumbbell className="h-6 w-6 text-white/80" />
              </div>
              <div className="mt-2">
                <Progress
                  value={isActiveRun ? getPhysicalProgress().percentage : 0}
                  className="h-2 bg-white/20 [&>div]:bg-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs font-medium">Psychological</p>
                  <p className="text-lg font-semibold">
                    {isActiveRun
                      ? psychologicalProgress.count
                      : getZeroProgress().count}
                    /3
                  </p>
                </div>
                <Activity className="h-6 w-6 text-white/80" />
              </div>
              <div className="mt-2">
                <Progress
                  value={isActiveRun ? psychologicalProgress.percentage : 0}
                  className="h-2 bg-white/20 [&>div]:bg-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-500 to-blue-500 dark:from-teal-600 dark:to-blue-600 text-white border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs font-medium">Cognitive</p>
                  <p className="text-lg font-semibold">
                    {isActiveRun
                      ? cognitiveProgress.count
                      : getZeroProgress().count}
                    /3
                  </p>
                </div>
                <Brain className="h-6 w-6 text-white/80" />
              </div>
              <div className="mt-2">
                <Progress
                  value={isActiveRun ? cognitiveProgress.percentage : 0}
                  className="h-2 bg-white/20 [&>div]:bg-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Status Text Section */}
        <Card className="mt-4 shadow-sm border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <CardContent className="p-4">
            {isActiveRun ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Overall Assessment Status
                  </h2>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                  >
                    {overallProgress.percentage}% Complete
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  You have completed {overallProgress.count} assessments across
                  all categories.
                  {overallProgress.percentage < 100
                    ? " Continue with your remaining assessments to get a comprehensive evaluation."
                    : " All assessments are complete. View your comprehensive report for detailed insights."}
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("reports")}
                    className="bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50 dark:border-teal-800"
                  >
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    View Overall Report
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 dark:border-indigo-800"
                  >
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Trainer Notes
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Future Assessment Run
                  </h2>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Upcoming
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                    <Clock className="h-4 w-4 mr-2" />
                    Starts {startDate && format(startDate, "MMMM d, yyyy")}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This assessment run is scheduled for the future. You'll be
                    able to access and complete your assessments when it begins.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default AssessmentProgress;
