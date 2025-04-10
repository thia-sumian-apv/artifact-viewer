import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { addMonths } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SubscriptionDetailsStep from "./steps/SubscriptionDetailsStep";
import RoleCustomizationStep from "./steps/RoleCustomizationStep";
import ModuleConfigurationStep, {
  type ModuleConfigType,
} from "./steps/ModuleConfigurationStep";
import { Progress } from "@/components/ui/progress";
import GeneralInformationStep from "./steps/GeneralInformationStep";
import GeneralSettingsStep from "./steps/GeneralSettingsStep";

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type GeneralInfoType = {
  name: string; // Company Name (required)
  shortName: string; // Company Short Name/Abbreviation
  status: "active" | "inactive"; // Company Status (required)
  contactName: string; // Contact Name (required)
  contactEmail: string; // Contact Email (required)
  contactNumber: string; // Contact Number
  address: string; // Company Address
};

type SubscriptionDetailsType = {
  subscriptionDuration: number; // in months (required)
  subscriptionStart: Date; // Subscription Start Date (required)
  subscriptionEnd: Date; // Auto-calculated
  maxLicenses: number; // Maximum User Licenses (required)
  usedLicenses: number; // Current usage (display only)
  unusedLicenses: number; // Auto-calculated (display only)
  renewalReminder: number; // Days before expiry
  includeTrial: boolean; // Option for free trial period
  trialDays: number; // Number of days for trial
};

type RoleLabelsType = {
  superAdmin: string; // Hidden from UI
  companyAdmin: string;
  courseCommander: string;
  courseTrainer: string;
  trainee: string;
};

type GeneralSettingsType = {
  notifications: {
    userRegistration: "email" | "self"; // Welcome email or self-registration
    reportAvailability: boolean;
    emailSenderName: string;
    welcomeEmailText: string;
    reportAvailabilityText: string;
  };
  dataRetention: {
    retentionPeriod: number; // in months
  };
};

type FormData = {
  generalInfo: GeneralInfoType;
  subscriptionDetails: SubscriptionDetailsType;
  roleLabels: RoleLabelsType;
  moduleConfig: ModuleConfigType;
  generalSettings: GeneralSettingsType;
};

export function AddCompanyDialog({
  open,
  onOpenChange,
}: AddCompanyDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    generalInfo: {
      name: "",
      shortName: "",
      status: "active",
      contactName: "",
      contactEmail: "",
      contactNumber: "",
      address: "",
    },
    subscriptionDetails: {
      subscriptionDuration: 12,
      subscriptionStart: new Date(),
      subscriptionEnd: addMonths(new Date(), 12),
      maxLicenses: 50,
      usedLicenses: 0,
      unusedLicenses: 50,
      renewalReminder: 30,
      includeTrial: false,
      trialDays: 14,
    },
    roleLabels: {
      superAdmin: "Super Admin",
      companyAdmin: "Company Admin",
      courseCommander: "Course Commander",
      courseTrainer: "Course Trainer",
      trainee: "Trainee",
    },
    moduleConfig: {
      cognitiveAssessments: {
        enabled: true,
        sart: true,
        visualRxn: true,
        spatialPlanning: true,
      },
      psychologicalAssessments: {
        enabled: true,
        selfDetermination: true,
        ml360Self: true,
        ml360Buddy: true,
        ml360Trainer: true,
        teamResilience: true,
      },
      externalAssessments: {
        enabled: true,
        cardioRespiratory: true,
        strengthAssessment: true,
        ippt: true,
        soc: true,
        roadMarch20km: true,
      },
      physicalAssessments: true,
      individualReporting: true,
      externalIntegration: true,
      training: {
        enabled: true,
        trainingA: true,
        trainingB: true,
      },
      thirdPartyIntegration: {
        enabled: true,
        polarWatch: true,
        vald: true,
      },
      reports: {
        enabled: true,
        teamResilienceReport: true,
        traineeReport: true,
      },
    },
    generalSettings: {
      notifications: {
        userRegistration: "email",
        reportAvailability: true,
        emailSenderName: "",
        welcomeEmailText:
          "Welcome to our platform! Please set up your account.",
        reportAvailabilityText: "Your report is now available to view.",
      },
      dataRetention: {
        retentionPeriod: 12,
      },
    },
  });

  const form = useForm<FormData>({
    defaultValues: formData,
  });

  // Update steps to match the new sections A-E
  const steps = [
    "General Information",
    "Subscription Details",
    "Role & Hierarchy Configuration",
    "Module Configuration",
    "General Settings",
  ];

  const handleComplete = async () => {
    // In a real app, this would submit to an API
    console.log("Submitting company:", formData);
    toast.success("Company created successfully!");
    onOpenChange(false);
    // Reset form state
    setCurrentStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full h-[550px] flex flex-col bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
        <DialogHeader>
          <div className="flex flex-col space-y-4">
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Create Company Details
            </DialogTitle>

            <div className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {steps[currentStep]}
                </span>
              </div>

              <Progress
                value={((currentStep + 1) / steps.length) * 100}
                className="h-1.5 w-full"
              />
            </div>
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <div className="mt-4 flex-1 overflow-y-auto">
            {currentStep === 0 && (
              <GeneralInformationStep
                data={formData.generalInfo}
                onUpdate={(generalInfo) =>
                  setFormData({ ...formData, generalInfo })
                }
                onNext={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 1 && (
              <SubscriptionDetailsStep
                data={formData.subscriptionDetails}
                onUpdate={(subscriptionDetails) =>
                  setFormData({ ...formData, subscriptionDetails })
                }
                onNext={() => setCurrentStep(2)}
                onBack={() => setCurrentStep(0)}
              />
            )}
            {currentStep === 2 && (
              <RoleCustomizationStep
                data={formData.roleLabels}
                onUpdate={(roleLabels) =>
                  setFormData({ ...formData, roleLabels })
                }
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}
            {currentStep === 3 && (
              <ModuleConfigurationStep
                data={formData.moduleConfig}
                onUpdate={(moduleConfig) =>
                  setFormData({ ...formData, moduleConfig })
                }
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 4 && (
              <GeneralSettingsStep
                data={formData.generalSettings}
                onUpdate={(generalSettings) =>
                  setFormData({ ...formData, generalSettings })
                }
                onBack={() => setCurrentStep(3)}
                onNext={handleComplete}
              />
            )}
          </div>
        </FormProvider>
        <div className="mt-6 flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <div>
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
          </div>

          <div>
            {currentStep < steps.length - 1 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete}>Create Company</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
