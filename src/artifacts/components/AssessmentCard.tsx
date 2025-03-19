import { Clock, FileText, Play } from "lucide-react";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";

export interface Assessment {
	id: string;
	title: string;
	description: string;
	status: "available" | "completed" | "in_progress" | string;
	icon?: React.ReactNode;
	duration?: string;
	date?: string;
	progress?: number;
	score?: number;
	type: "cognitive" | "psychological";
}

interface AssessmentCardProps {
	assessment: Assessment;
	startAssessment: (id: string) => void;
	viewReport: (id: string) => void;
}

const AssessmentCard = ({
	assessment,
	startAssessment,
	viewReport,
}: AssessmentCardProps) => {
	const getStatusBadge = () => {
		if (assessment.status === "available") {
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
					Available
				</span>
			);
		}
		if (assessment.status === "completed") {
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300">
					Completed
				</span>
			);
		}
		if (assessment.status === "in_progress") {
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
					In Progress
				</span>
			);
		}

		return (
			<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
				Unavailable
			</span>
		);
	};

	return (
		<Card className="hover:shadow-lg transition-shadow duration-300 border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-hidden">
			<CardHeader className="p-4 h-20 space-y-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center flex-1 min-w-0 pr-2">
						<div className="flex-shrink-0 bg-teal-50 dark:bg-teal-900/30 rounded-lg p-2">
							<div className="text-teal-600 dark:text-teal-400">
								{assessment.icon}
							</div>
						</div>
						<div className="ml-3 flex-1 min-w-0">
							<h3 className="text-base font-medium text-gray-900 dark:text-white">
								{assessment.title}
							</h3>
						</div>
					</div>
					<div className="flex-shrink-0 self-center">{getStatusBadge()}</div>
				</div>
			</CardHeader>

			<CardContent className="px-4 pb-2 pt-0 flex-1">
				<p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 h-12">
					{assessment.description}
				</p>

				<div className="mt-3 space-y-2">
					{assessment.duration && (
						<div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
							<Clock className="flex-shrink-0 h-3 w-3 text-gray-400 dark:text-gray-500" />
							<span className="ml-1">{assessment.duration}</span>
						</div>
					)}
					{assessment.date && (
						<div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
							<Clock className="flex-shrink-0 h-3 w-3 text-gray-400 dark:text-gray-500" />
							<span className="ml-1">Completed: {assessment.date}</span>
						</div>
					)}
				</div>

				{assessment.progress !== undefined && assessment.progress > 0 && (
					<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4">
						<div
							className={`h-1.5 rounded-full ${
								assessment.progress === 100
									? "bg-teal-500 dark:bg-teal-400"
									: "bg-blue-500 dark:bg-blue-400"
							}`}
							style={{ width: `${assessment.progress}%` }}
						/>
					</div>
				)}

				{assessment.score && (
					<div className="flex items-center mt-3">
						<div className="text-xs font-medium text-gray-500 dark:text-gray-400">
							Score:
						</div>
						<div className="ml-2 text-sm font-medium text-teal-600 dark:text-teal-400">
							{assessment.score}/100
						</div>
					</div>
				)}
			</CardContent>

			<CardFooter className="p-4 mt-auto">
				{assessment.status === "completed" ? (
					<button
						type="button"
						onClick={() => viewReport(assessment.id)}
						className="w-full flex justify-center items-center px-3 py-2 border border-transparent rounded-md text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
					>
						<FileText className="h-3 w-3 mr-1" />
						View Report
					</button>
				) : (
					<button
						type="button"
						onClick={() => startAssessment(assessment.id)}
						className="w-full flex justify-center items-center px-3 py-2 border border-transparent rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
					>
						<Play className="h-3 w-3 mr-1" />
						{assessment.status === "in_progress"
							? "Continue"
							: "Start Assessment"}
					</button>
				)}
			</CardFooter>
		</Card>
	);
};

export default AssessmentCard;
