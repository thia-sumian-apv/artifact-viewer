import { useState, useCallback } from "react";
import {
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	useSensors,
	useSensor,
	PointerSensor,
	closestCorners,
	type CollisionDetection,
	rectIntersection,
	pointerWithin,
} from "@dnd-kit/core";
import { toast } from "sonner";
import AssessmentItem from "./AssessmentItem";
import AssessmentRunsList from "./AssessmentRunsList";
import AssessmentPool from "./AssessmentPool";
import { getAssessmentById } from "../../types/assessment";
import { dummyAssessmentRunData } from "../../types/assessmentRun";

interface AssessmentDndContainerProps {
	courseId: string;
	onAddNewRun: () => void;
}

// Custom collision detection that combines multiple strategies
const customCollisionDetection: CollisionDetection = (args) => {
	// First try to find droppable areas using pointerWithin
	const pointerCollisions = pointerWithin(args);
	if (pointerCollisions.length > 0) return pointerCollisions;

	// Then try intersections if pointer detection didn't work
	const rectCollisions = rectIntersection(args);
	if (rectCollisions.length > 0) return rectCollisions;

	// Finally, use closestCorners as fallback
	return closestCorners(args);
};

const AssessmentDndContainer = ({
	courseId,
	onAddNewRun,
}: AssessmentDndContainerProps) => {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [allAssessmentRuns, setAllAssessmentRuns] = useState(
		dummyAssessmentRunData,
	);

	// Get all assessment IDs that are already assigned to runs for this course
	const assignedAssessmentIds = allAssessmentRuns
		.filter((run) => run.courseId === courseId)
		.flatMap((run) => run.assessments);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;

			if (!over) {
				setActiveId(null);
				return;
			}

			const activeId = active.id as string;
			const overId = over.id as string;

			console.log("Drag end:", { activeId, overId });

			// Clone the assessment runs to modify
			const newAssessmentRuns = [...allAssessmentRuns];

			// Find which run (if any) currently has this assessment
			const sourceRunIndex = newAssessmentRuns.findIndex((run) =>
				run.assessments.includes(activeId),
			);

			// Find the target run by checking if the over ID is either:
			// 1. A run ID directly
			// 2. An assessment ID that belongs to a run
			// 3. A special "pool" ID for the available assessments pool
			let targetRunIndex = newAssessmentRuns.findIndex(
				(run) => run.id === overId,
			);

			if (targetRunIndex === -1) {
				// Check if overId is an assessment in a run
				targetRunIndex = newAssessmentRuns.findIndex((run) =>
					run.assessments.includes(overId),
				);
			}

			// Handle dropping back to the available pool
			if (overId === "available-pool" && sourceRunIndex !== -1) {
				const sourceRun = { ...newAssessmentRuns[sourceRunIndex] };
				sourceRun.assessments = sourceRun.assessments.filter(
					(id) => id !== activeId,
				);
				newAssessmentRuns[sourceRunIndex] = sourceRun;

				setAllAssessmentRuns(newAssessmentRuns);

				const assessment = getAssessmentById(activeId);
				toast.success(
					`${assessment?.title || "Assessment"} moved to available pool`,
				);
				setActiveId(null);
				return;
			}

			// If we're dragging from the pool to a run
			if (sourceRunIndex === -1 && targetRunIndex !== -1) {
				const targetRun = { ...newAssessmentRuns[targetRunIndex] };

				// Only add if it's not already in the target run
				if (!targetRun.assessments.includes(activeId)) {
					targetRun.assessments = [...targetRun.assessments, activeId];
					newAssessmentRuns[targetRunIndex] = targetRun;

					setAllAssessmentRuns(newAssessmentRuns);

					const assessment = getAssessmentById(activeId);
					toast.success(
						`${assessment?.title || "Assessment"} added to ${targetRun.name}`,
					);
				}
			}
			// If we're moving between runs
			else if (
				sourceRunIndex !== -1 &&
				targetRunIndex !== -1 &&
				sourceRunIndex !== targetRunIndex
			) {
				const sourceRun = { ...newAssessmentRuns[sourceRunIndex] };
				const targetRun = { ...newAssessmentRuns[targetRunIndex] };

				// Remove from source run
				sourceRun.assessments = sourceRun.assessments.filter(
					(id) => id !== activeId,
				);
				newAssessmentRuns[sourceRunIndex] = sourceRun;

				// Add to target run if not already there
				if (!targetRun.assessments.includes(activeId)) {
					targetRun.assessments = [...targetRun.assessments, activeId];
					newAssessmentRuns[targetRunIndex] = targetRun;

					const assessment = getAssessmentById(activeId);
					toast.success(
						`${assessment?.title || "Assessment"} moved to ${targetRun.name}`,
					);
				}

				setAllAssessmentRuns(newAssessmentRuns);
			}

			setActiveId(null);
		},
		[allAssessmentRuns],
	);

	const activeAssessment = activeId ? getAssessmentById(activeId) : null;

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={customCollisionDetection}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<div className="lg:col-span-3">
					<AssessmentRunsList
						courseId={courseId}
						onAddNewRun={onAddNewRun}
						assessmentRuns={allAssessmentRuns.filter(
							(run) => run.courseId === courseId,
						)}
						onUpdateAssessmentRun={(updatedRun) => {
							setAllAssessmentRuns((prevRuns) =>
								prevRuns.map((run) =>
									run.id === updatedRun.id ? updatedRun : run,
								),
							);
						}}
					/>
				</div>
				<div>
					<AssessmentPool selectedAssessmentIds={assignedAssessmentIds} />
				</div>
			</div>

			<DragOverlay>
				{activeAssessment && (
					<AssessmentItem assessment={activeAssessment} isDraggable={false} />
				)}
			</DragOverlay>
		</DndContext>
	);
};

export default AssessmentDndContainer;
