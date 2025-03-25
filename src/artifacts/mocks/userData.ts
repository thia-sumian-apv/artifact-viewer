import type { User } from "../types/users";
import { mockCohorts, mockSubcohorts } from "./cohortData";
import { dummyCourseData } from "./courseData";

// Mock Users
export const mockUsers: User[] = [
	// Super Admin
	{
		id: "user-001",
		firstName: "Alex",
		lastName: "Rodriguez",
		email: "alex.rodriguez@example.com",
		age: 40,
		weight: 78,
		height: 180,
		dateOfBirth: new Date(1983, 5, 10),
		gender: "male",
		role: "superAdmin",
		createdAt: new Date(2022, 11, 1),
		updatedAt: new Date(2022, 11, 1),
	},

	// Company Admin
	{
		id: "user-002",
		firstName: "Sarah",
		lastName: "Johnson",
		email: "sarah.johnson@example.com",
		age: 35,
		weight: 65,
		height: 170,
		dateOfBirth: new Date(1988, 3, 15),
		gender: "female",
		role: "companyAdmin",
		companyId: "comp-001",
		createdAt: new Date(2022, 11, 10),
		updatedAt: new Date(2022, 11, 10),
	},

	// Course Commanders
	{
		id: "user-003",
		firstName: "Michael",
		lastName: "Chen",
		email: "michael.chen@example.com",
		age: 38,
		weight: 75,
		height: 178,
		dateOfBirth: new Date(1985, 7, 22),
		gender: "male",
		role: "courseCommander",
		courseIds: ["1", "2"],
		companyId: "comp-001", // Added company association
		createdAt: new Date(2023, 0, 5),
		updatedAt: new Date(2023, 0, 5),
	},
	{
		id: "user-004",
		firstName: "Emily",
		lastName: "Wong",
		email: "emily.wong@example.com",
		age: 36,
		weight: 62,
		height: 165,
		dateOfBirth: new Date(1987, 9, 12),
		gender: "female",
		role: "courseCommander",
		courseIds: ["3"],
		companyId: "comp-002", // Added company association
		createdAt: new Date(2023, 0, 8),
		updatedAt: new Date(2023, 0, 8),
	},

	// Course Trainers
	{
		id: "user-005",
		firstName: "David",
		lastName: "Smith",
		email: "david.smith@example.com",
		age: 32,
		weight: 82,
		height: 185,
		dateOfBirth: new Date(1991, 2, 28),
		gender: "male",
		role: "courseTrainer",
		subcohortId: "subcohort-001",
		companyId: "comp-001", // Added company association
		createdAt: new Date(2023, 0, 15),
		updatedAt: new Date(2023, 0, 15),
	},
	{
		id: "user-006",
		firstName: "Jessica",
		lastName: "Lee",
		email: "jessica.lee@example.com",
		age: 30,
		weight: 58,
		height: 168,
		dateOfBirth: new Date(1993, 4, 17),
		gender: "female",
		role: "courseTrainer",
		subcohortId: "subcohort-002",
		companyId: "comp-001", // Added company association
		createdAt: new Date(2023, 0, 15),
		updatedAt: new Date(2023, 0, 15),
	},
	{
		id: "user-007",
		firstName: "Robert",
		lastName: "Tan",
		email: "robert.tan@example.com",
		age: 34,
		weight: 76,
		height: 175,
		dateOfBirth: new Date(1989, 11, 5),
		gender: "male",
		role: "courseTrainer",
		subcohortId: "subcohort-003",
		companyId: "comp-002", // Added company association
		createdAt: new Date(2023, 0, 20),
		updatedAt: new Date(2023, 0, 20),
	},

	// Trainees
	{
		id: "user-008",
		firstName: "Thomas",
		lastName: "Garcia",
		email: "thomas.garcia@example.com",
		age: 22,
		weight: 70,
		height: 175,
		dateOfBirth: new Date(2001, 5, 30),
		gender: "male",
		role: "trainee",
		subcohortId: "subcohort-001",
		companyId: "comp-001", // Added company association
		buddyIds: ["user-009"],
		trainerIds: ["user-005"],
		createdAt: new Date(2023, 0, 15),
		updatedAt: new Date(2023, 0, 15),
	},
	{
		id: "user-009",
		firstName: "James",
		lastName: "Wilson",
		email: "james.wilson@example.com",
		age: 23,
		weight: 68,
		height: 172,
		dateOfBirth: new Date(2000, 2, 15),
		gender: "male",
		role: "trainee",
		subcohortId: "subcohort-001",
		companyId: "comp-001", // Added company association
		buddyIds: ["user-008"],
		trainerIds: ["user-005"],
		createdAt: new Date(2023, 0, 15),
		updatedAt: new Date(2023, 0, 15),
	},
	{
		id: "user-010",
		firstName: "Emma",
		lastName: "Thompson",
		email: "emma.thompson@example.com",
		age: 22,
		weight: 55,
		height: 165,
		dateOfBirth: new Date(2001, 7, 12),
		gender: "female",
		role: "trainee",
		subcohortId: "subcohort-002",
		companyId: "comp-001", // Added company association
		buddyIds: ["user-011"],
		trainerIds: ["user-006"],
		createdAt: new Date(2023, 0, 15),
		updatedAt: new Date(2023, 0, 15),
	},
	{
		id: "user-011",
		firstName: "Olivia",
		lastName: "Brown",
		email: "olivia.brown@example.com",
		age: 21,
		weight: 53,
		height: 163,
		dateOfBirth: new Date(2002, 1, 20),
		gender: "female",
		role: "trainee",
		subcohortId: "subcohort-002",
		companyId: "comp-001", // Added company association
		buddyIds: ["user-010"],
		trainerIds: ["user-006"],
		createdAt: new Date(2023, 0, 15),
		updatedAt: new Date(2023, 0, 15),
	},
	// Add some trainees for the other companies
	{
		id: "user-012",
		firstName: "William",
		lastName: "Davis",
		email: "william.davis@example.com",
		age: 24,
		weight: 72,
		height: 180,
		dateOfBirth: new Date(1999, 8, 5),
		gender: "male",
		role: "trainee",
		subcohortId: "subcohort-003",
		companyId: "comp-002", // Added company association
		buddyIds: ["user-013"],
		trainerIds: ["user-007"],
		createdAt: new Date(2023, 0, 20),
		updatedAt: new Date(2023, 0, 20),
	},
	{
		id: "user-013",
		firstName: "Sophia",
		lastName: "Miller",
		email: "sophia.miller@example.com",
		age: 23,
		weight: 59,
		height: 167,
		dateOfBirth: new Date(2000, 4, 18),
		gender: "female",
		role: "trainee",
		subcohortId: "subcohort-003",
		companyId: "comp-002", // Added company association
		buddyIds: ["user-012"],
		trainerIds: ["user-007"],
		createdAt: new Date(2023, 0, 20),
		updatedAt: new Date(2023, 0, 20),
	},
	{
		id: "user-014",
		firstName: "Jacob",
		lastName: "Taylor",
		email: "jacob.taylor@example.com",
		age: 22,
		weight: 75,
		height: 182,
		dateOfBirth: new Date(2001, 3, 22),
		gender: "male",
		role: "trainee",
		subcohortId: "subcohort-003",
		companyId: "comp-002", // Added company association
		buddyIds: [],
		trainerIds: ["user-007"],
		createdAt: new Date(2023, 0, 20),
		updatedAt: new Date(2023, 0, 20),
	},
	{
		id: "user-015",
		firstName: "Ava",
		lastName: "Anderson",
		email: "ava.anderson@example.com",
		age: 21,
		weight: 56,
		height: 165,
		dateOfBirth: new Date(2002, 5, 30),
		gender: "female",
		role: "trainee",
		subcohortId: "subcohort-003",
		companyId: "comp-002", // Added company association
		buddyIds: [],
		trainerIds: ["user-007"],
		createdAt: new Date(2023, 0, 20),
		updatedAt: new Date(2023, 0, 20),
	},
];

// Optional: Helper function to get users by role
export const getUsersByRole = (role: string): User[] => {
	return mockUsers.filter((user) => user.role === role);
};

// Optional: Helper function to get users by cohort
export const getUsersByCohort = (cohortId: string): User[] => {
	return mockUsers.filter(
		(user) => "cohortId" in user && user.cohortId === cohortId,
	);
};

// Optional: Helper function to get users by subcohort
export const getUsersBySubcohort = (subcohortId: string): User[] => {
	return mockUsers.filter(
		(user) => "subcohortId" in user && user.subcohortId === subcohortId,
	);
};

// Helper function to get courses associated with a user
export const getCoursesForUser = (user: User): string[] => {
	// For course commanders, directly return their assigned courses
	if (user.role === "courseCommander" && "courseIds" in user) {
		return user.courseIds || [];
	}

	// For trainers and trainees, lookup via subcohort -> cohort
	if ("subcohortId" in user && user.subcohortId) {
		const subcohort = mockSubcohorts.find((s) => s.id === user.subcohortId);
		if (subcohort) {
			const cohort = mockCohorts.find((c) => c.id === subcohort.cohortId);
			return cohort ? cohort.courseIds : [];
		}
	}

	return [];
};

// Helper function to get course details for a user
export const getCourseDetailsForUser = (user: User) => {
	const courseIds = getCoursesForUser(user);
	if (!courseIds.length) return [];

	return dummyCourseData.filter((course) => courseIds.includes(course.id));
};

// Helper function to get all trainers for a cohort
export const getTrainersByCohort = (cohortId: string): User[] => {
	return mockUsers.filter(
		(user) =>
			user.role === "courseTrainer" &&
			"cohortId" in user &&
			user.cohortId === cohortId,
	);
};

// Helper function to get all trainers for a trainee based on subcohort
export const getTrainersForTrainee = (traineeId: string): User[] => {
	const trainee = mockUsers.find((user) => user.id === traineeId);
	if (!trainee || trainee.role !== "trainee" || !("subcohortId" in trainee)) {
		return [];
	}

	return mockUsers.filter(
		(user) =>
			user.role === "courseTrainer" &&
			"subcohortId" in user &&
			user.subcohortId === trainee.subcohortId,
	);
};
