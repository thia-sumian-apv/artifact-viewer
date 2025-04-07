import AssessmentCard from "../AssessmentCard";
import type { Assessment } from "../AssessmentCard";

interface PsychologicalTabProps {
  assessments: {
    psychological: Assessment[];
  };
  startAssessment: (id: string) => void;
  viewReport: (id: string) => void;
}

const PsychologicalTab = ({
  assessments,
  startAssessment,
  viewReport,
}: PsychologicalTabProps) => {
  return (
    <>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Psychological Assessments
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessments.psychological.map((assessment) => (
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

export default PsychologicalTab;
