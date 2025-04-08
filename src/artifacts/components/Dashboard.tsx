import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  Brain,
  Dumbbell,
  Medal,
  Route,
  Mountain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AssessmentProgress from "./AssessmentProgress";
import {
  getLatestIPPTForUser,
  getLatestSOCForUser,
  getLatestRoadMarchForUser,
} from "../mocks/physicalData";
import { dummyAssessmentRunData } from "../types/assessmentRun";
import { useState } from "react";
import AssessmentLaunchCard from "./AssessmentLaunchCard";
import { UserRole } from "..";
import { HeadCircuit } from "@phosphor-icons/react";

interface ProgressData {
  count: number;
  percentage: number;
}

interface DashboardProps {
  cognitiveProgress: ProgressData;
  psychologicalProgress: ProgressData;
  overallProgress: ProgressData;
  userRole: UserRole;
  getPhysicalProgress: () => ProgressData;
  setActiveTab: (tab: string) => void;
  viewReport: (id: string) => void;
}

const formatTimeForDisplay = (seconds: number): string => {
  if (seconds >= 3600) {
    // Format as "X hr Y min" for ≥ 1 hour
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
  // Format as "X min Y sec" for < 1 hour
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
};

const Dashboard = ({
  cognitiveProgress,
  psychologicalProgress,
  getPhysicalProgress,
  overallProgress,
  setActiveTab,
  userRole,
}: DashboardProps) => {
  // Use a sample user (Thomas Garcia)
  const userId = "user-008";

  // Get latest records using the utility functions
  const latestIPPT = getLatestIPPTForUser(userId);
  const latestSOC = getLatestSOCForUser(userId);
  const latestRoadMarch = getLatestRoadMarchForUser(userId);
  const [selectedRunId, setSelectedRunId] = useState(
    dummyAssessmentRunData[0].id
  );

  const handleAssessmentRunChange = (runId: string) => {
    setSelectedRunId(runId);
  };

  // Create physical assessment items from mock data
  const physicalAssessments = [
    {
      id: "ippt",
      title: "IPPT",
      date: latestIPPT ? latestIPPT.assessmentDate.toLocaleDateString() : "N/A",
      status: latestIPPT ? latestIPPT.award : "N/A",
      score: latestIPPT ? `${latestIPPT.totalScore}` : "N/A",
      type: "physical",
      icon: Medal,
    },
    {
      id: "soc",
      title: "SOC",
      date: latestSOC ? latestSOC.assessmentDate.toLocaleDateString() : "N/A",
      status: latestSOC ? latestSOC.status : "N/A",
      score: latestSOC ? formatTimeForDisplay(latestSOC.timeInSeconds) : "N/A",
      type: "physical",
      icon: Route,
    },
    {
      id: "march",
      title: "20km Road March",
      date: latestRoadMarch
        ? latestRoadMarch.assessmentDate.toLocaleDateString()
        : "N/A",
      status: latestRoadMarch ? latestRoadMarch.status : "N/A",
      score: latestRoadMarch
        ? formatTimeForDisplay(latestRoadMarch.timeInSeconds)
        : "N/A",
      type: "physical",
      icon: Mountain,
    },
  ];

  return (
    <>
      {/* Add AssessmentProgress component here */}
      <AssessmentProgress
        cognitiveProgress={cognitiveProgress}
        psychologicalProgress={psychologicalProgress}
        getPhysicalProgress={getPhysicalProgress}
        overallProgress={overallProgress}
        selectedRunId={selectedRunId}
        onRunChange={handleAssessmentRunChange}
        userRole={userRole}
      />

      {/* Assessment Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <AssessmentLaunchCard
          title="Psychological"
          description="Evaluate your leadership behaviors, team resilience, and personal motivation levels through comprehensive self-assessment surveys."
          type="psychological"
          progress={psychologicalProgress}
          icon={HeadCircuit}
          selectedRunId={selectedRunId}
          onStart={() => setActiveTab("psychological")}
        />

        <AssessmentLaunchCard
          title="Cognitive"
          description="Measure your cognitive abilities including attention, visual recognition, and spatial planning through interactive, gamified exercises."
          type="cognitive"
          progress={cognitiveProgress}
          icon={Brain}
          selectedRunId={selectedRunId}
          onStart={() => setActiveTab("cognitive")}
        />
      </div>

      {/* Physical Training Results Card */}
      <Card className="shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Physical Training Results
            </CardTitle>
            <Dumbbell className="text-gray-400 dark:text-gray-500 h-6 w-6" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {physicalAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <assessment.icon className="mr-2 text-teal-600 dark:text-teal-400 h-5 w-5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {assessment.title}
                    </h4>
                    <div className="flex items-center mt-1">
                      <Badge
                        variant={
                          assessment.status === "fail"
                            ? "destructive"
                            : "outline"
                        }
                        className={`text-xs px-1.5 py-0 h-5 mr-2 ${
                          assessment.id === "ippt"
                            ? assessment.status === "gold"
                              ? "bg-amber-400 border-amber-400 text-black hover:bg-amber-400"
                              : assessment.status === "silver"
                              ? "bg-slate-300 border-slate-300 text-black hover:bg-slate-300"
                              : assessment.status === "bronze"
                              ? "bg-amber-600 border-amber-600 text-white hover:bg-amber-600"
                              : ""
                            : assessment.status === "pass"
                            ? "bg-green-500 border-green-500 text-white hover:bg-green-500"
                            : ""
                        }`}
                      >
                        {assessment.status.toUpperCase()}
                      </Badge>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {assessment.date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="text-md font-bold text-teal-600 dark:text-teal-400 mr-2 bg-transparent"
                  >
                    {assessment.score}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
          <Button
            variant="link"
            onClick={() => setActiveTab("physical")}
            className="p-0 text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center hover:text-blue-800 dark:hover:text-blue-300"
          >
            View all physical results
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-6">
        {/* Assessment Reports & Feedback section removed */}
      </div>
    </>
  );
};

export default Dashboard;
