import { useState, useEffect } from "react";
import FullscreenButton from "./FullscreenButton";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CountdownScreenProps {
	onCountdownComplete: () => void;
	containerRef: React.RefObject<HTMLDivElement>;
}

const CountdownScreen: React.FC<CountdownScreenProps> = ({
	onCountdownComplete,
	containerRef,
}) => {
	const [count, setCount] = useState(3);

	useEffect(() => {
		if (count === 0) {
			onCountdownComplete();
			return;
		}

		const timer = setTimeout(() => {
			setCount(count - 1);
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [count, onCountdownComplete]);

	// Define color based on count
	const getColorClass = () => {
		if (count === 3)
			return "text-teal-500 border-teal-200 dark:border-teal-900/30";
		if (count === 2)
			return "text-blue-500 border-blue-200 dark:border-blue-900/30";
		if (count === 1)
			return "text-amber-500 border-amber-200 dark:border-amber-900/30";
		return "text-green-500 border-green-200 dark:border-green-900/30";
	};

	return (
		<div className="max-w-md mx-auto w-full flex flex-col items-center justify-center">
			<div className="text-center mb-12">
				<Clock className="h-12 w-12 mx-auto mb-4 text-teal-500" />
				<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Get Ready
				</h2>
				<p className="mt-2 text-gray-500 dark:text-gray-400">
					{count === 0 ? "Starting now..." : "The test will begin shortly"}
				</p>
			</div>

			<Card
				className={`
        w-40 h-40 
        flex items-center justify-center 
        mb-10 
        bg-white dark:bg-gray-800 
        border-8 ${getColorClass()}
        shadow-md
        rounded-full
      `}
			>
				<span className={`text-7xl font-bold ${getColorClass().split(" ")[0]}`}>
					{count === 0 ? "GO!" : count}
				</span>
			</Card>

			<div className="absolute bottom-4 right-4">
				<FullscreenButton containerRef={containerRef} />
			</div>
		</div>
	);
};

export default CountdownScreen;
