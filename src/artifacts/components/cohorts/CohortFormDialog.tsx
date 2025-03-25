import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { dummyCourseData } from "../../mocks/courseData";
import type { Cohort } from "../../types/userGroups";

interface CohortFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	submitLabel: string;
	initialData?: Partial<Cohort>;
	onSubmit: (data: Omit<Cohort, "id" | "createdAt" | "updatedAt">) => void;
	trigger: ReactNode; // Add this prop for the trigger button
}

const CohortFormDialog = ({
	open,
	onOpenChange,
	title,
	description,
	submitLabel,
	initialData,
	onSubmit,
	trigger,
}: CohortFormProps) => {
	const [name, setName] = useState(initialData?.name || "");
	const [cohortDescription, setDescription] = useState(
		initialData?.description || "",
	);
	const [customLabel, setCustomLabel] = useState(
		initialData?.customLabel || "Cohort",
	);
	const [selectedCourses, setSelectedCourses] = useState<string[]>(
		initialData?.courseIds || [],
	);

	// Update form when initialData changes (for editing)
	useEffect(() => {
		if (initialData) {
			setName(initialData.name || "");
			setDescription(initialData.description || "");
			setCustomLabel(initialData.customLabel || "Cohort");
			setSelectedCourses(initialData.courseIds || []);
		}
	}, [initialData]);

	const handleSubmit = () => {
		onSubmit({
			name,
			description: cohortDescription,
			customLabel,
			courseIds: selectedCourses,
		});

		// Reset form and close dialog
		resetForm();
		onOpenChange(false);
	};

	const resetForm = () => {
		if (!initialData) {
			setName("");
			setDescription("");
			setCustomLabel("Cohort");
			setSelectedCourses([]);
		} else {
			setName(initialData.name || "");
			setDescription(initialData.description || "");
			setCustomLabel(initialData.customLabel || "Cohort");
			setSelectedCourses(initialData.courseIds || []);
		}
	};

	const toggleCourse = (courseId: string) => {
		setSelectedCourses((prev) =>
			prev.includes(courseId)
				? prev.filter((id) => id !== courseId)
				: [...prev, courseId],
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter cohort name"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="customLabel">Custom Label</Label>
							<Input
								id="customLabel"
								value={customLabel}
								onChange={(e) => setCustomLabel(e.target.value)}
								placeholder="Cohort"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={cohortDescription}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Enter cohort description"
							rows={3}
						/>
					</div>

					<div className="space-y-2">
						<Label>Courses</Label>
						<div className="rounded-md p-4 max-h-[200px] overflow-y-auto grid grid-cols-2 gap-2">
							{dummyCourseData.map((course) => (
								<div key={course.id} className="flex items-center space-x-2">
									<Checkbox
										id={`course-${course.id}`}
										checked={selectedCourses.includes(course.id)}
										onCheckedChange={() => toggleCourse(course.id)}
									/>
									<Label
										htmlFor={`course-${course.id}`}
										className="text-sm font-normal cursor-pointer"
									>
										{course.name} ({course.code})
									</Label>
								</div>
							))}
							{dummyCourseData.length === 0 && (
								<p className="text-sm text-gray-500">No courses available</p>
							)}
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => {
							resetForm();
							onOpenChange(false);
						}}
					>
						Cancel
					</Button>
					<Button type="submit" onClick={handleSubmit} disabled={!name.trim()}>
						{submitLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CohortFormDialog;
