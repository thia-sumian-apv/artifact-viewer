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
  ComposedChart,
  Line,
} from "recharts";
import { Lightbulb } from "lucide-react";

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

interface CognitiveMetricsDistributionProps {
  data?: MetricsData | null;
  loading?: boolean;
  error?: string | null;
}

interface HistogramDataPoint {
  binRange: string;
  binCenter: number;
  count: number;
}

const CognitiveMetricsDistribution: React.FC<
  CognitiveMetricsDistributionProps
> = ({
  data: externalData,
  loading: externalLoading,
  error: externalError,
}) => {
  const [data, setData] = useState<MetricsData | null>(externalData || null);
  const [selectedCognitiveMetric, setSelectedCognitiveMetric] =
    useState<string>("Sustained Attention Response Accuracy (%)");
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 dark:border-indigo-400" />
      </div>
    );

  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (!data) return <div>No data available</div>;

  const cognitiveMetrics = data.cognitive_metrics;
  const metricData = cognitiveMetrics[selectedCognitiveMetric];

  const histogramData = metricData.histogram.counts.map((count, index) => ({
    binRange: `${metricData.histogram.bin_edges[index].toFixed(
      1
    )}-${metricData.histogram.bin_edges[index + 1].toFixed(1)}`,
    binCenter: metricData.histogram.bin_centers[index],
    count: count,
  }));

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
    <Card className="overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 bg-white">
      <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1571310100246-e0676f359b42?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute bottom-4 left-6">
          <h3 className="text-2xl font-bold text-white">Cognitive Metrics</h3>
        </div>
        <div className="absolute top-4 right-4">
          <Lightbulb className="h-8 w-8 text-white/80" />
        </div>
      </div>

      <CardContent className="p-6">
        {/* Control row */}
        <div className="flex flex-wrap items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center">
            <Select
              value={selectedCognitiveMetric}
              onValueChange={setSelectedCognitiveMetric}
            >
              <SelectTrigger className="w-[260px] mr-3 bg-white border-gray-200 text-gray-900">
                <SelectValue className="text-gray-900" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {Object.keys(cognitiveMetrics).map((metric) => (
                  <SelectItem
                    key={metric}
                    value={metric}
                    className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                  >
                    {metric}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
              {metricData.stats.count} Trainees
            </Badge>
          </div>
        </div>

        {/* Chart */}
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
                  value: "Accuracy (%)",
                  position: "insideBottom",
                  offset: -10,
                  fontSize: 12,
                  fill: "#374151",
                }}
                tick={{ fontSize: 11, fill: "#374151" }}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <YAxis
                label={{
                  value: "Frequency",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fontSize: 12,
                  fill: "#374151",
                }}
                tick={{ fontSize: 11, fill: "#374151" }}
              />
              <Tooltip
                formatter={(value, name) => [
                  name === "density" ? "" : `${value} trainees`,
                ]}
                labelFormatter={(label) => `Accuracy: ${label.toFixed(1)}`}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  color: "#374151",
                }}
              />
              <Bar
                dataKey="count"
                fill="#A78BFA"
                opacity={0.8}
                radius={[4, 4, 0, 0]}
                name="Count"
              />
              <Line
                type="monotone"
                dataKey="density"
                stroke="#7C3AED"
                strokeWidth={2.5}
                dot={false}
                activeDot={false}
                name="density"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500">
          <div>
            <span>Mean: </span>
            <span className="font-medium text-gray-900">
              {metricData.stats.mean.toFixed(1)}%
            </span>
          </div>
          <div>
            <span>Median: </span>
            <span className="font-medium text-gray-900">
              {metricData.stats.median.toFixed(1)}%
            </span>
          </div>
          <div>
            <span>Range: </span>
            <span className="font-medium text-gray-900">
              {metricData.stats.min.toFixed(1)}-
              {metricData.stats.max.toFixed(1)}%
            </span>
          </div>
          <div>
            <span>Std Dev: </span>
            <span className="font-medium text-gray-900">
              {metricData.stats.std.toFixed(1)}
            </span>
          </div>
          <div>
            <span>Q1-Q3: </span>
            <span className="font-medium text-gray-900">
              {metricData.stats.q1.toFixed(1)}-{metricData.stats.q3.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CognitiveMetricsDistribution;
