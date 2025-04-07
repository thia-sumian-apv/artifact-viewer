import AssessmentCard from "../AssessmentCard";
import type { Assessment } from "../AssessmentCard";

interface CognitiveTabProps {
  assessments: {
    cognitive: Assessment[];
  };
  startAssessment: (id: string) => void;
  viewReport: (id: string) => void;
}

const CognitiveTab = ({
  assessments,
  startAssessment,
  viewReport,
}: CognitiveTabProps) => {
  return (
    <>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Cognitive Assessments
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessments.cognitive.map((assessment) => (
          <AssessmentCard
            key={assessment.id}
            assessment={assessment}
            startAssessment={startAssessment}
            viewReport={viewReport}
          />
        ))}
      </div>
    </>
  );
};

export default CognitiveTab;
