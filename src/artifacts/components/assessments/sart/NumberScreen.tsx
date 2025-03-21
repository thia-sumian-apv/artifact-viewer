import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Play, ChevronRight } from "lucide-react";
import FullscreenButton from "./FullscreenButton";

interface NumberScreenProps {
	onStartPractice: () => void;
	containerRef: React.RefObject<HTMLDivElement>;
	isPractice?: boolean;
}

const NumberScreen: React.FC<NumberScreenProps> = ({
	onStartPractice,
	containerRef,
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

			<Card className="relative bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-700 p-8 w-full max-w-md mb-10 overflow-hidden">
				<div className="absolute inset-0 flex items-center justify-center opacity-5">
					<span className="text-[20rem] font-bold">3</span>
				</div>

				<div className="relative z-10 text-center">
					<p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-6">
						Press SPACEBAR for all numbers except
					</p>

					<div className="inline-flex flex-col items-center justify-center mb-6">
						<div className="rounded-full bg-white dark:bg-gray-900 shadow-lg w-24 h-24 flex items-center justify-center mb-2">
							<span className="text-5xl font-bold text-amber-600 dark:text-amber-400">
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
			</Card>

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

			<div className="absolute bottom-4 right-4">
				<FullscreenButton containerRef={containerRef} />
			</div>
		</div>
	);
};

export default NumberScreen;
