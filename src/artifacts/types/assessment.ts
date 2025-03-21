export interface Assessment {
	id: string;
	title: string;
	type: "cognitive" | "psychological";
	description: string;
	status: "active" | "inactive";
}

// Export the assessment options (moved from SelectAssessmentsStep.tsx)
export const assessmentOptions = {
	cognitive: [
		{
			id: "sart",
			title: "SART",
			type: "cognitive" as const,
			description: "Sustained Attention to Response Task",
			status: "active" as const,
		},
		{
			id: "visual-rxn",
			title: "Visual RXN",
			type: "cognitive" as const,
			description: "Visual Reaction Time Test",
			status: "active" as const,
		},
		{
			id: "spatial-planning",
			title: "Spatial Planning",
			type: "cognitive" as const,
			description: "Spatial Planning and Problem Solving",
			status: "active" as const,
		},
	],
	psychological: [
		{
			id: "ml360",
			title: "ML360 (Self)",
			type: "psychological" as const,
			description: "Self-Assessment Module",
			status: "active" as const,
		},
		{
			id: "ml360-buddy",
			title: "ML360 (Buddy)",
			type: "psychological" as const,
			description: "Peer Assessment Module",
			status: "active" as const,
		},
		{
			id: "ml360-trainer",
			title: "ML360 (Trainer)",
			type: "psychological" as const,
			description: "Trainer Assessment Module",
			status: "active" as const,
		},
		{
			id: "team-resilience",
			title: "Team Resilience",
			type: "psychological" as const,
			description: "Team Resilience Assessment",
			status: "active" as const,
		},
		{
			id: "self-determination",
			title: "Self-Determination",
			type: "psychological" as const,
			description: "Self-Determination Assessment",
			status: "active" as const,
		},
	],
};

// Flatten the assessments for easier access by ID
export const allAssessments = [
	...assessmentOptions.cognitive,
	...assessmentOptions.psychological,
];

export const getAssessmentById = (id: string): Assessment | undefined => {
	return allAssessments.find((assessment) => assessment.id === id);
};
