import { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { BookOpen, Lightbulb, Activity } from "lucide-react";
import type { Assessment } from "../AssessmentCard";
import { dummyAssessmentRunData } from "../../types/assessmentRun";
import TrainingTab from "./TrainingTab";

const TrainingModulesTab = () => {
  const [selectedRunId, setSelectedRunId] = useState(
    dummyAssessmentRunData[0].id
  );

  // Define static training modules organized by type
  const trainingModulesRef = useRef({
    cognitive: [
      {
        id: "trainingA",
        title: "Concentration Grid",
        description:
          "Enhance your focus and concentration by identifying and selecting numbers in sequential order from a randomized grid.",
        duration: "15-20 mins",
        status: "available",
        icon: BookOpen,
        type: "cognitive" as const,
      },
    ],
    psychological: [
      {
        id: "trainingB",
        title: "Stress Management",
        description:
          "Learn techniques for managing stress and maintaining mental resilience.",
        duration: "30-35 mins",
        status: "available",
        icon: Lightbulb,
        type: "psychological" as const,
      },
    ],
    physical: [
      {
        id: "trainingC",
        title: "Physical Recovery",
        description:
          "Guided exercises for optimal physical recovery and performance.",
        duration: "25-30 mins",
        status: "available",
        icon: Activity,
        type: "physical" as const,
      },
    ],
  });

  // State for filtered modules to display
  const [trainingModules, setTrainingModules] = useState(
    trainingModulesRef.current
  );

  // Process assessment runs and determine which training modules should be available
  const processAssessmentRuns = () => {
    const now = new Date();
    const data: Record<string, typeof trainingModulesRef.current> = {};

    dummyAssessmentRunData.forEach((run) => {
      const startDate = new Date(run.startDate);
      const isFuture = now < startDate;

      // Process each type of training module
      const processModules = <T extends Assessment[]>(modules: T) =>
        modules.map((module) => ({
          ...module,
          status: isFuture ? "future" : module.status,
          futureDate: isFuture ? format(startDate, "MMM d, yyyy") : undefined,
        })) as T;

      data[run.id] = {
        cognitive: processModules(trainingModulesRef.current.cognitive),
        psychological: processModules(trainingModulesRef.current.psychological),
        physical: processModules(trainingModulesRef.current.physical),
      };
    });

    if (data[selectedRunId]) {
      setTrainingModules(data[selectedRunId]);
    }
  };

  useEffect(() => {
    processAssessmentRuns();
  }, [selectedRunId]);

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
        <div className="flex-1">
          <Tabs defaultValue="cognitive" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
                <TabsTrigger value="psychological">Psychological</TabsTrigger>
                <TabsTrigger value="physical">Physical</TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Assessment Run:
                </span>
                <div>
                  <Select value={selectedRunId} onValueChange={handleRunChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assessment run" />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyAssessmentRunData.map((run) => (
                        <SelectItem key={run.id} value={run.id}>
                          {run.name} ({format(new Date(run.startDate), "MMM d")}{" "}
                          - {format(new Date(run.endDate), "MMM d, yyyy")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <TabsContent value="cognitive">
              <TrainingTab
                modules={trainingModules.cognitive}
                startTraining={startTraining}
                viewReport={viewReport}
              />
            </TabsContent>

            <TabsContent value="psychological">
              <TrainingTab
                modules={trainingModules.psychological}
                startTraining={startTraining}
                viewReport={viewReport}
              />
            </TabsContent>

            <TabsContent value="physical">
              <TrainingTab
                modules={trainingModules.physical}
                startTraining={startTraining}
                viewReport={viewReport}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TrainingModulesTab;
