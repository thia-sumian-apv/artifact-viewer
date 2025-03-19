import {
	Brain,
	Activity,
	FileText,
	Dumbbell,
	ChevronRight,
} from "lucide-react";
import type { Assessment } from "./AssessmentCard";

interface ProgressData {
	count: number;
	percentage: number;
}

interface DashboardProps {
	assessments: {
		physical: Assessment[];
		cognitive: Assessment[];
		psychological: Assessment[];
	};
	cognitiveProgress: ProgressData;
	psychologicalProgress: ProgressData;
	overallProgress: ProgressData;
	getPhysicalProgress: () => ProgressData;
	setActiveTab: (tab: string) => void;
	viewReport: (id: string) => void;
}

const Dashboard = ({
	assessments,
	cognitiveProgress,
	psychologicalProgress,
	setActiveTab,
	viewReport,
}: DashboardProps) => {
	return (
		<>
			<div className="mb-6">
				{/* Dashboard label and notification buttons removed */}
			</div>

			{/* Large Assessment Launcher Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				{/* Psychological Assessment Launch Card */}
				<div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border border-gray-100 dark:border-gray-700">
					<div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
						{/* This would be replaced with an actual image in production */}
						<div
							className="absolute inset-0 opacity-20"
							style={{
								backgroundImage:
									"url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						/>

						<div className="absolute bottom-4 left-6">
							<h3 className="text-2xl font-bold text-white">Psychological</h3>
							<p className="text-white/80 text-sm">Assessment</p>
						</div>
						<Activity className="absolute top-4 right-4 h-8 w-8 text-white/80" />
					</div>
					<div className="p-6">
						<p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
							Evaluate your leadership behaviors, team resilience, and personal
							motivation levels through comprehensive self-assessment surveys.
						</p>
						<div className="flex justify-between items-center">
							<div>
								<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
									Completed: {psychologicalProgress.count}
								</span>
								<div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1.5">
									<div
										className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full"
										style={{
											width: `${psychologicalProgress.percentage}%`,
										}}
									/>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setActiveTab("psychological")}
								className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600"
							>
								Start Assessment
							</button>
						</div>
					</div>
				</div>

				{/* Cognitive Assessment Launch Card */}
				<div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border border-gray-100 dark:border-gray-700">
					<div className="h-40 bg-gradient-to-r from-teal-500 to-blue-600 relative overflow-hidden">
						{/* This would be replaced with an actual image in production */}
						<div
							className="absolute inset-0 opacity-20"
							style={{
								backgroundImage:
									"url('https://images.unsplash.com/photo-1571310100246-e0676f359b42?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						/>

						<div className="absolute bottom-4 left-6">
							<h3 className="text-2xl font-bold text-white">Cognitive</h3>
							<p className="text-white/80 text-sm">Assessment</p>
						</div>
						<Brain className="absolute top-4 right-4 h-8 w-8 text-white/80" />
					</div>
					<div className="p-6">
						<p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
							Measure your cognitive abilities including attention, visual
							recognition, and spatial planning through interactive, gamified
							exercises.
						</p>
						<div className="flex justify-between items-center">
							<div>
								<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
									Completed: {cognitiveProgress.count}
								</span>
								<div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1.5">
									<div
										className="bg-teal-600 dark:bg-teal-500 h-1.5 rounded-full"
										style={{
											width: `${cognitiveProgress.percentage}%`,
										}}
									/>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setActiveTab("cognitive")}
								className="px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-md text-sm font-medium hover:bg-teal-700 dark:hover:bg-teal-600"
							>
								Start Assessment
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Physical Training Results Card */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
				<div className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Physical Training Results
						</h3>
						<Dumbbell className="h-6 w-6 text-gray-400 dark:text-gray-500" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{assessments.physical.map((assessment) => (
							<div
								key={assessment.id}
								className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center"
							>
								<div>
									<h4 className="text-sm font-medium text-gray-900 dark:text-white">
										{assessment.title}
									</h4>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										{assessment.date}
									</p>
								</div>
								<div className="flex items-center">
									<span className="text-lg font-bold text-teal-600 dark:text-teal-400 mr-2">
										{assessment.score}
									</span>
									<button
										type="button"
										onClick={() => viewReport(assessment.id)}
										className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
									>
										<FileText className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>

					<button
						type="button"
						onClick={() => setActiveTab("physical")}
						className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center hover:text-blue-800 dark:hover:text-blue-300"
					>
						View all physical results
						<ChevronRight className="h-4 w-4 ml-1" />
					</button>
				</div>
			</div>

			<div className="mt-6">
				{/* Assessment Reports & Feedback section removed */}
			</div>
		</>
	);
};

export default Dashboard;
