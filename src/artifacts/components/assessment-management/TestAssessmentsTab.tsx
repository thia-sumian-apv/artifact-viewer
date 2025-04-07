import { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CognitiveTab from "./CognitiveTab";
import PsychologicalTab from "./PsychologicalTab";
import PhysicalTab from "../PhysicalTab";
import PhysicalStatsAdminView from "../physical/PhysicalStatsAdminView";
import SARTTraining from "../assessments/sart/SARTTraining";
import type { Assessment } from "../AssessmentCard";
import { dummyAssessmentRunData } from "../../types/assessmentRun";
import { format } from "date-fns";
import { Brain, Eye, Users, Shield, Heart, Volleyball } from "lucide-react";
import type { UserRole } from "../../index";

interface TestAssessmentsTabProps {
  userRole?: UserRole;
}

const TestAssessmentsTab = ({
  userRole = "trainee",
}: TestAssessmentsTabProps) => {
  // Assessment modal state
  const [currentAssessment, setCurrentAssessment] = useState<string | null>(
    null
  );
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);

  // Check if user is admin
  const isAdmin = userRole === "superAdmin" || userRole === "companyAdmin";

  // Assessment run selection state
  const [selectedRunId, setSelectedRunId] = useState(
    dummyAssessmentRunData[0].id
  );

  // Store base assessment data in a ref to avoid re-render cycles
  const baseAssessmentsRef = useRef<{
    cognitive: Assessment[];
    psychological: Assessment[];
    physical: Assessment[];
  }>({
    cognitive: [
      {
        id: "sart",
        title: "Sustained Attention Response Task (SART)",
        description:
          "Measures your ability to maintain focus and suppress impulsive responses over time.",
        duration: "10-12 mins",
        status: "available",
        icon: <Brain className="h-6 w-6" />,
        type: "cognitive",
      },
      {
        id: "vrxn",
        title: "Visual Recognition (RXN)",
        description:
          "Tests your ability to memorize and identify visual patterns under time constraints.",
        duration: "15-20 mins",
        status: "completed",
        icon: <Eye className="h-6 w-6" />,
        type: "cognitive",
      },
      {
        id: "spatial",
        title: "Spatial Planning",
        description:
          "Evaluates your ability to visualize and strategize spatial arrangements with minimal moves.",
        duration: "12-15 mins",
        status: "available",
        icon: <Volleyball className="h-6 w-6" />,
        type: "cognitive",
      },
    ],
    psychological: [
      {
        id: "ml360",
        title: "Mindful Leadership Assessment (ML360)",
        description:
          "Evaluates leadership behaviors reflecting mindfulness in workplace scenarios.",
        duration: "15-20 mins",
        status: "completed",
        icon: <Users className="h-6 w-6" />,
        type: "psychological",
      },
      {
        id: "teamres",
        title: "Team Resilience Assessment",
        description:
          "Measures your team's ability to bounce back from challenges and adapt to change.",
        duration: "10-15 mins",
        status: "available",
        icon: <Shield className="h-6 w-6" />,
        type: "psychological",
      },
      {
        id: "selfdet",
        title: "Self-Determination Assessment",
        description:
          "Evaluates your motivation level and sense of autonomy, competence, and relatedness.",
        duration: "10 mins",
        status: "available",
        icon: <Heart className="h-6 w-6" />,
        type: "psychological",
      },
    ],
    physical: [],
  });

  // State for filtered assessments to display
  const [assessments, setAssessments] = useState<{
    cognitive: Assessment[];
    psychological: Assessment[];
    physical: Assessment[];
  }>(baseAssessmentsRef.current);

  // Process assessment runs and determine which assessments should be available
  const processAssessmentRuns = () => {
    const now = new Date();
    const data: Record<
      string,
      {
        cognitive: Assessment[];
        psychological: Assessment[];
        physical: Assessment[];
        isActive: boolean;
      }
    > = {};

    dummyAssessmentRunData.forEach((run) => {
      const startDate = new Date(run.startDate);
      const endDate = new Date(run.endDate);
      const isActive = now >= startDate && now <= endDate;
      const isFuture = now < startDate;

      // Log useful debugging info
      console.log(
        `Run: ${run.name}, isActive: ${isActive}, isFuture: ${isFuture}, startDate: ${startDate}`
      );

      // Determine which assessments to include from the base assessments ref
      const cognitiveAssessments = baseAssessmentsRef.current.cognitive
        .filter((assessment) => run.assessments.includes(assessment.id))
        .map((assessment) => {
          // If the run is in the future, always mark assessments as future
          if (isFuture) {
            return {
              ...assessment,
              status: "future",
              futureDate: format(startDate, "MMM d, yyyy"),
            };
          }
          // Otherwise keep original status (for active or past runs)
          return { ...assessment };
        });

      // Same logic for psychological assessments
      const psychologicalAssessments = baseAssessmentsRef.current.psychological
        .filter((assessment) => run.assessments.includes(assessment.id))
        .map((assessment) => {
          if (isFuture) {
            return {
              ...assessment,
              status: "future",
              futureDate: format(startDate, "MMM d, yyyy"),
            };
          }
          return { ...assessment };
        });

      data[run.id] = {
        cognitive: cognitiveAssessments,
        psychological: psychologicalAssessments,
        physical: [],
        isActive,
      };
    });

    // Update current assessments based on selected run
    if (data[selectedRunId]) {
      setAssessments({
        cognitive: data[selectedRunId].cognitive,
        psychological: data[selectedRunId].psychological,
        physical: data[selectedRunId].physical,
      });
    }
  };

  // Process assessment runs when component mounts or dummyAssessmentRunData changes
  useEffect(() => {
    processAssessmentRuns();
  }, [dummyAssessmentRunData, selectedRunId]);

  // Functions for handling assessments
  const startAssessment = (id: string) => {
    console.log(`Starting assessment: ${id}`);

    // Handle SART assessment specifically
    if (id === "sart") {
      setCurrentAssessment("sart");
      setAssessmentModalOpen(true);
    }
  };

  const viewReport = (id: string) => {
    console.log(`Viewing report for: ${id}`);
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
                <div className="w-64">
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
              <CognitiveTab
                assessments={assessments}
                startAssessment={startAssessment}
                viewReport={viewReport}
              />
            </TabsContent>

            <TabsContent value="psychological">
              <PsychologicalTab
                assessments={assessments}
                startAssessment={startAssessment}
                viewReport={viewReport}
              />
            </TabsContent>

            <TabsContent value="physical">
              {isAdmin ? <PhysicalStatsAdminView /> : <PhysicalTab />}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Assessment Modal */}
      <Dialog open={assessmentModalOpen} onOpenChange={setAssessmentModalOpen}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] h-[90vh] p-0 overflow-hidden">
          {currentAssessment === "sart" && (
            <SARTTraining onClose={() => setAssessmentModalOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestAssessmentsTab;
