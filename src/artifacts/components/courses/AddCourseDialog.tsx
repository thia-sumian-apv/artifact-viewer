import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { SelectAssessmentsStep } from "./steps/SelectAssessmentsStep";
import { ConfigureAssessmentsStep } from "./steps/ConfigureAssessmentSteps";
import type { AssessmentConfigs } from "./steps/ConfigureAssessmentSteps";
import type { Assessment } from "../AssessmentCard";
import { Button } from "@/components/ui/button";

interface AddCourseDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

interface FormData {
	basicInfo: {
		courseCode: string;
		courseName: string;
		courseDescription: string;
	};
	selectedAssessments: Assessment[];
	assessmentConfigs: AssessmentConfigs;
}

export function AddCourseDialog({ open, onOpenChange }: AddCourseDialogProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<FormData>({
		basicInfo: {
			courseCode: "",
			courseName: "",
			courseDescription: "",
		},
		selectedAssessments: [],
		assessmentConfigs: {},
	});

	const steps = [
		"Basic Information",
		"Select Assessments",
		"Configure Assessments",
	];

	const handleComplete = async () => {
		// Handle form submission
		toast.success("Course created successfully!");
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl w-full h-[550px] flex flex-col">
				<DialogHeader>
					<div className="flex flex-col space-y-4">
						<DialogTitle>Add New Course</DialogTitle>

						<div className="flex flex-col">
							<div className="flex justify-between mb-1">
								<span className="text-sm font-medium">
									Step {currentStep + 1} of {steps.length}
								</span>
								<span className="text-sm text-muted-foreground">
									{steps[currentStep]}
								</span>
							</div>

							<Progress
								value={((currentStep + 1) / steps.length) * 100}
								className="h-1.5 w-full"
							/>
						</div>
					</div>
				</DialogHeader>

				<div className="mt-4 flex-1 overflow-y-auto">
					{currentStep === 0 && (
						<BasicInfoStep
							data={formData.basicInfo}
							onUpdate={(basicInfo) => setFormData({ ...formData, basicInfo })}
							onNext={() => setCurrentStep(1)}
						/>
					)}
					{currentStep === 1 && (
						<SelectAssessmentsStep
							selected={formData.selectedAssessments}
							onUpdate={(selectedAssessments) =>
								setFormData({ ...formData, selectedAssessments })
							}
							onNext={() => setCurrentStep(2)}
							onBack={() => setCurrentStep(0)}
						/>
					)}
					{currentStep === 2 && (
						<ConfigureAssessmentsStep
							assessments={formData.selectedAssessments}
							configs={formData.assessmentConfigs}
							onUpdate={(assessmentConfigs) =>
								setFormData({ ...formData, assessmentConfigs })
							}
							onBack={() => setCurrentStep(1)}
							onComplete={handleComplete}
						/>
					)}
				</div>

				{/* Fixed footer with navigation buttons */}
				<div className="mt-6 flex justify-between border-t pt-4">
					<div>
						{currentStep > 0 && (
							<Button
								variant="outline"
								onClick={() => setCurrentStep(currentStep - 1)}
							>
								Back
							</Button>
						)}
					</div>

					<div>
						{currentStep < steps.length - 1 ? (
							<Button onClick={() => setCurrentStep(currentStep + 1)}>
								Next
							</Button>
						) : (
							<Button onClick={handleComplete}>Create Course</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
