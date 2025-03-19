export interface AssessmentRun {
	id: string;
	code: string;
	name: string;
	description: string;
	courseId: string;
	startDate: string;
	endDate: string;
	createdBy: string;
	lastModified: string;
	lastModifiedBy: string;
}

export const dummyAssessmentRunData: AssessmentRun[] = [
	{
		id: "1",
		code: "AR001",
		name: "First Quarter Assessment",
		description: "Q1 2024 Assessment for CDO Course 1",
		courseId: "1",
		startDate: "2024-01-01",
		endDate: "2024-03-31",
		createdBy: "John Doe",
		lastModified: "2024-03-15",
		lastModifiedBy: "Jane Smith",
	},
	{
		id: "2",
		code: "AR002",
		name: "Mid-Term Evaluation",
		description: "Mid-term assessment for CDO Course 2",
		courseId: "2",
		startDate: "2024-02-15",
		endDate: "2024-04-15",
		createdBy: "Jane Smith",
		lastModified: "2024-03-14",
		lastModifiedBy: "John Doe",
	},
	{
		id: "3",
		code: "AR003",
		name: "Final Assessment",
		description: "Final evaluation for CDO Course 1",
		courseId: "1",
		startDate: "2024-04-01",
		endDate: "2024-06-30",
		createdBy: "John Doe",
		lastModified: "2024-03-16",
		lastModifiedBy: "John Doe",
	},
];
