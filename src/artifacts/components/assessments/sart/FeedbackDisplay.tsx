import { CheckCircle, XCircle } from "lucide-react";

interface FeedbackDisplayProps {
	isCorrect: boolean;
	digit: number;
	isPressedSpace: boolean;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
	isCorrect,
	digit,
	isPressedSpace,
}) => {
	// Determine the feedback message
	const getFeedbackMessage = () => {
		if (digit === 3) {
			return isPressedSpace
				? "You pressed space for the number 3. You should NOT press for 3."
				: "Correct! You didn't press for the number 3.";
		}
		return isPressedSpace
			? "Correct! You pressed space for a non-3 digit."
			: "You missed! You should press space for all non-3 digits.";
	};

	return (
		<div
			className={`
      fixed inset-0 flex items-center justify-center z-50
      bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm
    `}
		>
			<div className="flex flex-col items-center p-6 max-w-sm text-center">
				{isCorrect ? (
					<CheckCircle className="h-16 w-16 text-green-500 mb-4" />
				) : (
					<XCircle className="h-16 w-16 text-red-500 mb-4" />
				)}

				<p
					className={`text-xl font-semibold ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
				>
					{isCorrect ? "Correct!" : "Incorrect!"}
				</p>

				<p className="mt-2 text-gray-700 dark:text-gray-300">
					{getFeedbackMessage()}
				</p>
			</div>
		</div>
	);
};

export default FeedbackDisplay;
