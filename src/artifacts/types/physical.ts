import type { User } from "./users";

// Physical Stats Types
export interface BasePhysicalData {
	id: string;
	userId: string; // References a User
	assessmentDate: Date;
	createdAt: Date;
	updatedAt: Date;
}

// Injury History
export interface InjuryRecord {
	id: string;
	userId: string;
	injuryDate: Date;
	recoveryDate?: Date;
	injuryType: string;
	description: string;
	severity: "minor" | "moderate" | "severe";
	status: "active" | "recovered" | "chronic";
	createdAt: Date;
	updatedAt: Date;
}

// IPPT (Individual Physical Proficiency Test)
export interface IPPTRecord extends BasePhysicalData {
	award: "gold" | "silver" | "bronze" | "fail";
	pushUpReps: number;
	sitUpReps: number;
	runTime: number; // in seconds
	totalScore: number;
}

// SOC (Standard Obstacle Course)
export interface SOCRecord extends BasePhysicalData {
	status: "pass" | "fail";
	timeInSeconds: number; // Timing in seconds
}

// 20km Road March
export interface RoadMarchRecord extends BasePhysicalData {
	status: "pass" | "fail";
	timeInSeconds: number; // Timing in seconds
	distanceCompleted: number; // in km
}

// Cardio Respiratory
export interface CardioRespiratoryRecord extends BasePhysicalData {
	vo2Max: number; // VO2 Max value
	restingHeartRate: number; // in BPM
	exerciseHeartRate: number; // in BPM
	heartRateVariability: number; // in ms
}

// Strength Assessment
export interface StrengthRecord extends BasePhysicalData {
	squatRepMax: number; // in kg
	deadliftRepMax: number; // in kg
	maxPullUps: number; // number of reps
	sprintDragCarryTime: number; // in seconds
}

// Combined Physical Profile for a user
export interface UserPhysicalProfile {
	userId: string;
	user: User; // The associated user
	weight: number; // Current weight in kg
	injuries: InjuryRecord[];
	ipptRecords: IPPTRecord[];
	socRecords: SOCRecord[];
	roadMarchRecords: RoadMarchRecord[];
	cardioRecords: CardioRespiratoryRecord[];
	strengthRecords: StrengthRecord[];
	lastUpdated: Date;
}
