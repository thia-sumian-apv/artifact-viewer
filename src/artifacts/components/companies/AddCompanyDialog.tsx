import { useState } from "react";
import { addMonths } from "date-fns";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BasicCompanyInfoStep from "./steps/BasicCompanyInfoStep";
import ContactInfoStep from "./steps/ContactInfoStep";
import SubscriptionDetailsStep from "./steps/SubscriptionDetailsStep";
import RoleCustomizationStep from "./steps/RoleCustomizationStep";
import ModuleConfigurationStep, {
	type ModuleConfig,
} from "./steps/ModuleConfigurationStep";
import BrandingSettingsStep, {
	type BrandingSettings,
} from "./steps/BrandingSettingsStep";
import DataRetentionPolicyStep, {
	type DataRetentionPolicy,
} from "./steps/DataRetentionPolicyStep";
import NotificationSettingsStep, {
	type NotificationSettings,
} from "./steps/NotificationSettingsStep";
import { Progress } from "@/components/ui/progress";

interface AddCompanyDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

type BasicInfoType = {
	name: string;
	shortName: string;
	registrationNumber: string;
	logo: File | null;
	status: "active" | "inactive";
};

type ContactInfoType = {
	contactName: string;
	contactEmail: string;
	contactNumber: string;
	address: string;
};

type SubscriptionDetailsType = {
	subscriptionDuration: number;
	subscriptionStart: Date;
	subscriptionEnd: Date;
	maxLicenses: number;
	usedLicenses: number;
	renewalReminder: number;
};

type RoleLabelsType = {
	superAdmin: string;
	companyAdmin: string;
	courseCommander: string;
	courseTrainer: string;
	trainee: string;
};

type FormData = {
	basicInfo: BasicInfoType;
	contactInfo: ContactInfoType;
	subscriptionDetails: SubscriptionDetailsType;
	roleLabels: RoleLabelsType;
	moduleConfig: ModuleConfig;
	notificationSettings: NotificationSettings;
	dataRetentionPolicy: DataRetentionPolicy;
	brandingSettings: BrandingSettings;
};

export function AddCompanyDialog({
	open,
	onOpenChange,
}: AddCompanyDialogProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<FormData>({
		basicInfo: {
			name: "",
			shortName: "",
			registrationNumber: "",
			logo: null,
			status: "active",
		},
		contactInfo: {
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
			renewalReminder: 30,
		},
		roleLabels: {
			superAdmin: "Super Admin",
			companyAdmin: "Company Admin",
			courseCommander: "Course Commander",
			courseTrainer: "Course Trainer",
			trainee: "Trainee",
		},
		moduleConfig: {
			cognitiveAssessments: true,
			psychologicalAssessments: true,
			externalAssessments: false,
			physicalAssessments: false,
			teamResilience: false,
			individualReporting: true,
			externalIntegration: false,
		},
		notificationSettings: {
			welcomeEmail: true,
			reportAvailabilityNotification: true,
			emailSenderName: "",
			emailFooterText: "",
			companySupportEmail: "",
		},
		dataRetentionPolicy: {
			retentionPeriod: 12, // in months
			archivePolicy: "archive", // archive, delete, anonymize
			dataExportSettings: "none", // none, monthly, quarterly, yearly
		},
		brandingSettings: {
			primaryColor: "#4f46e5", // default indigo color
			secondaryColor: "#10b981", // default emerald color
			customCSS: "",
			customWelcomeMessage: "Welcome to our platform",
			dashboardWelcomeText: "Welcome to your dashboard",
		},
	});

	const steps = [
		"Basic Information",
		"Contact Information",
		"Subscription Details",
		"Role Customization",
		"Module Configuration",
		"Notification Settings",
		"Data Retention Policy",
		"Branding Settings",
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
			<DialogContent className="max-w-3xl w-full h-[550px] flex flex-col">
				<DialogHeader>
					<div className="flex flex-col space-y-4">
						<DialogTitle>Add New Company</DialogTitle>

						<div className="flex flex-col">
							<div className="flex justify-between mb-1">
								<span className="text-sm font-medium">
									Step {currentStep + 1} of {steps.length}
								</span>
								<span className="text-sm text-muted-foreground">
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

				<div className="mt-4 flex-1 overflow-y-auto">
					{currentStep === 0 && (
						<BasicCompanyInfoStep
							data={formData.basicInfo}
							onUpdate={(basicInfo) => setFormData({ ...formData, basicInfo })}
							onNext={() => setCurrentStep(1)}
						/>
					)}
					{currentStep === 1 && (
						<ContactInfoStep
							data={formData.contactInfo}
							onUpdate={(contactInfo) =>
								setFormData({ ...formData, contactInfo })
							}
							onNext={() => setCurrentStep(2)}
							onBack={() => setCurrentStep(0)}
						/>
					)}
					{currentStep === 2 && (
						<SubscriptionDetailsStep
							data={formData.subscriptionDetails}
							onUpdate={(subscriptionDetails) =>
								setFormData({ ...formData, subscriptionDetails })
							}
							onNext={() => setCurrentStep(3)}
							onBack={() => setCurrentStep(1)}
						/>
					)}
					{currentStep === 3 && (
						<RoleCustomizationStep
							data={formData.roleLabels}
							onUpdate={(roleLabels) =>
								setFormData({ ...formData, roleLabels })
							}
							onBack={() => setCurrentStep(2)}
							onNext={handleComplete}
						/>
					)}
					{currentStep === 4 && (
						<ModuleConfigurationStep
							data={formData.moduleConfig}
							onUpdate={(moduleConfig) =>
								setFormData({ ...formData, moduleConfig })
							}
							onNext={() => handleComplete()} // Complete on next since this is last step
							onBack={() => setCurrentStep(3)}
						/>
					)}
					{currentStep === 5 && (
						<NotificationSettingsStep
							data={formData.notificationSettings}
							onUpdate={(notificationSettings) =>
								setFormData({ ...formData, notificationSettings })
							}
							onBack={() => setCurrentStep(4)}
							onNext={() => setCurrentStep(6)}
						/>
					)}
					{currentStep === 6 && (
						<DataRetentionPolicyStep
							data={formData.dataRetentionPolicy}
							onUpdate={(dataRetentionPolicy) =>
								setFormData({ ...formData, dataRetentionPolicy })
							}
							onBack={() => setCurrentStep(5)}
							onNext={() => setCurrentStep(7)}
						/>
					)}
					{currentStep === 7 && (
						<BrandingSettingsStep
							data={formData.brandingSettings}
							onUpdate={(brandingSettings) =>
								setFormData({ ...formData, brandingSettings })
							}
							onBack={() => setCurrentStep(6)}
							onNext={handleComplete}
						/>
					)}
				</div>

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
							<Button onClick={handleComplete}>Create Company</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
