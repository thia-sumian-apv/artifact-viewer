import { mockUsers } from "./userData";
import type {
	InjuryRecord,
	IPPTRecord,
	SOCRecord,
	RoadMarchRecord,
	CardioRespiratoryRecord,
	StrengthRecord,
	UserPhysicalProfile,
} from "../types/physical";

// Mock Injury Records
export const mockInjuries: InjuryRecord[] = [
	{
		id: "injury-001",
		userId: "user-008", // Thomas Garcia
		injuryDate: new Date(2023, 2, 15),
		recoveryDate: new Date(2023, 3, 30),
		injuryType: "Sprain",
		description: "Ankle sprain during morning PT",
		severity: "moderate",
		status: "recovered",
		createdAt: new Date(2023, 2, 15),
		updatedAt: new Date(2023, 3, 30),
	},
	{
		id: "injury-002",
		userId: "user-009", // James Wilson
		injuryDate: new Date(2023, 4, 5),
		recoveryDate: new Date(2023, 5, 20),
		injuryType: "Strain",
		description: "Lower back strain during deadlift",
		severity: "moderate",
		status: "recovered",
		createdAt: new Date(2023, 4, 5),
		updatedAt: new Date(2023, 5, 20),
	},
	{
		id: "injury-003",
		userId: "user-010", // Emma Thompson
		injuryDate: new Date(2023, 6, 12),
		injuryType: "Tendonitis",
		description: "Shoulder tendonitis",
		severity: "minor",
		status: "active",
		createdAt: new Date(2023, 6, 12),
		updatedAt: new Date(2023, 6, 12),
	},
	{
		id: "injury-004",
		userId: "user-012", // William Davis
		injuryDate: new Date(2023, 1, 8),
		recoveryDate: new Date(2023, 2, 28),
		injuryType: "Fracture",
		description: "Hairline fracture in right foot",
		severity: "severe",
		status: "recovered",
		createdAt: new Date(2023, 1, 8),
		updatedAt: new Date(2023, 2, 28),
	},
	{
		id: "injury-005",
		userId: "user-014", // Jacob Taylor
		injuryDate: new Date(2023, 5, 18),
		injuryType: "Shin Splints",
		description: "Bilateral shin splints from road march",
		severity: "moderate",
		status: "chronic",
		createdAt: new Date(2023, 5, 18),
		updatedAt: new Date(2023, 7, 1),
	},
];

// Mock IPPT Records
export const mockIPPTRecords: IPPTRecord[] = [
	{
		id: "ippt-001",
		userId: "user-008", // Thomas Garcia
		assessmentDate: new Date(2023, 1, 15),
		award: "silver",
		pushUpReps: 42,
		sitUpReps: 45,
		runTime: 690, // 11:30 in seconds
		totalScore: 75,
		createdAt: new Date(2023, 1, 15),
		updatedAt: new Date(2023, 1, 15),
	},
	{
		id: "ippt-002",
		userId: "user-009", // James Wilson
		assessmentDate: new Date(2023, 1, 15),
		award: "gold",
		pushUpReps: 60,
		sitUpReps: 58,
		runTime: 570, // 9:30 in seconds
		totalScore: 90,
		createdAt: new Date(2023, 1, 15),
		updatedAt: new Date(2023, 1, 15),
	},
	{
		id: "ippt-003",
		userId: "user-010", // Emma Thompson
		assessmentDate: new Date(2023, 1, 16),
		award: "bronze",
		pushUpReps: 30,
		sitUpReps: 35,
		runTime: 780, // 13:00 in seconds
		totalScore: 65,
		createdAt: new Date(2023, 1, 16),
		updatedAt: new Date(2023, 1, 16),
	},
	{
		id: "ippt-004",
		userId: "user-011", // Olivia Brown
		assessmentDate: new Date(2023, 1, 16),
		award: "silver",
		pushUpReps: 35,
		sitUpReps: 40,
		runTime: 720, // 12:00 in seconds
		totalScore: 72,
		createdAt: new Date(2023, 1, 16),
		updatedAt: new Date(2023, 1, 16),
	},
	{
		id: "ippt-005",
		userId: "user-012", // William Davis
		assessmentDate: new Date(2023, 1, 17),
		award: "fail",
		pushUpReps: 25,
		sitUpReps: 28,
		runTime: 900, // 15:00 in seconds
		totalScore: 55,
		createdAt: new Date(2023, 1, 17),
		updatedAt: new Date(2023, 1, 17),
	},
	{
		id: "ippt-006",
		userId: "user-013", // Sophia Miller
		assessmentDate: new Date(2023, 1, 17),
		award: "bronze",
		pushUpReps: 27,
		sitUpReps: 32,
		runTime: 840, // 14:00 in seconds
		totalScore: 62,
		createdAt: new Date(2023, 1, 17),
		updatedAt: new Date(2023, 1, 17),
	},
	{
		id: "ippt-007",
		userId: "user-014", // Jacob Taylor
		assessmentDate: new Date(2023, 1, 18),
		award: "gold",
		pushUpReps: 58,
		sitUpReps: 60,
		runTime: 540, // 9:00 in seconds
		totalScore: 95,
		createdAt: new Date(2023, 1, 18),
		updatedAt: new Date(2023, 1, 18),
	},
	{
		id: "ippt-008",
		userId: "user-015", // Ava Anderson
		assessmentDate: new Date(2023, 1, 18),
		award: "bronze",
		pushUpReps: 28,
		sitUpReps: 30,
		runTime: 840, // 14:00 in seconds
		totalScore: 61,
		createdAt: new Date(2023, 1, 18),
		updatedAt: new Date(2023, 1, 18),
	},
];

// Mock SOC Records
export const mockSOCRecords: SOCRecord[] = [
	{
		id: "soc-001",
		userId: "user-008", // Thomas Garcia
		assessmentDate: new Date(2023, 2, 10),
		status: "pass",
		timeInSeconds: 300, // 5:00 in seconds
		createdAt: new Date(2023, 2, 10),
		updatedAt: new Date(2023, 2, 10),
	},
	{
		id: "soc-002",
		userId: "user-009", // James Wilson
		assessmentDate: new Date(2023, 2, 10),
		status: "pass",
		timeInSeconds: 285, // 4:45 in seconds
		createdAt: new Date(2023, 2, 10),
		updatedAt: new Date(2023, 2, 10),
	},
	{
		id: "soc-003",
		userId: "user-010", // Emma Thompson
		assessmentDate: new Date(2023, 2, 11),
		status: "fail",
		timeInSeconds: 360, // 6:00 in seconds
		createdAt: new Date(2023, 2, 11),
		updatedAt: new Date(2023, 2, 11),
	},
	{
		id: "soc-004",
		userId: "user-011", // Olivia Brown
		assessmentDate: new Date(2023, 2, 11),
		status: "pass",
		timeInSeconds: 330, // 5:30 in seconds
		createdAt: new Date(2023, 2, 11),
		updatedAt: new Date(2023, 2, 11),
	},
	{
		id: "soc-005",
		userId: "user-012", // William Davis
		assessmentDate: new Date(2023, 2, 12),
		status: "fail",
		timeInSeconds: 375, // 6:15 in seconds
		createdAt: new Date(2023, 2, 12),
		updatedAt: new Date(2023, 2, 12),
	},
];

// Mock 20km Road March Records
export const mockRoadMarchRecords: RoadMarchRecord[] = [
	{
		id: "march-001",
		userId: "user-008", // Thomas Garcia
		assessmentDate: new Date(2023, 3, 5),
		status: "pass",
		timeInSeconds: 14400, // 4:00:00 in seconds
		distanceCompleted: 20,
		createdAt: new Date(2023, 3, 5),
		updatedAt: new Date(2023, 3, 5),
	},
	{
		id: "march-002",
		userId: "user-009", // James Wilson
		assessmentDate: new Date(2023, 3, 5),
		status: "pass",
		timeInSeconds: 13500, // 3:45:00 in seconds
		distanceCompleted: 20,
		createdAt: new Date(2023, 3, 5),
		updatedAt: new Date(2023, 3, 5),
	},
	{
		id: "march-003",
		userId: "user-010", // Emma Thompson
		assessmentDate: new Date(2023, 3, 6),
		status: "fail",
		timeInSeconds: 16200, // 4:30:00 in seconds
		distanceCompleted: 18.5,
		createdAt: new Date(2023, 3, 6),
		updatedAt: new Date(2023, 3, 6),
	},
	{
		id: "march-004",
		userId: "user-012", // William Davis
		assessmentDate: new Date(2023, 3, 6),
		status: "pass",
		timeInSeconds: 14400, // 4:00:00 in seconds
		distanceCompleted: 20,
		createdAt: new Date(2023, 3, 6),
		updatedAt: new Date(2023, 3, 6),
	},
	{
		id: "march-005",
		userId: "user-014", // Jacob Taylor
		assessmentDate: new Date(2023, 3, 7),
		status: "pass",
		timeInSeconds: 12600, // 3:30:00 in seconds
		distanceCompleted: 20,
		createdAt: new Date(2023, 3, 7),
		updatedAt: new Date(2023, 3, 7),
	},
];

// Mock Cardio Respiratory Records
export const mockCardioRecords: CardioRespiratoryRecord[] = [
	{
		id: "cardio-001",
		userId: "user-008", // Thomas Garcia
		assessmentDate: new Date(2023, 4, 10),
		vo2Max: 45.2,
		restingHeartRate: 68,
		exerciseHeartRate: 165,
		heartRateVariability: 45,
		createdAt: new Date(2023, 4, 10),
		updatedAt: new Date(2023, 4, 10),
	},
	{
		id: "cardio-002",
		userId: "user-009", // James Wilson
		assessmentDate: new Date(2023, 4, 10),
		vo2Max: 52.6,
		restingHeartRate: 60,
		exerciseHeartRate: 155,
		heartRateVariability: 65,
		createdAt: new Date(2023, 4, 10),
		updatedAt: new Date(2023, 4, 10),
	},
	{
		id: "cardio-003",
		userId: "user-010", // Emma Thompson
		assessmentDate: new Date(2023, 4, 11),
		vo2Max: 40.1,
		restingHeartRate: 72,
		exerciseHeartRate: 180,
		heartRateVariability: 35,
		createdAt: new Date(2023, 4, 11),
		updatedAt: new Date(2023, 4, 11),
	},
	{
		id: "cardio-004",
		userId: "user-011", // Olivia Brown
		assessmentDate: new Date(2023, 4, 11),
		vo2Max: 42.5,
		restingHeartRate: 70,
		exerciseHeartRate: 175,
		heartRateVariability: 40,
		createdAt: new Date(2023, 4, 11),
		updatedAt: new Date(2023, 4, 11),
	},
	{
		id: "cardio-005",
		userId: "user-012", // William Davis
		assessmentDate: new Date(2023, 4, 12),
		vo2Max: 38.6,
		restingHeartRate: 75,
		exerciseHeartRate: 185,
		heartRateVariability: 30,
		createdAt: new Date(2023, 4, 12),
		updatedAt: new Date(2023, 4, 12),
	},
	{
		id: "cardio-006",
		userId: "user-013", // Sophia Miller
		assessmentDate: new Date(2023, 4, 12),
		vo2Max: 41.2,
		restingHeartRate: 69,
		exerciseHeartRate: 178,
		heartRateVariability: 38,
		createdAt: new Date(2023, 4, 12),
		updatedAt: new Date(2023, 4, 12),
	},
	{
		id: "cardio-007",
		userId: "user-014", // Jacob Taylor
		assessmentDate: new Date(2023, 4, 13),
		vo2Max: 55.8,
		restingHeartRate: 58,
		exerciseHeartRate: 150,
		heartRateVariability: 70,
		createdAt: new Date(2023, 4, 13),
		updatedAt: new Date(2023, 4, 13),
	},
	{
		id: "cardio-008",
		userId: "user-015", // Ava Anderson
		assessmentDate: new Date(2023, 4, 13),
		vo2Max: 43.7,
		restingHeartRate: 67,
		exerciseHeartRate: 170,
		heartRateVariability: 42,
		createdAt: new Date(2023, 4, 13),
		updatedAt: new Date(2023, 4, 13),
	},
];

// Mock Strength Records
export const mockStrengthRecords: StrengthRecord[] = [
	{
		id: "strength-001",
		userId: "user-008", // Thomas Garcia
		assessmentDate: new Date(2023, 5, 15),
		squatRepMax: 120,
		deadliftRepMax: 140,
		maxPullUps: 12,
		sprintDragCarryTime: 180, // 3:00 in seconds
		createdAt: new Date(2023, 5, 15),
		updatedAt: new Date(2023, 5, 15),
	},
	{
		id: "strength-002",
		userId: "user-009", // James Wilson
		assessmentDate: new Date(2023, 5, 15),
		squatRepMax: 150,
		deadliftRepMax: 180,
		maxPullUps: 20,
		sprintDragCarryTime: 150, // 2:30 in seconds
		createdAt: new Date(2023, 5, 15),
		updatedAt: new Date(2023, 5, 15),
	},
	{
		id: "strength-003",
		userId: "user-010", // Emma Thompson
		assessmentDate: new Date(2023, 5, 16),
		squatRepMax: 80,
		deadliftRepMax: 95,
		maxPullUps: 5,
		sprintDragCarryTime: 210, // 3:30 in seconds
		createdAt: new Date(2023, 5, 16),
		updatedAt: new Date(2023, 5, 16),
	},
	{
		id: "strength-004",
		userId: "user-011", // Olivia Brown
		assessmentDate: new Date(2023, 5, 16),
		squatRepMax: 75,
		deadliftRepMax: 90,
		maxPullUps: 6,
		sprintDragCarryTime: 200, // 3:20 in seconds
		createdAt: new Date(2023, 5, 16),
		updatedAt: new Date(2023, 5, 16),
	},
	{
		id: "strength-005",
		userId: "user-012", // William Davis
		assessmentDate: new Date(2023, 5, 17),
		squatRepMax: 105,
		deadliftRepMax: 125,
		maxPullUps: 10,
		sprintDragCarryTime: 195, // 3:15 in seconds
		createdAt: new Date(2023, 5, 17),
		updatedAt: new Date(2023, 5, 17),
	},
	{
		id: "strength-006",
		userId: "user-013", // Sophia Miller
		assessmentDate: new Date(2023, 5, 17),
		squatRepMax: 70,
		deadliftRepMax: 85,
		maxPullUps: 4,
		sprintDragCarryTime: 225, // 3:45 in seconds
		createdAt: new Date(2023, 5, 17),
		updatedAt: new Date(2023, 5, 17),
	},
	{
		id: "strength-007",
		userId: "user-014", // Jacob Taylor
		assessmentDate: new Date(2023, 5, 18),
		squatRepMax: 160,
		deadliftRepMax: 185,
		maxPullUps: 22,
		sprintDragCarryTime: 135, // 2:15 in seconds
		createdAt: new Date(2023, 5, 18),
		updatedAt: new Date(2023, 5, 18),
	},
	{
		id: "strength-008",
		userId: "user-015", // Ava Anderson
		assessmentDate: new Date(2023, 5, 18),
		squatRepMax: 85,
		deadliftRepMax: 100,
		maxPullUps: 7,
		sprintDragCarryTime: 195, // 3:15 in seconds
		createdAt: new Date(2023, 5, 18),
		updatedAt: new Date(2023, 5, 18),
	},
];

// Combine all the physical data into user profiles
export const generatePhysicalProfiles = (): UserPhysicalProfile[] => {
	// First, get all trainees from mockUsers
	const trainees = mockUsers.filter((user) => user.role === "trainee");

	return trainees.map((user) => {
		// Get the latest records for each category for this user
		const userInjuries = mockInjuries.filter(
			(injury) => injury.userId === user.id,
		);

		const userIPPT = mockIPPTRecords
			.filter((record) => record.userId === user.id)
			.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime());

		const userSOC = mockSOCRecords
			.filter((record) => record.userId === user.id)
			.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime());

		const userRoadMarch = mockRoadMarchRecords
			.filter((record) => record.userId === user.id)
			.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime());

		const userCardio = mockCardioRecords
			.filter((record) => record.userId === user.id)
			.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime());

		const userStrength = mockStrengthRecords
			.filter((record) => record.userId === user.id)
			.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime());

		// Find the most recently updated record to set lastUpdated
		const allDates = [
			...userInjuries.map((i) => i.updatedAt),
			...userIPPT.map((i) => i.updatedAt),
			...userSOC.map((i) => i.updatedAt),
			...userRoadMarch.map((i) => i.updatedAt),
			...userCardio.map((i) => i.updatedAt),
			...userStrength.map((i) => i.updatedAt),
		].sort((a, b) => b.getTime() - a.getTime());

		return {
			userId: user.id,
			user: user,
			weight: user.weight,
			injuries: userInjuries,
			ipptRecords: userIPPT,
			socRecords: userSOC,
			roadMarchRecords: userRoadMarch,
			cardioRecords: userCardio,
			strengthRecords: userStrength,
			lastUpdated: allDates.length > 0 ? allDates[0] : new Date(),
		};
	});
};

// Export the combined profiles for easy access
export const mockPhysicalProfiles = generatePhysicalProfiles();

// Utility functions for accessing physical data
export const getLatestIPPTForUser = (
	userId: string,
): IPPTRecord | undefined => {
	return mockIPPTRecords
		.filter((record) => record.userId === userId)
		.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];
};

export const getLatestSOCForUser = (userId: string): SOCRecord | undefined => {
	return mockSOCRecords
		.filter((record) => record.userId === userId)
		.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];
};

export const getLatestRoadMarchForUser = (
	userId: string,
): RoadMarchRecord | undefined => {
	return mockRoadMarchRecords
		.filter((record) => record.userId === userId)
		.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];
};

export const getLatestCardioForUser = (
	userId: string,
): CardioRespiratoryRecord | undefined => {
	return mockCardioRecords
		.filter((record) => record.userId === userId)
		.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];
};

export const getLatestStrengthForUser = (
	userId: string,
): StrengthRecord | undefined => {
	return mockStrengthRecords
		.filter((record) => record.userId === userId)
		.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];
};

// Format time in seconds to mm:ss or hh:mm:ss
export const formatTimeFromSeconds = (seconds: number): string => {
	if (seconds >= 3600) {
		// Format as hh:mm:ss for ≥ 1 hour
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}
	// Format as mm:ss for < 1 hour
	const minutes = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
