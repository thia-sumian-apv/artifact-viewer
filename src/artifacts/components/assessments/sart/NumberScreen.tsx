import { Button } from "@/components/ui/button";
import { AlertCircle, Play, ChevronRight } from "lucide-react";

interface NumberScreenProps {
	onStartPractice: () => void;
	containerRef: React.RefObject<HTMLDivElement>;
	isPractice?: boolean;
}

const NumberScreen: React.FC<NumberScreenProps> = ({
	onStartPractice,
	isPractice = true,
}) => {
	return (
		<div className="max-w-xl mx-auto w-full flex flex-col items-center justify-center">
			<div className="text-center mb-8">
				<AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
				<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Key Instruction
				</h2>
				<p className="mt-2 text-gray-500 dark:text-gray-400">
					{isPractice
						? "Remember this important rule"
						: "Ready to begin the full test"}
				</p>
			</div>

			<div className="relative z-10 text-center">
				<p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-6">
					Press{" "}
					<kbd className="px-2 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
						SPACEBAR
					</kbd>{" "}
					for all numbers except
				</p>

				<div className="inline-flex flex-col items-center justify-center mb-6">
					<div className="relative h-60 w-60 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-md border-4 border-gray-100 dark:border-gray-700">
						<span className="text-8xl font-bold text-gray-900 dark:text-white">
							3
						</span>
					</div>
					<p className="text-md font-semibold text-red-600 dark:text-red-400 mt-2">
						DO NOT PRESS for this number
					</p>
				</div>

				<p className="text-sm text-gray-600 dark:text-gray-300">
					Whenever you see a 3, hold back and don't press anything
				</p>
			</div>

			<div className="mt-10">
				{isPractice ? (
					<Button
						onClick={onStartPractice}
						className="w-full md:w-auto flex items-center justify-center gap-2"
					>
						<Play className="h-4 w-4" />
						Start Practice
					</Button>
				) : (
					<Button
						onClick={onStartPractice}
						className="w-full md:w-auto flex items-center justify-center gap-2"
					>
						Begin Test <ChevronRight className="h-4 w-4" />
					</Button>
				)}
			</div>
		</div>
	);
};

export default NumberScreen;
