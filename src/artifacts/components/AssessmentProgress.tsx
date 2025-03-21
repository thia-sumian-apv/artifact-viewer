import { Brain, Activity, Dumbbell, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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
		<Card className="mb-6 shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
			<CardHeader className="pb-2 p-6">
				<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
					Assessment Progress
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6 pt-0">
				{/* Progress Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white border-0 shadow-md">
						<CardContent className="p-4">
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
								<Progress
									value={getPhysicalProgress().percentage}
									className="h-2 bg-white/20 [&>div]:bg-white"
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white border-0 shadow-md">
						<CardContent className="p-4">
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
								<Progress
									value={psychologicalProgress.percentage}
									className="h-2 bg-white/20 [&>div]:bg-white"
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-r from-teal-500 to-blue-500 dark:from-teal-600 dark:to-blue-600 text-white border-0 shadow-md">
						<CardContent className="p-4">
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
								<Progress
									value={cognitiveProgress.percentage}
									className="h-2 bg-white/20 [&>div]:bg-white"
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Overall Status Text Section */}
				<Card className="mt-4 shadow-sm border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
					<CardContent className="p-4">
						<div className="flex justify-between items-center mb-3">
							<h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
								Overall Assessment Status
							</h2>
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
							<Button
								variant="outline"
								size="sm"
								onClick={() => setActiveTab("reports")}
								className="bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50 dark:border-teal-800"
							>
								<FileText className="h-3.5 w-3.5 mr-1.5" />
								View Overall Report
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 dark:border-indigo-800"
							>
								<FileText className="h-3.5 w-3.5 mr-1.5" />
								Trainer Notes
							</Button>
						</div>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

export default AssessmentProgress;
