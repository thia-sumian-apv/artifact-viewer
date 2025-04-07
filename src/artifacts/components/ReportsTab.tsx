import type { Assessment } from "./AssessmentCard";

interface ReportsTabProps {
  assessments: {
    cognitive: Assessment[];
    psychological: Assessment[];
    physical: Assessment[];
  };
  viewReport: (id: string) => void;
}

const ReportsTab = ({ assessments, viewReport }: ReportsTabProps) => {
  return (
    <>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Assessment Reports
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
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
                    onClick={() => viewReport(assessment.id)}
                    className="px-3 py-1 text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-md hover:bg-teal-100 dark:hover:bg-teal-900/50"
                  >
                    View Report
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Physical Training Reports
          </h3>
          <div className="space-y-3">
            {assessments.physical.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="text-teal-500 dark:text-teal-400 mr-3">
                    {assessment.icon && (
                      <assessment.icon className="text-teal-500 dark:text-teal-400 mr-3" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {assessment.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Completed: {assessment.date}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => viewReport(assessment.id)}
                  className="px-3 py-1 text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-md hover:bg-teal-100 dark:hover:bg-teal-900/50"
                >
                  View Report
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsTab;
