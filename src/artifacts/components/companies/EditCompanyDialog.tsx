import { useState, useEffect } from "react";
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
import type { Company } from "../../mocks/companyData";
import ModuleConfigurationStep, {
	type ModuleConfig,
} from "./steps/ModuleConfigurationStep";
import BrandingSettingsStep, {
	type BrandingSettings,
} from "./steps/BrandingSettingsStep";
import NotificationSettingsStep, {
	type NotificationSettings,
} from "./steps/NotificationSettingsStep";
import DataRetentionPolicyStep, {
	type DataRetentionPolicy,
} from "./steps/DataRetentionPolicyStep";
import { Progress } from "@/components/ui/progress";

interface EditCompanyDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	company: Company;
	onSave: (updatedCompany: Company) => void;
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

export function EditCompanyDialog({
	open,
	onOpenChange,
	company,
	onSave,
}: EditCompanyDialogProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<FormData>({
		basicInfo: {
			name: company.name,
			shortName: company.shortName,
			registrationNumber: company.registrationNumber,
			logo: null, // Can't populate File object from string URL
			status: company.status,
		},
		contactInfo: {
			contactName: company.contactName,
			contactEmail: company.contactEmail,
			contactNumber: company.contactNumber,
			address: company.address,
		},
		subscriptionDetails: {
			subscriptionDuration: company.subscriptionDuration,
			subscriptionStart: company.subscriptionStart,
			subscriptionEnd: company.subscriptionEnd,
			maxLicenses: company.maxLicenses,
			usedLicenses: company.usedLicenses,
			renewalReminder: company.renewalReminder,
		},
		roleLabels: company.roleLabels,
		moduleConfig: company.modules,
		notificationSettings: company.notificationSettings || {
			welcomeEmail: true,
			reportAvailabilityNotification: true,
			emailSenderName: company.name || "",
			emailFooterText: "",
			companySupportEmail: company.contactEmail || "",
		},
		dataRetentionPolicy: company.dataRetentionPolicy || {
			retentionPeriod: 12, // in months
			archivePolicy: "archive", // archive, delete, anonymize
			dataExportSettings: "none", // none, monthly, quarterly, yearly
		},
		brandingSettings: company.brandingSettings || {
			primaryColor: "#4f46e5", // default indigo color
			secondaryColor: "#10b981", // default emerald color
			customCSS: "",
			customWelcomeMessage: `Welcome to ${company.name}`,
			dashboardWelcomeText: `Welcome to your ${company.name} dashboard`,
		},
	});

	// Re-initialize form data when company changes
	useEffect(() => {
		setFormData({
			basicInfo: {
				name: company.name,
				shortName: company.shortName,
				registrationNumber: company.registrationNumber,
				logo: null,
				status: company.status,
			},
			contactInfo: {
				contactName: company.contactName,
				contactEmail: company.contactEmail,
				contactNumber: company.contactNumber,
				address: company.address,
			},
			subscriptionDetails: {
				subscriptionDuration: company.subscriptionDuration,
				subscriptionStart: company.subscriptionStart,
				subscriptionEnd: company.subscriptionEnd,
				maxLicenses: company.maxLicenses,
				usedLicenses: company.usedLicenses,
				renewalReminder: company.renewalReminder,
			},
			roleLabels: company.roleLabels,
			moduleConfig: company.modules,
			notificationSettings: company.notificationSettings || {
				welcomeEmail: true,
				reportAvailabilityNotification: true,
				emailSenderName: company.name || "",
				emailFooterText: "",
				companySupportEmail: company.contactEmail || "",
			},
			dataRetentionPolicy: company.dataRetentionPolicy || {
				retentionPeriod: 12, // in months
				archivePolicy: "archive", // archive, delete, anonymize
				dataExportSettings: "none", // none, monthly, quarterly, yearly
			},
			brandingSettings: company.brandingSettings || {
				primaryColor: "#4f46e5", // default indigo color
				secondaryColor: "#10b981", // default emerald color
				customCSS: "",
				customWelcomeMessage: `Welcome to ${company.name}`,
				dashboardWelcomeText: `Welcome to your ${company.name} dashboard`,
			},
		});
	}, [company]);

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
		// Create updated company object
		const updatedCompany: Company = {
			...company,
			name: formData.basicInfo.name,
			shortName: formData.basicInfo.shortName,
			registrationNumber: formData.basicInfo.registrationNumber,
			status: formData.basicInfo.status,
			contactName: formData.contactInfo.contactName,
			contactEmail: formData.contactInfo.contactEmail,
			contactNumber: formData.contactInfo.contactNumber,
			address: formData.contactInfo.address,
			subscriptionDuration: formData.subscriptionDetails.subscriptionDuration,
			subscriptionStart: formData.subscriptionDetails.subscriptionStart,
			subscriptionEnd: formData.subscriptionDetails.subscriptionEnd,
			maxLicenses: formData.subscriptionDetails.maxLicenses,
			usedLicenses: formData.subscriptionDetails.usedLicenses,
			renewalReminder: formData.subscriptionDetails.renewalReminder,
			roleLabels: formData.roleLabels,
			modules: formData.moduleConfig,
		};

		// If a new logo was uploaded
		if (formData.basicInfo.logo) {
			// In a real app, you'd upload the file and get a URL back
			console.log("Would upload new logo:", formData.basicInfo.logo);
			// updatedCompany.logo = newLogoUrl;
		}

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

						<div className="flex flex-wrap gap-1 mt-2">
							{steps.map((step, index) => (
								<Button
									key={step}
									onClick={() => setCurrentStep(index)}
									variant={currentStep === index ? "secondary" : "ghost"}
									size="sm"
									className="text-xs h-7 w-7 p-0"
								>
									{index + 1}
								</Button>
							))}
						</div>
					</div>
				</DialogHeader>

				<div className="mt-2 flex-1 overflow-y-auto">
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
							onBack={() => setCurrentStep(0)}
							onNext={() => setCurrentStep(2)}
						/>
					)}
					{currentStep === 2 && (
						<SubscriptionDetailsStep
							data={formData.subscriptionDetails}
							onUpdate={(subscriptionDetails) =>
								setFormData({ ...formData, subscriptionDetails })
							}
							onBack={() => setCurrentStep(1)}
							onNext={() => setCurrentStep(3)}
						/>
					)}
					{currentStep === 3 && (
						<RoleCustomizationStep
							data={formData.roleLabels}
							onUpdate={(roleLabels) =>
								setFormData({ ...formData, roleLabels })
							}
							onBack={() => setCurrentStep(2)}
							onNext={() => setCurrentStep(4)}
						/>
					)}
					{currentStep === 4 && (
						<ModuleConfigurationStep
							data={formData.moduleConfig}
							onUpdate={(moduleConfig) =>
								setFormData({ ...formData, moduleConfig })
							}
							onBack={() => setCurrentStep(3)}
							onNext={() => setCurrentStep(5)}
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
							<Button
								onClick={() => setCurrentStep(currentStep + 1)}
								disabled={
									(currentStep === 0 && !formData.basicInfo.name) ||
									(currentStep === 1 && !formData.contactInfo.contactName)
								}
							>
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
