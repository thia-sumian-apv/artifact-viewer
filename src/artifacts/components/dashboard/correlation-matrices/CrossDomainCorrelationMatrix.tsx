import type React from "react";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CrossDomainCorrelationItem {
  source: string;
  source_domain: string;
  target: string;
  target_domain: string;
  value: number;
}

interface CrossDomainCorrelationMatrix {
  data: CrossDomainCorrelationItem[];
  metadata?: {
    min_value: number;
    max_value: number;
  };
}

interface CrossDomainCorrelationMatrixProps {
  data: CrossDomainCorrelationMatrix;
}

const CrossDomainCorrelationMatrix: React.FC<
  CrossDomainCorrelationMatrixProps
> = ({ data }) => {
  // Process the data to extract unique domains and metrics
  const {
    physicalMetrics,
    cognitiveMetrics,
    psychologicalMetrics,
    correlationMap,
    domains,
  } = useMemo(() => {
    // Check if required data is available
    if (!data || !data.data || !Array.isArray(data.data)) {
      return {
        physicalMetrics: [],
        cognitiveMetrics: [],
        psychologicalMetrics: [],
        correlationMap: new Map(),
        domains: [],
      };
    }

    // Extract unique metrics by domain
    const physicalMetrics: string[] = [];
    const cognitiveMetrics: string[] = [];
    const psychologicalMetrics: string[] = [];
    const correlationMap = new Map<string, Map<string, number>>();
    const domains = new Set<string>();

    // Collect unique metrics by domain
    for (const item of data.data) {
      domains.add(item.source_domain);
      domains.add(item.target_domain);

      // Add source metric to appropriate domain array if not already there
      if (
        item.source_domain === "physical" &&
        !physicalMetrics.includes(item.source)
      ) {
        physicalMetrics.push(item.source);
      } else if (
        item.source_domain === "cognitive" &&
        !cognitiveMetrics.includes(item.source)
      ) {
        cognitiveMetrics.push(item.source);
      } else if (
        item.source_domain === "psychological" &&
        !psychologicalMetrics.includes(item.source)
      ) {
        psychologicalMetrics.push(item.source);
      }

      // Add target metric to appropriate domain array if not already there
      if (
        item.target_domain === "physical" &&
        !physicalMetrics.includes(item.target)
      ) {
        physicalMetrics.push(item.target);
      } else if (
        item.target_domain === "cognitive" &&
        !cognitiveMetrics.includes(item.target)
      ) {
        cognitiveMetrics.push(item.target);
      } else if (
        item.target_domain === "psychological" &&
        !psychologicalMetrics.includes(item.target)
      ) {
        psychologicalMetrics.push(item.target);
      }

      // Build correlation map for quick lookup
      const sourceKey = `${item.source_domain}:${item.source}`;
      const targetKey = `${item.target_domain}:${item.target}`;

      if (!correlationMap.has(sourceKey)) {
        correlationMap.set(sourceKey, new Map());
      }
      correlationMap.get(sourceKey)?.set(targetKey, item.value);
    }

    return {
      physicalMetrics,
      cognitiveMetrics,
      psychologicalMetrics,
      correlationMap,
      domains: Array.from(domains),
    };
  }, [data]);

  const getDomainTitle = (domain: string) => {
    switch (domain) {
      case "physical":
        return "Physical";
      case "cognitive":
        return "Cognitive";
      case "psychological":
        return "Psychological";
      default:
        return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
  };

  // Update the getCorrelationColor function
  const getCorrelationColor = (value: number) => {
    if (value > 0) {
      // Positive correlation - red gradient (stronger = more intense red)
      return `rgba(234, 67, 53, ${Math.min(value * 0.9 + 0.1, 1).toFixed(2)})`;
    }
    if (value < 0) {
      // Negative correlation - blue gradient (stronger negative = more intense blue)
      return `rgba(66, 133, 244, ${Math.min(
        Math.abs(value) * 0.9 + 0.1,
        1
      ).toFixed(2)})`;
    }
    // No correlation - light gray
    return "rgba(240, 240, 240, 0.5)";
  };

  // Set default domains based on available data
  const [selectedSourceDomain, setSelectedSourceDomain] = useState(
    domains[0] || "physical"
  );
  const [selectedTargetDomain, setSelectedTargetDomain] = useState(
    domains[0] || domains[1] || "cognitive"
  );

  // Get metrics for selected domains
  const sourceMetrics =
    selectedSourceDomain === "physical"
      ? physicalMetrics
      : selectedSourceDomain === "cognitive"
      ? cognitiveMetrics
      : psychologicalMetrics;

  const targetMetrics =
    selectedTargetDomain === "physical"
      ? physicalMetrics
      : selectedTargetDomain === "cognitive"
      ? cognitiveMetrics
      : psychologicalMetrics;

  // Dynamic layout adjustments based on metric count
  const isSmallMatrix = sourceMetrics.length <= 5 && targetMetrics.length <= 5;
  const cellWidth = isSmallMatrix ? "w-28" : "w-20";
  const cellHeight = isSmallMatrix ? "h-16" : "h-14";
  const labelWidth = isSmallMatrix ? "w-48" : "w-40";
  const fontSize = isSmallMatrix ? "text-sm" : "text-xs";

  const getCorrelation = (source: string, target: string): number => {
    const sourceKey = `${selectedSourceDomain}:${source}`;
    const targetKey = `${selectedTargetDomain}:${target}`;

    return correlationMap.get(sourceKey)?.get(targetKey) || 0;
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="pt-6 bg-white">
        <div className="space-y-10">
          {/* Domain selection options */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <h3 className="text-xl font-semibold whitespace-nowrap text-gray-900">
              {getDomainTitle(selectedSourceDomain)} ×{" "}
              {getDomainTitle(selectedTargetDomain)} Correlation
            </h3>

            <div className="flex items-center gap-1">
              <span className="text-base font-medium text-gray-700 whitespace-nowrap">
                Domain Correlation From:
              </span>

              <Select
                value={selectedSourceDomain}
                onValueChange={setSelectedSourceDomain}
              >
                <SelectTrigger
                  id="source-domain"
                  className="w-[130px] mx-2 bg-white border-gray-200 text-gray-900"
                >
                  <SelectValue
                    className="text-gray-900"
                    placeholder="Source Domain"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {domains.map((domain) => (
                    <SelectItem
                      key={`source-${domain}`}
                      value={domain}
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      {getDomainTitle(domain)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-base font-medium text-gray-700 whitespace-nowrap ml-2">
                To:
              </span>

              <Select
                value={selectedTargetDomain}
                onValueChange={setSelectedTargetDomain}
              >
                <SelectTrigger
                  id="target-domain"
                  className="w-[130px] ml-2 bg-white border-gray-200 text-gray-900"
                >
                  <SelectValue
                    className="text-gray-900"
                    placeholder="Target Domain"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {domains.map((domain) => (
                    <SelectItem
                      key={`target-${domain}`}
                      value={domain}
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      {getDomainTitle(domain)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Matrix with gradient legend */}
          <div className="flex flex-col items-center mt-8">
            <div className="flex flex-col items-start w-full">
              <div className="flex items-center justify-center w-full">
                <div className="overflow-auto max-w-full">
                  <div className="flex">
                    <div className={`${labelWidth} flex-shrink-0`} />
                    <div className="flex">
                      {targetMetrics.map((target) => (
                        <div
                          key={`header-${target}`}
                          className={`${cellWidth} flex-shrink-0 pb-2 px-1`}
                        >
                          <div
                            className={`font-medium ${fontSize} text-gray-900 text-center overflow-hidden`}
                          >
                            {target}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Matrix rows */}
                  <div className="flex flex-col">
                    {sourceMetrics.map((source) => (
                      <div key={`row-${source}`} className="flex">
                        <div
                          className={`${labelWidth} ${cellHeight} flex-shrink-0 pr-2 flex items-center justify-end`}
                        >
                          <div
                            className={`font-medium ${fontSize} text-gray-900 text-right overflow-hidden`}
                          >
                            {source}
                          </div>
                        </div>

                        {/* Correlation cells */}
                        <div className="flex">
                          {targetMetrics.map((target) => {
                            const correlation = getCorrelation(source, target);
                            const isSelf =
                              source === target &&
                              selectedSourceDomain === selectedTargetDomain;

                            return (
                              <div
                                key={`cell-${source}-${target}`}
                                className={`
                                  ${cellWidth} ${cellHeight} flex-shrink-0 p-1
                                  ${isSelf ? "opacity-50" : ""}
                                `}
                              >
                                <div
                                  className={`
                                    w-full h-full rounded-md flex items-center justify-center
                                    ${isSelf ? "bg-gray-100" : ""}
                                  `}
                                  style={{
                                    backgroundColor: isSelf
                                      ? undefined
                                      : getCorrelationColor(correlation),
                                  }}
                                >
                                  <span
                                    className={`
                                      ${fontSize} font-semibold
                                      ${
                                        Math.abs(correlation) > 0.5
                                          ? "text-white"
                                          : "text-gray-800"
                                      }
                                    `}
                                  >
                                    {correlation === 0
                                      ? "-"
                                      : correlation.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vertical gradient legend */}
                <div className="flex flex-col items-center ml-4">
                  <div className="flex flex-col items-start mt-2">
                    <span className="text-xs font-medium text-red-700">
                      +1.0
                    </span>
                    <div className="h-60 w-3 rounded-full bg-gradient-to-b from-red-500 via-gray-100 to-blue-500 mx-2" />
                    <span className="text-xs font-medium text-blue-700 mt-auto">
                      -1.0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrossDomainCorrelationMatrix;
