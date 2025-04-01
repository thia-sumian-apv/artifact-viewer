import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownScreenProps {
	onCountdownComplete: () => void;
	containerRef: React.RefObject<HTMLDivElement>;
}

const CountdownScreen: React.FC<CountdownScreenProps> = ({
	onCountdownComplete,
}) => {
	const [stage, setStage] = useState(0);
	const [_progress, setProgress] = useState(0);
	const stages = ["Ready", "Get Set", "Go!"];

	// Longer duration for each stage (2 seconds per stage)
	const stageDurations = [1250, 1250, 250]; // Ready: 1.25s, Get Set: 1.25s, Go!: 0.5s

	useEffect(() => {
		if (stage >= 3) {
			onCountdownComplete();
			return;
		}

		// Get the duration for the current stage
		const currentStageDuration = stageDurations[stage];

		// Reset progress to the starting value for this stage
		const startValue = stage * 33.33;
		setProgress(startValue);

		// Animate progress to the end value
		const endValue = (stage + 1) * 33.33;
		const interval = 16; // ~60fps for smooth animation
		// Use the current stage's duration for calculation
		const steps = currentStageDuration / interval;
		const increment = (endValue - startValue) / steps;

		let currentProgress = startValue;
		let animationFrame: number;

		const updateProgress = () => {
			currentProgress += increment;
			if (currentProgress >= endValue) {
				// Ensure progress reaches exactly the end value for the stage
				setProgress(endValue);

				// Move to next stage after completing this one
				const timer = setTimeout(() => {
					setStage(stage + 1);
				}, 100); // Slight pause at each completed stage

				return () => clearTimeout(timer);
			}
			setProgress(currentProgress);
			animationFrame = requestAnimationFrame(updateProgress);
		};

		animationFrame = requestAnimationFrame(updateProgress);

		return () => {
			cancelAnimationFrame(animationFrame);
		};
	}, [stage, onCountdownComplete]);

	// Define color based on stage
	const getColorClass = () => {
		if (stage === 0) return "text-blue-500";
		if (stage === 1) return "text-amber-500";
		return "text-green-500";
	};

	const currentText = stage < 3 ? stages[stage] : "";

	return (
		<div className="max-w-xl mx-auto w-full flex flex-col items-center justify-center h-full relative">
			{/* Fixed height instruction area - same position as feedback in GameScreen */}
			<div className="w-full max-w-md mb-8 h-32 flex items-center justify-center">
				<div className="text-center">
					<Clock className="h-10 w-10 mx-auto mb-2 text-teal-500" />
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
						Get Ready
					</h2>
					<p className="mt-1 text-gray-500 dark:text-gray-400">
						{stage >= 3 ? "Starting now..." : "The test will begin shortly"}
					</p>
				</div>
			</div>

			{/* Countdown timer - same position as the digit in NumberScreen and GameScreen */}
			<div className="relative h-60 w-60 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-md border-4 border-gray-100 dark:border-gray-700">
				<div className="absolute inset-0 flex items-center justify-center">
					<span
						className={`text-3xl font-bold ${getColorClass()} transition-colors duration-300`}
					>
						{currentText}
					</span>
				</div>
			</div>

			{/* Empty space to match layout in other screens */}
			<div className="mt-12 h-16" />
		</div>
	);
};

export default CountdownScreen;
