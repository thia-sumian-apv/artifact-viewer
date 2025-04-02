import { ChevronRight } from "lucide-react";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Assessment } from "./AssessmentCard";
import AssessmentProgress from "./AssessmentProgress";

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
	getPhysicalProgress,
	overallProgress,
	setActiveTab,
	viewReport,
}: DashboardProps) => {
	return (
		<>
			{/* Add AssessmentProgress component here */}
			<AssessmentProgress
				cognitiveProgress={cognitiveProgress}
				psychologicalProgress={psychologicalProgress}
				getPhysicalProgress={getPhysicalProgress}
				overallProgress={overallProgress}
				setActiveTab={setActiveTab}
			/>
			<div className="mb-6">
				{/* Dashboard label and notification buttons removed */}
			</div>

			{/* Large Assessment Launcher Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				{/* Psychological Assessment Launch Card */}
				<Card className="overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
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
						<span
							className="material-icons absolute top-4 right-4 h-8 w-8 text-white/80"
							style={{ fontSize: "32px" }}
						>
							psychology
						</span>
					</div>
					<CardContent className="p-6">
						<p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
							Evaluate your leadership behaviors, team resilience, and personal
							motivation levels through comprehensive self-assessment surveys.
						</p>
						<div className="flex justify-between items-center">
							<div>
								<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
									Completed: {psychologicalProgress.count}
								</span>
								<Progress
									value={psychologicalProgress.percentage}
									className="w-32 h-1.5 mt-1.5 [&>div]:bg-indigo-600 dark:[&>div]:bg-indigo-500"
								/>
							</div>
							<Button
								onClick={() => setActiveTab("psychological")}
								className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white"
								size="sm"
							>
								Start Assessment
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Cognitive Assessment Launch Card */}
				<Card className="overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
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
						<span
							className="material-symbols-outlined absolute top-4 right-4 h-8 w-8 text-white/80"
							style={{ fontSize: "32px" }}
						>
							neurology
						</span>
					</div>
					<CardContent className="p-6">
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
								<Progress
									value={cognitiveProgress.percentage}
									className="w-32 h-1.5 mt-1.5 [&>div]:bg-teal-600 dark:[&>div]:bg-teal-500"
								/>
							</div>
							<Button
								onClick={() => setActiveTab("cognitive")}
								className="bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 text-white"
								size="sm"
							>
								Start Assessment
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Physical Training Results Card */}
			<Card className="shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
				<CardHeader className="p-6 pb-0">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
							Physical Training Results
						</CardTitle>
						<span
							className="material-symbols-outlined text-gray-400 dark:text-gray-500"
							style={{
								fontSize: "24px",
								lineHeight: 1,
								width: "24px",
								height: "24px",
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							exercise
						</span>
					</div>
				</CardHeader>
				<CardContent className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{assessments.physical.map((assessment) => (
							<div
								key={assessment.id}
								className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center"
							>
								<div className="flex items-center">
									{/* Add appropriate icon based on assessment id */}
									{assessment.id === "cardio" && (
										<span
											className="material-symbols-outlined mr-2 text-teal-600 dark:text-teal-400"
											style={{
												fontSize: "20px",
												lineHeight: 1,
												display: "inline-flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											cardiology
										</span>
									)}
									{assessment.id === "strength" && (
										<span
											className="material-symbols-outlined mr-2 text-teal-600 dark:text-teal-400"
											style={{
												fontSize: "20px",
												lineHeight: 1,
												display: "inline-flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											exercise
										</span>
									)}
									{assessment.id === "ippt" && (
										<span
											className="material-symbols-outlined mr-2 text-teal-600 dark:text-teal-400"
											style={{
												fontSize: "20px",
												lineHeight: 1,
												display: "inline-flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											directions_run
										</span>
									)}
									<div>
										<h4 className="text-sm font-medium text-gray-900 dark:text-white">
											{assessment.title}
										</h4>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
											{assessment.date}
										</p>
									</div>
								</div>
								<div className="flex items-center">
									<Badge
										variant="outline"
										className="text-lg font-bold text-teal-600 dark:text-teal-400 mr-2 bg-transparent"
									>
										{assessment.score}
									</Badge>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => viewReport(assessment.id)}
										className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
									>
										<span
											className="material-symbols-outlined"
											style={{
												fontSize: "16px",
												lineHeight: 1,
												display: "inline-flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											description
										</span>
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
				<CardFooter className="px-6 pb-6 pt-0">
					<Button
						variant="link"
						onClick={() => setActiveTab("physical")}
						className="p-0 text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center hover:text-blue-800 dark:hover:text-blue-300"
					>
						View all physical results
						<ChevronRight className="h-4 w-4 ml-1" />
					</Button>
				</CardFooter>
			</Card>

			<div className="mt-6">
				{/* Assessment Reports & Feedback section removed */}
			</div>
		</>
	);
};

export default Dashboard;
