import { DatabaseBackup, Calendar, Download } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export interface DataRetentionPolicy {
	retentionPeriod: number;
	archivePolicy: string;
	dataExportSettings: string;
}

interface DataRetentionPolicyStepProps {
	data: DataRetentionPolicy;
	onUpdate: (data: DataRetentionPolicy) => void;
	onBack: () => void;
	onNext: () => void;
}

export default function DataRetentionPolicyStep({
	data,
	onUpdate,
}: DataRetentionPolicyStepProps) {
	// Helper to display retention period in years/months
	const formatRetentionPeriod = (months: number) => {
		if (months >= 12) {
			const years = Math.floor(months / 12);
			const remainingMonths = months % 12;
			if (remainingMonths === 0) {
				return `${years} year${years > 1 ? "s" : ""}`;
			}
			return `${years} year${years > 1 ? "s" : ""} and ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
		}
		return `${months} month${months > 1 ? "s" : ""}`;
	};

	return (
		<div className="space-y-6 px-1">
			<div>
				<p className="text-sm text-muted-foreground">
					Configure how long data is retained and what happens when the
					retention period expires.
				</p>
			</div>

			<div className="space-y-4">
				<Card>
					<CardHeader className="pb-2">
						<h3 className="text-sm font-semibold flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							Data Retention Period
						</h3>
						<CardDescription className="text-xs">
							Set how long user data will be retained
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-4">
							<div className="pt-2">
								<Slider
									value={[data.retentionPeriod]}
									min={3}
									max={60}
									step={3}
									onValueChange={(value) =>
										onUpdate({ ...data, retentionPeriod: value[0] })
									}
								/>
							</div>
							<div className="text-center text-sm font-medium">
								{formatRetentionPeriod(data.retentionPeriod)}
							</div>
							<div className="text-xs text-muted-foreground text-center">
								Data will be retained for{" "}
								{formatRetentionPeriod(data.retentionPeriod)} after creation
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<h3 className="text-sm font-semibold flex items-center gap-2">
							<DatabaseBackup className="h-4 w-4" />
							Archive Policy
						</h3>
						<CardDescription className="text-xs">
							What happens to data after the retention period
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Select
							value={data.archivePolicy}
							onValueChange={(value) =>
								onUpdate({ ...data, archivePolicy: value })
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select archive policy" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="archive">
									Archive (read-only access)
								</SelectItem>
								<SelectItem value="delete">Delete permanently</SelectItem>
								<SelectItem value="anonymize">Anonymize data</SelectItem>
							</SelectContent>
						</Select>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<h3 className="text-sm font-semibold flex items-center gap-2">
							<Download className="h-4 w-4" />
							Data Export Settings
						</h3>
						<CardDescription className="text-xs">
							Configure automated exports of company data
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Select
							value={data.dataExportSettings}
							onValueChange={(value) =>
								onUpdate({ ...data, dataExportSettings: value })
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select export frequency" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">No automated exports</SelectItem>
								<SelectItem value="monthly">Monthly export</SelectItem>
								<SelectItem value="quarterly">Quarterly export</SelectItem>
								<SelectItem value="yearly">Yearly export</SelectItem>
							</SelectContent>
						</Select>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
