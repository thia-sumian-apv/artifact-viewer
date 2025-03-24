import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Brain, Activity, Dumbbell, Users, User, Zap } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";

export interface ModuleConfig {
	cognitiveAssessments: boolean;
	psychologicalAssessments: boolean;
	externalAssessments: boolean;
	physicalAssessments: boolean;
	teamResilience: boolean;
	individualReporting: boolean;
	externalIntegration: boolean;
}

interface ModuleConfigurationStepProps {
	data: ModuleConfig;
	onUpdate: (data: ModuleConfig) => void;
	onNext: () => void;
	onBack: () => void;
}

export default function ModuleConfigurationStep({
	data,
	onUpdate,
}: ModuleConfigurationStepProps) {
	const modules = [
		{
			id: "cognitiveAssessments",
			title: "Cognitive Assessments",
			description: "SART, Visual RXN, Spatial Planning",
			icon: <Brain className="h-5 w-5" />,
		},
		{
			id: "psychologicalAssessments",
			title: "Psychological Assessments",
			description: "ML360, Team Resilience",
			icon: <Activity className="h-5 w-5" />,
		},
		{
			id: "externalAssessments",
			title: "External Assessments",
			description: "Cardio Respiratory, Strength Assessment",
			icon: <Dumbbell className="h-5 w-5" />,
		},
		{
			id: "physicalAssessments",
			title: "Physical Assessments",
			description: "IPPT, SOC, 20km Road March",
			icon: <Dumbbell className="h-5 w-5" />,
		},
		{
			id: "teamResilience",
			title: "Team Resilience Reporting",
			description: "Team-based analysis and reporting tools",
			icon: <Users className="h-5 w-5" />,
		},
		{
			id: "individualReporting",
			title: "Individual Reporting",
			description: "Personal performance metrics and insights",
			icon: <User className="h-5 w-5" />,
		},
		{
			id: "externalIntegration",
			title: "External Integration",
			description: "Polar Watches, VALD equipment, smart rings",
			icon: <Zap className="h-5 w-5" />,
		},
	];

	const handleToggle = (moduleId: keyof ModuleConfig) => {
		onUpdate({
			...data,
			[moduleId]: !data[moduleId],
		});
	};

	return (
		<div className="space-y-6 px-1">
			<div>
				<p className="text-sm text-muted-foreground">
					Select which modules to enable for this company based on their
					subscription.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{modules.map((module) => {
					const moduleId = module.id as keyof ModuleConfig;
					return (
						<Card
							key={module.id}
							className={`border-2 transition-colors cursor-pointer ${
								data[moduleId]
									? "border-teal-500 dark:border-teal-400 bg-teal-50/50 dark:bg-teal-900/20"
									: "border-gray-200 dark:border-gray-700"
							}`}
							onClick={() => handleToggle(moduleId)}
						>
							<CardHeader className="p-3 pb-0 flex flex-row items-start space-y-0">
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<Checkbox
											id={module.id}
											checked={data[moduleId]}
											onCheckedChange={() => handleToggle(moduleId)}
										/>
										<Label
											htmlFor={module.id}
											className="font-medium cursor-pointer text-sm flex items-center gap-2"
										>
											<span
												className={`p-1 rounded-md ${
													data[moduleId]
														? "bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300"
														: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
												}`}
											>
												{module.icon}
											</span>
											{module.title}
										</Label>
									</div>
								</div>
							</CardHeader>
							<CardContent className="pl-9 p-3">
								<CardDescription className="text-xs">
									{module.description}
								</CardDescription>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
