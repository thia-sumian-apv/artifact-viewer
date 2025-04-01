import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import AssessmentItem from "./AssessmentItem";
import { allAssessments } from "../../types/assessment";

interface AssessmentPoolProps {
	selectedAssessmentIds: string[];
}

const AssessmentPool = ({ selectedAssessmentIds }: AssessmentPoolProps) => {
	// Set up droppable area for the pool
	const { setNodeRef } = useDroppable({
		id: "available-pool",
	});

	// Filter out assessments that are already selected
	const availableAssessments = useMemo(() => {
		return allAssessments.filter(
			(assessment) => !selectedAssessmentIds.includes(assessment.id),
		);
	}, [selectedAssessmentIds]);

	const cognitiveAssessments = availableAssessments.filter(
		(assessment) => assessment.type === "cognitive",
	);
	const psychologicalAssessments = availableAssessments.filter(
		(assessment) => assessment.type === "psychological",
	);

	return (
		<Card
			className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
			ref={setNodeRef}
		>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg">Available Assessments</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-2 ">Cognitive</h3>
					<SortableContext
						items={cognitiveAssessments.map((a) => a.id)}
						strategy={verticalListSortingStrategy}
					>
						<div className="space-y-2">
							{cognitiveAssessments.map((assessment) => (
								<AssessmentItem key={assessment.id} assessment={assessment} />
							))}
							{cognitiveAssessments.length === 0 && (
								<p className="text-sm  italic">
									All cognitive assessments are assigned
								</p>
							)}
						</div>
					</SortableContext>
				</div>

				<div>
					<h3 className="text-sm font-medium mb-2 ">Psychological</h3>
					<SortableContext
						items={psychologicalAssessments.map((a) => a.id)}
						strategy={verticalListSortingStrategy}
					>
						<div className="space-y-2">
							{psychologicalAssessments.map((assessment) => (
								<AssessmentItem key={assessment.id} assessment={assessment} />
							))}
							{psychologicalAssessments.length === 0 && (
								<p className="text-sm  italic">
									All psychological assessments are assigned
								</p>
							)}
						</div>
					</SortableContext>
				</div>
			</CardContent>
		</Card>
	);
};

export default AssessmentPool;
