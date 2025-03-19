import { Brain, Activity, Dumbbell, FileText } from "lucide-react";

interface ProgressData {
	count: number;
	percentage: number;
}

interface AssessmentProgressProps {
	cognitiveProgress: ProgressData;
	psychologicalProgress: ProgressData;
	getPhysicalProgress: () => ProgressData;
	overallProgress: ProgressData;
	setActiveTab: (tab: string) => void;
}

const AssessmentProgress = ({
	cognitiveProgress,
	psychologicalProgress,
	getPhysicalProgress,
	overallProgress,
	setActiveTab,
}: AssessmentProgressProps) => {
	return (
		<div className="mb-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
			<div className="p-4">
				<div className="flex justify-between items-center mb-3">
					<h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
						Assessment Progress
					</h2>
				</div>

				{/* Progress Cards Grid */}
				<div className="grid grid-cols-3 gap-3">
					<div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-lg p-3 text-white">
						<div className="flex justify-between">
							<div>
								<p className="text-xs font-medium">Physical</p>
								<p className="text-lg font-semibold">
									{getPhysicalProgress().count}/3
								</p>
							</div>
							<Dumbbell className="h-6 w-6 text-white/80" />
						</div>
						<div className="mt-2">
							<progress
								className="progress progress-white w-full h-2"
								value={getPhysicalProgress().percentage}
								max="100"
							/>
						</div>
					</div>

					<div className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 rounded-lg p-3 text-white">
						<div className="flex justify-between">
							<div>
								<p className="text-xs font-medium">Psychological</p>
								<p className="text-lg font-semibold">
									{psychologicalProgress.count}/3
								</p>
							</div>
							<Activity className="h-6 w-6 text-white/80" />
						</div>
						<div className="mt-2">
							<progress
								className="progress progress-white w-full h-2"
								value={psychologicalProgress.percentage}
								max="100"
							/>
						</div>
					</div>

					<div className="bg-gradient-to-r from-teal-500 to-blue-500 dark:from-teal-600 dark:to-blue-600 rounded-lg p-3 text-white">
						<div className="flex justify-between">
							<div>
								<p className="text-xs font-medium">Cognitive</p>
								<p className="text-lg font-semibold">
									{cognitiveProgress.count}/3
								</p>
							</div>
							<Brain className="h-6 w-6 text-white/80" />
						</div>
						<div className="mt-2">
							<progress
								className="progress progress-white w-full h-2"
								value={cognitiveProgress.percentage}
								max="100"
							/>
						</div>
					</div>
				</div>

				{/* Overall Status Text Section */}
				<div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
					<div className="flex justify-between items-center mb-3">
						<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
							Overall Assessment Status
						</h3>
						<div
							className="radial-progress text-blue-600 dark:text-blue-400"
							style={
								{
									"--value": overallProgress.percentage,
									"--size": "2.5rem",
									"--thickness": "5px",
								} as React.CSSProperties
							}
							aria-valuenow={overallProgress.percentage}
							aria-valuemin={0}
							aria-valuemax={100}
							role="progressbar"
							tabIndex={0}
						>
							<span className="text-xs">{overallProgress.percentage}%</span>
						</div>
					</div>
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
						You have completed {overallProgress.count} assessments across all
						categories.
						{overallProgress.percentage < 100
							? " Continue with your remaining assessments to get a comprehensive evaluation."
							: " All assessments are complete. View your comprehensive report for detailed insights."}
					</p>
					<div className="flex space-x-3">
						<button
							type="button"
							onClick={() => setActiveTab("reports")}
							className="px-3 py-2 text-xs rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 flex items-center"
						>
							<FileText className="h-3.5 w-3.5 mr-1.5" />
							View Overall Report
						</button>
						<button
							type="button"
							className="px-3 py-2 text-xs rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center"
						>
							<FileText className="h-3.5 w-3.5 mr-1.5" />
							Trainer Notes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AssessmentProgress;
