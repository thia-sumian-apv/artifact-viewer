import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Zap, BookOpen, Link, BarChart3, Brain, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HeadCircuit } from "@phosphor-icons/react";

export interface ModuleConfigType {
  cognitiveAssessments: {
    enabled: boolean;
    sart: boolean;
    visualRxn: boolean;
    spatialPlanning: boolean;
  };
  psychologicalAssessments: {
    enabled: boolean;
    selfDetermination: boolean;
    ml360Self: boolean;
    ml360Buddy: boolean;
    ml360Trainer: boolean;
    teamResilience: boolean;
  };
  externalAssessments: {
    enabled: boolean;
    cardioRespiratory: boolean;
    strengthAssessment: boolean;
    ippt: boolean;
    soc: boolean;
    roadMarch20km: boolean;
  };
  physicalAssessments: boolean;
  individualReporting: boolean;
  externalIntegration: boolean;
  training: {
    enabled: boolean;
    trainingA: boolean;
    trainingB: boolean;
  };
  thirdPartyIntegration: {
    enabled: boolean;
    polarWatch: boolean;
    vald: boolean;
  };
  reports: {
    enabled: boolean;
    teamResilienceReport: boolean;
    traineeReport: boolean;
  };
}

interface ModuleConfigurationStepProps {
  data: ModuleConfigType;
  onUpdate: (data: ModuleConfigType) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ModuleConfigurationStep({
  data,
  onUpdate,
}: ModuleConfigurationStepProps) {
  const handleMainToggle = (
    moduleId: keyof ModuleConfigType,
    value: boolean
  ) => {
    if (typeof data[moduleId] === "boolean") {
      onUpdate({
        ...data,
        [moduleId]: value,
      });
    } else if (moduleId in data && typeof data[moduleId] === "object") {
      // Get the module data first
      const moduleData = data[moduleId];
      onUpdate({
        ...data,
        [moduleId]: {
          ...moduleData,
          enabled: value,
        },
      });
    }
  };

  const handleSubToggle = (
    moduleId: keyof ModuleConfigType,
    subModuleId: string,
    value: boolean
  ) => {
    if (typeof data[moduleId] === "object") {
      onUpdate({
        ...data,
        [moduleId]: {
          ...(data[moduleId] as Record<string, boolean>),
          [subModuleId]: value,
        },
      });
    }
  };

  // Helper function to check if all submodules are enabled
  const areAllSubModulesEnabled = (moduleId: string) => {
    const moduleData = data[moduleId as keyof ModuleConfigType] as Record<
      string,
      boolean
    >;
    if (!moduleData || typeof moduleData !== "object") return false;

    const subModules = Object.entries(moduleData).filter(
      ([key]) => key !== "enabled"
    );
    return subModules.every(([, value]) => value); // Remove the underscore
  };

  // Helper function to toggle all submodules
  const toggleAllSubModules = (
    moduleId: keyof ModuleConfigType,
    value: boolean
  ) => {
    const moduleData = data[moduleId as keyof ModuleConfigType];
    if (typeof moduleData !== "object") return;

    const updatedModule = { ...moduleData, enabled: value } as Record<
      string,
      boolean
    >;

    // Set all submodules to the same value
    for (const key of Object.keys(moduleData)) {
      if (key !== "enabled") {
        updatedModule[key] = value;
      }
    }

    onUpdate({
      ...data,
      [moduleId]: updatedModule,
    });
  };

  return (
    <div className="space-y-6 p-1">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          Select which modules to enable for this company. All modules are
          selected by default.
        </p>
      </div>

      <div className="grid gap-6">
        {/* ASSESSMENTS CARD */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">Assessment Modules</h3>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <Accordion type="multiple" className="space-y-2">
              {/* Cognitive Assessments */}
              <AccordionItem
                value="cognitive"
                className="border rounded-md overflow-hidden"
              >
                <div className="flex items-center px-4 py-3 justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="cognitiveAssessments"
                      checked={data.cognitiveAssessments.enabled}
                      onCheckedChange={(checked) =>
                        handleMainToggle("cognitiveAssessments", !!checked)
                      }
                      className="h-5 w-5"
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-md flex items-center justify-center ${
                          data.psychologicalAssessments.enabled
                            ? "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        <Brain className="w-4 h-4" />
                      </span>
                      <Label
                        htmlFor="cognitiveAssessments"
                        className="font-medium"
                      >
                        Cognitive Assessments
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAllSubModules(
                          "cognitiveAssessments",
                          !areAllSubModulesEnabled("cognitiveAssessments")
                        );
                      }}
                      className="text-xs h-7"
                    >
                      {areAllSubModulesEnabled("cognitiveAssessments")
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                    <AccordionTrigger className="p-0 hover:no-underline">
                      <span className="sr-only">Toggle</span>
                    </AccordionTrigger>
                  </div>
                </div>
                <AccordionContent className="pb-3 pt-0 pl-12 pr-4">
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sart"
                        checked={data.cognitiveAssessments.sart}
                        disabled={!data.cognitiveAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "cognitiveAssessments",
                            "sart",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="sart" className="text-sm">
                        SART
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="visualRxn"
                        checked={data.cognitiveAssessments.visualRxn}
                        disabled={!data.cognitiveAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "cognitiveAssessments",
                            "visualRxn",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="visualRxn" className="text-sm">
                        Visual RXN
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="spatialPlanning"
                        checked={data.cognitiveAssessments.spatialPlanning}
                        disabled={!data.cognitiveAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "cognitiveAssessments",
                            "spatialPlanning",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="spatialPlanning" className="text-sm">
                        Spatial Planning
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Psychological Assessments */}
              <AccordionItem
                value="psychological"
                className="border rounded-md overflow-hidden"
              >
                <div className="flex items-center px-4 py-3 justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="psychologicalAssessments"
                      checked={data.psychologicalAssessments.enabled}
                      onCheckedChange={(checked) =>
                        handleMainToggle("psychologicalAssessments", !!checked)
                      }
                      className="h-5 w-5"
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-md flex items-center justify-center ${
                          data.psychologicalAssessments.enabled
                            ? "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        <HeadCircuit className="w-4 h-4" weight="bold" />
                      </span>
                      <Label
                        htmlFor="psychologicalAssessments"
                        className="font-medium"
                      >
                        Psychological Assessments
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAllSubModules(
                          "psychologicalAssessments",
                          !areAllSubModulesEnabled("psychologicalAssessments")
                        );
                      }}
                      className="text-xs h-7"
                    >
                      {areAllSubModulesEnabled("psychologicalAssessments")
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                    <AccordionTrigger className="p-0 hover:no-underline">
                      <span className="sr-only">Toggle</span>
                    </AccordionTrigger>
                  </div>
                </div>
                <AccordionContent className="pb-3 pt-0 pl-12 pr-4">
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="selfDetermination"
                        checked={
                          data.psychologicalAssessments.selfDetermination
                        }
                        disabled={!data.psychologicalAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "psychologicalAssessments",
                            "selfDetermination",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="selfDetermination" className="text-sm">
                        Self-Determination
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ml360Self"
                        checked={data.psychologicalAssessments.ml360Self}
                        disabled={!data.psychologicalAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "psychologicalAssessments",
                            "ml360Self",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="ml360Self" className="text-sm">
                        ML 360 (Self)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ml360Buddy"
                        checked={data.psychologicalAssessments.ml360Buddy}
                        disabled={!data.psychologicalAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "psychologicalAssessments",
                            "ml360Buddy",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="ml360Buddy" className="text-sm">
                        ML 360 (Buddy)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ml360Trainer"
                        checked={data.psychologicalAssessments.ml360Trainer}
                        disabled={!data.psychologicalAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "psychologicalAssessments",
                            "ml360Trainer",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="ml360Trainer" className="text-sm">
                        ML 360 (Trainer)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ml360Trainer"
                        checked={data.psychologicalAssessments.teamResilience}
                        disabled={!data.psychologicalAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "psychologicalAssessments",
                            "teamResilience",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="ml360Trainer" className="text-sm">
                        Team Resilience
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Simple Assessment Items */}
              <AccordionItem
                value="externalAssessments"
                className="border rounded-md overflow-hidden"
              >
                <div className="flex items-center px-4 py-3 justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="externalAssessments"
                      checked={data.externalAssessments.enabled}
                      onCheckedChange={(checked) =>
                        handleMainToggle("externalAssessments", !!checked)
                      }
                      className="h-5 w-5"
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-md flex items-center justify-center ${
                          data.psychologicalAssessments.enabled
                            ? "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        <Dumbbell className="w-4 h-4" />
                      </span>
                      <Label
                        htmlFor="externalAssessments"
                        className="font-medium"
                      >
                        External Assessments
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAllSubModules(
                          "externalAssessments",
                          !areAllSubModulesEnabled("externalAssessments")
                        );
                      }}
                      className="text-xs h-7"
                    >
                      {areAllSubModulesEnabled("externalAssessments")
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                    <AccordionTrigger className="p-0 hover:no-underline">
                      <span className="sr-only">Toggle</span>
                    </AccordionTrigger>
                  </div>
                </div>
                <AccordionContent className="pb-3 pt-0 pl-12 pr-4">
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cardioRespiratory"
                        checked={data.externalAssessments.cardioRespiratory}
                        disabled={!data.externalAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "externalAssessments",
                            "cardioRespiratory",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="cardioRespiratory" className="text-sm">
                        Cardio Respiratory
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="strengthAssessment"
                        checked={data.externalAssessments.strengthAssessment}
                        disabled={!data.externalAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "externalAssessments",
                            "strengthAssessment",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="strengthAssessment" className="text-sm">
                        Strength Assessment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ippt"
                        checked={data.externalAssessments.ippt}
                        disabled={!data.externalAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "externalAssessments",
                            "ippt",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="ippt" className="text-sm">
                        IPPT
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="soc"
                        checked={data.externalAssessments.soc}
                        disabled={!data.externalAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "externalAssessments",
                            "soc",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="soc" className="text-sm">
                        SOC
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="roadMarch20km"
                        checked={data.externalAssessments.roadMarch20km}
                        disabled={!data.externalAssessments.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "externalAssessments",
                            "roadMarch20km",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="roadMarch20km" className="text-sm">
                        20km Road March
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* TRAINING CARD */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">Training Modules</h3>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <Accordion type="multiple" className="space-y-2">
              {/* Training */}
              <AccordionItem
                value="training"
                className="border rounded-md overflow-hidden"
              >
                <div className="flex items-center px-4 py-3 justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="training"
                      checked={data.training.enabled}
                      onCheckedChange={(checked) =>
                        handleMainToggle("training", !!checked)
                      }
                      className="h-5 w-5"
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-md ${
                          data.training.enabled
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        <BookOpen className="h-4 w-4" />
                      </span>
                      <Label htmlFor="training" className="font-medium">
                        Training
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAllSubModules(
                          "training",
                          !areAllSubModulesEnabled("training")
                        );
                      }}
                      className="text-xs h-7"
                    >
                      {areAllSubModulesEnabled("training")
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                    <AccordionTrigger className="p-0 hover:no-underline">
                      <span className="sr-only">Toggle</span>
                    </AccordionTrigger>
                  </div>
                </div>
                <AccordionContent className="pb-3 pt-0 pl-12 pr-4">
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="trainingA"
                        checked={data.training.trainingA}
                        disabled={!data.training.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle("training", "trainingA", !!checked)
                        }
                      />
                      <Label htmlFor="trainingA" className="text-sm">
                        Training A
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="trainingB"
                        checked={data.training.trainingB}
                        disabled={!data.training.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle("training", "trainingB", !!checked)
                        }
                      />
                      <Label htmlFor="trainingB" className="text-sm">
                        Training B
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* INTEGRATION CARD */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">Integration Module</h3>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <Accordion type="multiple" className="space-y-2">
              {/* Third Party Integration */}
              <AccordionItem
                value="thirdParty"
                className="border rounded-md overflow-hidden"
              >
                <div className="flex items-center px-4 py-3 justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="thirdPartyIntegration"
                      checked={data.thirdPartyIntegration.enabled}
                      onCheckedChange={(checked) =>
                        handleMainToggle("thirdPartyIntegration", !!checked)
                      }
                      className="h-5 w-5"
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-md ${
                          data.thirdPartyIntegration.enabled
                            ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        <Link className="h-4 w-4" />
                      </span>
                      <Label
                        htmlFor="thirdPartyIntegration"
                        className="font-medium"
                      >
                        Third Party Integration
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAllSubModules(
                          "thirdPartyIntegration",
                          !areAllSubModulesEnabled("thirdPartyIntegration")
                        );
                      }}
                      className="text-xs h-7"
                    >
                      {areAllSubModulesEnabled("thirdPartyIntegration")
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                    <AccordionTrigger className="p-0 hover:no-underline">
                      <span className="sr-only">Toggle</span>
                    </AccordionTrigger>
                  </div>
                </div>
                <AccordionContent className="pb-3 pt-0 pl-12 pr-4">
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="polarWatch"
                        checked={data.thirdPartyIntegration.polarWatch}
                        disabled={!data.thirdPartyIntegration.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "thirdPartyIntegration",
                            "polarWatch",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="polarWatch" className="text-sm">
                        Polar Watch
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vald"
                        checked={data.thirdPartyIntegration.vald}
                        disabled={!data.thirdPartyIntegration.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "thirdPartyIntegration",
                            "vald",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="vald" className="text-sm">
                        VALD
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Simple Integration Item */}
              <div className="flex items-center px-4 py-3 border rounded-md">
                <Checkbox
                  id="externalIntegration"
                  checked={data.externalIntegration}
                  onCheckedChange={(checked) =>
                    handleMainToggle("externalIntegration", !!checked)
                  }
                  className="h-5 w-5 mr-3"
                />
                <div className="flex items-center gap-2">
                  <span
                    className={`p-1.5 rounded-md ${
                      data.externalIntegration
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    <Zap className="h-4 w-4" />
                  </span>
                  <Label htmlFor="externalIntegration" className="font-medium">
                    External Integration
                  </Label>
                </div>
              </div>
            </Accordion>
          </CardContent>
        </Card>

        {/* REPORTS CARD */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">Reporting Module</h3>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <Accordion type="multiple" className="space-y-2">
              {/* Reports */}
              <AccordionItem
                value="reportItems"
                className="border rounded-md overflow-hidden"
              >
                <div className="flex items-center px-4 py-3 justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="reports"
                      checked={data.reports.enabled}
                      onCheckedChange={(checked) =>
                        handleMainToggle("reports", !!checked)
                      }
                      className="h-5 w-5"
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-md ${
                          data.reports.enabled
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </span>
                      <Label htmlFor="reports" className="font-medium">
                        Report Types
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAllSubModules(
                          "reports",
                          !areAllSubModulesEnabled("reports")
                        );
                      }}
                      className="text-xs h-7"
                    >
                      {areAllSubModulesEnabled("reports")
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                    <AccordionTrigger className="p-0 hover:no-underline">
                      <span className="sr-only">Toggle</span>
                    </AccordionTrigger>
                  </div>
                </div>
                <AccordionContent className="pb-3 pt-0 pl-12 pr-4">
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="teamResilienceReport"
                        checked={data.reports.teamResilienceReport}
                        disabled={!data.reports.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle(
                            "reports",
                            "teamResilienceReport",
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="teamResilienceReport" className="text-sm">
                        Team Resilience Report
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="traineeReport"
                        checked={data.reports.traineeReport}
                        disabled={!data.reports.enabled}
                        onCheckedChange={(checked) =>
                          handleSubToggle("reports", "traineeReport", !!checked)
                        }
                      />
                      <Label htmlFor="traineeReport" className="text-sm">
                        Trainee Report
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
