import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, BarChart as BarChartIcon, Clock } from "lucide-react";
import type { SARTResponse } from "./SARTConfig";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine,
	Cell,
	type TooltipProps,
} from "recharts";
import type {
	ValueType,
	NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface ScoreData {
	accuracy: number;
	averageResponseTime: number;
	fastestResponseTime: number;
	correctResponses: number;
	incorrectResponses: number;
	missedResponses: number;
}

interface ResultsScreenProps {
	testResponses: SARTResponse[];
	onTryAgain: () => void;
	onFinish: () => void;
	containerRef: React.RefObject<HTMLDivElement>;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
	testResponses,
	onTryAgain,
	onFinish,
}) => {
	// Calculate all the metrics
	const scores = useMemo((): ScoreData => {
		if (testResponses.length === 0) {
			return {
				accuracy: 0,
				averageResponseTime: 0,
				fastestResponseTime: 0,
				correctResponses: 0,
				incorrectResponses: 0,
				missedResponses: 0,
			};
		}

		const correctResponses = testResponses.filter((r) => r.isCorrect).length;
		const incorrectResponses = testResponses.filter((r) => !r.isCorrect).length;

		// Count responses with null responseTime (no response given when needed)
		const missedResponses = testResponses.filter(
			(r) => r.digit !== 3 && r.responseTime === null,
		).length;

		const responseTimes = testResponses
			.filter((r) => r.responseTime !== null)
			.map((r) => r.responseTime as number);

		const averageResponseTime =
			responseTimes.length > 0
				? Math.round(
						responseTimes.reduce((sum, time) => sum + time, 0) /
							responseTimes.length,
					)
				: 0;

		const fastestResponseTime =
			responseTimes.length > 0 ? Math.min(...responseTimes) : 0;

		// Calculate accuracy percentage
		const accuracy = Math.round(
			(correctResponses / testResponses.length) * 100,
		);

		return {
			accuracy,
			averageResponseTime,
			fastestResponseTime,
			correctResponses,
			incorrectResponses,
			missedResponses,
		};
	}, [testResponses]);

	// Format response time data for chart
	const chartData = useMemo(() => {
		return testResponses.map((response, index) => ({
			trial: index + 1,
			digit: response.digit,
			responseTime: response.responseTime || 0,
			isCorrect: response.isCorrect,
			isTarget: response.digit === 3,
			// Add a status field to simplify rendering logic
			status:
				response.digit === 3
					? "noPress"
					: response.isCorrect
						? "correct"
						: "incorrect",
		}));
	}, [testResponses]);

	// Custom tooltip formatter
	const customTooltip = ({
		active,
		payload,
		label,
	}: TooltipProps<ValueType, NameType>) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			const isTarget = data.digit === 3;

			return (
				<div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm text-xs">
					<p className="font-medium">{`Trial ${label}: Digit ${data.digit}`}</p>
					{isTarget ? (
						<p className="text-gray-600 dark:text-gray-300">
							No response needed
						</p>
					) : (
						<p className="text-gray-600 dark:text-gray-300">
							{data.responseTime ? `${data.responseTime}ms` : "No response"}
						</p>
					)}
					<p
						className={`font-medium ${
							data.isCorrect
								? "text-green-500 dark:text-green-400"
								: "text-red-500 dark:text-red-400"
						}`}
					>
						{data.isCorrect ? "Correct" : "Incorrect"}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="max-w-xl mx-auto w-full flex flex-col gap-4 overflow-y-auto px-4">
			<div className="text-center mb-2">
				<CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500" />
				<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Assessment Complete
				</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Your SART performance results
				</p>
			</div>

			{/* Key Stats section */}
			<div className="grid grid-cols-2 gap-4 mb-4">
				<Card>
					<CardContent className="p-4 flex flex-col items-center">
						<div className="flex items-center mb-1">
							<BarChartIcon className="h-5 w-5 text-blue-500 mr-2" />
							<span className="text-sm font-medium">Accuracy</span>
						</div>
						<p className="text-3xl font-bold text-gray-900 dark:text-white">
							{scores.accuracy}%
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{scores.correctResponses} of {testResponses.length} correct
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4 flex flex-col items-center">
						<div className="flex items-center mb-1">
							<Clock className="h-5 w-5 text-amber-500 mr-2" />
							<span className="text-sm font-medium">Response Time</span>
						</div>
						<p className="text-3xl font-bold text-gray-900 dark:text-white">
							{scores.averageResponseTime}ms
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Fastest: {scores.fastestResponseTime}ms
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Response Times Chart */}
			<Card className="mb-4">
				<CardHeader className="pb-0 pt-4 px-4">
					<CardTitle className="text-base">Response Times by Trial</CardTitle>
				</CardHeader>

				<CardContent className="pt-2 px-2 pb-4">
					<div className="h-64 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={chartData}
								margin={{ top: 30, right: 60, left: 10, bottom: 30 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									opacity={0.3}
									vertical={false}
								/>
								<XAxis
									dataKey="trial"
									label={{
										value: "Question Number",
										position: "insideBottom",
										offset: -5,
									}}
									tick={{ fontSize: 12 }}
								/>
								<YAxis
									label={{
										value: "ms",
										angle: -90,
										position: "insideLeft",
										offset: 5,
									}}
									tick={{ fontSize: 12 }}
									domain={[0, "dataMax + 100"]}
								/>
								<Tooltip content={customTooltip} />

								{/* Bar for response times */}
								<Bar
									dataKey="responseTime"
									name="Response Time"
									fill="#22C55E" // Default color
									radius={[4, 4, 0, 0]}
									label={
										{
											/* ... existing label props */
										}
									}
								>
									{chartData.map((entry) => {
										let color = "#22C55E"; // Default green (correct)

										// For digit 3, use red if they responded (incorrect) and gray if they didn't (correct)
										if (entry.digit === 3) {
											color = entry.isCorrect ? "#9CA3AF" : "#EF4444"; // Gray only if correct (no press)
										} else if (!entry.isCorrect) {
											color = "#EF4444"; // Red for incorrect
										}

										return (
											<Cell
												key={`cell-${entry.trial}-${entry.digit}`}
												fill={color}
											/>
										);
									})}
								</Bar>
								<ReferenceLine
									y={scores.averageResponseTime}
									stroke="#FFA500"
									strokeDasharray="3 3"
									label={{
										value: `Avg: ${scores.averageResponseTime}ms`,
										position: "right",
										fill: "#FFA500",
										fontSize: 12,
										offset: 10, // Add offset to move label away from edge
									}}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>

					{/* Legend - positioned with more space from chart */}
					<div className="flex justify-center gap-8 mt-6 text-xs">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-sm bg-green-500" />
							<span>Correct</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-sm bg-red-500" />
							<span>Incorrect</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Action Buttons */}
			<div className="flex gap-4 justify-center mt-2 mb-4">
				<Button onClick={onTryAgain} variant="outline" className="px-6">
					Try Again
				</Button>
				<Button
					onClick={onFinish}
					className="bg-teal-500 hover:bg-teal-600 px-6"
				>
					Finish
				</Button>
			</div>
		</div>
	);
};

export default ResultsScreen;
