import type { UserRole } from "..";

// Base User interface
interface BaseUser {
	id: string; // Immutable user ID
	firstName: string;
	lastName: string;
	email: string;
	age: number;
	weight: number; // in kg
	height: number; // in cm
	dateOfBirth: Date;
	gender: "male" | "female" | "other";
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
}

// Extended interfaces for different roles
interface SuperAdmin extends BaseUser {
	role: "superAdmin";
	companyId?: string; // Make it optional
}

interface CompanyAdmin extends BaseUser {
	role: "companyAdmin";
	companyId: string;
}

interface CourseCommander extends BaseUser {
	role: "courseCommander";
	companyId: string;
	courseIds: string[]; // Courses associated with this commander
}

interface CourseTrainer extends BaseUser {
	role: "courseTrainer";
	companyId: string;
	subcohortId: string; // The subcohort they are responsible for training
}

interface Trainee extends BaseUser {
	role: "trainee";
	companyId: string;
	subcohortId: string;
	buddyIds: string[]; // References to other trainees who are buddies
	trainerIds: string[]; // References to assigned trainers
}

// Union type for all user types
export type User =
	| SuperAdmin
	| CompanyAdmin
	| CourseCommander
	| CourseTrainer
	| Trainee;
