import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  ArrowRightLeft,
  ArrowUp,
  ArrowDown,
  Target,
  Gauge,
  ActivitySquare,
  Dumbbell,
  Brain,
  Calculator,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeadCircuit } from "@phosphor-icons/react";

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

interface SummaryStatisticsCardProps {
  data: SummaryStatisticsData | null;
  loading: boolean;
  error: string | null;
}

const SummaryStatisticsCard: React.FC<SummaryStatisticsCardProps> = ({
  data,
  loading,
  error,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("physical");
  const [selectedMetric, setSelectedMetric] = useState<string>("");

  // Update metric when category changes
  useEffect(() => {
    if (data && selectedCategory) {
      const metricsInCategory =
        data.categories[selectedCategory as keyof typeof data.categories] || [];
      if (metricsInCategory.length > 0) {
        setSelectedMetric(metricsInCategory[0]);
      }
    }
  }, [data, selectedCategory]);

  // Format number to 2 decimal places
  const formatNumber = (num: number) => {
    return num.toFixed(2);
  };

  // Get stat icon
  const getStatIcon = (statName: string) => {
    switch (statName) {
      case "mean":
        return <Target className="h-4 w-4 text-blue-500" />;
      case "std":
        return <ArrowRightLeft className="h-4 w-4 text-purple-500" />;
      case "min":
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      case "max":
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case "50%":
        return <Gauge className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className="overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border-0">
        <div className="h-40 bg-gradient-to-r from-orange-500 to-amber-600 relative overflow-hidden">
          <div className="absolute bottom-4 left-6">
            <h3 className="text-2xl font-bold text-white">
              Summary Statistics
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
              {error || "Failed to load summary statistics data"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedStats = selectedMetric ? data.metrics[selectedMetric] : null;
  const metricsInCategory =
    data.categories[selectedCategory as keyof typeof data.categories] || [];

  return (
    <Card className="overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200 border-0">
      <div
        className={
          "h-40 bg-gradient-to-r from-green-500 to-teal-600 relative overflow-hidden"
        }
      >
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
            Performance Overview
          </h3>
        </div>
        <ActivitySquare className="absolute top-4 right-4 text-white/80 w-8 h-8" />
      </div>

      <CardContent className="p-6">
        {/* Category Tabs */}
        <div className="mb-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger
                value="physical"
                className="flex items-center justify-center gap-1 text-xs"
              >
                <Dumbbell className="w-4 h-4" /> Physical
              </TabsTrigger>
              <TabsTrigger
                value="cognitive"
                className="flex items-center justify-center gap-1 text-xs"
              >
                <Brain className="w-4 h-4" /> Cognitive
              </TabsTrigger>
              <TabsTrigger
                value="leadership"
                className="flex items-center justify-center gap-1 text-xs"
              >
                <HeadCircuit className="w-4 h-4" weight="bold" /> Leadership
              </TabsTrigger>
              <TabsTrigger
                value="other"
                className="flex items-center justify-center gap-1 text-xs"
              >
                <Calculator className="w-4 h-4" /> Other
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-3">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-full border-gray-100 shadow-sm">
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                {metricsInCategory.map((metric) => (
                  <SelectItem key={metric} value={metric}>
                    {metric}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedStats && (
          <div className="space-y-5 pt-1 h-full flex flex-col">
            {/* Count Badge */}
            <div className="flex items-center justify-between px-1 py-2 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 h-8 w-8 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Sample Count</div>
                  <div className="text-xs text-gray-500">
                    Total observations
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold">{selectedStats.count}</div>
            </div>

            {/* Key Stats - Redesigned with better spacing */}
            <div className="grid grid-cols-2 gap-5 mt-2">
              {/* Mean */}
              <div className="flex items-center space-x-2 border-l-3 border-blue-500 pl-3 py-1">
                <Target className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-sm font-medium">Mean</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatNumber(selectedStats.mean)}
                  </span>
                </div>
              </div>

              {/* Std Deviation */}
              <div className="flex items-center space-x-2 border-l-3 border-purple-500 pl-3 py-1">
                <ArrowRightLeft className="h-5 w-5 text-purple-500 flex-shrink-0" />
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-sm font-medium">Std Dev</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {formatNumber(selectedStats.std)}
                  </span>
                </div>
              </div>

              {/* Min */}
              <div className="flex items-center space-x-2 border-l-3 border-red-500 pl-3 py-1">
                <ArrowDown className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-sm font-medium">Min</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    {formatNumber(selectedStats.min)}
                  </span>
                </div>
              </div>

              {/* Max */}
              <div className="flex items-center space-x-2 border-l-3 border-green-500 pl-3 py-1">
                <ArrowUp className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-sm font-medium">Max</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatNumber(selectedStats.max)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quartiles */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-sm font-medium mb-2 flex items-center gap-1.5">
                {getStatIcon("50%")} Distribution Quartiles
              </div>
              <div className="flex items-center w-full h-4 relative mb-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-blue-200"
                  style={{ width: "25%" }}
                />
                <div
                  className="absolute left-[25%] top-0 bottom-0 bg-blue-300"
                  style={{ width: "25%" }}
                />
                <div
                  className="absolute left-[50%] top-0 bottom-0 bg-blue-400"
                  style={{ width: "25%" }}
                />
                <div
                  className="absolute left-[75%] top-0 bottom-0 bg-blue-500"
                  style={{ width: "25%" }}
                />

                {/* Median marker */}
                <div className="absolute left-[50%] w-0.5 -ml-[1px] top-0 bottom-0 bg-white z-10" />
              </div>
              <div className="grid grid-cols-3 text-center">
                <div>
                  <div className="text-xs text-gray-500">Q1 (25%)</div>
                  <div className="text-sm font-semibold">
                    {formatNumber(selectedStats["25%"])}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Median</div>
                  <div className="text-sm font-semibold">
                    {formatNumber(selectedStats["50%"])}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Q3 (75%)</div>
                  <div className="text-sm font-semibold">
                    {formatNumber(selectedStats["75%"])}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-500 pt-1 italic border-t border-gray-100 dark:border-gray-700 mt-auto">
                <Gauge className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                <span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Quartiles
                  </span>{" "}
                  divide the data into four equal parts. The interquartile range
                  (IQR) between Q1 and Q3 contains the middle 50% of values.
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryStatisticsCard;
