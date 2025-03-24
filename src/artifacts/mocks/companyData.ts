import { addMonths } from "date-fns";

export interface Company {
	id: string;
	name: string;
	shortName: string;
	registrationNumber: string;
	logo?: string;
	status: "active" | "inactive";

	// Contact info
	contactName: string;
	contactEmail: string;
	contactNumber: string;
	address: string;

	// Subscription details
	subscriptionDuration: number; // in months
	subscriptionStart: Date;
	subscriptionEnd: Date;
	maxLicenses: number;
	usedLicenses: number;
	renewalReminder: number; // days

	// Role customization
	roleLabels: {
		superAdmin: string;
		companyAdmin: string;
		courseCommander: string;
		courseTrainer: string;
		trainee: string;
	};

	// Module configuration
	modules: {
		cognitiveAssessments: boolean;
		psychologicalAssessments: boolean;
		externalAssessments: boolean;
		physicalAssessments: boolean;
		teamResilience: boolean;
		individualReporting: boolean;
		externalIntegration: boolean;
	};

	// Notification settings
	notificationSettings?: {
		welcomeEmail: boolean;
		reportAvailabilityNotification: boolean;
		emailSenderName: string;
		emailFooterText: string;
		companySupportEmail: string;
	};

	// Data retention policy
	dataRetentionPolicy?: {
		retentionPeriod: number; // in months
		archivePolicy: string; // archive, delete, anonymize
		dataExportSettings: string; // none, monthly, quarterly, yearly
	};

	// Branding settings
	brandingSettings?: {
		primaryColor: string;
		secondaryColor: string;
		customCSS: string;
		customWelcomeMessage: string;
		dashboardWelcomeText: string;
	};
}

export const mockCompanyData: Company[] = [
	{
		id: "comp-001",
		name: "NeuroTech Solutions Pte Ltd",
		shortName: "NTS",
		registrationNumber: "202012345A",
		logo: "/logos/neurotech.png",
		status: "active",
		contactName: "John Smith",
		contactEmail: "john.smith@neurotech.com",
		contactNumber: "+65 9123 4567",
		address: "123 Innovation Drive, #08-01, Singapore 138622",
		subscriptionDuration: 12,
		subscriptionStart: new Date(2023, 1, 1),
		subscriptionEnd: addMonths(new Date(2023, 1, 1), 12),
		maxLicenses: 50,
		usedLicenses: 42,
		renewalReminder: 30,
		roleLabels: {
			superAdmin: "Super Admin",
			companyAdmin: "Company Admin",
			courseCommander: "Program Director",
			courseTrainer: "Instructor",
			trainee: "Participant",
		},
		modules: {
			cognitiveAssessments: true,
			psychologicalAssessments: true,
			externalAssessments: false,
			physicalAssessments: false,
			teamResilience: true,
			individualReporting: true,
			externalIntegration: false,
		},
	},
	{
		id: "comp-002",
		name: "Cognitive Edge Solutions",
		shortName: "CES",
		registrationNumber: "202154321B",
		logo: "/logos/cognitive.png",
		status: "active",
		contactName: "Sarah Johnson",
		contactEmail: "sarah@cognitive-edge.com",
		contactNumber: "+65 8765 4321",
		address: "456 Brain Street, #12-34, Singapore 159876",
		subscriptionDuration: 24,
		subscriptionStart: new Date(2022, 6, 15),
		subscriptionEnd: addMonths(new Date(2022, 6, 15), 24),
		maxLicenses: 100,
		usedLicenses: 87,
		renewalReminder: 45,
		roleLabels: {
			superAdmin: "System Administrator",
			companyAdmin: "Organization Admin",
			courseCommander: "Program Manager",
			courseTrainer: "Facilitator",
			trainee: "Learner",
		},
		modules: {
			cognitiveAssessments: true,
			psychologicalAssessments: true,
			externalAssessments: true,
			physicalAssessments: true,
			teamResilience: true,
			individualReporting: true,
			externalIntegration: true,
		},
	},
	{
		id: "comp-003",
		name: "MindFit Training Academy",
		shortName: "MFTA",
		registrationNumber: "202198765C",
		logo: "/logos/mindfit.png",
		status: "inactive",
		contactName: "Michael Lee",
		contactEmail: "michael@mindfit.edu",
		contactNumber: "+65 9876 5432",
		address: "789 Cognitive Lane, #04-05, Singapore 247981",
		subscriptionDuration: 6,
		subscriptionStart: new Date(2023, 3, 10),
		subscriptionEnd: addMonths(new Date(2023, 3, 10), 6),
		maxLicenses: 25,
		usedLicenses: 25,
		renewalReminder: 14,
		roleLabels: {
			superAdmin: "Admin",
			companyAdmin: "Organization Manager",
			courseCommander: "Course Director",
			courseTrainer: "Trainer",
			trainee: "Student",
		},
		modules: {
			cognitiveAssessments: true,
			psychologicalAssessments: true,
			externalAssessments: false,
			physicalAssessments: true,
			teamResilience: false,
			individualReporting: true,
			externalIntegration: false,
		},
	},
];
