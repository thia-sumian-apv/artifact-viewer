import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface RoleCustomizationStepProps {
	data: {
		superAdmin: string;
		companyAdmin: string;
		courseCommander: string;
		courseTrainer: string;
		trainee: string;
	};
	onUpdate: (data: RoleCustomizationStepProps["data"]) => void;
	onBack: () => void;
	onNext: () => void;
}

type RoleKey = keyof RoleCustomizationStepProps["data"];

export default function RoleCustomizationStep({
	data,
	onUpdate,
}: RoleCustomizationStepProps) {
	const defaultLabels = {
		superAdmin: "Super Admin",
		companyAdmin: "Company Admin",
		courseCommander: "Course Commander",
		courseTrainer: "Course Trainer",
		trainee: "Trainee",
	};

	const tooltips = {
		superAdmin: "Full system access, can manage all companies",
		companyAdmin: "Manages users and courses within their company",
		courseCommander: "Creates and manages course content and assessments",
		courseTrainer: "Facilitates courses and views trainee progress",
		trainee: "End users who participate in courses and assessments",
	};

	// Track which roles are enabled
	const [enabledRoles, setEnabledRoles] = useState<Record<RoleKey, boolean>>({
		superAdmin: false, // Hidden from companies
		companyAdmin: true,
		courseCommander: true,
		courseTrainer: true,
		trainee: true,
	});

	// Visible roles for the company (excluding superAdmin)
	const companyRoles: RoleKey[] = [
		"companyAdmin",
		"courseCommander",
		"courseTrainer",
		"trainee",
	];

	const handleResetToDefaults = () => {
		onUpdate(defaultLabels);
		setEnabledRoles({
			superAdmin: false,
			companyAdmin: true,
			courseCommander: true,
			courseTrainer: true,
			trainee: true,
		});
	};

	const toggleRole = (role: RoleKey) => {
		// Count currently enabled roles
		const currentlyEnabled = Object.values(enabledRoles).filter(Boolean).length;

		// Don't allow disabling if only 2 roles are left enabled
		if (enabledRoles[role] && currentlyEnabled <= 2) {
			return;
		}

		// Don't allow enabling if already at 4 roles
		if (!enabledRoles[role] && currentlyEnabled >= 4) {
			return;
		}

		setEnabledRoles((prev) => ({
			...prev,
			[role]: !prev[role],
		}));
	};

	return (
		<div className="space-y-4 px-1">
			<div className="flex items-center justify-between mb-2">
				<div>
					<p className="text-sm font-medium">Role Hierarchy Configuration</p>
					<p className="text-xs text-muted-foreground">
						Customize role names and select which roles to use (min 2, max 4)
					</p>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={handleResetToDefaults}
					className="text-xs flex items-center gap-1"
				>
					<RefreshCw className="h-3 w-3" />
					Reset
				</Button>
			</div>

			<div className="bg-slate-50 dark:bg-slate-900/50 rounded-md p-3 border">
				<div className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex justify-between items-center">
					<span>Organizational Hierarchy</span>
					<Badge variant="outline" className="text-xs">
						{Object.values(enabledRoles).filter(Boolean).length}/4 roles enabled
					</Badge>
				</div>

				<div className="space-y-3">
					{companyRoles.map((role) => (
						<div
							key={role}
							className={`grid grid-cols-[auto,1fr,2fr] gap-3 items-center rounded-md p-2 ${
								enabledRoles[role]
									? "bg-white dark:bg-slate-800 border"
									: "opacity-50 bg-slate-100 dark:bg-slate-900"
							}`}
						>
							<div className="flex flex-col items-center justify-center">
								<Switch
									checked={enabledRoles[role]}
									onCheckedChange={() => toggleRole(role)}
									aria-label={`Toggle ${role} role`}
								/>
							</div>

							<div className="flex items-center gap-1">
								<Label htmlFor={role} className="text-sm font-medium truncate">
									{defaultLabels[role]}
								</Label>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
										</TooltipTrigger>
										<TooltipContent side="right">
											<p className="text-xs max-w-[200px]">{tooltips[role]}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>

							<Input
								id={role}
								value={data[role]}
								onChange={(e) => onUpdate({ ...data, [role]: e.target.value })}
								placeholder={`Custom name for ${defaultLabels[role]}`}
								className="h-8 text-sm"
								disabled={!enabledRoles[role]}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
