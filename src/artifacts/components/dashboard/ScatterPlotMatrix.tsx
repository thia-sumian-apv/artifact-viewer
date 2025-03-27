import type React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	ScatterChart,
	Tooltip,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	ZAxis,
} from "recharts";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define interfaces in a separate section for better organization
interface ScatterPlotData {
	x_metric: string;
	y_metric: string;
	title: string;
	correlation: number;
	trend_line: {
		slope: number;
		intercept: number;
		points: { x: number; y: number }[];
	};
	x_stats: {
		min: number;
		max: number;
		mean: number;
		median: number;
	};
	y_stats: {
		min: number;
		max: number;
		mean: number;
		median: number;
	};
}

interface MetricInfo {
	min: number;
	max: number;
	mean: number;
	description: string;
}

interface TraineeData {
	Trainee: string;
	Detachment: string;
	Age_Group: string;
	[key: string]: string;
}

interface ScatterPlotMatrixProps {
	data: {
		scatter_plots: Record<string, ScatterPlotData>;
		group_options: string[];
		metric_info: Record<string, MetricInfo>;
		trainee_data: TraineeData[];
	} | null;
	loading: boolean;
	error: string | null;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		name: string;
		value: number;
		payload: TraineeData & { x: number; y: number };
	}>;
}

// Separate component for the custom tooltip
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
	if (active && payload && payload.length) {
		const data = payload[0].payload;
		return (
			<div className="bg-popover p-3 border border-border rounded-md shadow-md text-popover-foreground">
				<p className="font-medium text-sm mb-1">{data.Trainee}</p>
				<p className="text-xs text-muted-foreground mb-2">{`${data.Detachment}, ${data.Age_Group}`}</p>
				<div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
					<span className="text-muted-foreground">{payload[0].name}:</span>
					<span className="font-medium">{Number(data.x).toFixed(2)}</span>
					<span className="text-muted-foreground">{payload[1].name}:</span>
					<span className="font-medium">{Number(data.y).toFixed(2)}</span>
				</div>
			</div>
		);
	}
	return null;
};

const MetricStatsCard: React.FC<{
	metricName: string;
	stats: { min: number; max: number; mean: number; median: number };
	description?: string;
}> = ({ metricName, stats, description }) => (
	<div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100">
		<h4 className="font-medium text-gray-800 text-md mb-1">
			{metricName.replace(/_/g, " ")}
		</h4>
		{description && (
			<p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
				{description}
			</p>
		)}
		<div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2">
			<div className="flex justify-between">
				<span className="text-sm text-gray-500 dark:text-gray-400">Min:</span>
				<span className="text-sm font-medium">{stats.min.toFixed(2)}</span>
			</div>
			<div className="flex justify-between">
				<span className="text-sm text-gray-500 dark:text-gray-400">Max:</span>
				<span className="text-sm font-medium">{stats.max.toFixed(2)}</span>
			</div>
			<div className="flex justify-between">
				<span className="text-sm text-gray-500 dark:text-gray-400">Mean:</span>
				<span className="text-sm font-medium">{stats.mean.toFixed(2)}</span>
			</div>
			<div className="flex justify-between">
				<span className="text-sm text-gray-500 dark:text-gray-400">
					Median:
				</span>
				<span className="text-sm font-medium">{stats.median.toFixed(2)}</span>
			</div>
		</div>
	</div>
);
// Separate component for the actual scatter chart
const ScatterPlotChart: React.FC<{
	currentPlot: ScatterPlotData;
	scatterData: Array<{
		name: string;
		data: Array<TraineeData & { x: number; y: number }>;
	}>;
}> = ({ currentPlot, scatterData }) => {
	// Colors for different groups - using shadcn-friendly color palette
	const COLORS = [
		"hsl(221, 83%, 53%)", // blue
		"hsl(24, 100%, 62%)", // orange
		"hsl(142, 71%, 45%)", // green
		"hsl(346, 84%, 61%)", // red
		"hsl(262, 80%, 58%)", // purple
		"hsl(93, 64%, 50%)", // lime
		"hsl(331, 79%, 66%)", // pink
		"hsl(215, 14%, 54%)", // gray
	];

	// Format tick values to show only 2 decimal places
	const formatTick = (value: number) => value.toFixed(2);

	// Calculate proper domain padding (5% padding on each side)
	const getAxisDomain = (min: number, max: number) => {
		const range = max - min;
		return [
			Math.max(0, min - range * 0.05), // Don't go below 0
			max + range * 0.05,
		];
	};

	const xDomain = getAxisDomain(
		currentPlot.x_stats.min,
		currentPlot.x_stats.max,
	);
	const yDomain = getAxisDomain(
		currentPlot.y_stats.min,
		currentPlot.y_stats.max,
	);

	return (
		<div className="h-[450px] w-full">
			<ResponsiveContainer width="100%" height="100%">
				<ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
					{/* Fixed grid with dashed lines */}
					<CartesianGrid
						strokeDasharray="3 3"
						horizontal
						vertical
						stroke="hsl(215 20% 65% / 0.2)"
					/>

					{/* X-axis with dynamic range but fixed number of ticks */}
					<XAxis
						type="number"
						dataKey="x"
						name={currentPlot.x_metric.replace(/_/g, " ")}
						domain={xDomain}
						tickCount={6}
						label={{
							value: currentPlot.x_metric.replace(/_/g, " "),
							position: "insideBottom",
							offset: -5,
							fill: "hsl(215 20% 65% / 0.8)",
							fontSize: 12,
						}}
						tick={{ fontSize: 11 }}
						tickFormatter={formatTick}
						stroke="hsl(215 20% 65% / 0.8)"
					/>

					{/* Y-axis with dynamic range but fixed number of ticks */}
					<YAxis
						type="number"
						dataKey="y"
						name={currentPlot.y_metric.replace(/_/g, " ")}
						domain={yDomain}
						tickCount={6}
						label={{
							value: currentPlot.y_metric.replace(/_/g, " "),
							angle: -90,
							position: "center",
							dx: -45,
							fill: "hsl(215 20% 65% / 0.8)",
							fontSize: 12,
							textAnchor: "middle",
						}}
						tick={{ fontSize: 11 }}
						tickFormatter={formatTick}
						stroke="hsl(215 20% 65% / 0.8)"
					/>

					<ZAxis range={[50, 50]} />

					<Tooltip
						content={<CustomTooltip />}
						cursor={{
							strokeDasharray: "3 3",
							stroke: "hsl(215 20% 65% / 0.6)",
						}}
					/>

					{/* Legend with minimal styling */}
					<Legend
						layout="horizontal"
						verticalAlign="bottom"
						align="center"
						wrapperStyle={{ paddingTop: 15 }}
						iconSize={8}
						iconType="circle"
						formatter={(value) => (
							<span className="text-xs font-medium">{value}</span>
						)}
					/>

					{/* Scatter plots for each group */}
					{scatterData.map((group, index) => (
						<Scatter
							key={group.name}
							name={group.name}
							data={group.data}
							fill={COLORS[index % COLORS.length]}
							stroke="#fff"
							strokeWidth={1}
							shape="circle"
							legendType="circle"
						/>
					))}
				</ScatterChart>
			</ResponsiveContainer>
		</div>
	);
};

// Separate component for the plot selection controls
const PlotControls: React.FC<{
	plots: Record<string, ScatterPlotData>;
	selectedPlot: string;
	setSelectedPlot: (value: string) => void;
	groupOptions: string[];
	selectedGroup: string;
	setSelectedGroup: (value: string) => void;
}> = ({
	plots,
	selectedPlot,
	setSelectedPlot,
	groupOptions,
	selectedGroup,
	setSelectedGroup,
}) => {
	// Get the current plot data
	const currentPlot = plots[selectedPlot];

	// Extract available metric combinations for X and Y axis selectors
	const availableXMetrics = Array.from(
		new Set(Object.values(plots).map((plot) => plot.x_metric)),
	);

	const availableYMetricsForCurrentX = Array.from(
		new Set(
			Object.values(plots)
				.filter((plot) => plot.x_metric === currentPlot?.x_metric)
				.map((plot) => plot.y_metric),
		),
	);

	// Handle X metric change
	const handleXMetricChange = (xMetric: string) => {
		// Find the first plot that uses this X metric
		const newPlotKey = Object.entries(plots).find(
			([_, plot]) => plot.x_metric === xMetric,
		)?.[0];

		if (newPlotKey) {
			setSelectedPlot(newPlotKey);
		}
	};

	// Handle Y metric change
	const handleYMetricChange = (yMetric: string) => {
		// Find a plot that matches the current X and selected Y
		const newPlotKey = Object.entries(plots).find(
			([_, plot]) =>
				plot.x_metric === currentPlot?.x_metric && plot.y_metric === yMetric,
		)?.[0];

		if (newPlotKey) {
			setSelectedPlot(newPlotKey);
		}
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
			{/* Group By tabs - column 1 */}
			<div>
				<Label className="text-sm font-medium block mb-1.5">Group By</Label>
				<Tabs
					value={selectedGroup}
					onValueChange={setSelectedGroup}
					className="w-full"
				>
					<TabsList className="w-full grid grid-cols-2 bg-muted h-9">
						{groupOptions.map((option) => (
							<TabsTrigger key={option} value={option} className="text-xs">
								{option}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			{/* X-Axis selector - column 2 */}
			<div>
				<Label
					htmlFor="x-metric-select"
					className="text-sm font-medium mb-1.5 block"
				>
					X-Axis Metric
				</Label>
				<Select
					value={currentPlot?.x_metric || ""}
					onValueChange={handleXMetricChange}
				>
					<SelectTrigger id="x-metric-select" className="bg-background h-9">
						<SelectValue placeholder="Select X-axis metric" />
					</SelectTrigger>
					<SelectContent>
						{availableXMetrics.map((metric) => (
							<SelectItem key={metric} value={metric}>
								{metric.replace(/_/g, " ")}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Y-Axis selector - column 3 */}
			<div>
				<Label
					htmlFor="y-metric-select"
					className="text-sm font-medium mb-1.5 block"
				>
					Y-Axis Metric
				</Label>
				<Select
					value={currentPlot?.y_metric || ""}
					onValueChange={handleYMetricChange}
				>
					<SelectTrigger id="y-metric-select" className="bg-background h-9">
						<SelectValue placeholder="Select Y-axis metric" />
					</SelectTrigger>
					<SelectContent>
						{availableYMetricsForCurrentX.map((metric) => (
							<SelectItem key={metric} value={metric}>
								{metric.replace(/_/g, " ")}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};

// Main component
const ScatterPlotMatrix: React.FC<ScatterPlotMatrixProps> = ({
	data,
	loading,
	error,
}) => {
	const [selectedPlot, setSelectedPlot] = useState<string>("");
	const [groupBy, setGroupBy] = useState<string>("");

	if (loading) {
		return (
			<div className="flex justify-center items-center h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
			</div>
		);
	}

	if (!data || error) return null;

	// Set default values if not already set
	if (!selectedPlot && Object.keys(data.scatter_plots).length > 0) {
		setSelectedPlot(Object.keys(data.scatter_plots)[0]);
		return null;
	}

	if (!groupBy && data.group_options.length > 0) {
		setGroupBy(data.group_options[0]);
		return null;
	}

	const currentPlot = data.scatter_plots[selectedPlot];
	if (!currentPlot) return null;

	// Prepare data for the selected scatter plot
	const prepareScatterData = () => {
		// Group data by the selected group option
		const groupedData: Record<
			string,
			Array<TraineeData & { x: number; y: number }>
		> = {};

		for (const trainee of data.trainee_data) {
			const group = trainee[groupBy];
			if (!groupedData[group]) {
				groupedData[group] = [];
			}

			groupedData[group].push({
				...trainee,
				x: Number.parseFloat(trainee[currentPlot.x_metric]),
				y: Number.parseFloat(trainee[currentPlot.y_metric]),
			} as TraineeData & { x: number; y: number });
		}

		return Object.entries(groupedData).map(([group, points]) => ({
			name: group,
			data: points,
		}));
	};

	const scatterData = prepareScatterData();

	return (
		<Card className="col-span-2 overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border-0">
			<div className="h-40 bg-gradient-to-r from-teal-600 to-pink-600 relative overflow-hidden">
				<div
					className="absolute inset-0 opacity-20"
					style={{
						backgroundImage:
							"url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3')",
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<div className="absolute bottom-4 left-6">
					<h3 className="text-2xl font-bold text-white">
						Performance Relationships
					</h3>
					<p className="text-white/80 text-sm">Scatter Plot Analysis</p>
				</div>
				<TrendingUp className="absolute top-4 right-4 h-8 w-8 text-white/80" />
			</div>

			<CardContent className="p-8">
				{/* Plot selection controls without metricInfo */}
				<PlotControls
					plots={data.scatter_plots}
					selectedPlot={selectedPlot}
					setSelectedPlot={setSelectedPlot}
					groupOptions={data.group_options}
					selectedGroup={groupBy}
					setSelectedGroup={setGroupBy}
				/>

				<div className="space-y-6">
					{/* Plot header with title */}
					<div className="mb-4">
						<h3 className="text-xl font-semibold text-gray-800">
							{currentPlot.title}
						</h3>
						<p className="text-md text-gray-600 mt-1">
							Correlation: {currentPlot.correlation.toFixed(3)}
						</p>
					</div>

					{/* Scatter plot chart */}
					<div className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
						<ScatterPlotChart
							currentPlot={currentPlot}
							scatterData={scatterData}
						/>
					</div>

					{/* Metric statistics cards */}
					<div className="grid grid-cols-2 gap-6 mt-4">
						<MetricStatsCard
							metricName={currentPlot.x_metric}
							stats={currentPlot.x_stats}
							description={data.metric_info[currentPlot.x_metric]?.description}
						/>
						<MetricStatsCard
							metricName={currentPlot.y_metric}
							stats={currentPlot.y_stats}
							description={data.metric_info[currentPlot.y_metric]?.description}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ScatterPlotMatrix;
