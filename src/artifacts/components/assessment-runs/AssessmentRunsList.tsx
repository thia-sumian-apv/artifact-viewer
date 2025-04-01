import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { AssessmentRun } from "../../types/assessmentRun";
import AssessmentRunCard from "./AssessmentRunCard";
import EditAssessmentRunDialog from "./EditAssessmentRunDialog";

interface AssessmentRunsListProps {
	courseId: string;
	onAddNewRun: () => void;
	assessmentRuns: AssessmentRun[];
	onUpdateAssessmentRun: (assessmentRun: AssessmentRun) => void;
}

const AssessmentRunsList = ({
	onAddNewRun,
	assessmentRuns,
	onUpdateAssessmentRun,
}: AssessmentRunsListProps) => {
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedRun, setSelectedRun] = useState<AssessmentRun | null>(null);

	const handleEdit = (run: AssessmentRun) => {
		setSelectedRun(run);
		setEditDialogOpen(true);
	};

	const handleDelete = (id: string) => {
		// In a real app, this would delete the assessment run
		console.log("Delete assessment run:", id);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-semibold">
					Assessment Runs ({assessmentRuns.length})
				</h2>
				<Button onClick={onAddNewRun}>
					<Plus className="h-4 w-4 mr-2" />
					Add Assessment Run
				</Button>
			</div>

			<div className="space-y-4">
				{assessmentRuns.length > 0 ? (
					assessmentRuns.map((run) => (
						<AssessmentRunCard
							key={run.id}
							assessmentRun={run}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onUpdateAssessments={onUpdateAssessmentRun}
						/>
					))
				) : (
					<div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
						<p className="">No assessment runs found for this course</p>
						<Button variant="outline" onClick={onAddNewRun} className="mt-4">
							<Plus className="h-4 w-4 mr-2" />
							Create First Assessment Run
						</Button>
					</div>
				)}
			</div>

			{selectedRun && (
				<EditAssessmentRunDialog
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
					assessmentRun={selectedRun}
				/>
			)}
		</div>
	);
};

export default AssessmentRunsList;
