import AssessmentCard from "./AssessmentCard";
import type { Assessment } from "./AssessmentCard";

interface PhysicalTabProps {
  assessments: {
    physical: Assessment[];
  };
  startAssessment: (id: string) => void;
  viewReport: (id: string) => void;
}

const PhysicalTab = ({
  assessments,
  startAssessment,
  viewReport,
}: PhysicalTabProps) => {
  return (
    <>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Physical Assessments
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessments.physical.map((assessment) => (
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

export default PhysicalTab;
