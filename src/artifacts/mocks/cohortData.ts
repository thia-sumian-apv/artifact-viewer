import type { Cohort, Subcohort } from "../types/userGroups";

// Mock data for cohorts and subcohorts
export const mockCohorts: Cohort[] = [
	{
		id: "cohort-001",
		name: "Alpha Company",
		description: "Alpha Company description",
		customLabel: "Company",
		courseIds: ["1"],
		createdAt: new Date(2023, 0, 15),
		updatedAt: new Date(2023, 0, 15),
	},
	{
		id: "cohort-002",
		name: "Bravo Company",
		description: "Bravo Company description",
		customLabel: "Company",
		courseIds: ["1"],
		createdAt: new Date(2023, 0, 20),
		updatedAt: new Date(2023, 1, 5),
	},
	{
		id: "cohort-003",
		name: "Command School",
		description: "Command School description",
		customLabel: "School",
		courseIds: ["1"],
		createdAt: new Date(2023, 2, 10),
		updatedAt: new Date(2023, 2, 10),
	},
];

export const mockSubcohorts: Subcohort[] = [
	{
		id: "subcohort-001",
		name: "1st Platoon",
		description: "1st Platoon description",
		cohortId: "cohort-001",
		createdAt: new Date(2023, 0, 15),
		updatedAt: new Date(2023, 0, 15),
	},
	{
		id: "subcohort-002",
		name: "2nd Platoon",
		description: "2nd Platoon description",
		cohortId: "cohort-001",
		createdAt: new Date(2023, 0, 15),
		updatedAt: new Date(2023, 0, 15),
	},
	{
		id: "subcohort-003",
		name: "1st Platoon",
		description: "1st Platoon description",
		cohortId: "cohort-002",
		createdAt: new Date(2023, 0, 20),
		updatedAt: new Date(2023, 0, 20),
	},
	{
		id: "subcohort-004",
		name: "Leadership Wing",
		description: "Leadership Wing description",
		cohortId: "cohort-003",
		createdAt: new Date(2023, 2, 10),
		updatedAt: new Date(2023, 2, 10),
	},
	{
		id: "subcohort-005",
		name: "Technical Wing",
		description: "Technical Wing description",
		cohortId: "cohort-003",
		createdAt: new Date(2023, 2, 10),
		updatedAt: new Date(2023, 2, 10),
	},
];

// Function to get subcohorts by cohort ID
export const getSubcohortsByCohortId = (cohortId: string): Subcohort[] => {
	return mockSubcohorts.filter((subcohort) => subcohort.cohortId === cohortId);
};
