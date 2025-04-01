import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";

export interface NotificationSettings {
	welcomeEmail: boolean;
	reportAvailabilityNotification: boolean;
	emailSenderName: string;
	emailFooterText: string;
	companySupportEmail: string;
}

interface NotificationSettingsStepProps {
	data: NotificationSettings;
	onUpdate: (data: NotificationSettings) => void;
	onBack: () => void;
	onNext: () => void;
}

export default function NotificationSettingsStep({
	data,
	onUpdate,
}: NotificationSettingsStepProps) {
	const handleToggle = (
		field: keyof Pick<
			NotificationSettings,
			"welcomeEmail" | "reportAvailabilityNotification"
		>,
	) => {
		onUpdate({
			...data,
			[field]: !data[field],
		});
	};

	return (
		<div className="space-y-6 px-1">
			<div>
				<p className="text-sm ">
					Configure notification settings and email customization for this
					company.
				</p>
			</div>

			<div className="space-y-4">
				<Card>
					<CardHeader className="pb-2">
						<h3 className="text-sm font-semibold flex items-center gap-2">
							<Mail className="h-4 w-4" />
							Email Notifications
						</h3>
						<CardDescription className="text-xs">
							Enable or disable automated email notifications
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between space-x-2">
							<Label htmlFor="welcomeEmail" className="flex flex-col space-y-1">
								<span>Welcome Email</span>
								<span className="font-normal text-xs ">
									Send welcome email to new users
								</span>
							</Label>
							<Switch
								id="welcomeEmail"
								checked={data.welcomeEmail}
								onCheckedChange={() => handleToggle("welcomeEmail")}
							/>
						</div>

						<div className="flex items-center justify-between space-x-2">
							<Label
								htmlFor="reportNotification"
								className="flex flex-col space-y-1"
							>
								<span>Report Availability Notification</span>
								<span className="font-normal text-xs ">
									Notify users when new reports are available
								</span>
							</Label>
							<Switch
								id="reportNotification"
								checked={data.reportAvailabilityNotification}
								onCheckedChange={() =>
									handleToggle("reportAvailabilityNotification")
								}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<h3 className="text-sm font-semibold flex items-center gap-2">
							<Send className="h-4 w-4" />
							Email Customization
						</h3>
						<CardDescription className="text-xs">
							Customize email appearance and contact information
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-2">
							<Label htmlFor="emailSenderName">Email Sender Name</Label>
							<Input
								id="emailSenderName"
								value={data.emailSenderName}
								onChange={(e) =>
									onUpdate({ ...data, emailSenderName: e.target.value })
								}
								placeholder="e.g. Resilience Team"
								className="h-8"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="companySupportEmail">Company Support Email</Label>
							<Input
								id="companySupportEmail"
								type="email"
								value={data.companySupportEmail}
								onChange={(e) =>
									onUpdate({ ...data, companySupportEmail: e.target.value })
								}
								placeholder="support@company.com"
								className="h-8"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="emailFooter">Email Footer Text</Label>
							<Textarea
								id="emailFooter"
								value={data.emailFooterText}
								onChange={(e) =>
									onUpdate({ ...data, emailFooterText: e.target.value })
								}
								placeholder="Custom footer text for all company emails"
								className="h-20 resize-none"
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
