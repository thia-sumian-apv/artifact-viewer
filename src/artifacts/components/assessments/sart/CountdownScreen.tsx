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
	const [progress, setProgress] = useState(0);
	const stages = ["Ready", "Get Set", "Go!"];

	// Longer duration for each stage (2 seconds per stage)
	const stageDuration = 2000;

	useEffect(() => {
		if (stage >= 3) {
			onCountdownComplete();
			return;
		}

		// Reset progress to the starting value for this stage
		const startValue = stage * 33.33;
		setProgress(startValue);

		// Animate progress to the end value
		const endValue = (stage + 1) * 33.33;
		const interval = 16; // ~60fps for smooth animation
		const steps = stageDuration / interval;
		const increment = (endValue - startValue) / steps;

		let currentProgress = startValue;
		let animationFrame: number;

		const updateProgress = () => {
			currentProgress += increment;
			if (currentProgress >= endValue) {
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

	// Get the current color for the radial progress
	const getProgressColorClass = () => {
		if (stage === 0) return "text-blue-500";
		if (stage === 1) return "text-amber-500";
		return "text-green-500";
	};

	const currentText = stage < 3 ? stages[stage] : "";

	return (
		<div className="max-w-md mx-auto w-full flex flex-col items-center justify-center">
			<div className="text-center mb-8">
				<Clock className="h-12 w-12 mx-auto mb-4 text-teal-500" />
				<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Get Ready
				</h2>
				<p className="mt-2 text-gray-500 dark:text-gray-400">
					{stage >= 3 ? "Starting now..." : "The test will begin shortly"}
				</p>
			</div>

			<div className="relative flex items-center justify-center mb-10">
				{/* daisyUI radial progress */}
				<div
					className={`radial-progress ${getProgressColorClass()} transition-colors duration-300`}
					style={
						{
							"--value": progress,
							"--size": "12rem",
							"--thickness": "0.5rem",
						} as React.CSSProperties
					}
				/>

				<div className="absolute inset-0 flex items-center justify-center">
					<span
						className={`text-3xl font-bold ${getColorClass()} transition-colors duration-300`}
					>
						{currentText}
					</span>
				</div>
			</div>
		</div>
	);
};

export default CountdownScreen;
