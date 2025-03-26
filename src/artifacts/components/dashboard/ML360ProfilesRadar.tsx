import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import {
	ResponsiveContainer,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
	Tooltip,
	Legend,
} from "recharts";

interface ML360ProfileData {
	group: string;
	count: number;
	[key: string]: string | number;
}

interface RadarProfilesData {
	ml360_profiles: {
		by_detachment: ML360ProfileData[];
		by_age_group: ML360ProfileData[];
		dimensions: string[];
	};
	self_determination_profiles: {
		by_detachment: ML360ProfileData[];
		by_age_group: ML360ProfileData[];
		dimensions: string[];
	};
}

interface ML360ProfilesRadarProps {
	data?: RadarProfilesData | null;
	loading?: boolean;
	error?: string | null;
}

const ML360ProfilesRadar: React.FC<ML360ProfilesRadarProps> = ({
	data: externalData,
	loading: externalLoading,
	error: externalError,
}) => {
	const [data, setData] = useState<RadarProfilesData | null>(
		externalData || null,
	);
	const [loading, setLoading] = useState<boolean>(
		externalLoading !== undefined ? externalLoading : true,
	);
	const [error, setError] = useState<string | null>(externalError || null);
	const [activeTab, setActiveTab] = useState<"age" | "detachment">("age");

	useEffect(() => {
		if (externalData) {
			setData(externalData);
			return;
		}

		setLoading(true);
		fetch("/src/data/analysis/radar_profiles.json")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to load radar profiles data");
				}
				return response.json();
			})
			.then((jsonData: RadarProfilesData) => {
				setData(jsonData);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [externalData]);

	if (loading)
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 dark:border-teal-400" />
			</div>
		);

	if (error) return <div className="text-red-500">Error: {error}</div>;

	if (!data) return <div>No data available</div>;

	const formatRadarData = (
		profileData: ML360ProfileData[],
		dimensions: string[],
	) => {
		return dimensions.map((dim) => ({
			dimension: dim.replace("ML360 ", ""),
			...profileData.reduce(
				(acc, profile) => {
					acc[profile.group] = profile[dim] as number;
					return acc;
				},
				{} as Record<string, number>,
			),
		}));
	};

	const ml360Dimensions = data.ml360_profiles.dimensions;
	const radarData =
		activeTab === "age"
			? formatRadarData(data.ml360_profiles.by_age_group, ml360Dimensions)
			: formatRadarData(data.ml360_profiles.by_detachment, ml360Dimensions);

	// Colors for the radar chart - highly distinguishable colors
	const COLORS = [
		"#2563EB", // Blue
		"#DC2626", // Red
		"#65A30D", // Green
		"#F59E0B", // Amber
		"#6D28D9", // Purple
	];

	// ..
	// Get total count of participants
	const getTotalCount = () => {
		const profiles =
			activeTab === "age"
				? data.ml360_profiles.by_age_group
				: data.ml360_profiles.by_detachment;

		return profiles.reduce((sum, group) => sum + group.count, 0);
	};

	return (
		<Card className="overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200">
			<CardHeader className="p-0">
				<div className="h-40 bg-gradient-to-r from-blue-500 to-cyan-600 relative overflow-hidden">
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
						<h3 className="text-2xl font-bold text-white">ML360 Profiles</h3>
						<p className="text-white/80 text-sm">Mindfulness dimensions</p>
					</div>
					<div className="absolute top-4 right-4">
						<Brain className="h-8 w-8 text-white/80" />
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-6">
				<Tabs
					value={activeTab}
					onValueChange={(v) => setActiveTab(v as "age" | "detachment")}
					className="w-full"
				>
					<div className="flex items-center justify-between mb-4 pb-4 border-b">
						<TabsList className="bg-muted">
							<TabsTrigger
								value="age"
								className="data-[state=active]:bg-background"
							>
								By Age Group
							</TabsTrigger>
							<TabsTrigger
								value="detachment"
								className="data-[state=active]:bg-background"
							>
								By Detachment
							</TabsTrigger>
						</TabsList>
						<Badge variant="secondary" className="ml-2">
							{getTotalCount()} Trainees
						</Badge>
					</div>

					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<RadarChart outerRadius="75%" data={radarData}>
								<PolarGrid
									strokeDasharray="3 3"
									stroke="hsl(var(--muted-foreground))"
								/>
								<PolarAngleAxis
									dataKey="dimension"
									tick={{
										fontSize: 12,
										fill: "hsl(var(--foreground))",
										fontWeight: "500",
									}}
									stroke="hsl(var(--border))"
								/>
								<PolarRadiusAxis
									angle={90} // Change angle to 90 degrees for better alignment
									domain={[0, 7]}
									tick={{
										fontSize: 11,
										fill: "hsl(var(--foreground))",
										dy: 0, // Adjust vertical position
									}}
									axisLine={{ stroke: "hsl(var(--border))" }}
									tickLine={{ stroke: "hsl(var(--border))" }}
									stroke="hsl(var(--border))"
									tickCount={8} // Create ticks at 0, 1, 2, 3, 4, 5, 6, 7
									tickFormatter={(value) => value.toString()} // Format tick labels
									orientation="middle" // Ensure ticks are centered
								/>
								{activeTab === "age"
									? data.ml360_profiles.by_age_group.map((group, index) => (
											<Radar
												key={group.group}
												name={group.group}
												dataKey={group.group}
												stroke={COLORS[index % COLORS.length]}
												fill={COLORS[index % COLORS.length]}
												fillOpacity={0.2}
												strokeWidth={2.5} // Thicker lines
												dot={true} // Show dots at data points
												activeDot={{ r: 5 }} // Larger active dots
											/>
										))
									: data.ml360_profiles.by_detachment.map((group, index) => (
											<Radar
												key={group.group}
												name={group.group}
												dataKey={group.group}
												stroke={COLORS[index % COLORS.length]}
												fill={COLORS[index % COLORS.length]}
												fillOpacity={0.2}
												strokeWidth={1.5} // Thicker lines
												dot={true} // Show dots at data points
												activeDot={{ r: 5 }} // Larger active dots
											/>
										))}
								<Tooltip
									formatter={(value: number, name) => [
										`${value.toFixed(2)} (Avg)`,
										`${name}`,
									]}
									labelFormatter={(label) => `Dimension: ${label}`}
									contentStyle={{
										borderRadius: "var(--radius)",
										backgroundColor: "hsl(var(--background))",
										borderColor: "hsl(var(--border))",
										boxShadow: "var(--shadow)",
										color: "hsl(var(--foreground))",
										padding: "0.75rem 1rem",
									}}
								/>
								<Legend
									iconType="circle"
									iconSize={10}
									wrapperStyle={{
										paddingTop: 10,
										color: "hsl(var(--foreground))",
									}}
								/>
							</RadarChart>
						</ResponsiveContainer>
					</div>

					<div className="mt-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
						<div className="flex items-center justify-center">
							<span className="font-medium">Scale: 1 to 7</span>
						</div>
						<p className="text-center text-xs mt-1">
							Data shows average ML360 scores by{" "}
							{activeTab === "age" ? "age group" : "detachment"}. Higher values
							indicate better mindfulness capabilities.
						</p>
					</div>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default ML360ProfilesRadar;
