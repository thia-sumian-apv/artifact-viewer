import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	BookOpen,
	Building2,
	Info,
	RefreshCw,
	User,
	UserCog,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

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

	// Icons for each role type
	const roleIcons: Record<RoleKey, React.ReactNode> = {
		superAdmin: <Building2 className="h-4 w-4" />, // Add superAdmin icon
		companyAdmin: <Building2 className="h-4 w-4" />,
		courseCommander: <BookOpen className="h-4 w-4" />,
		courseTrainer: <UserCog className="h-4 w-4" />,
		trainee: <User className="h-4 w-4" />,
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
		<div className="max-w-3xl mx-auto">
			{/* Header section remains unchanged */}
			<div className="flex items-center justify-between mb-4">
				<div>
					<h2 className="text-lg font-medium">Role Hierarchy Configuration</h2>
					<p className="text-sm text-slate-500 dark:text-slate-400">
						Customize role names and select which roles to use in your
						organization
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={handleResetToDefaults}
					className="flex items-center gap-1"
				>
					<RefreshCw className="h-3.5 w-3.5" />
					Reset to Defaults
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-[1fr,1.2fr] gap-6">
				{/* Left column - Role customization (unchanged) */}
				<Card>
					<CardHeader className="pb-3">
						<div className="flex justify-between items-center">
							<CardTitle className="text-base">Role Selection</CardTitle>
							<Badge variant="outline">
								{Object.values(enabledRoles).filter(Boolean).length}/4 roles
							</Badge>
						</div>
						<CardDescription>
							Enable and customize 2-4 roles for your organization
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{companyRoles.map((role) => (
								<div
									key={role}
									className={`p-3 rounded-md transition-all ${
										enabledRoles[role]
											? "bg-white dark:bg-slate-800 border"
											: "opacity-60 bg-slate-50 dark:bg-slate-900/50"
									}`}
								>
									{/* First row: Label left, Switch right */}
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center gap-1.5">
											<div
												className={`${enabledRoles[role] ? "text-primary" : "text-slate-400"}`}
											>
												{roleIcons[role]}
											</div>
											<Label
												htmlFor={role}
												className="text-sm font-medium flex items-center gap-1"
											>
												{defaultLabels[role]}
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
														</TooltipTrigger>
														<TooltipContent
															side="right"
															className="max-w-[220px]"
														>
															<p className="text-xs">{tooltips[role]}</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</Label>
										</div>

										<Switch
											checked={enabledRoles[role]}
											onCheckedChange={() => toggleRole(role)}
											aria-label={`Toggle ${role} role`}
										/>
									</div>

									{/* Second row: Input spans full width */}
									<div>
										<Input
											id={role}
											value={data[role]}
											onChange={(e) =>
												onUpdate({ ...data, [role]: e.target.value })
											}
											placeholder={`Custom name for ${defaultLabels[role]}`}
											className="h-8 text-sm w-full"
											disabled={!enabledRoles[role]}
										/>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Right column - Tree-style hierarchy visualization */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-base">
							Organizational Structure
						</CardTitle>
						<CardDescription>
							Preview how your role hierarchy will appear
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="bg-white dark:bg-slate-800 rounded-md p-4 min-h-[260px]">
							{/* Tree-style visualization */}
							{(() => {
								// Get only enabled roles in hierarchy order
								const enabledRolesInOrder = companyRoles.filter(
									(role) => enabledRoles[role],
								);

								if (enabledRolesInOrder.length === 0)
									return (
										<div className="flex items-center justify-center h-[200px] text-center text-sm text-slate-500 dark:text-slate-400">
											<p>Enable roles to see the hierarchy</p>
										</div>
									);

								return (
									<div className="text-sm">
										{/* Top level role */}
										<div className="tree-item">
											<div className="flex items-center py-1.5">
												<div className="mr-2 text-primary">
													{roleIcons[enabledRolesInOrder[0]]}
												</div>
												<span className="font-medium">
													{data[enabledRolesInOrder[0]] ||
														defaultLabels[enabledRolesInOrder[0]]}
												</span>
											</div>

											{enabledRolesInOrder.length > 1 && (
												<div className="pl-6 border-l border-slate-200 dark:border-slate-700 ml-2">
													{/* Second level - First instance (expanded) */}
													<div className="tree-item">
														<div className="flex items-center py-1.5">
															<div className="flex items-center">
																<div className="mr-2 text-primary">
																	{roleIcons[enabledRolesInOrder[1]]}
																</div>
																<span>
																	{data[enabledRolesInOrder[1]] ||
																		defaultLabels[enabledRolesInOrder[1]]}{" "}
																	1
																</span>
															</div>
														</div>

														{enabledRolesInOrder.length > 2 && (
															<div className="pl-6 border-l border-slate-200 dark:border-slate-700 ml-2">
																{/* Third level - First instance (expanded) */}
																<div className="tree-item">
																	<div className="flex items-center py-1.5">
																		<div className="flex items-center">
																			<div className="mr-2 text-primary">
																				{roleIcons[enabledRolesInOrder[2]]}
																			</div>
																			<span>
																				{data[enabledRolesInOrder[2]] ||
																					defaultLabels[
																						enabledRolesInOrder[2]
																					]}{" "}
																				1
																			</span>
																		</div>
																	</div>

																	{enabledRolesInOrder.length > 3 && (
																		<div className="pl-6 border-l border-slate-200 dark:border-slate-700 ml-2">
																			{/* Fourth level - Multiple instances */}
																			<div className="tree-item">
																				<div className="flex items-center py-1.5">
																					<div className="flex items-center">
																						<div className="mr-2 text-primary">
																							{
																								roleIcons[
																									enabledRolesInOrder[3]
																								]
																							}
																						</div>
																						<span>
																							{data[enabledRolesInOrder[3]] ||
																								defaultLabels[
																									enabledRolesInOrder[3]
																								]}{" "}
																							1
																						</span>
																					</div>
																				</div>
																			</div>

																			<div className="tree-item">
																				<div className="flex items-center py-1.5">
																					<div className="flex items-center">
																						<div className="mr-2 text-primary">
																							{
																								roleIcons[
																									enabledRolesInOrder[3]
																								]
																							}
																						</div>
																						<span>
																							{data[enabledRolesInOrder[3]] ||
																								defaultLabels[
																									enabledRolesInOrder[3]
																								]}{" "}
																							2
																						</span>
																					</div>
																				</div>
																			</div>

																			<div className="tree-item text-slate-500 dark:text-slate-400 py-1 pl-6">
																				...
																			</div>
																		</div>
																	)}
																</div>

																{/* Third level - Second instance (collapsed) */}
																<div className="tree-item">
																	<div className="flex items-center py-1.5 text-slate-500 dark:text-slate-400">
																		<div className="flex items-center">
																			<div className="mr-2 opacity-70">
																				{roleIcons[enabledRolesInOrder[2]]}
																			</div>
																			<span>
																				{data[enabledRolesInOrder[2]] ||
																					defaultLabels[
																						enabledRolesInOrder[2]
																					]}{" "}
																				2
																			</span>
																		</div>
																	</div>
																</div>

																<div className="tree-item text-slate-500 dark:text-slate-400 py-1 pl-6">
																	...
																</div>
															</div>
														)}
													</div>

													{/* Second level - Second instance (collapsed) */}
													<div className="tree-item">
														<div className="flex items-center py-1.5 text-slate-500 dark:text-slate-400">
															<div className="flex items-center">
																<div className="mr-2 opacity-70">
																	{roleIcons[enabledRolesInOrder[1]]}
																</div>
																<span>
																	{data[enabledRolesInOrder[1]] ||
																		defaultLabels[enabledRolesInOrder[1]]}{" "}
																	2
																</span>
															</div>
														</div>
													</div>

													<div className="tree-item text-slate-500 dark:text-slate-400 py-1 pl-6">
														...
													</div>
												</div>
											)}
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
								);
							})()}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
