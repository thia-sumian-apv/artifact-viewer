import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Calendar,
  Users,
  Tag,
  Mail,
  Phone,
  MapPin,
  User,
  Zap,
  Bell,
  Database,
  Clock,
  BarChart3,
  BookOpen,
  Link,
  Brain,
  Dumbbell,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { Company } from "@/artifacts/types/company";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { HeadCircuit } from "@phosphor-icons/react";

interface ViewCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
  onEdit: (id: string) => void;
}

export function ViewCompanyDialog({
  open,
  onOpenChange,
  company,
  onEdit,
}: ViewCompanyDialogProps) {
  const [activeTab, setActiveTab] = useState("general-info");

  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {company.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="general-info"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <TabsList className="flex flex-row overflow-x-auto mb-4 w-full">
            <TabsTrigger value="general-info">General Information</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="roles">Roles & Hierarchy</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="settings">General Settings</TabsTrigger>
          </TabsList>

          {/* General Information Tab */}
          <TabsContent value="general-info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Company Name
                    </p>
                    <p className="font-medium">{company.name}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Short Name
                    </p>
                    <p className="font-medium">{company.shortName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Status
                    </p>
                    <Badge
                      variant={
                        company.status === "active" ? "default" : "destructive"
                      }
                      className={`capitalize ${
                        company.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : ""
                      }`}
                    >
                      {company.status}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Registration Number
                    </p>
                    <p className="font-medium">{company.registrationNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Contact Person
                    </p>
                    <p className="font-medium">{company.contactName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </p>
                    <p className="font-medium">{company.contactEmail}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone
                    </p>
                    <p className="font-medium">{company.contactNumber}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Address
                    </p>
                    <p className="font-medium">{company.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Start Date
                    </p>
                    <p className="font-medium">
                      {format(company.subscriptionStart, "dd/MM/yyyy")}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      End Date
                    </p>
                    <p className="font-medium">
                      {format(company.subscriptionEnd, "dd/MM/yyyy")}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Duration
                    </p>
                    <p className="font-medium">
                      {company.subscriptionDuration} months
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      Renewal Reminder
                    </p>
                    <p className="font-medium">
                      {company.renewalReminder} days before expiry
                    </p>
                  </div>

                  {company.trialSettings && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Trial Status
                        </p>
                        <Badge
                          variant={
                            company.trialSettings.includeTrial
                              ? "default"
                              : "outline"
                          }
                        >
                          {company.trialSettings.includeTrial
                            ? "Trial Included"
                            : "No Trial"}
                        </Badge>
                      </div>

                      {company.trialSettings.includeTrial && (
                        <div className="space-y-1">
                          <p className="text-sm flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Trial Duration
                          </p>
                          <p className="font-medium">
                            {company.trialSettings.trialDays} days
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>License Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Total Licenses
                    </p>
                    <p className="font-medium">{company.maxLicenses}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Used Licenses
                    </p>
                    <p className="font-medium">{company.usedLicenses}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Available Licenses
                    </p>
                    <p className="font-medium">
                      {company.maxLicenses - company.usedLicenses}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles & Hierarchy Tab */}
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Role Customization</CardTitle>
                <CardDescription>
                  Custom role labels for this company
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-slate-800 rounded-md p-4">
                  {/* Tree-style visualization - more similar to RoleCustomizationStep */}
                  <div className="text-sm">
                    {/* Top level role - superAdmin */}
                    <div className="tree-item">
                      <div className="flex items-center py-1.5">
                        <div className="mr-2 text-blue-600 dark:text-blue-400">
                          <Users className="h-4 w-4" />
                        </div>
                        <span className="font-medium">
                          {company.roleLabels.superAdmin}
                        </span>
                      </div>

                      {/* Second level - companyAdmin */}
                      <div className="pl-6 border-l border-slate-200 dark:border-slate-700 ml-2">
                        <div className="tree-item">
                          <div className="flex items-center py-1.5">
                            <div className="flex items-center">
                              <div className="mr-2 text-indigo-600 dark:text-indigo-400">
                                <Users className="h-4 w-4" />
                              </div>
                              <span className="font-medium">
                                {company.roleLabels.companyAdmin} 1
                              </span>
                            </div>
                          </div>

                          {/* Third level - courseCommander */}
                          <div className="pl-6 border-l border-slate-200 dark:border-slate-700 ml-2">
                            <div className="tree-item">
                              <div className="flex items-center py-1.5">
                                <div className="flex items-center">
                                  <div className="mr-2 text-purple-600 dark:text-purple-400">
                                    <Users className="h-4 w-4" />
                                  </div>
                                  <span className="font-medium">
                                    {company.roleLabels.courseCommander} 1
                                  </span>
                                </div>
                              </div>

                              {/* Fourth level - courseTrainer */}
                              <div className="pl-6 border-l border-slate-200 dark:border-slate-700 ml-2">
                                <div className="tree-item">
                                  <div className="flex items-center py-1.5">
                                    <div className="flex items-center">
                                      <div className="mr-2 text-pink-600 dark:text-pink-400">
                                        <Users className="h-4 w-4" />
                                      </div>
                                      <span className="font-medium">
                                        {company.roleLabels.courseTrainer} 1
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="tree-item">
                                  <div className="flex items-center py-1.5 text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center">
                                      <div className="mr-2 opacity-70">
                                        <Users className="h-4 w-4" />
                                      </div>
                                      <span>
                                        {company.roleLabels.courseTrainer} 2
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="tree-item text-slate-500 dark:text-slate-400 py-1 pl-6">
                                  ...
                                </div>

                                {/* Fifth level - trainee */}
                                <div className="pl-6 border-l border-slate-200 dark:border-slate-700 ml-2">
                                  <div className="tree-item">
                                    <div className="flex items-center py-1.5">
                                      <div className="flex items-center">
                                        <div className="mr-2 text-orange-600 dark:text-orange-400">
                                          <User className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">
                                          {company.roleLabels.trainee} 1
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="tree-item">
                                    <div className="flex items-center py-1.5 text-slate-500 dark:text-slate-400">
                                      <div className="flex items-center">
                                        <div className="mr-2 opacity-70">
                                          <User className="h-4 w-4" />
                                        </div>
                                        <span>
                                          {company.roleLabels.trainee} 2
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="tree-item text-slate-500 dark:text-slate-400 py-1 pl-6">
                                    ...
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Third level - second instance (collapsed) */}
                            <div className="tree-item">
                              <div className="flex items-center py-1.5 text-slate-500 dark:text-slate-400">
                                <div className="flex items-center">
                                  <div className="mr-2 opacity-70">
                                    <Users className="h-4 w-4" />
                                  </div>
                                  <span>
                                    {company.roleLabels.courseCommander} 2
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="tree-item text-slate-500 dark:text-slate-400 py-1 pl-6">
                              ...
                            </div>
                          </div>
                        </div>

                        {/* Second level - second instance (collapsed) */}
                        <div className="tree-item">
                          <div className="flex items-center py-1.5 text-slate-500 dark:text-slate-400">
                            <div className="flex items-center">
                              <div className="mr-2 opacity-70">
                                <Users className="h-4 w-4" />
                              </div>
                              <span>{company.roleLabels.companyAdmin} 2</span>
                            </div>
                          </div>
                        </div>

                        <div className="tree-item text-slate-500 dark:text-slate-400 py-1 pl-6">
                          ...
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t text-xs text-slate-500 dark:text-slate-400">
                      <p>
                        This tree shows your organization's hierarchical
                        structure. Only one branch is fully expanded to
                        illustrate the reporting chain, while dots (...)
                        indicate additional instances at each level.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Tab - Restructured with cards containing accordions */}
          <TabsContent value="modules" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Module configuration for {company.name}
            </p>

            <div className="space-y-6 max-h-[450px] overflow-y-auto pr-1">
              {/* Assessment Modules Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    Assessment Modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    {/* Cognitive Assessment Accordion */}
                    {company.modules.cognitiveAssessments && (
                      <AccordionItem value="cognitive" className="border-b">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex items-center">
                            <div className="bg-teal-50 dark:bg-teal-900/20 p-1 rounded-md mr-2 flex items-center justify-center">
                              <Brain className="w-[18px] h-[18px] text-teal-600 dark:text-teal-400" />
                            </div>
                            <span className="font-medium text-sm">
                              Cognitive Assessments
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          {company.moduleDetails?.cognitiveAssessments && (
                            <div className="grid grid-cols-2 gap-2 pl-8">
                              {Object.entries(
                                company.moduleDetails.cognitiveAssessments
                              )
                                .filter(
                                  ([key, value]) => key !== "enabled" && value
                                )
                                .map(([key]) => (
                                  <div
                                    key={key}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                                    {key
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) =>
                                        str.toUpperCase()
                                      )}
                                  </div>
                                ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Psychological Assessment Accordion */}
                    {company.modules.psychologicalAssessments && (
                      <AccordionItem value="psychological" className="border-b">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex items-center">
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-1 rounded-md mr-2 flex items-center justify-center">
                              <HeadCircuit
                                className="w-[18px] h-[18px] text-indigo-600 dark:text-indigo-400"
                                weight="bold"
                              />
                            </div>
                            <span className="font-medium text-sm">
                              Psychological Assessments
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          {company.moduleDetails?.psychologicalAssessments && (
                            <div className="grid grid-cols-2 gap-2 pl-8">
                              {Object.entries(
                                company.moduleDetails.psychologicalAssessments
                              )
                                .filter(
                                  ([key, value]) => key !== "enabled" && value
                                )
                                .map(([key]) => (
                                  <div
                                    key={key}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    {key
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) =>
                                        str.toUpperCase()
                                      )}
                                  </div>
                                ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* External/Physical Assessment Accordion */}
                    {company.modules.externalAssessments && (
                      <AccordionItem
                        value="physical-external"
                        className="border-b"
                      >
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex items-center">
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-1 rounded-md mr-2 flex items-center justify-center">
                              <Dumbbell className="w-[18px] h-[18px] text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="font-medium text-sm">
                              Physical & External Assessments
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          {company.moduleDetails?.externalAssessments && (
                            <div className="grid grid-cols-2 gap-2 pl-8">
                              {Object.entries(
                                company.moduleDetails.externalAssessments
                              )
                                .filter(
                                  ([key, value]) => key !== "enabled" && value
                                )
                                .map(([key]) => (
                                  <div
                                    key={key}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                    {key
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) =>
                                        str.toUpperCase()
                                      )}
                                  </div>
                                ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Training Modules Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    Training Modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {company.moduleDetails?.training?.enabled ? (
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem
                        value="training-components"
                        className="border-b"
                      >
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex items-center">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-1 rounded-md mr-2">
                              <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium text-sm">
                              Training Components
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <div className="grid grid-cols-2 gap-2 pl-8">
                            {Object.entries(company.moduleDetails.training)
                              .filter(
                                ([key, value]) => key !== "enabled" && value
                              )
                              .map(([key]) => (
                                <div
                                  key={key}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </div>
                              ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <div className="py-2 text-sm text-muted-foreground">
                      No training modules enabled for this company
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Integration Modules Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    Integration Modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    {/* Third Party Integration Accordion */}
                    {company.moduleDetails?.thirdPartyIntegration?.enabled && (
                      <AccordionItem value="third-party" className="border-b">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex items-center">
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-1 rounded-md mr-2">
                              <Link className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="font-medium text-sm">
                              Third Party Integration
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <div className="grid grid-cols-2 gap-2 pl-8">
                            {Object.entries(
                              company.moduleDetails.thirdPartyIntegration
                            )
                              .filter(
                                ([key, value]) => key !== "enabled" && value
                              )
                              .map(([key]) => (
                                <div
                                  key={key}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </div>
                              ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* External Integration Accordion */}
                    {company.modules.externalIntegration && (
                      <AccordionItem
                        value="external-integration"
                        className="border-b"
                      >
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex items-center">
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-1 rounded-md mr-2">
                              <Zap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="font-medium text-sm">
                              External Integration
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <div className="pl-8 text-sm text-muted-foreground">
                            Allows integration with external systems and data
                            sources
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Reporting Modules Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    Reporting Modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    {/* Report Types Accordion */}
                    {company.moduleDetails?.reports?.enabled && (
                      <AccordionItem value="report-types" className="border-b">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex items-center">
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-1 rounded-md mr-2">
                              <BarChart3 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="font-medium text-sm">
                              Report Types
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <div className="grid grid-cols-2 gap-2 pl-8">
                            {Object.entries(company.moduleDetails.reports)
                              .filter(
                                ([key, value]) => key !== "enabled" && value
                              )
                              .map(([key]) => (
                                <div
                                  key={key}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </div>
                              ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* General Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            {/* Notification Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Email and notification configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.notificationSettings ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm">
                        Email Registration
                      </h4>
                      <Badge variant="outline" className="mt-2">
                        {company.notificationSettings.userRegistration ===
                        "email"
                          ? "Welcome Email"
                          : "Self Registration"}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm">
                        Report Availability
                      </h4>
                      <Badge
                        variant={
                          company.notificationSettings.reportAvailability
                            ? "default"
                            : "outline"
                        }
                        className="mt-2"
                      >
                        {company.notificationSettings.reportAvailability
                          ? "Enabled"
                          : "Disabled"}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm">Email Sender Name</h4>
                      <p className="text-sm mt-2">
                        {company.notificationSettings.emailSenderName ||
                          company.name}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm">Support Email</h4>
                      <p className="text-sm mt-2">
                        {company.notificationSettings.companySupportEmail ||
                          company.contactEmail}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <h4 className="font-medium text-sm">
                        Welcome Email Text
                      </h4>
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        {company.notificationSettings.welcomeEmailText ||
                          "Welcome to our platform!"}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <h4 className="font-medium text-sm">
                        Report Availability Text
                      </h4>
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        {company.notificationSettings.reportAvailabilityText ||
                          "Your report is now available."}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No notification settings configured.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Data Retention Policy Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Data Retention Policy
                </CardTitle>
                <CardDescription>
                  How long data is kept and managed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {company.dataRetentionPolicy ? (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="font-medium text-sm">Retention Period</h4>
                      <Badge className="mt-2">
                        {company.dataRetentionPolicy.retentionPeriod} months
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No data retention policy configured.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => onEdit(company.id)}>Edit Company</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
