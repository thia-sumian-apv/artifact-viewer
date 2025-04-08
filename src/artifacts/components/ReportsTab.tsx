import {
  mockInjuries,
  getLatestIPPTForUser,
  getLatestSOCForUser,
  getLatestRoadMarchForUser,
  getLatestCardioForUser,
  getLatestStrengthForUser,
} from "../mocks/physicalData";
import type { Assessment } from "./AssessmentCard";
import PhysicalReport from "./reports/PhysicalReport";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useState } from "react";
import OverallReportDialog from "./reports/OverallReportDialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";
import { dummyAssessmentRunData } from "../types/assessmentRun";
import { SARTReportDialog } from "./reports/SARTReportDialog";
import ML360ReportDialog from "./reports/ML360ReportDialog";

interface ReportsTabProps {
  assessments: {
    cognitive: Assessment[];
    psychological: Assessment[];
    physical: Assessment[];
  };
  viewReport: (id: string) => void;
}

const ReportsTab = ({ assessments, viewReport }: ReportsTabProps) => {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const USER_ID = "user-008";
  const physicalData = {
    injuries: mockInjuries.filter((injury) => injury.userId === USER_ID),
    ippt: getLatestIPPTForUser(USER_ID)!,
    soc: getLatestSOCForUser(USER_ID)!,
    roadMarch: getLatestRoadMarchForUser(USER_ID)!,
    cardio: getLatestCardioForUser(USER_ID)!,
    strength: getLatestStrengthForUser(USER_ID)!,
  };

  const [selectedRunId, setSelectedRunId] = useState(
    dummyAssessmentRunData[0].id
  );
  const handleRunChange = (value: string) => {
    setSelectedRunId(value);
  };

  const [sartDialogOpen, setSartDialogOpen] = useState(false);
  const [ml360DialogOpen, setMl360DialogOpen] = useState(false);
  const handleViewReport = (id: string) => {
    if (id === "sart") {
      setSartDialogOpen(true);
    } else if (id === "ml360") {
      setMl360DialogOpen(true);
    } else {
      viewReport(id);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Assessment Reports
            </h2>
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
                        {run.name} ({format(new Date(run.startDate), "MMM d")} -{" "}
                        {format(new Date(run.endDate), "MMM d, yyyy")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50 dark:border-teal-800"
                onClick={() => setReportDialogOpen(true)}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                View Overall Report
              </Button>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Completed Assessments
            </h3>
            <div className="space-y-3">
              {[...assessments.cognitive, ...assessments.psychological]
                .filter((a) => a.status === "completed")
                .map((assessment) => (
                  <div
                    key={assessment.id}
                    className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {assessment.icon && (
                        <assessment.icon className="mr-2 text-teal-600 dark:text-teal-400 h-5 w-5" />
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {assessment.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Score: {assessment.score}/100
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleViewReport(assessment.id)}
                      className="px-3 py-1 text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-md hover:bg-teal-100 dark:hover:bg-teal-900/50"
                    >
                      View Results
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Physical Training Reports */}
          <PhysicalReport assessments={physicalData} />
        </CardContent>
      </Card>
      <SARTReportDialog
        open={sartDialogOpen}
        onOpenChange={setSartDialogOpen}
      />
      <ML360ReportDialog
        open={ml360DialogOpen}
        onOpenChange={setMl360DialogOpen}
      />
      <OverallReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
      />
    </>
  );
};

export default ReportsTab;
