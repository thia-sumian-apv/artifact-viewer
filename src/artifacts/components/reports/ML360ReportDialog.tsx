import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ML360ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Static dummy data for individual ML360 results
const dummyML360Results = [
  { dimension: "Awareness", value: 5.7 },
  { dimension: "Calm & Patience", value: 5.8 },
  { dimension: "Open Mind", value: 5.5 },
  { dimension: "Focus & Presence", value: 5.4 },
  { dimension: "Growth", value: 5.9 },
];

const ML360ReportDialog = ({ open, onOpenChange }: ML360ReportDialogProps) => {
  const COLORS = ["hsl(var(--primary))"];
  // Format data for radar chart
  const radarData = dummyML360Results.map((result) => ({
    dimension: result.dimension.replace("ML360 ", ""),
    value: result.value,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ML360 Assessment Results
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Radar Chart - Styled like ML360ProfilesRadar */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="h-[300px]">
                {" "}
                {/* Reduced height */}
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
                      angle={90}
                      domain={[0, 7]}
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--foreground))",
                        dy: 0,
                      }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                      stroke="hsl(var(--border))"
                      tickCount={8}
                      tickFormatter={(value) => value.toString()}
                      orientation="middle"
                    />
                    <Radar
                      name="Your Score"
                      dataKey="value"
                      stroke={COLORS[0]}
                      fill={COLORS[0]}
                      fillOpacity={0.2}
                      strokeWidth={2.5}
                      dot={true}
                      activeDot={{ r: 5 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `${value.toFixed(2)}`,
                        "Your Score",
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
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Dimension Breakdown */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
              Mindfulness Dimensions
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              {/* Awareness */}
              <div className="flex items-center space-x-2 border-l-3 border-teal-500 pl-3 py-1">
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium">Awareness</span>
                    <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                      {dummyML360Results[0].value.toFixed(1)}
                    </span>
                  </div>
                  <Progress
                    value={(dummyML360Results[0].value / 7) * 100}
                    className="h-1 bg-gray-200 dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Right Column */}
              {/* Calm & Patience */}
              <div className="flex items-center space-x-2 border-l-3 border-teal-500 pl-3 py-1">
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium">Calm & Patience</span>
                    <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                      {dummyML360Results[1].value.toFixed(1)}
                    </span>
                  </div>
                  <Progress
                    value={(dummyML360Results[1].value / 7) * 100}
                    className="h-1 bg-gray-200 dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Left Column */}
              {/* Open Mind */}
              <div className="flex items-center space-x-2 border-l-3 border-teal-500 pl-3 py-1">
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium">Open Mind</span>
                    <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                      {dummyML360Results[2].value.toFixed(1)}
                    </span>
                  </div>
                  <Progress
                    value={(dummyML360Results[2].value / 7) * 100}
                    className="h-1 bg-gray-200 dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Right Column */}
              {/* Focus & Presence */}
              <div className="flex items-center space-x-2 border-l-3 border-teal-500 pl-3 py-1">
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium">
                      Focus & Presence
                    </span>
                    <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                      {dummyML360Results[3].value.toFixed(1)}
                    </span>
                  </div>
                  <Progress
                    value={(dummyML360Results[3].value / 7) * 100}
                    className="h-1 bg-gray-200 dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Left Column */}
              {/* Growth */}
              <div className="flex items-center space-x-2 border-l-3 border-teal-500 pl-3 py-1">
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium">Growth</span>
                    <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                      {dummyML360Results[4].value.toFixed(1)}
                    </span>
                  </div>
                  <Progress
                    value={(dummyML360Results[4].value / 7) * 100}
                    className="h-1 bg-gray-200 dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-500 pt-3 italic border-t border-gray-200 dark:border-gray-700 mt-4">
              <span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Scale: 1-7
                </span>{" "}
                Higher scores indicate stronger mindfulness capabilities in each
                dimension.
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ML360ReportDialog;
