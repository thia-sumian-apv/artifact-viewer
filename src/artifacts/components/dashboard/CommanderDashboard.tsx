import type React from "react";
import { useState, useEffect } from "react";
import PhysicalMetricsDistribution from "./PhysicalMetricsDistribution";
import CognitiveMetricsDistribution from "./CognitiveMetricsDistribution";
import CorrelationMatrix from "./CorrelationMatrix";
import ML360ProfilesRadar from "./ML360ProfilesRadar";
import SelfDeterminationRadar from "./SelfDeterminationRadar";
import ScatterPlotMatrix from "./ScatterPlotMatrix";
import BoxPlotComparison from "./BoxPlotComparison";
import SummaryStatisticsCard from "./SummaryStatisticsCard";

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

interface BoxplotAnalysisData {
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
interface ScatterPlotsData {
	scatter_plots: Record<
		string,
		{
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
	>;
	group_options: string[];
	metric_info: Record<
		string,
		{
			min: number;
			max: number;
			mean: number;
			description: string;
		}
	>;
	trainee_data: Array<{
		Trainee: string;
		Detachment: string;
		Age_Group: string;
		[key: string]: string;
	}>;
}

interface SummaryStatistic {
	count: number;
	mean: number;
	std: number;
	min: number;
	"25%": number;
	"50%": number;
	"75%": number;
	max: number;
}

interface SummaryStatisticsData {
	metrics: Record<string, SummaryStatistic>;
	categories: {
		physical: string[];
		cognitive: string[];
		leadership: string[];
		other: string[];
	};
}

const CommanderDashboard: React.FC = () => {
	const [data, setData] = useState<MetricsData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [boxplotData, setBoxplotData] = useState<BoxplotAnalysisData | null>(
		null,
	);
	const [radarData, setRadarData] = useState<RadarProfilesData | null>(null);
	const [scatterData, setScatterData] = useState<ScatterPlotsData | null>(null);
	const [summaryStats, setSummaryStats] =
		useState<SummaryStatisticsData | null>(null);

	useEffect(() => {
		setLoading(true);
		Promise.all([
			fetch("/data/analysis/metrics_distribution.json"),
			fetch("/data/analysis/correlation_matrices.json"),
			fetch("/data/analysis/boxplot_analysis.json"),
			fetch("/data/analysis/radar_profiles.json"),
			fetch("/data/analysis/scatter_plots.json"),
			fetch("/data/analysis/summary_statistics.json"),
		])
			.then(
				([
					metricsRes,
					correlationRes,
					boxplotRes,
					radarRes,
					scatterRes,
					summaryStatsRes,
				]) => {
					if (
						!metricsRes.ok ||
						!correlationRes.ok ||
						!boxplotRes.ok ||
						!radarRes.ok ||
						!scatterRes.ok ||
						!summaryStatsRes.ok
					) {
						throw new Error("Failed to load data");
					}
					return Promise.all([
						metricsRes.json(),
						correlationRes.json(),
						boxplotRes.json(),
						radarRes.json(),
						scatterRes.json(),
						summaryStatsRes.json(),
					]);
				},
			)
			.then(
				([
					metricsData,
					correlationData,
					boxplotData,
					radarData,
					scatterData,
					summaryStatsData,
				]) => {
					console.log("Correlation Data:", correlationData); // Debug log
					console.log("Boxplot Data:", boxplotData); // Debug log
					console.log("Radar Data:", radarData); // Debug log
					console.log("Scatter Data:", scatterData); // Debug log
					console.log("Summary Stats Data:", summaryStatsData); // Debug log
					setData({
						...metricsData,
						correlation_matrices: correlationData,
					});
					setBoxplotData(boxplotData);
					setRadarData(radarData);
					setScatterData(scatterData);
					setSummaryStats(summaryStatsData);
					setLoading(false);
				},
			)
			.catch((err) => {
				console.error("Error loading data:", err); // Debug log
				setError(err.message);
				setLoading(false);
			});
	}, []);

	return (
		<div className="container mx-auto space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<SummaryStatisticsCard
					data={summaryStats}
					loading={loading}
					error={error}
				/>
				<BoxPlotComparison data={boxplotData} loading={loading} error={error} />
			</div>
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
			<div className="grid grid-cols-1">
				<CorrelationMatrix
					data={data?.correlation_matrices || null}
					loading={loading}
					error={error}
				/>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<ML360ProfilesRadar data={radarData} loading={loading} error={error} />
				<SelfDeterminationRadar
					data={radarData}
					loading={loading}
					error={error}
				/>
			</div>
			<div className="grid grid-cols-1">
				<ScatterPlotMatrix data={scatterData} loading={loading} error={error} />
			</div>
		</div>
	);
};

export default CommanderDashboard;
