// src/artifacts/components/assessment-management/TrainingModulesTab.tsx
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { BookOpen, Lightbulb } from "lucide-react";
import type { Assessment } from "../AssessmentCard";
import { dummyAssessmentRunData } from "../../types/assessmentRun";
import TrainingTab from "./TrainingTab";

const TrainingModulesTab = () => {
  // Assessment run selection state - using existing assessment runs
  const [selectedRunId, setSelectedRunId] = useState(
    dummyAssessmentRunData[0].id
  );

  // Define static training modules that apply to all assessment runs
  const trainingModulesRef = useRef<Assessment[]>([
    {
      id: "trainingA",
      title: "Concentration Grid",
      description:
        "Enhance your focus and concentration by identifying and selecting numbers in sequential order from a randomized grid.",
      duration: "15-20 mins",
      status: "available",
      icon: BookOpen,
      type: "cognitive",
    },
    {
      id: "trainingB",
      title: "Training Module B",
      description: "Description for training module B.",
      duration: "30-35 mins",
      status: "available",
      icon: Lightbulb,
      type: "cognitive",
    },
  ]);

  // State for filtered modules to display
  const [trainingModules, setTrainingModules] = useState<Assessment[]>(
    trainingModulesRef.current
  );

  // Process assessment runs and determine which training modules should be available
  const processAssessmentRuns = () => {
    const now = new Date();
    const data: Record<string, Assessment[]> = {};

    dummyAssessmentRunData.forEach((run) => {
      const startDate = new Date(run.startDate);
      const isFuture = now < startDate;

      // Create a copy of all training modules with status adjusted for this run
      const modulesForRun = trainingModulesRef.current.map((module) => {
        if (isFuture) {
          return {
            ...module,
            status: "future",
            futureDate: format(startDate, "MMM d, yyyy"),
          };
        } else {
          // For active or past runs, use the original status
          return { ...module };
        }
      });

      data[run.id] = modulesForRun;
    });

    // Update current modules based on selected run
    if (data[selectedRunId]) {
      setTrainingModules(data[selectedRunId]);
    }
  };

  // Process assessment runs when component mounts or selected run changes
  useEffect(() => {
    processAssessmentRuns();
  }, [selectedRunId]);

  // Functions for handling training modules
  const startTraining = (id: string) => {
    console.log(`Starting training module: ${id}`);
  };

  const viewReport = (id: string) => {
    console.log(`Viewing report for module: ${id}`);
  };

  const handleRunChange = (value: string) => {
    setSelectedRunId(value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Available Training Modules
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Assessment Run:
            </span>
            <div className="w-64">
              <Select value={selectedRunId} onValueChange={handleRunChange}>
                <SelectTrigger>
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

        <TrainingTab
          modules={trainingModules}
          startTraining={startTraining}
          viewReport={viewReport}
        />
      </div>
    </div>
  );
};

export default TrainingModulesTab;
