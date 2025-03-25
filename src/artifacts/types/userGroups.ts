// User Groups
export interface Cohort {
	id: string;
	name: string;
	description: string;
	customLabel: string; // Allows customization of "Cohort" label
	courseIds: string[]; // Courses associated with this cohort
	createdAt: Date;
	updatedAt: Date;
}

export interface Subcohort {
	id: string;
	name: string;
	description: string;
	cohortId: string; // Reference to parent cohort
	createdAt: Date;
	updatedAt: Date;
}
