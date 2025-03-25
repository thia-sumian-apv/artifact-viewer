import { useState, useEffect, useCallback, useRef } from "react";
import {
	DEFAULT_SETTINGS,
	generateDigit,
	type SARTResponse,
} from "./SARTConfig";
import { useKeyPress } from "./useKeyPress";
import { CheckCircle, Plus, XCircle } from "lucide-react";

interface GameScreenProps {
	mode: "practice" | "test";
	onComplete: (responses: SARTResponse[]) => void;
	containerRef: React.RefObject<HTMLDivElement>;
	settings?: typeof DEFAULT_SETTINGS;
}

const GameScreen: React.FC<GameScreenProps> = ({
	mode,
	onComplete,
	settings = DEFAULT_SETTINGS,
}) => {
	// Game state
	const [currentDigit, setCurrentDigit] = useState<number | null>(null);
	const [showFixation, setShowFixation] = useState(false);
	const [showFeedback, setShowFeedback] = useState(false);
	const [isCorrectResponse, setIsCorrectResponse] = useState(false);
	const [isPressedSpace, setIsPressedSpace] = useState(false);
	const [trialCount, setTrialCount] = useState(0);
	const [responses, setResponses] = useState<SARTResponse[]>([]);
	const [isPaused, setIsPaused] = useState(false);

	const digitDisplayTime = useRef<number | null>(null);
	const responseTime = useRef<number | null>(null);
	const hasResponded = useRef(false);

	const totalTrials =
		mode === "practice" ? settings.practiceQuestions : settings.mainQuestions;

	// Function to start a new trial
	const startNewTrial = useCallback(() => {
		// Reset state for new trial
		hasResponded.current = false;
		setIsPressedSpace(false);
		responseTime.current = null;

		// Show fixation cross
		setShowFixation(true);
		setCurrentDigit(null);

		// After delay, show digit
		setTimeout(() => {
			setShowFixation(false);

			// Generate digit based on noise level
			const digit = generateDigit(settings.noiseLevel);
			setCurrentDigit(digit);
			digitDisplayTime.current = Date.now();

			// Hide digit after digitDuration
			setTimeout(() => {
				// If user didn't respond during digitDuration, process as no response
				if (!hasResponded.current) {
					hasResponded.current = true;

					// Not pressing space is correct for digit 3
					const isCorrect = digit === 3;
					setIsCorrectResponse(isCorrect);
					setIsPressedSpace(false);

					// Show feedback
					setIsPaused(true);
					setShowFeedback(true);

					// Record response
					const newResponse: SARTResponse = {
						digit,
						responseTime: null,
						isCorrect,
						isPractice: mode === "practice",
					};

					setResponses((prev) => [...prev, newResponse]);

					// Hide feedback after appropriate duration
					const feedbackDuration = isCorrect
						? settings.correctFeedbackDuration
						: settings.incorrectFeedbackDuration;

					setTimeout(() => {
						setShowFeedback(false);
						setIsPaused(false);
						setTrialCount((prev) => prev + 1);
					}, feedbackDuration);
				}
			}, settings.digitDuration);
		}, settings.initialCrossDuration);
	}, [settings, mode]);

	// Process spacebar press
	const handleSpacebarPress = useCallback(() => {
		if (currentDigit === null || isPaused || hasResponded.current) return;

		hasResponded.current = true;
		setIsPressedSpace(true);

		// Calculate response time
		if (digitDisplayTime.current) {
			responseTime.current = Date.now() - digitDisplayTime.current;
		}

		// Determine if response is correct (should press for all except 3)
		const isCorrect = currentDigit !== 3;
		setIsCorrectResponse(isCorrect);

		// Show feedback
		setIsPaused(true);
		setShowFeedback(true);

		// Record response
		const newResponse: SARTResponse = {
			digit: currentDigit,
			responseTime: responseTime.current,
			isCorrect,
			isPractice: mode === "practice",
		};

		setResponses((prev) => [...prev, newResponse]);

		// Hide feedback after appropriate duration
		const feedbackDuration = isCorrect
			? settings.correctFeedbackDuration
			: settings.incorrectFeedbackDuration;

		setTimeout(() => {
			setShowFeedback(false);
			setIsPaused(false);
			setTrialCount((prev) => prev + 1);
		}, feedbackDuration);
	}, [currentDigit, isPaused, mode, settings]);

	// Listen for spacebar presses
	useKeyPress("Space", handleSpacebarPress);

	// Main game loop
	useEffect(() => {
		if (trialCount >= totalTrials) {
			// Game complete, pass responses back
			onComplete(responses);
			return;
		}

		if (isPaused) return;

		// Start a new trial immediately
		startNewTrial();

		return () => {
			// Cleanup any pending timers if component unmounts during a trial
			// This doesn't handle all timer cleanup, but helps with unmounting
		};
	}, [trialCount, totalTrials, isPaused, responses, onComplete, startNewTrial]);

	return (
		<div className="max-w-xl mx-auto w-full flex flex-col items-center justify-center h-full relative">
			<div className="absolute top-6 right-6 z-10">
				<span className="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
					{mode === "practice" ? "Practice" : "Test"}: {trialCount + 1} /{" "}
					{totalTrials}
				</span>
			</div>

			{/* Feedback area - fixed height, positioned at top */}
			<div className="w-full max-w-md mb-8 h-20 flex items-center justify-center">
				<div
					className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 w-full ${showFeedback ? "" : "opacity-0"}`}
				>
					{showFeedback && (
						<div className="flex items-center justify-center space-x-3">
							<div className="flex-shrink-0">
								{isCorrectResponse ? (
									<CheckCircle className="h-6 w-6 text-green-500" />
								) : (
									<XCircle className="h-6 w-6 text-red-500" />
								)}
							</div>
							<div className="flex-1 text-left">
								<p
									className={`text-sm font-medium ${isCorrectResponse ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
								>
									{isCorrectResponse ? "Correct!" : "Incorrect!"}
								</p>
								<p className="text-xs text-gray-600 dark:text-gray-400 truncate">
									{currentDigit === 3
										? isPressedSpace
											? "You pressed space for 3. Don't press for 3."
											: "Good! You didn't press for 3."
										: isPressedSpace
											? "Good! You pressed for a non-3 digit."
											: "You should press space for all non-3 digits."}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="relative h-60 w-60 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-md border-4 border-gray-100 dark:border-gray-700">
				{showFixation && (
					<Plus className="h-12 w-12 text-gray-800 dark:text-gray-200" />
				)}

				{currentDigit !== null && (
					<span className="text-8xl font-bold text-gray-900 dark:text-white">
						{currentDigit}
					</span>
				)}
			</div>

			<div className="mt-12 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center max-w-md">
				<p className="text-sm text-gray-600 dark:text-gray-400">
					Remember: Press <span className="font-semibold">SPACEBAR</span> for
					all numbers{" "}
					<span className="font-semibold text-red-600 dark:text-red-400">
						except 3
					</span>
				</p>
			</div>
		</div>
	);
};

export default GameScreen;
