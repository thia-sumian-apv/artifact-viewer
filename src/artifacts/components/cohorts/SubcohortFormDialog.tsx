import { useState, useEffect, useMemo, type ReactNode } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dummyCourseData } from "../../mocks/courseData";
import type { Subcohort, Cohort } from "../../types/userGroups";

interface SubcohortFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	submitLabel: string;
	cohort: Cohort;
	initialData?: Partial<Subcohort>;
	onSubmit: (data: Omit<Subcohort, "id" | "createdAt" | "updatedAt">) => void;
	trigger: ReactNode; // Add trigger prop
}

const SubcohortFormDialog = ({
	open,
	onOpenChange,
	title,
	description,
	submitLabel,
	cohort,
	initialData,
	onSubmit,
	trigger,
}: SubcohortFormProps) => {
	const [name, setName] = useState(initialData?.name || "");
	const [subcohortDescription, setDescription] = useState(
		initialData?.description || "",
	);

	// Update form when initialData changes (for editing)
	useEffect(() => {
		if (initialData) {
			setName(initialData.name || "");
			setDescription(initialData.description || "");
		}
	}, [initialData]);

	const cohortCourses = useMemo(() => {
		return dummyCourseData.filter((course) =>
			cohort.courseIds.includes(course.id),
		);
	}, [cohort.courseIds]);

	const handleSubmit = () => {
		onSubmit({
			name,
			description: subcohortDescription,
			cohortId: cohort.id,
		});

		// Reset form and close dialog
		resetForm();
		onOpenChange(false);
	};

	const resetForm = () => {
		if (!initialData) {
			setName("");
			setDescription("");
		} else {
			setName(initialData.name || "");
			setDescription(initialData.description || "");
		}
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
							<Label>Parent {cohort.customLabel}</Label>
							<div className="h-10 px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
								{cohort.name}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="name">Subcohort Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder={`Enter name for this ${cohort.customLabel.toLowerCase()} unit`}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={subcohortDescription}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Enter subcohort description"
							rows={3}
						/>
					</div>

					<div className="space-y-2">
						<Label>Associated Courses (inherited)</Label>
						<div className="rounded-md border p-4 bg-gray-50 dark:bg-gray-800">
							{cohortCourses.length > 0 ? (
								<div className="flex flex-wrap gap-2">
									{cohortCourses.map((course) => (
										<Badge key={course.id} variant="secondary">
											{course.name} ({course.code})
										</Badge>
									))}
								</div>
							) : (
								<p className="text-sm text-gray-500">
									No courses associated with this cohort
								</p>
							)}
							<p className="text-xs text-gray-500 mt-2 italic">
								Subcohorts automatically inherit all courses from their parent{" "}
								{cohort.customLabel.toLowerCase()}.
							</p>
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

export default SubcohortFormDialog;
