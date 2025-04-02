import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Pencil, Trash2, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { AssessmentRun } from "../../types/assessmentRun";
import { getAssessmentById } from "../../types/assessment";
import EditAssessmentsDialog from "./EditAssessmentsDialog";

interface AssessmentRunCardProps {
	assessmentRun: AssessmentRun;
	onEdit: (assessmentRun: AssessmentRun) => void;
	onDelete: (assessmentRunId: string) => void;
	onUpdateAssessments: (assessmentRun: AssessmentRun) => void;
}

const AssessmentRunCard = ({
	assessmentRun,
	onEdit,
	onDelete,
	onUpdateAssessments,
}: AssessmentRunCardProps) => {
	const [editAssessmentsOpen, setEditAssessmentsOpen] = useState(false);

	const assignedAssessments = useMemo(() => {
		return assessmentRun.assessments
			.map(getAssessmentById)
			.filter(
				(
					assessment,
				): assessment is NonNullable<ReturnType<typeof getAssessmentById>> =>
					assessment !== undefined,
			);
	}, [assessmentRun.assessments]);

	// Determine color scheme based on assessment types
	const cognitiveCount = assignedAssessments.filter(
		(a) => a.type === "cognitive",
	).length;
	const psychologicalCount = assignedAssessments.filter(
		(a) => a.type === "psychological",
	).length;

	// Select appropriate gradient colors
	const gradientClass =
		cognitiveCount > psychologicalCount
			? "from-teal-500 to-blue-500 dark:from-teal-600 dark:to-blue-600"
			: "from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700";

	return (
		<>
			<Card className="overflow-hidden shadow-sm border-0 mb-4">
				<div className={`bg-gradient-to-r ${gradientClass} text-white p-5`}>
					<div className="flex justify-between items-start">
						<div>
							<div className="text-white/80 text-sm font-medium">
								{assessmentRun.code}
							</div>
							<h3 className="text-xl font-bold text-white">
								{assessmentRun.name}
							</h3>
							<div className="flex items-center mt-2">
								<Calendar className="h-4 w-4 mr-2 text-white/80" />
								<span className="text-sm text-white">
									{format(new Date(assessmentRun.startDate), "MMM d")} —
									{format(new Date(assessmentRun.endDate), "MMM d, yyyy")}
								</span>
							</div>
						</div>
						<div className="flex gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => onEdit(assessmentRun)}
								className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
								title="Edit Details"
							>
								<Pencil className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setEditAssessmentsOpen(true)}
								className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
								title="Edit Assessments"
							>
								<ListPlus className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => onDelete(assessmentRun.id)}
								className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
								title="Delete"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
					{assessmentRun.description && (
						<p className="text-white/80 text-sm mt-3 max-w-3xl">
							{assessmentRun.description}
						</p>
					)}
				</div>

				<CardContent className="p-5 bg-white dark:bg-gray-800">
					<div>
						<div className="text-sm font-medium mb-3 flex items-center">
							<span className="text-gray-900 dark:text-white">
								Assigned Assessments ({assignedAssessments.length})
							</span>
						</div>

						<div className="space-y-2">
							{assignedAssessments.map((assessment) => (
								<div
									key={assessment.id}
									className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
								>
									<div className="flex items-center">
										<div
											className={`flex-shrink-0 rounded-lg p-2 ${
												assessment.type === "cognitive"
													? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
													: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
											} flex items-center justify-center`}
										>
											{assessment.type === "cognitive" ? (
												<span
													className="material-symbols-outlined"
													style={{ fontSize: "22px", lineHeight: 1 }}
												>
													neurology
												</span>
											) : (
												<span
													className="material-icons"
													style={{ fontSize: "22px", lineHeight: 1 }}
												>
													psychology
												</span>
											)}
										</div>
										<div className="ml-3 flex-1 min-w-0">
											<h3 className="text-sm font-medium text-gray-900 dark:text-white">
												{assessment.title}
											</h3>
											<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
												{assessment.description}
											</p>
										</div>
									</div>
								</div>
							))}
							{assignedAssessments.length === 0 && (
								<div className="text-center py-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-md">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										No assessments assigned
									</p>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setEditAssessmentsOpen(true)}
										className="mt-2"
									>
										<ListPlus className="h-4 w-4 mr-2" />
										Add Assessments
									</Button>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			<EditAssessmentsDialog
				open={editAssessmentsOpen}
				onOpenChange={setEditAssessmentsOpen}
				assessmentRun={assessmentRun}
				onSave={onUpdateAssessments}
			/>
		</>
	);
};

export default AssessmentRunCard;
