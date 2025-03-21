import { useState, useRef } from "react";
import InstructionsScreen from "./InstructionsScreen";
import NumberScreen from "./NumberScreen";
import CountdownScreen from "./CountdownScreen";
import GameScreen from "./GameScreen";
import ResultsScreen from "./ResultsScreen";
import { DEFAULT_SETTINGS, type SARTResponse } from "./SARTConfig";
import FullscreenButton from "./FullscreenButton";

interface SARTTrainingProps {
	onClose: () => void;
}

type SARTScreen =
	| "instructions"
	| "number-intro"
	| "countdown-practice"
	| "practice"
	| "test-intro"
	| "countdown-test"
	| "test"
	| "complete";

const SARTTraining: React.FC<SARTTrainingProps> = ({ onClose }) => {
	const [currentScreen, setCurrentScreen] =
		useState<SARTScreen>("instructions");
	const containerRef = useRef<HTMLDivElement>(null);

	// Game responses
	const [_practiceResponses, setPracticeResponses] = useState<SARTResponse[]>(
		[],
	);
	const [testResponses, setTestResponses] = useState<SARTResponse[]>([]);

	const navigateToScreen = (screen: SARTScreen) => {
		setCurrentScreen(screen);
	};

	const startPractice = () => {
		setCurrentScreen("countdown-practice");
	};

	const beginPracticeSession = () => {
		setCurrentScreen("practice");
	};

	const handlePracticeComplete = (responses: SARTResponse[]) => {
		setPracticeResponses(responses);
		setCurrentScreen("test-intro");
	};

	const startMainTest = () => {
		setCurrentScreen("countdown-test");
	};

	const beginMainTest = () => {
		setCurrentScreen("test");
	};

	const handleTestComplete = (responses: SARTResponse[]) => {
		setTestResponses(responses);
		setCurrentScreen("complete");
		console.log("Test completed with responses:", responses);
	};

	const handleTryAgain = () => {
		// Start a new assessment
		setPracticeResponses([]);
		setTestResponses([]);
		setCurrentScreen("instructions");
	};

	return (
		<div
			ref={containerRef}
			className="relative w-full h-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4 rounded-lg overflow-auto"
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
					isPractice={true}
				/>
			)}

			{currentScreen === "countdown-practice" && (
				<CountdownScreen
					onCountdownComplete={beginPracticeSession}
					containerRef={containerRef}
				/>
			)}

			{currentScreen === "practice" && (
				<GameScreen
					mode="practice"
					onComplete={handlePracticeComplete}
					containerRef={containerRef}
					settings={DEFAULT_SETTINGS}
				/>
			)}

			{currentScreen === "test-intro" && (
				<NumberScreen
					onStartPractice={startMainTest}
					containerRef={containerRef}
					isPractice={false}
				/>
			)}

			{currentScreen === "countdown-test" && (
				<CountdownScreen
					onCountdownComplete={beginMainTest}
					containerRef={containerRef}
				/>
			)}

			{currentScreen === "test" && (
				<GameScreen
					mode="test"
					onComplete={handleTestComplete}
					containerRef={containerRef}
					settings={DEFAULT_SETTINGS}
				/>
			)}

			{currentScreen === "complete" && (
				<ResultsScreen
					testResponses={testResponses}
					onTryAgain={handleTryAgain}
					onFinish={onClose}
					containerRef={containerRef}
				/>
			)}
			<div className="absolute bottom-4 right-4">
				<FullscreenButton containerRef={containerRef} />
			</div>
		</div>
	);
};

export default SARTTraining;
