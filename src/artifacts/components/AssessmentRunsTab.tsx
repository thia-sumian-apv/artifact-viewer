import { useState } from "react";
import AssessmentRunsList from "./assessment-runs/AssessmentRunsList";
import AddAssessmentRunDialog from "./assessment-runs/AddAssessmentRunDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyAssessmentRunData } from "../types/assessmentRun";
import type { AssessmentRun } from "../types/assessmentRun";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { dummyCourseData } from "../mocks/courseData";

const AssessmentRunsTab = () => {
	const [selectedCourseId, setSelectedCourseId] = useState<string>(
		dummyCourseData[0]?.id || "",
	);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [assessmentRuns, setAssessmentRuns] = useState<AssessmentRun[]>(
		dummyAssessmentRunData,
	);

	const handleAddNewRun = () => {
		setAddDialogOpen(true);
	};

	// Filter assessment runs by course ID
	const courseAssessmentRuns = assessmentRuns.filter(
		(run) => run.courseId === selectedCourseId,
	);

	// Update assessment run
	const handleUpdateAssessmentRun = (updatedRun: AssessmentRun) => {
		setAssessmentRuns((prevRuns) =>
			prevRuns.map((run) => (run.id === updatedRun.id ? updatedRun : run)),
		);
	};

	// Add new assessment run
	const handleAddAssessmentRun = (newRun: AssessmentRun) => {
		setAssessmentRuns((prevRuns) => [
			...prevRuns,
			{
				...newRun,
				id: String(prevRuns.length + 1), // Simplified ID generation for demo
				createdBy: "Current User",
				lastModified: new Date().toISOString().split("T")[0],
				lastModifiedBy: "Current User",
			},
		]);
	};

	return (
		<div className="space-y-6">
			<Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
				<CardHeader className="pb-4">
					<CardTitle>Assessment Runs</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div className="grid grid-cols-12 h-[calc(100vh-280px)]">
						{/* Left column - Course Table - Fixed width (4/12 of the total width) */}
						<div className="col-span-4 border-r pr-4 overflow-auto h-full p-6">
							<h3 className="text-lg font-medium mb-4">Courses</h3>
							<div className="overflow-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-1/4">Code</TableHead>
											<TableHead className="w-1/4">Name</TableHead>
											<TableHead className="w-2/4 hidden sm:table-cell">
												Description
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{dummyCourseData.map((course) => (
											<TableRow
												key={course.id}
												className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
													selectedCourseId === course.id
														? "bg-blue-50 dark:bg-blue-900/30"
														: ""
												}`}
												onClick={() => setSelectedCourseId(course.id)}
											>
												<TableCell className="font-medium">
													{course.code}
												</TableCell>
												<TableCell>{course.name}</TableCell>
												<TableCell className="hidden sm:table-cell truncate max-w-[200px]">
													{course.description || "No description"}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>

						{/* Right column - Assessment Runs - Fixed width (8/12 of the total width) */}
						<div className="col-span-8 overflow-auto h-full p-6">
							{selectedCourseId && (
								<AssessmentRunsList
									courseId={selectedCourseId}
									onAddNewRun={handleAddNewRun}
									assessmentRuns={courseAssessmentRuns}
									onUpdateAssessmentRun={handleUpdateAssessmentRun}
								/>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			<AddAssessmentRunDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				courseId={selectedCourseId}
				onAdd={handleAddAssessmentRun}
			/>
		</div>
	);
};

export default AssessmentRunsTab;
