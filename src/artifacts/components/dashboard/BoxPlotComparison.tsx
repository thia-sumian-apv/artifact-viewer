import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart4, Activity, Brain, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

interface BoxplotData {
	age_group_analysis: {
		Physical_Fitness_Composite: {
			groups: Array<{
				name: string;
				q1: number;
				median: number;
				q3: number;
				lower_whisker: number;
				upper_whisker: number;
				min: number;
				max: number;
			}>;
			outliers: Array<{
				group: string;
				value: number;
			}>;
		};
		Cognitive_Performance_Composite: {
			groups: Array<{
				name: string;
				q1: number;
				median: number;
				q3: number;
				lower_whisker: number;
				upper_whisker: number;
				min: number;
				max: number;
			}>;
			outliers: Array<{
				group: string;
				value: number;
			}>;
		};
		ML360_Composite: {
			groups: Array<{
				name: string;
				q1: number;
				median: number;
				q3: number;
				lower_whisker: number;
				upper_whisker: number;
				min: number;
				max: number;
			}>;
			outliers: Array<{
				group: string;
				value: number;
			}>;
		};
	};
	detachment_analysis: {
		Physical_Fitness_Composite: {
			groups: Array<{
				name: string;
				q1: number;
				median: number;
				q3: number;
				lower_whisker: number;
				upper_whisker: number;
				min: number;
				max: number;
			}>;
			outliers: Array<{
				group: string;
				value: number;
			}>;
		};
		Cognitive_Performance_Composite: {
			groups: Array<{
				name: string;
				q1: number;
				median: number;
				q3: number;
				lower_whisker: number;
				upper_whisker: number;
				min: number;
				max: number;
			}>;
			outliers: Array<{
				group: string;
				value: number;
			}>;
		};
		ML360_Composite: {
			groups: Array<{
				name: string;
				q1: number;
				median: number;
				q3: number;
				lower_whisker: number;
				upper_whisker: number;
				min: number;
				max: number;
			}>;
			outliers: Array<{
				group: string;
				value: number;
			}>;
		};
	};
	age_group_counts: Record<string, number>;
	detachment_counts: Record<string, number>;
}

interface BoxPlotComparisonProps {
	data: BoxplotData | null;
	loading: boolean;
	error: string | null;
}

const BoxPlotComparison: React.FC<BoxPlotComparisonProps> = ({
	data,
	loading,
	error,
}) => {
	const [groupBy, setGroupBy] = useState<"age" | "detachment">("detachment");
	const [metric, setMetric] = useState<"physical" | "cognitive" | "ml360">(
		"physical",
	);
	const boxplotRef = useRef<HTMLDivElement>(null);

	// Get the appropriate metric data based on selections
	const getMetricData = () => {
		if (!data) return null;

		if (groupBy === "age") {
			switch (metric) {
				case "physical":
					return data.age_group_analysis.Physical_Fitness_Composite;
				case "cognitive":
					return data.age_group_analysis.Cognitive_Performance_Composite;
				case "ml360":
					return data.age_group_analysis.ML360_Composite;
				default:
					return null;
			}
		}
		switch (metric) {
			case "physical":
				return data.detachment_analysis.Physical_Fitness_Composite;
			case "cognitive":
				return data.detachment_analysis.Cognitive_Performance_Composite;
			case "ml360":
				return data.detachment_analysis.ML360_Composite;
			default:
				return null;
		}
	};

	// Get metric title based on selection
	const getMetricTitle = () => {
		switch (metric) {
			case "physical":
				return "Physical Fitness Composite";
			case "cognitive":
				return "Cognitive Performance Composite";
			case "ml360":
				return "ML360 Composite";
			default:
				return "";
		}
	};

	// Create and render the box plot
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!data || loading || error || !boxplotRef.current) return;

		// Clear previous plot
		boxplotRef.current.innerHTML = "";

		// Get the appropriate data based on selections
		const metricData = getMetricData();
		if (!metricData) return;

		// Transform data for the box plot
		const transformedData = metricData.groups.map((group) => ({
			group: group.name,
			q1: group.q1,
			q3: group.q3,
			median: group.median,
			min: group.lower_whisker,
			max: group.upper_whisker,
		}));

		// Get outliers for separate plotting
		const outlierData = (metricData.outliers || []).map((o) => ({
			group: o.group,
			value: o.value,
		}));

		// Colors for different groups
		const colors = [
			"#4361ee", // Blue (primary)
			"#3a0ca3", // Deep purple
			"#7209b7", // Vibrant purple
			"#f72585", // Magenta/pink
		];
		// Calculate domain with padding
		const allValues = [
			...metricData.groups.flatMap((g) => [
				g.min,
				g.max,
				g.q1,
				g.q3,
				g.median,
				g.lower_whisker,
				g.upper_whisker,
			]),
			...outlierData.map((o) => o.value),
		];
		const valueExtent = d3.extent(allValues) as [number, number];
		const padding = (valueExtent[1] - valueExtent[0]) * 0.05;

		// Create the box plot with enhanced visuals
		const plot = Plot.plot({
			width: boxplotRef.current.clientWidth,
			height: 280,
			marginLeft: 80,
			marginRight: 40,
			marginTop: 40,
			marginBottom: 60, // Increased bottom margin for x-axis labels
			y: {
				label: getMetricTitle(),
				domain: [valueExtent[0] - padding, valueExtent[1] + padding],
				grid: true,
				labelAnchor: "center",
				labelOffset: 60,
			},
			x: {
				label: groupBy === "age" ? "Age Group" : "Detachment",
				padding: 0.5,
				labelAnchor: "center",
				labelOffset: 40,
				tickSize: 6,
			},
			marks: [
				// 1. Rules for the whiskers (min to max)
				Plot.ruleX(transformedData, {
					x: "group",
					y1: "min",
					y2: "max",
					stroke: "#000",
					strokeWidth: 1.5,
				}),

				// 2. Rectangles for the interquartile range (Q1 to Q3)
				Plot.rectY(transformedData, {
					x: "group",
					y1: "q1",
					y2: "q3",
					fill: (d) =>
						colors[
							metricData.groups.findIndex((g) => g.name === d.group) %
								colors.length
						],
					fillOpacity: 0.8,
					stroke: "#000",
					strokeWidth: 1.5,
					insetLeft: 0.3,
					insetRight: 0.3,
				}),

				// 3. Horizontal lines for the median (fixed from ruleY to ruleX)
				Plot.ruleY(transformedData, {
					x1: (d) => d.group,
					x2: (d) => d.group,
					y: "median",
					stroke: "#000",
					strokeWidth: 2.5,
					insetLeft: -0.3, // Adjusted to be wider than the box
					insetRight: -0.3, // Adjusted to be wider than the box
				}),

				// 4. Dots for the outliers
				Plot.dot(outlierData, {
					x: "group",
					y: "value",
					fill: "black",
					stroke: "#000",
					strokeWidth: 1,
					r: 3.5,
				}),
			],
			style: {
				background: "transparent",
				color: "currentColor",
			},
		});

		// Render the plot
		boxplotRef.current.append(plot);

		// Cleanup function
		return () => {
			if (boxplotRef.current) {
				boxplotRef.current.innerHTML = "";
			}
		};
	}, [data, groupBy, loading, error, metric]);

	if (loading) {
		return (
			<Card className="overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border-0">
				<div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
					<div className="absolute bottom-4 left-6">
						<h3 className="text-2xl font-bold text-white">
							Performance Distribution
						</h3>
						<p className="text-white/80 text-sm">Loading data...</p>
					</div>
				</div>
				<CardContent className="p-6">
					<Skeleton className="h-[280px] w-full" />
				</CardContent>
			</Card>
		);
	}

	if (error || !data) {
		return (
			<Card className="overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border-0">
				<div className="h-40 bg-gradient-to-r from-red-600 to-pink-600 relative overflow-hidden">
					<div className="absolute bottom-4 left-6">
						<h3 className="text-2xl font-bold text-white">Error</h3>
						<p className="text-white/80 text-sm">Failed to load data</p>
					</div>
				</div>
				<CardContent className="p-6">
					<div className="flex items-center justify-center h-[280px]">
						<p className="text-red-500">
							{error || "Failed to load boxplot data"}
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border-0">
			<div className="h-40 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-700 relative overflow-hidden">
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
						Performance Distribution
					</h3>
					<p className="text-white/80 text-sm">Box Plot Analysis</p>
				</div>
				<BarChart4 className="absolute top-4 right-4 h-8 w-8 text-white/80" />
			</div>

			<CardContent className="p-6 space-y-4">
				<div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
					<div>
						<div className="text-sm font-medium mb-2 text-gray-700">Metric</div>
						<Tabs
							value={metric}
							onValueChange={(value) =>
								setMetric(value as "physical" | "cognitive" | "ml360")
							}
							className="w-full sm:w-auto"
						>
							<TabsList className="grid grid-cols-3">
								<TabsTrigger
									value="physical"
									className="flex items-center gap-1 text-xs"
								>
									<Activity className="h-3 w-3" /> Physical
								</TabsTrigger>
								<TabsTrigger
									value="cognitive"
									className="flex items-center gap-1 text-xs"
								>
									<Brain className="h-3 w-3" /> Cognitive
								</TabsTrigger>
								<TabsTrigger
									value="ml360"
									className="flex items-center gap-1 text-xs"
								>
									<TrendingUp className="h-3 w-3" /> ML360
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					<div>
						<div className="text-sm font-medium mb-2 text-gray-700">
							Group By
						</div>
						<Tabs
							value={groupBy}
							onValueChange={(value) =>
								setGroupBy(value as "age" | "detachment")
							}
							className="w-full sm:w-auto"
						>
							<TabsList className="grid grid-cols-2">
								<TabsTrigger value="age" className="text-xs">
									Age Group
								</TabsTrigger>
								<TabsTrigger value="detachment" className="text-xs">
									Detachment
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</div>

				<div
					ref={boxplotRef}
					className="h-[300px] w-full border border-gray-100 rounded-lg overflow-hidden bg-white p-2"
				/>

				<div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
					<p>
						<span className="font-medium">Box Plot:</span> The box shows IQR
						(Q1-Q3) with median line. Whiskers extend to min/max values within
						1.5 * IQR. Outliers shown as dots.
					</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default BoxPlotComparison;
