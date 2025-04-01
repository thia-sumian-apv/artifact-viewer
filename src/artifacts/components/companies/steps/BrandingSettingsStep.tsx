import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paintbrush, Code, MessageSquare } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface BrandingSettings {
	primaryColor: string;
	secondaryColor: string;
	customCSS: string;
	customWelcomeMessage: string;
	dashboardWelcomeText: string;
}

interface BrandingSettingsStepProps {
	data: BrandingSettings;
	onUpdate: (data: BrandingSettings) => void;
	onBack: () => void;
	onNext: () => void;
}

export default function BrandingSettingsStep({
	data,
	onUpdate,
}: BrandingSettingsStepProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="space-y-6 px-1">
			<div>
				<p className="text-sm ">
					Customize the appearance and branding for this company's portal.
				</p>
			</div>

			<div className="space-y-4">
				<Card>
					<CardHeader className="pb-2">
						<h3 className="text-sm font-semibold flex items-center gap-2">
							<Paintbrush className="h-4 w-4" />
							Color Scheme
						</h3>
						<CardDescription className="text-xs">
							Set brand colors for the company portal
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="primaryColor">Primary Color</Label>
									<div className="flex items-center gap-2">
										<div
											className="h-10 w-10 rounded-md border cursor-pointer"
											style={{ backgroundColor: data.primaryColor }}
											onClick={() =>
												document.getElementById("primaryColor")?.click()
											}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													document.getElementById("primaryColor")?.click();
												}
											}}
											role="button"
											tabIndex={0}
										/>
										<Input
											type="color"
											id="primaryColor"
											value={data.primaryColor}
											onChange={(e) =>
												onUpdate({ ...data, primaryColor: e.target.value })
											}
											className="sr-only"
										/>
										<div className="flex-1">
											<Input
												value={data.primaryColor.toUpperCase()}
												onChange={(e) =>
													onUpdate({ ...data, primaryColor: e.target.value })
												}
												className="font-mono text-sm h-8 px-2"
											/>
										</div>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="secondaryColor">Secondary Color</Label>
									<div className="flex items-center gap-2">
										<div
											className="h-10 w-10 rounded-md border cursor-pointer"
											style={{ backgroundColor: data.secondaryColor }}
											onClick={() =>
												document.getElementById("secondaryColor")?.click()
											}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													document.getElementById("secondaryColor")?.click();
												}
											}}
											role="button"
											tabIndex={0}
										/>
										<Input
											type="color"
											id="secondaryColor"
											value={data.secondaryColor}
											onChange={(e) =>
												onUpdate({ ...data, secondaryColor: e.target.value })
											}
											className="sr-only"
										/>
										<div className="flex-1">
											<Input
												value={data.secondaryColor.toUpperCase()}
												onChange={(e) =>
													onUpdate({ ...data, secondaryColor: e.target.value })
												}
												className="font-mono text-sm h-8 px-2"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<h3 className="text-sm font-semibold flex items-center gap-2">
							<MessageSquare className="h-4 w-4" />
							Welcome Messages
						</h3>
						<CardDescription className="text-xs">
							Customize welcome messages shown to users
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="customWelcomeMessage">
								Login Page Welcome Message
							</Label>
							<Input
								id="customWelcomeMessage"
								value={data.customWelcomeMessage}
								onChange={(e) =>
									onUpdate({ ...data, customWelcomeMessage: e.target.value })
								}
								placeholder="Welcome message displayed on login page"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="dashboardWelcomeText">
								Dashboard Welcome Text
							</Label>
							<Textarea
								id="dashboardWelcomeText"
								value={data.dashboardWelcomeText}
								onChange={(e) =>
									onUpdate({ ...data, dashboardWelcomeText: e.target.value })
								}
								placeholder="Welcome text shown on user dashboard"
								rows={3}
							/>
						</div>
					</CardContent>
				</Card>

				<Collapsible
					open={open}
					onOpenChange={setOpen}
					className="w-full border rounded-md"
				>
					<CollapsibleTrigger asChild>
						<Button
							variant="ghost"
							className="flex w-full items-center justify-between rounded-t-md p-4 text-sm font-medium"
						>
							<span className="flex items-center gap-2">
								<Code className="h-4 w-4" />
								Advanced Styling Options
							</span>
							<div className="text-xs ">{open ? "Hide" : "Show"}</div>
						</Button>
					</CollapsibleTrigger>
					<CollapsibleContent className="px-4 pb-4">
						<div className="space-y-2">
							<Label htmlFor="customCSS" className="text-sm">
								Custom CSS
							</Label>
							<Textarea
								id="customCSS"
								value={data.customCSS}
								onChange={(e) =>
									onUpdate({ ...data, customCSS: e.target.value })
								}
								placeholder=".custom-class { color: #123456; }"
								rows={5}
								className="font-mono text-sm"
							/>
							<p className="text-xs ">
								For advanced users only. Add custom CSS to further customize the
								company portal appearance.
							</p>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>
		</div>
	);
}
