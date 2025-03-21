export interface GameSettingsType {
	noiseLevel: number; // Randomness of '3' appearing (0-100%)
	practiceQuestions: number; // Number of practice trials
	mainQuestions: number; // Number of actual trials
	displayTime: number; // Total time to display each trial (ms)
	initialCrossDuration: number; // Duration of fixation cross before digit (ms)
	digitDuration: number; // Duration each digit is shown (ms)
	correctFeedbackDuration: number; // Duration of correct feedback (ms)
	incorrectFeedbackDuration: number; // Duration of incorrect feedback (ms)
}

export const DEFAULT_SETTINGS: GameSettingsType = {
	noiseLevel: 60,
	practiceQuestions: 5,
	mainQuestions: 10,
	displayTime: 1150,
	initialCrossDuration: 100,
	digitDuration: 500,
	correctFeedbackDuration: 1000,
	incorrectFeedbackDuration: 1000,
};

export interface SARTResponse {
	digit: number;
	responseTime: number | null; // Null if no response
	isCorrect: boolean;
	isPractice: boolean;
}

export interface SARTResults {
	correctResponses: number;
	incorrectResponses: number;
	averageResponseTime: number;
	missedTargets: number; // Times '3' appeared and user pressed spacebar
	missedNonTargets: number; // Times non-'3' appeared and user didn't press spacebar
	responses: SARTResponse[];
}

export function generateDigit(noiseLevel: number): number {
	// Higher noise level = higher chance of non-target digits (not 3)
	// Lower noise level = more balanced distribution
	const threshold = Math.min(Math.max(noiseLevel, 0), 100) / 100;

	// Random number to determine if we show a 3 or not
	const rand = Math.random();

	if (rand < threshold) {
		// Generate a number from 1-9 excluding 3
		const digits = [1, 2, 4, 5, 6, 7, 8, 9];
		return digits[Math.floor(Math.random() * digits.length)];
	}
	// Show the target digit (3)
	return 3;
}
