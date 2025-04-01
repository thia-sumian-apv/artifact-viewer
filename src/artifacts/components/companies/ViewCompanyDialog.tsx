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
	Activity,
	Brain,
	Dumbbell,
	User,
	Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Company } from "../../mocks/companyData";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";

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
	const [activeTab, setActiveTab] = useState("details");

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
					defaultValue="details"
					value={activeTab}
					onValueChange={setActiveTab}
					className="mt-2"
				>
					<TabsList className="flex flex-row overflow-x-auto mb-4 w-full">
						<TabsTrigger value="details">Details</TabsTrigger>
						<TabsTrigger value="subscription">Subscription</TabsTrigger>
						<TabsTrigger value="roles">Roles</TabsTrigger>
						<TabsTrigger value="modules">Modules</TabsTrigger>
						<TabsTrigger value="notifications">Notifications</TabsTrigger>
						<TabsTrigger value="data-retention">Data</TabsTrigger>
						<TabsTrigger value="branding">Branding</TabsTrigger>
					</TabsList>

					<TabsContent value="details" className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<p className="text-sm  flex items-center">
									<Tag className="h-4 w-4 mr-2" />
									Short Name
								</p>
								<p className="font-medium">{company.shortName}</p>
							</div>

							<div className="space-y-1">
								<p className="text-sm  flex items-center">
									<Tag className="h-4 w-4 mr-2" />
									Registration Number
								</p>
								<p className="font-medium">{company.registrationNumber}</p>
							</div>

							<div className="space-y-1">
								<p className="text-sm  flex items-center">
									<Users className="h-4 w-4 mr-2" />
									Contact Person
								</p>
								<p className="font-medium">{company.contactName}</p>
							</div>

							<div className="space-y-1">
								<p className="text-sm  flex items-center">
									<Mail className="h-4 w-4 mr-2" />
									Email
								</p>
								<p className="font-medium">{company.contactEmail}</p>
							</div>

							<div className="space-y-1">
								<p className="text-sm  flex items-center">
									<Phone className="h-4 w-4 mr-2" />
									Phone
								</p>
								<p className="font-medium">{company.contactNumber}</p>
							</div>

							<div className="col-span-2 space-y-1">
								<p className="text-sm  flex items-center">
									<MapPin className="h-4 w-4 mr-2" />
									Address
								</p>
								<p className="font-medium">{company.address}</p>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="subscription" className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<p className="text-sm  flex items-center">
									<Calendar className="h-4 w-4 mr-2" />
									Subscription Start
								</p>
								<p className="font-medium">
									{format(company.subscriptionStart, "dd/MM/yyyy")}
								</p>
							</div>

							<div className="space-y-1">
								<p className="text-sm  flex items-center">
									<Calendar className="h-4 w-4 mr-2" />
									Subscription End
								</p>
								<p className="font-medium">
									{format(company.subscriptionEnd, "dd/MM/yyyy")}
								</p>
							</div>

							<div className="space-y-1">
								<p className="text-sm  flex items-center">
									<Tag className="h-4 w-4 mr-2" />
									Duration
								</p>
								<p className="font-medium">
									{company.subscriptionDuration} months
								</p>
							</div>

							<div className="space-y-1">
								<p className="text-sm  flex items-center">
									<Users className="h-4 w-4 mr-2" />
									Licenses
								</p>
								<p className="font-medium">
									{company.usedLicenses} / {company.maxLicenses} used
								</p>
							</div>

							<div className="space-y-1">
								<p className="text-sm  flex items-center">
									<Calendar className="h-4 w-4 mr-2" />
									Renewal Reminder
								</p>
								<p className="font-medium">
									{company.renewalReminder} days before expiry
								</p>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="roles" className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<p className="text-sm ">Super Admin Label</p>
								<p className="font-medium">{company.roleLabels.superAdmin}</p>
							</div>

							<div className="space-y-1">
								<p className="text-sm ">Company Admin Label</p>
								<p className="font-medium">{company.roleLabels.companyAdmin}</p>
							</div>

							<div className="space-y-1">
								<p className="text-sm ">Course Commander Label</p>
								<p className="font-medium">
									{company.roleLabels.courseCommander}
								</p>
							</div>

							<div className="space-y-1">
								<p className="text-sm ">Course Trainer Label</p>
								<p className="font-medium">
									{company.roleLabels.courseTrainer}
								</p>
							</div>

							<div className="space-y-1">
								<p className="text-sm ">Trainee Label</p>
								<p className="font-medium">{company.roleLabels.trainee}</p>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="modules" className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							{Object.entries(company.modules).map(([key, enabled]) => {
								// Convert camelCase to Title Case with spaces
								const title = key
									.replace(/([A-Z])/g, " $1")
									.replace(/^./, (str) => str.toUpperCase());

								let icon: React.ReactNode;
								switch (key as keyof typeof company.modules) {
									case "cognitiveAssessments":
										icon = <Brain className="h-4 w-4" />;
										break;
									case "psychologicalAssessments":
										icon = <Activity className="h-4 w-4" />;
										break;
									case "externalAssessments":
									case "physicalAssessments":
										icon = <Dumbbell className="h-4 w-4" />;
										break;
									case "teamResilience":
										icon = <Users className="h-4 w-4" />;
										break;
									case "individualReporting":
										icon = <User className="h-4 w-4" />;
										break;
									case "externalIntegration":
										icon = <Zap className="h-4 w-4" />;
										break;
									default:
										icon = <Activity className="h-4 w-4" />;
								}

								return (
									<div
										key={key}
										className={`flex items-center gap-3 p-2 rounded-md border ${
											enabled
												? "bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-900/50"
												: "bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400"
										}`}
									>
										<div
											className={`p-2 rounded-md ${
												enabled
													? "bg-teal-100 dark:bg-teal-800/50 text-teal-600 dark:text-teal-300"
													: "bg-gray-100 dark:bg-gray-700"
											}`}
										>
											{icon}
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium">{title}</p>
											<p className="text-xs ">
												{enabled ? "Enabled" : "Disabled"}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</TabsContent>
					<TabsContent value="notifications" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Notification Settings</CardTitle>
								<CardDescription>
									Email and notification configuration for this company
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<h4 className="font-medium text-sm">Email Notifications</h4>
										<div className="mt-2 space-y-2">
											<div className="flex justify-between text-sm">
												<span>Welcome Email:</span>
												<Badge
													variant={
														company.notificationSettings?.welcomeEmail
															? "default"
															: "outline"
													}
												>
													{company.notificationSettings?.welcomeEmail
														? "Enabled"
														: "Disabled"}
												</Badge>
											</div>
											<div className="flex justify-between text-sm">
												<span>Report Availability:</span>
												<Badge
													variant={
														company.notificationSettings
															?.reportAvailabilityNotification
															? "default"
															: "outline"
													}
												>
													{company.notificationSettings
														?.reportAvailabilityNotification
														? "Enabled"
														: "Disabled"}
												</Badge>
											</div>
										</div>
									</div>

									<div>
										<h4 className="font-medium text-sm">Email Configuration</h4>
										<div className="mt-2 space-y-2 text-sm">
											<div className="flex justify-between">
												<span>Sender Name:</span>
												<span className="font-medium">
													{company.notificationSettings?.emailSenderName ||
														company.name}
												</span>
											</div>
											<div className="flex justify-between">
												<span>Support Email:</span>
												<span className="font-medium">
													{company.notificationSettings?.companySupportEmail ||
														company.contactEmail}
												</span>
											</div>
										</div>
									</div>
								</div>

								{company.notificationSettings?.emailFooterText && (
									<div>
										<h4 className="font-medium text-sm mb-1">
											Email Footer Text
										</h4>
										<div className="bg-muted p-2 rounded text-sm">
											{company.notificationSettings.emailFooterText}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="data-retention" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Data Retention Policy</CardTitle>
								<CardDescription>
									Data retention and archiving configuration
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-3 gap-4">
									<div>
										<h4 className="font-medium text-sm">Retention Period</h4>
										<div className="mt-2 text-sm">
											<Badge className="mt-1">
												{company.dataRetentionPolicy?.retentionPeriod || 12}{" "}
												months
											</Badge>
										</div>
									</div>

									<div>
										<h4 className="font-medium text-sm">Archive Policy</h4>
										<div className="mt-2 text-sm">
											<Badge variant="outline" className="capitalize">
												{company.dataRetentionPolicy?.archivePolicy ||
													"archive"}
											</Badge>
										</div>
									</div>

									<div>
										<h4 className="font-medium text-sm">Data Export</h4>
										<div className="mt-2 text-sm">
											<Badge
												variant={
													company.dataRetentionPolicy?.dataExportSettings !==
													"none"
														? "default"
														: "outline"
												}
												className="capitalize"
											>
												{company.dataRetentionPolicy?.dataExportSettings ||
													"none"}
											</Badge>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="branding" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Branding Settings</CardTitle>
								<CardDescription>
									Custom branding configuration for this company
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<h4 className="font-medium text-sm">Brand Colors</h4>
										<div className="mt-2 flex items-center space-x-3">
											<div className="flex items-center space-x-1">
												<div
													className="w-6 h-6 rounded border"
													style={{
														backgroundColor:
															company.brandingSettings?.primaryColor ||
															"#4f46e5",
													}}
												/>
												<span className="text-xs">Primary</span>
											</div>
											<div className="flex items-center space-x-1">
												<div
													className="w-6 h-6 rounded border"
													style={{
														backgroundColor:
															company.brandingSettings?.secondaryColor ||
															"#10b981",
													}}
												/>
												<span className="text-xs">Secondary</span>
											</div>
										</div>
									</div>

									<div>
										<h4 className="font-medium text-sm">Welcome Messages</h4>
										<div className="mt-2 space-y-2 text-sm">
											<div className="line-clamp-1">
												<span className="text-xs ">Login:</span>{" "}
												<span>
													{company.brandingSettings?.customWelcomeMessage ||
														`Welcome to ${company.name}`}
												</span>
											</div>
											<div className="line-clamp-1">
												<span className="text-xs ">Dashboard:</span>{" "}
												<span>
													{company.brandingSettings?.dashboardWelcomeText ||
														`Welcome to your ${company.name} dashboard`}
												</span>
											</div>
										</div>
									</div>
								</div>

								{company.brandingSettings?.customCSS && (
									<div>
										<h4 className="font-medium text-sm mb-1">Custom CSS</h4>
										<div className="bg-muted p-2 rounded text-xs font-mono overflow-auto max-h-24">
											{company.brandingSettings.customCSS}
										</div>
									</div>
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
