import { useState, useCallback, useMemo, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Activity } from "lucide-react";
import type { AssessmentRun } from "../../types/assessmentRun";
import { allAssessments, getAssessmentById } from "../../types/assessment";

interface EditAssessmentsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	assessmentRun: AssessmentRun;
	onSave: (assessmentRun: AssessmentRun) => void;
}

// Create a simple drag and drop item component
function DraggableAssessmentItem({
	assessment,
	onDragStart,
	isDropTarget = false,
}: {
	assessment: NonNullable<ReturnType<typeof getAssessmentById>>; // Changed type here
	onDragStart: (id: string) => void;
	isDropTarget?: boolean;
}) {
	return (
		<div
			draggable={!isDropTarget}
			onDragStart={(e) => {
				e.dataTransfer.setData("text/plain", assessment.id);
				onDragStart(assessment.id);
			}}
			className={`p-3 rounded-md border flex items-center justify-between 
              ${isDropTarget ? "cursor-default" : "cursor-grab active:cursor-grabbing"}
              ${
								assessment.type === "cognitive"
									? "border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/30"
									: "border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/30"
							}`}
		>
			<div className="flex items-center">
				{assessment.type === "cognitive" ? (
					<Brain className="h-4 w-4 mr-2 text-teal-600" />
				) : (
					<Activity className="h-4 w-4 mr-2 text-indigo-600" />
				)}
				<span className="font-medium">{assessment.title}</span>
			</div>
		</div>
	);
}

// Create a drop container component
function DropContainer({
	title,
	children,
	onDrop,
	isOver,
	setIsOver,
}: {
	id: string;
	title: string;
	children: React.ReactNode;
	onDrop: (id: string) => void;
	isOver: boolean;
	setIsOver: (isOver: boolean) => void;
}) {
	return (
		<div
			onDragOver={(e) => {
				e.preventDefault();
				if (!isOver) setIsOver(true);
			}}
			onDragEnter={(e) => {
				e.preventDefault();
				setIsOver(true);
			}}
			onDragLeave={(e) => {
				const rect = e.currentTarget.getBoundingClientRect();
				const x = e.clientX;
				const y = e.clientY;

				// Only set isOver to false if the cursor has actually left the element
				if (
					x < rect.left ||
					x >= rect.right ||
					y < rect.top ||
					y >= rect.bottom
				) {
					setIsOver(false);
				}
			}}
			onDrop={(e) => {
				e.preventDefault();
				setIsOver(false);
				const id = e.dataTransfer.getData("text/plain");
				onDrop(id);
			}}
			className={`p-3 rounded-md border-2 transition-colors h-full flex flex-col ${
				isOver
					? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20"
					: "border-transparent"
			}`}
		>
			<h3 className="text-sm font-medium mb-3">{title}</h3>
			<div className="space-y-2 overflow-y-auto flex-1">{children}</div>
		</div>
	);
}

const EditAssessmentsDialog = ({
	open,
	onOpenChange,
	assessmentRun,
	onSave,
}: EditAssessmentsDialogProps) => {
	// Local state for selected assessment IDs
	const [selectedIds, setSelectedIds] = useState<string[]>(
		assessmentRun.assessments,
	);
	const [_draggingId, setDraggingId] = useState<string | null>(null);
	const [isOverAssigned, setIsOverAssigned] = useState(false);
	const [isOverAvailable, setIsOverAvailable] = useState(false);

	// Reset selection when dialog opens with new assessment run
	useEffect(() => {
		if (open) {
			setSelectedIds(assessmentRun.assessments);
		}
	}, [open, assessmentRun]);

	// Get assigned assessments
	const assignedAssessments = useMemo(() => {
		return selectedIds
			.map(getAssessmentById)
			.filter(
				(
					assessment,
				): assessment is NonNullable<ReturnType<typeof getAssessmentById>> =>
					assessment !== undefined,
			);
	}, [selectedIds]);

	// Get available (unassigned) assessments
	const availableAssessments = useMemo(() => {
		return allAssessments.filter(
			(assessment) => !selectedIds.includes(assessment.id),
		);
	}, [selectedIds]);

	// Group assessments by type
	const assignedCognitiveAssessments = assignedAssessments.filter(
		(a) => a.type === "cognitive",
	);
	const assignedPsychologicalAssessments = assignedAssessments.filter(
		(a) => a.type === "psychological",
	);
	const availableCognitiveAssessments = availableAssessments.filter(
		(a) => a.type === "cognitive",
	);
	const availablePsychologicalAssessments = availableAssessments.filter(
		(a) => a.type === "psychological",
	);

	const handleDropToAssigned = useCallback(
		(id: string) => {
			if (!selectedIds.includes(id)) {
				setSelectedIds((prev) => [...prev, id]);
				const assessment = getAssessmentById(id);
				toast.success(`${assessment?.title || "Assessment"} added to run`);
			}
		},
		[selectedIds],
	);

	const handleDropToAvailable = useCallback(
		(id: string) => {
			if (selectedIds.includes(id)) {
				setSelectedIds((prev) => prev.filter((item) => item !== id));
				const assessment = getAssessmentById(id);
				toast.success(`${assessment?.title || "Assessment"} removed from run`);
			}
		},
		[selectedIds],
	);

	const handleSave = () => {
		onSave({
			...assessmentRun,
			assessments: selectedIds,
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[850px] h-[600px] flex flex-col">
				<DialogHeader>
					<DialogTitle>Edit Assessments for {assessmentRun.name}</DialogTitle>
				</DialogHeader>

				<div className="flex-1 py-4 overflow-hidden">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
						{/* Assigned Assessments */}
						<Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[450px]">
							<CardHeader className="pb-2">
								<CardTitle className="text-lg">Assigned Assessments</CardTitle>
							</CardHeader>
							<CardContent className="flex-1 overflow-hidden pb-4">
								<DropContainer
									id="assigned-container"
									title="Drag assessments here to add to this run"
									onDrop={handleDropToAssigned}
									isOver={isOverAssigned}
									setIsOver={setIsOverAssigned}
								>
									{/* Cognitive section */}
									<div>
										<h3 className="text-sm font-medium mb-2  flex items-center">
											<Brain className="h-4 w-4 mr-2 text-teal-600" />
											Cognitive ({assignedCognitiveAssessments.length})
										</h3>
										<div className="space-y-2">
											{assignedCognitiveAssessments.map((assessment) => (
												<DraggableAssessmentItem
													key={assessment.id}
													assessment={assessment}
													onDragStart={setDraggingId}
												/>
											))}
											{assignedCognitiveAssessments.length === 0 && (
												<p className="text-sm  italic">
													No cognitive assessments assigned
												</p>
											)}
										</div>
									</div>

									{/* Psychological section */}
									<div className="mt-4">
										<h3 className="text-sm font-medium mb-2  flex items-center">
											<Activity className="h-4 w-4 mr-2 text-indigo-600" />
											Psychological ({assignedPsychologicalAssessments.length})
										</h3>
										<div className="space-y-2">
											{assignedPsychologicalAssessments.map((assessment) => (
												<DraggableAssessmentItem
													key={assessment.id}
													assessment={assessment}
													onDragStart={setDraggingId}
												/>
											))}
											{assignedPsychologicalAssessments.length === 0 && (
												<p className="text-sm  italic">
													No psychological assessments assigned
												</p>
											)}
										</div>
									</div>
								</DropContainer>
							</CardContent>
						</Card>

						{/* Available Assessments */}
						<Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[450px]">
							<CardHeader className="pb-2">
								<CardTitle className="text-lg">Available Assessments</CardTitle>
							</CardHeader>
							<CardContent className="flex-1 overflow-hidden pb-4">
								<DropContainer
									id="available-container"
									title="Drag assessments here to remove from this run"
									onDrop={handleDropToAvailable}
									isOver={isOverAvailable}
									setIsOver={setIsOverAvailable}
								>
									{/* Cognitive section */}
									<div>
										<h3 className="text-sm font-medium mb-2  flex items-center">
											<Brain className="h-4 w-4 mr-2 text-teal-600" />
											Cognitive ({availableCognitiveAssessments.length})
										</h3>
										<div className="space-y-2">
											{availableCognitiveAssessments.map((assessment) => (
												<DraggableAssessmentItem
													key={assessment.id}
													assessment={assessment}
													onDragStart={setDraggingId}
												/>
											))}
											{availableCognitiveAssessments.length === 0 && (
												<p className="text-sm  italic">
													All cognitive assessments are assigned
												</p>
											)}
										</div>
									</div>

									{/* Psychological section */}
									<div className="mt-4">
										<h3 className="text-sm font-medium mb-2  flex items-center">
											<Activity className="h-4 w-4 mr-2 text-indigo-600" />
											Psychological ({availablePsychologicalAssessments.length})
										</h3>
										<div className="space-y-2">
											{availablePsychologicalAssessments.map((assessment) => (
												<DraggableAssessmentItem
													key={assessment.id}
													assessment={assessment}
													onDragStart={setDraggingId}
												/>
											))}
											{availablePsychologicalAssessments.length === 0 && (
												<p className="text-sm  italic">
													All psychological assessments are assigned
												</p>
											)}
										</div>
									</div>
								</DropContainer>
							</CardContent>
						</Card>
					</div>
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button type="button" onClick={handleSave}>
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditAssessmentsDialog;
