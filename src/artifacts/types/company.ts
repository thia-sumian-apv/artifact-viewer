export interface Company {
	id: string;

	// General Information
	name: string;
	shortName: string;
	registrationNumber: string;
	logo?: string;
	status: "active" | "inactive";
	contactName: string;
	contactEmail: string;
	contactNumber: string;
	address: string;

	// Subscription Details
	subscriptionDuration: number;
	subscriptionStart: Date;
	subscriptionEnd: Date;
	maxLicenses: number;
	usedLicenses: number;
	renewalReminder: number;

	// Role Labels
	roleLabels: {
		superAdmin: string;
		companyAdmin: string;
		courseCommander: string;
		courseTrainer: string;
		trainee: string;
	};

	// Module Configuration
	modules: {
		cognitiveAssessments: boolean;
		psychologicalAssessments: boolean;
		externalAssessments: boolean;
		physicalAssessments: boolean;
		teamResilience: boolean;
		individualReporting: boolean;
		externalIntegration: boolean;
	};

	// General Settings
	notificationSettings?: {
		userRegistration: "email" | "self";
		reportAvailability: boolean;
		emailSenderName: string;
		welcomeEmailText: string;
		reportAvailabilityText: string;
		companySupportEmail?: string;
	};

	dataRetentionPolicy?: {
		retentionPeriod: number;
	};

	// Additional optional fields for enhanced modules
	moduleDetails?: {
		cognitiveAssessments?: {
			sart: boolean;
			visualRxn: boolean;
			spatialPlanning: boolean;
		};
		psychologicalAssessments?: {
			selfDetermination: boolean;
			ml360Self: boolean;
			ml360Buddy: boolean;
			ml360Trainer: boolean;
			teamResilience: boolean;
		};
		externalAssessments?: {
			cardioRespiratory: boolean;
			strengthAssessment: boolean;
			ippt: boolean;
			soc: boolean;
			roadMarch20km: boolean;
		};
		training?: {
			enabled: boolean;
			trainingA: boolean;
			trainingB: boolean;
		};
		thirdPartyIntegration?: {
			enabled: boolean;
			polarWatch: boolean;
			vald: boolean;
		};
		reports?: {
			enabled: boolean;
			teamResilienceReport: boolean;
			traineeReport: boolean;
		};
	};

	// Optional trial information
	trialSettings?: {
		includeTrial: boolean;
		trialDays: number;
	};

	// Branding settings (keep for backward compatibility)
	brandingSettings?: {
		primaryColor: string;
		secondaryColor: string;
		customCSS: string;
		customWelcomeMessage: string;
		dashboardWelcomeText: string;
	};
}
