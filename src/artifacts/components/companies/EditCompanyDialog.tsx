import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import GeneralInformationStep from "./steps/GeneralInformationStep";
import SubscriptionDetailsStep from "./steps/SubscriptionDetailsStep";
import RoleCustomizationStep from "./steps/RoleCustomizationStep";
import ModuleConfigurationStep, {
	type ModuleConfigType,
} from "./steps/ModuleConfigurationStep";
import GeneralSettingsStep from "./steps/GeneralSettingsStep";
import type { Company } from "@/artifacts/types/company";

interface EditCompanyDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	company: Company;
	onSave: (updatedCompany: Company) => void;
}

// New type definitions based on AddCompanyDialog
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

export function EditCompanyDialog({
	open,
	onOpenChange,
	company,
	onSave,
}: EditCompanyDialogProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<FormData>({
		generalInfo: {
			name: company.name,
			shortName: company.shortName,
			status: company.status as "active" | "inactive",
			contactName: company.contactName,
			contactEmail: company.contactEmail,
			contactNumber: company.contactNumber,
			address: company.address,
		},
		subscriptionDetails: {
			subscriptionDuration: company.subscriptionDuration || 12,
			subscriptionStart: company.subscriptionStart,
			subscriptionEnd: company.subscriptionEnd,
			maxLicenses: company.maxLicenses,
			usedLicenses: company.usedLicenses,
			unusedLicenses: company.maxLicenses - company.usedLicenses,
			renewalReminder: company.renewalReminder || 30,
			includeTrial: false,
			trialDays: 14,
		},
		roleLabels: company.roleLabels || {
			superAdmin: "Super Admin",
			companyAdmin: "Company Admin",
			courseCommander: "Course Commander",
			courseTrainer: "Course Trainer",
			trainee: "Trainee",
		},
		moduleConfig: {
			cognitiveAssessments: {
				enabled: !!company.modules?.cognitiveAssessments,
				sart: true,
				visualRxn: true,
				spatialPlanning: true,
			},
			psychologicalAssessments: {
				enabled: !!company.modules?.psychologicalAssessments,
				selfDetermination: true,
				ml360Self: true,
				ml360Buddy: true,
				ml360Trainer: true,
				teamResilience: !!company.modules?.teamResilience,
			},
			externalAssessments: {
				enabled: !!company.modules?.externalAssessments,
				cardioRespiratory: true,
				strengthAssessment: true,
				ippt: true,
				soc: true,
				roadMarch20km: true,
			},
			physicalAssessments: !!company.modules?.physicalAssessments,
			individualReporting: !!company.modules?.individualReporting,
			externalIntegration: !!company.modules?.externalIntegration,
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
				emailSenderName: company.name,
				welcomeEmailText: `Welcome to ${company.name}! Please set up your account.`,
				reportAvailabilityText: "Your report is now available to view.",
			},
			dataRetention: {
				retentionPeriod: 12,
			},
		},
	});

	// Set up form context
	const form = useForm<FormData>({
		defaultValues: formData,
	});

	// Update form when company or formData changes
	useEffect(() => {
		form.reset(formData);
	}, [formData, form]);

	// Update steps to match the new sections as in AddCompanyDialog
	const steps = [
		"General Information",
		"Subscription Details",
		"Role & Hierarchy Configuration",
		"Module Configuration",
		"General Settings",
	];

	const handleComplete = async () => {
		// Create updated company object
		const updatedCompany: Company = {
			...company,
			name: formData.generalInfo.name,
			shortName: formData.generalInfo.shortName,
			status: formData.generalInfo.status,
			contactName: formData.generalInfo.contactName,
			contactEmail: formData.generalInfo.contactEmail,
			contactNumber: formData.generalInfo.contactNumber,
			address: formData.generalInfo.address,
			subscriptionDuration: formData.subscriptionDetails.subscriptionDuration,
			subscriptionStart: formData.subscriptionDetails.subscriptionStart,
			subscriptionEnd: formData.subscriptionDetails.subscriptionEnd,
			maxLicenses: formData.subscriptionDetails.maxLicenses,
			usedLicenses: formData.subscriptionDetails.usedLicenses,
			renewalReminder: formData.subscriptionDetails.renewalReminder,
			roleLabels: formData.roleLabels,
			modules: {
				cognitiveAssessments:
					formData.moduleConfig.cognitiveAssessments.enabled,
				psychologicalAssessments:
					formData.moduleConfig.psychologicalAssessments.enabled,
				externalAssessments: formData.moduleConfig.externalAssessments.enabled,
				physicalAssessments: formData.moduleConfig.physicalAssessments,
				individualReporting: formData.moduleConfig.individualReporting,
				externalIntegration: formData.moduleConfig.externalIntegration,
				teamResilience:
					formData.moduleConfig.psychologicalAssessments.teamResilience,
			},
		};

		onSave(updatedCompany);
		toast.success("Company updated successfully!");
		onOpenChange(false);
		setCurrentStep(0);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl w-full h-[550px] flex flex-col">
				<DialogHeader>
					<div className="flex flex-col space-y-4">
						<DialogTitle>Edit Company: {company.name}</DialogTitle>

						<div className="flex flex-col">
							<div className="flex justify-between mb-1">
								<span className="text-sm font-medium">
									Step {currentStep + 1} of {steps.length}
								</span>
								<span className="text-sm ">{steps[currentStep]}</span>
							</div>

							<Progress
								value={((currentStep + 1) / steps.length) * 100}
								className="h-1.5 w-full"
							/>
						</div>
					</div>
				</DialogHeader>

				{/* Wrap all content with FormProvider */}
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

				<div className="mt-6 flex justify-between border-t pt-4">
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
							<Button onClick={handleComplete}>Save Changes</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
