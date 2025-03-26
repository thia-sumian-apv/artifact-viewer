import type React from "react";
import { useState, useEffect } from "react";
import PhysicalMetricsDistribution from "./PhysicalMetricsDistribution";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, ChartBar, ArrowDown, ArrowUp } from "lucide-react";
import CognitiveMetricsDistribution from "./CognitiveMetricsDistribution";
import CorrelationMatrix from "./CorrelationMatrix";
import ML360ProfilesRadar from "./ML360ProfilesRadar";
import SelfDeterminationRadar from "./SelfDeterminationRadar";

interface MetricData {
	histogram: {
		counts: number[];
		bin_edges: number[];
		bin_centers: number[];
	};
	stats: {
		mean: number;
		median: number;
		std: number;
		min: number;
		max: number;
		q1: number;
		q3: number;
		count: number;
	};
	raw_data: number[];
}
interface MetricsData {
	physical_metrics: Record<string, MetricData>;
	cognitive_metrics: Record<string, MetricData>;
	correlation_matrices: {
		matrices: {
			physical_cognitive: number[][];
			physical_psychological: number[][];
			cognitive_psychological: number[][];
		};
		domains: {
			physical: string[];
			cognitive: string[];
			psychological: string[];
		};
		metadata: {
			min_value: number;
			max_value: number;
		};
		cross_domain_correlation: {
			data: Array<{
				source: string;
				source_domain: string;
				target: string;
				target_domain: string;
				value: number;
			}>;
			metadata?: {
				min_value: number;
				max_value: number;
			};
		};
	};
}

interface RadarProfilesData {
	ml360_profiles: {
		by_detachment: Array<{
			group: string;
			count: number;
			[key: string]: string | number;
		}>;
		by_age_group: Array<{
			group: string;
			count: number;
			[key: string]: string | number;
		}>;
		dimensions: string[];
	};
	self_determination_profiles: {
		by_detachment: Array<{
			group: string;
			count: number;
			[key: string]: string | number;
		}>;
		by_age_group: Array<{
			group: string;
			count: number;
			[key: string]: string | number;
		}>;
		dimensions: string[];
	};
}

interface BoxplotData {
	// Define structure based on your actual data
	[metric: string]: {
		whiskers: number[];
		quartiles: number[];
		// Add other properties as needed
	};
}

const CommanderDashboard: React.FC = () => {
	const [data, setData] = useState<MetricsData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [_boxplotData, setBoxplotData] = useState<BoxplotData | null>(null);
	const [radarData, setRadarData] = useState<RadarProfilesData | null>(null);
	useEffect(() => {
		setLoading(true);
		Promise.all([
			fetch("/data/analysis/metrics_distribution.json"),
			fetch("/data/analysis/correlation_matrices.json"),
			fetch("/data/analysis/boxplot_analysis.json"),
			fetch("/data/analysis/radar_profiles.json"),
		])
			.then(([metricsRes, correlationRes, boxplotRes, radarRes]) => {
				if (
					!metricsRes.ok ||
					!correlationRes.ok ||
					!boxplotRes.ok ||
					!radarRes.ok
				) {
					throw new Error("Failed to load data");
				}
				return Promise.all([
					metricsRes.json(),
					correlationRes.json(),
					boxplotRes.json(),
					radarRes.json(),
				]);
			})
			.then(([metricsData, correlationData, boxplotData, radarData]) => {
				console.log("Correlation Data:", correlationData); // Debug log
				console.log("Boxplot Data:", boxplotData); // Debug log
				console.log("Radar Data:", radarData); // Debug log
				setData({
					...metricsData,
					correlation_matrices: correlationData,
				});
				setBoxplotData(boxplotData);
				setRadarData(radarData);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error loading data:", err); // Debug log
				setError(err.message);
				setLoading(false);
			});
	}, []);

	return (
		<div className="container mx-auto space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<PhysicalMetricsDistribution
					data={data}
					loading={loading}
					error={error}
				/>
				<CognitiveMetricsDistribution
					data={data}
					loading={loading}
					error={error}
				/>
			</div>
			{/* Second row: Correlation Matrix (full width) */}
			<div className="grid grid-cols-1">
				<CorrelationMatrix
					data={data?.correlation_matrices || null}
					loading={loading}
					error={error}
				/>
			</div>
			{/* Radar Charts Row */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<ML360ProfilesRadar data={radarData} loading={loading} error={error} />
				<SelfDeterminationRadar
					data={radarData}
					loading={loading}
					error={error}
				/>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Course Overview Stats */}
				<Card className="overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
					<div className="h-40 bg-gradient-to-r from-green-500 to-emerald-600 relative overflow-hidden">
						<div
							className="absolute inset-0 opacity-20"
							style={{
								backgroundImage:
									"url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						/>
						<div className="absolute bottom-4 left-6">
							<h3 className="text-2xl font-bold text-white">Course Overview</h3>
							<p className="text-white/80 text-sm">
								Key Performance Indicators
							</p>
						</div>
						<ChartBar className="absolute top-4 right-4 h-8 w-8 text-white/80" />
					</div>
					<CardContent className="p-6">
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
								<div className="text-xs text-gray-500 dark:text-gray-400">
									Completion Rate
								</div>
								<div className="text-2xl font-bold text-green-600 dark:text-green-400">
									82%
								</div>
							</div>
							<div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
								<div className="text-xs text-gray-500 dark:text-gray-400">
									Trainee Count
								</div>
								<div className="text-2xl font-bold">
									{loading
										? "..."
										: data?.physical_metrics?.["Pull Ups"]?.stats.count}
								</div>
							</div>
							<div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
								<div className="text-xs text-gray-500 dark:text-gray-400">
									Above Average
								</div>
								<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
									65%
								</div>
							</div>
							<div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
								<div className="text-xs text-gray-500 dark:text-gray-400">
									Below Average
								</div>
								<div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
									35%
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Trainee Insights Card */}
				<Card className="overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
					<div className="h-40 bg-gradient-to-r from-blue-600 to-cyan-600 relative overflow-hidden">
						<div
							className="absolute inset-0 opacity-20"
							style={{
								backgroundImage:
									"url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1184&q=80')",
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						/>
						<div className="absolute bottom-4 left-6">
							<h3 className="text-2xl font-bold text-white">
								Trainee Insights
							</h3>
							<p className="text-white/80 text-sm">Performance Distributions</p>
						</div>
						<Users className="absolute top-4 right-4 h-8 w-8 text-white/80" />
					</div>
					<CardContent className="p-6">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<div className="text-sm font-medium">Top Performers</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">
										5 trainees exceed benchmarks in all areas
									</div>
								</div>
								<div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
									<ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div>
									<div className="text-sm font-medium">Needs Improvement</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">
										8 trainees below benchmarks in physical metrics
									</div>
								</div>
								<div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
									<ArrowDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div>
									<div className="text-sm font-medium">Cognitive Strength</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">
										Average accuracy in SART: 96.3%
									</div>
								</div>
								<div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
									<Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default CommanderDashboard;
