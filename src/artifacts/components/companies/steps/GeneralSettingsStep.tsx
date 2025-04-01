import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Mail, Send, DatabaseBackup, UserCog } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

export interface GeneralSettingsType {
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
}

interface GeneralSettingsStepProps {
	data: GeneralSettingsType;
	onUpdate: (data: GeneralSettingsType) => void;
	onBack: () => void;
	onNext: () => void;
}

export default function GeneralSettingsStep({
	data,
	onUpdate,
}: GeneralSettingsStepProps) {
	// Helper to display retention period in years/months
	const formatRetentionPeriod = (months: number) => {
		if (months >= 12) {
			const years = Math.floor(months / 12);
			const remainingMonths = months % 12;
			if (remainingMonths === 0) {
				return `${years} year${years > 1 ? "s" : ""}`;
			}
			return `${years} year${years > 1 ? "s" : ""} and ${remainingMonths} month${
				remainingMonths > 1 ? "s" : ""
			}`;
		}
		return `${months} month${months > 1 ? "s" : ""}`;
	};

	return (
		<div className="space-y-6 px-1">
			<Tabs defaultValue="notifications" className="w-full">
				<TabsList className="grid w-full grid-cols-2 mb-6">
					<TabsTrigger
						value="notifications"
						className="flex items-center gap-2"
					>
						<Send className="h-4 w-4" />
						Notification Settings
					</TabsTrigger>
					<TabsTrigger
						value="data-retention"
						className="flex items-center gap-2"
					>
						<DatabaseBackup className="h-4 w-4" />
						Data Retention
					</TabsTrigger>
				</TabsList>

				<TabsContent value="notifications" className="space-y-6">
					<Card className="overflow-hidden border-md">
						<CardHeader className="bg-muted/40 pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<UserCog className="h-5 w-5" />
								User Registration Method
							</CardTitle>
							<CardDescription>
								Choose how users will join your platform
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<RadioGroup
								value={data.notifications.userRegistration}
								onValueChange={(value: "email" | "self") =>
									onUpdate({
										...data,
										notifications: {
											...data.notifications,
											userRegistration: value,
										},
									})
								}
								className="space-y-4"
							>
								<div className="flex items-start space-x-3 p-3 rounded-md border hover:border-primary/50 hover:bg-muted/20 transition-colors">
									<RadioGroupItem value="email" id="email-option" />
									<div className="grid gap-1.5">
										<Label htmlFor="email-option" className="font-medium">
											<span className="flex items-center gap-2">
												<Mail className="h-4 w-4" />
												Welcome Email
											</span>
										</Label>
										<p className="text-sm text-muted-foreground">
											Company admin sends invitations to users via email
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-3 p-3 rounded-md border hover:border-primary/50 hover:bg-muted/20 transition-colors">
									<RadioGroupItem value="self" id="self-option" />
									<div className="grid gap-1.5">
										<Label htmlFor="self-option" className="font-medium">
											<span className="flex items-center gap-2">
												<UserCog className="h-4 w-4" />
												Self Registration
											</span>
										</Label>
										<p className="text-sm text-muted-foreground">
											Users can register themselves using a standard URL
										</p>
									</div>
								</div>
							</RadioGroup>
						</CardContent>
					</Card>

					<Card className="overflow-hidden border-md">
						<CardHeader className="bg-muted/40 pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<Mail className="h-5 w-5" />
								Email Notifications
							</CardTitle>
							<CardDescription>
								Configure automatic notifications sent to users
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between space-x-2 p-3 rounded-md">
								<Label
									htmlFor="reportNotification"
									className="flex flex-col space-y-1 cursor-pointer"
								>
									<span className="font-medium">
										Report Availability Notification
									</span>
									<span className="text-sm text-muted-foreground">
										Notify users when new reports are available
									</span>
								</Label>
								<Switch
									id="reportNotification"
									checked={data.notifications.reportAvailability}
									onCheckedChange={(checked) =>
										onUpdate({
											...data,
											notifications: {
												...data.notifications,
												reportAvailability: checked,
											},
										})
									}
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="overflow-hidden border-md">
						<CardHeader className="bg-muted/40 pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<Send className="h-5 w-5" />
								Email Customization
							</CardTitle>
							<CardDescription>
								Personalize the content and appearance of system emails
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6 space-y-6">
							<div className="grid gap-2">
								<Label htmlFor="emailSenderName" className="font-medium">
									Email Sender Name
								</Label>
								<Input
									id="emailSenderName"
									value={data.notifications.emailSenderName}
									onChange={(e) =>
										onUpdate({
											...data,
											notifications: {
												...data.notifications,
												emailSenderName: e.target.value,
											},
										})
									}
									placeholder="e.g. Resilience Team"
									className="h-10"
								/>
								<p className="text-xs text-muted-foreground">
									This name will appear as the sender of all system emails
								</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="welcomeEmailText" className="font-medium">
									Welcome Email Message
								</Label>
								<Textarea
									id="welcomeEmailText"
									value={data.notifications.welcomeEmailText}
									onChange={(e) =>
										onUpdate({
											...data,
											notifications: {
												...data.notifications,
												welcomeEmailText: e.target.value,
											},
										})
									}
									placeholder="Enter your custom welcome message here..."
									className="min-h-[120px] resize-y"
								/>
								<p className="text-xs text-muted-foreground">
									This text will be included in welcome emails sent to new users
								</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="reportAvailabilityText" className="font-medium">
									Report Notification Message
								</Label>
								<Textarea
									id="reportAvailabilityText"
									value={data.notifications.reportAvailabilityText}
									onChange={(e) =>
										onUpdate({
											...data,
											notifications: {
												...data.notifications,
												reportAvailabilityText: e.target.value,
											},
										})
									}
									placeholder="Enter your custom notification message here..."
									className="min-h-[120px] resize-y"
								/>
								<p className="text-xs text-muted-foreground">
									This text will be included in report availability
									notifications
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="data-retention" className="space-y-6">
					<Card className="overflow-hidden border-md">
						<CardHeader className="bg-muted/40 pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								Data Retention Period
							</CardTitle>
							<CardDescription>
								Set how long user data will be stored in the system
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="space-y-6">
								<div className="pt-4 px-2">
									<Slider
										value={[data.dataRetention.retentionPeriod]}
										min={3}
										max={60}
										step={3}
										onValueChange={(value) =>
											onUpdate({
												...data,
												dataRetention: {
													...data.dataRetention,
													retentionPeriod: value[0],
												},
											})
										}
									/>
								</div>
								<div className="flex items-center justify-center">
									<Badge
										variant="secondary"
										className="px-4 py-1.5 text-sm font-medium"
									>
										{formatRetentionPeriod(data.dataRetention.retentionPeriod)}
									</Badge>
								</div>
								<div className="text-sm text-center text-muted-foreground bg-muted/30 p-3 rounded-md">
									Personal Identifiable Information will be automatically
									removed after{" "}
									<span className="font-medium">
										{formatRetentionPeriod(data.dataRetention.retentionPeriod)}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="overflow-hidden border-md">
						<CardHeader className="bg-muted/40 pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<DatabaseBackup className="h-5 w-5" />
								Data Retention Policy
							</CardTitle>
							<CardDescription>
								Important information about how data is handled
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="p-4 border rounded-md bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900">
								<p className="text-sm">
									At the end of the data retention period, all Personal
									Identifiable Information (PII) will be permanently removed
									from the system, while anonymized data may be kept for
									analytical purposes.
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
