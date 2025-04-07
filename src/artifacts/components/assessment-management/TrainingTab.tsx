import AssessmentCard, { type Assessment } from "../AssessmentCard";

interface TrainingTabProps {
  modules: Assessment[];
  startTraining: (id: string) => void;
  viewReport: (id: string) => void;
}

const TrainingTab = ({
  modules,
  startTraining,
  viewReport,
}: TrainingTabProps) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <AssessmentCard
            key={module.id}
            assessment={module}
            startAssessment={startTraining}
            viewReport={viewReport}
          />
        ))}
      </div>
    </>
  );
};

export default TrainingTab;
