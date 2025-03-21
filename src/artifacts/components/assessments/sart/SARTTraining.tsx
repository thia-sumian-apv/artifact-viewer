import { useState, useRef } from "react";
import InstructionsScreen from "./InstructionsScreen";
import NumberScreen from "./NumberScreen";
import CountdownScreen from "./CountdownScreen";
import { useKeyPress } from "./useKeyPress";

interface SARTTrainingProps {
	onClose: () => void;
}

type SARTScreen =
	| "instructions"
	| "number-intro"
	| "countdown"
	| "practice"
	| "practice-complete"
	| "test-intro"
	| "test"
	| "complete";

const SARTTraining: React.FC<SARTTrainingProps> = ({ onClose }) => {
	const [currentScreen, setCurrentScreen] =
		useState<SARTScreen>("instructions");
	const containerRef = useRef<HTMLDivElement>(null);

	// Game state
	const [currentNumber, setCurrentNumber] = useState(0);
	const [responses, setResponses] = useState<{
		correct: number;
		incorrect: number;
	}>({
		correct: 0,
		incorrect: 0,
	});

	const handleSpacebarPress = () => {
		// Logic to handle spacebar press during the test
		console.log("Spacebar pressed!");
		// Add game logic here
	};

	// Only activate the spacebar press handler during actual gameplay
	useKeyPress(
		"Space",
		["practice", "test"].includes(currentScreen)
			? handleSpacebarPress
			: undefined,
	);

	const navigateToScreen = (screen: SARTScreen) => {
		setCurrentScreen(screen);
	};

	const startPractice = () => {
		setCurrentScreen("countdown");
		// After countdown is complete, the CountdownScreen component will call its
		// onCountdownComplete prop which should start the practice
	};

	const beginPracticeSession = () => {
		setCurrentScreen("practice");
		// Initialize practice session
		// This would be called when countdown completes
	};

	return (
		<div
			ref={containerRef}
			className="relative w-full h-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4 rounded-lg"
		>
			{currentScreen === "instructions" && (
				<InstructionsScreen
					onContinue={() => navigateToScreen("number-intro")}
					containerRef={containerRef}
				/>
			)}

			{currentScreen === "number-intro" && (
				<NumberScreen
					onStartPractice={startPractice}
					containerRef={containerRef}
				/>
			)}

			{currentScreen === "countdown" && (
				<CountdownScreen
					onCountdownComplete={beginPracticeSession}
					containerRef={containerRef}
				/>
			)}

			{/* Additional screens would be added here */}
		</div>
	);
};

export default SARTTraining;
