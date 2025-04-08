import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Scale,
  Award,
  Timer,
  HeartPulse,
  Weight,
  Mountain,
} from "lucide-react";
import { format } from "date-fns";
import { formatTimeFromSeconds } from "@/artifacts/mocks/physicalData";
import {
  InjuryRecord,
  IPPTRecord,
  SOCRecord,
  RoadMarchRecord,
  CardioRespiratoryRecord,
  StrengthRecord,
} from "@/artifacts/types/physical";

interface PhysicalReportProps {
  assessments: {
    injuries: InjuryRecord[];
    ippt: IPPTRecord;
    soc: SOCRecord;
    roadMarch: RoadMarchRecord;
    cardio: CardioRespiratoryRecord;
    strength: StrengthRecord;
  };
}

const PhysicalReport = ({ assessments }: PhysicalReportProps) => {
  const formatDate = (date: Date) => format(date, "d MMM yyyy");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Physical Training Reports
      </h3>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {/* Weight & Injury History - Keeping this as is since it's the reference style */}
        <AccordionItem
          value="weight-injury"
          className="border-none rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Weight & Injury History
              </h4>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3">
              {assessments.injuries.map((injury) => (
                <div
                  key={injury.id}
                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">
                        {injury.injuryType}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {injury.description}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        injury.status === "recovered"
                          ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                          : injury.status === "active"
                          ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                    >
                      {injury.status.charAt(0).toUpperCase() +
                        injury.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Date: {formatDate(injury.injuryDate)}</span>
                    {injury.recoveryDate && (
                      <span>
                        {" "}
                        • Recovered: {formatDate(injury.recoveryDate)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* IPPT Results - Updated to be more condensed */}
        <AccordionItem
          value="ippt"
          className="border-none rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md">
                <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                IPPT Results
              </h4>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex gap-4 mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Push-ups: {assessments.ippt.pushUpReps}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Sit-ups: {assessments.ippt.sitUpReps}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Run: {formatTimeFromSeconds(assessments.ippt.runTime)}
                    </span>
                  </div>
                  <p className="text-sm font-medium">
                    Total Score: {assessments.ippt.totalScore}/100
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    assessments.ippt.award === "gold"
                      ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                      : assessments.ippt.award === "silver"
                      ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      : assessments.ippt.award === "bronze"
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                      : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {assessments.ippt.award.toUpperCase()}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* SOC Performance - Updated to be more condensed */}
        <AccordionItem
          value="soc"
          className="border-none rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-md">
                <Timer className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                SOC Performance
              </h4>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Time: {formatTimeFromSeconds(assessments.soc.timeInSeconds)}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    assessments.soc.status === "pass"
                      ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {assessments.soc.status.toUpperCase()}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* 20km Road March - Updated to be more condensed */}
        <AccordionItem
          value="road-march"
          className="border-none rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                <Mountain className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                20km Road March
              </h4>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex gap-4 mb-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Time:{" "}
                      {formatTimeFromSeconds(
                        assessments.roadMarch.timeInSeconds
                      )}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    assessments.roadMarch.status === "pass"
                      ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {assessments.roadMarch.status.toUpperCase()}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* Cardio Respiratory - Updated to be more condensed */}
        <AccordionItem
          value="cardio"
          className="border-none rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                <HeartPulse className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Cardio Respiratory
              </h4>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>VO2 Max: {assessments.cardio.vo2Max} ml/kg/min</span>
                <span>
                  Resting HR: {assessments.cardio.restingHeartRate} bpm
                </span>
                <span>
                  Exercise HR: {assessments.cardio.exerciseHeartRate} bpm
                </span>
                <span>HRV: {assessments.cardio.heartRateVariability} ms</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="strength"
          className="border-none rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-md">
                <Weight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Strength Assessment
              </h4>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Squat Max: {assessments.strength.squatRepMax} kg</span>
                <span>
                  Deadlift Max: {assessments.strength.deadliftRepMax} kg
                </span>
                <span>Pull-ups: {assessments.strength.maxPullUps} reps</span>
                <span>
                  Sprint-Drag-Carry:{" "}
                  {formatTimeFromSeconds(
                    assessments.strength.sprintDragCarryTime
                  )}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PhysicalReport;
