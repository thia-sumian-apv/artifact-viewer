import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ResultsScreen from "../assessments/sart/ResultsScreen";
import type { SARTResponse } from "../assessments/sart/SARTConfig";

interface SARTReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Generate dummy SART responses (keep this from current implementation)
const generateFixedResponses = (): SARTResponse[] => {
  return [
    // First 4 responses are for digit '3' (2 correct, 2 incorrect)
    {
      digit: 3,
      responseTime: null, // Correct: No response for '3'
      isCorrect: true,
      isPractice: false,
    },
    {
      digit: 3,
      responseTime: 215, // Incorrect: Responded when shouldn't
      isCorrect: false,
      isPractice: false,
    },
    {
      digit: 3,
      responseTime: null, // Correct: No response for '3'
      isCorrect: true,
      isPractice: false,
    },
    {
      digit: 3,
      responseTime: 202, // Incorrect: Responded when shouldn't
      isCorrect: false,
      isPractice: false,
    },
    // Next 6 responses are for non-3 digits (all correct with varied response times)
    {
      digit: 5,
      responseTime: 245, // Fast response
      isCorrect: true,
      isPractice: false,
    },
    {
      digit: 2,
      responseTime: 312, // Medium response
      isCorrect: true,
      isPractice: false,
    },
    {
      digit: 7,
      responseTime: 278, // Medium-fast response
      isCorrect: true,
      isPractice: false,
    },
    {
      digit: 1,
      responseTime: 298, // Medium response
      isCorrect: true,
      isPractice: false,
    },
    {
      digit: 9,
      responseTime: 267, // Medium-fast response
      isCorrect: true,
      isPractice: false,
    },
    {
      digit: 4,
      responseTime: 289, // Medium response
      isCorrect: true,
      isPractice: false,
    },
  ];
};

export const SARTReportDialog = ({
  open,
  onOpenChange,
}: SARTReportDialogProps) => {
  // Generate dummy data
  const dummyResponses = generateFixedResponses();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>SART Assessment Results</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[80vh]">
          <ResultsScreen
            testResponses={dummyResponses}
            onTryAgain={() => {}}
            onFinish={() => onOpenChange(false)}
            containerRef={{ current: null }}
            viewMode="report"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
