import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { Dumbbell } from "lucide-react";

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
  physical_metrics: {
    [key: string]: MetricData;
  };
  cognitive_metrics: {
    [key: string]: MetricData;
  };
}

interface PhysicalMetricsDistributionProps {
  data?: MetricsData | null;
  loading?: boolean;
  error?: string | null;
}

interface HistogramDataPoint {
  binRange: string;
  binCenter: number;
  count: number;
}

const PhysicalMetricsDistribution: React.FC<
  PhysicalMetricsDistributionProps
> = ({
  data: externalData,
  loading: externalLoading,
  error: externalError,
}) => {
  const [data, setData] = useState<MetricsData | null>(externalData || null);
  const [selectedPhysicalMetric, setSelectedPhysicalMetric] =
    useState<string>("Pull Ups");
  const [loading, setLoading] = useState<boolean>(
    externalLoading !== undefined ? externalLoading : true
  );
  const [error, setError] = useState<string | null>(externalError || null);

  useEffect(() => {
    if (externalData) {
      setData(externalData);
      return;
    }

    setLoading(true);
    fetch("/data/analysis/metrics_distribution.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load metrics data");
        }
        return response.json();
      })
      .then((jsonData: MetricsData) => {
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

  const physicalMetrics = data.physical_metrics;
  const metricData = physicalMetrics[selectedPhysicalMetric];

  const histogramData = metricData.histogram.counts.map((count, index) => ({
    binRange: `${metricData.histogram.bin_edges[index].toFixed(
      1
    )}-${metricData.histogram.bin_edges[index + 1].toFixed(1)}`,
    binCenter: metricData.histogram.bin_centers[index],
    count: count,
  }));

  // Generate KDE curve data from the histogram
  const generateKDEData = (histData: HistogramDataPoint[]) => {
    // Simple approach to create a smoothed curve
    const points = histData.map((item) => ({
      x: item.binCenter,
      y: item.count,
    }));

    // Apply smoothing
    const smoothedPoints = [];
    const smoothingFactor = 0.2;

    for (let i = 0; i < points.length; i++) {
      let yVal = points[i].y;

      // Weighted average of neighboring points
      if (i > 0)
        yVal = yVal * (1 - smoothingFactor) + points[i - 1].y * smoothingFactor;
      if (i < points.length - 1)
        yVal = yVal * (1 - smoothingFactor) + points[i + 1].y * smoothingFactor;

      smoothedPoints.push({
        binCenter: points[i].x,
        binRange: histogramData[i].binRange,
        count: histogramData[i].count,
        density: yVal * 1.2, // Scale it up slightly to match seaborn style
      });
    }

    return smoothedPoints;
  };

  const kdeData = generateKDEData(histogramData);

  return (
    <Card className="overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div
        className={
          "h-40 bg-gradient-to-r from-orange-500 to-red-600 relative overflow-hidden"
        }
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute bottom-4 left-6">
          <h3 className="text-2xl font-bold text-white">Physical Metrics</h3>
        </div>
        <div className="absolute top-4 right-4">
          <Dumbbell className="text-white/80 w-8 h-8" />
        </div>
      </div>

      <CardContent className="p-6">
        {/* Simplified control row with selector and key stats */}
        <div className="flex flex-wrap items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <Select
              value={selectedPhysicalMetric}
              onValueChange={setSelectedPhysicalMetric}
            >
              <SelectTrigger className="w-[180px] mr-3 bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(physicalMetrics).map((metric) => (
                  <SelectItem key={metric} value={metric}>
                    {metric}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-100">
              {metricData.stats.count} Trainees
            </Badge>
          </div>
        </div>

        {/* Main focus: Distribution chart with more height */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={kdeData}
              margin={{ top: 20, right: 15, left: 0, bottom: 30 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="binCenter"
                label={{
                  value: selectedPhysicalMetric,
                  position: "insideBottom",
                  offset: -10,
                  fontSize: 12,
                }}
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => value.toFixed(1)} // Add this line
              />
              <YAxis
                label={{
                  value: "Frequency",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fontSize: 12,
                }}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value, name) => [
                  name === "density" ? "" : `${value} trainees`,
                ]}
                labelFormatter={(label) => `Pull Ups: ${label}`}
                contentStyle={{
                  borderRadius: "6px",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill="#FF9F45"
                opacity={0.7}
                radius={[4, 4, 0, 0]}
                name="Count"
              />
              <Line
                type="monotone"
                dataKey="density"
                stroke="#D35400"
                strokeWidth={2.5}
                dot={false}
                activeDot={false}
                name="density"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Subtle statistical insights below the chart */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div>
            <span>Mean: </span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {metricData.stats.mean.toFixed(1)}
            </span>
          </div>
          <div>
            <span>Median: </span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {metricData.stats.median.toFixed(1)}
            </span>
          </div>
          <div>
            <span>Range: </span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {metricData.stats.min.toFixed(0)}-
              {metricData.stats.max.toFixed(0)}
            </span>
          </div>
          <div>
            <span>Std Dev: </span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {metricData.stats.std.toFixed(1)}
            </span>
          </div>
          <div>
            <span>Q1-Q3: </span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {metricData.stats.q1.toFixed(1)}-{metricData.stats.q3.toFixed(1)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhysicalMetricsDistribution;
