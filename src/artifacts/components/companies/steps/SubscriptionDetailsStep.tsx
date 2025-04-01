import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { format, addMonths, addDays } from "date-fns";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription } from "@/components/ui/form";

interface SubscriptionDetailsStepProps {
	data: {
		subscriptionDuration: number; // in months (required)
		subscriptionStart: Date; // Subscription Start Date (required)
		subscriptionEnd: Date; // Auto-calculated
		maxLicenses: number; // Maximum User Licenses (required)
		usedLicenses: number; // Current usage (display only)
		unusedLicenses: number; // Auto-calculated (display only)
		renewalReminder: number; // Days before expiry
		includeTrial: boolean; // Option for free trial period
		trialDays: number; // Number of days for trial
	};
	onUpdate: (data: SubscriptionDetailsStepProps["data"]) => void;
	onNext: () => void;
	onBack: () => void;
}

export default function SubscriptionDetailsStep({
	data,
	onUpdate,
}: SubscriptionDetailsStepProps) {
	const onUpdateRef = useRef(onUpdate);
	// Update ref when onUpdate changes
	useEffect(() => {
		onUpdateRef.current = onUpdate;
	}, [onUpdate]);

	// Auto-calculate end date when duration or start date changes
	useEffect(() => {
		const startDate = data.subscriptionStart;

		// If trial is included, add trial days to start date for subscription calculations
		const calculationStartDate = data.includeTrial
			? addDays(startDate, data.trialDays)
			: startDate;

		const newEndDate = addMonths(
			calculationStartDate,
			data.subscriptionDuration,
		);

		// Calculate unused licenses
		const newUnusedLicenses = Math.max(0, data.maxLicenses - data.usedLicenses);

		if (
			newEndDate.getTime() !== data.subscriptionEnd.getTime() ||
			newUnusedLicenses !== data.unusedLicenses
		) {
			onUpdateRef.current({
				...data,
				subscriptionEnd: newEndDate,
				unusedLicenses: newUnusedLicenses,
			});
		}
	}, [
		data.subscriptionDuration,
		data.subscriptionStart,
		data.subscriptionEnd,
		data.maxLicenses,
		data.usedLicenses,
		data.includeTrial,
		data.trialDays,
		data,
	]);

	const handleDurationChange = (value: string) => {
		onUpdate({
			...data,
			subscriptionDuration: Number.parseInt(value, 10),
		});
	};

	const handleStartDateChange = (date: Date | undefined) => {
		if (date) {
			onUpdate({
				...data,
				subscriptionStart: date,
			});
		}
	};

	const handleMaxLicensesChange = (value: string) => {
		const maxLicenses = Number.parseInt(value, 10) || 1;
		onUpdate({
			...data,
			maxLicenses,
			unusedLicenses: Math.max(0, maxLicenses - data.usedLicenses),
		});
	};

	return (
		<div className="space-y-5 px-1">
			<div className="space-y-3">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="subscriptionDuration">Subscription Duration</Label>
						<Select
							value={data.subscriptionDuration.toString()}
							onValueChange={handleDurationChange}
						>
							<SelectTrigger id="subscriptionDuration" className="w-full">
								<SelectValue placeholder="Select duration" />
							</SelectTrigger>
							<SelectContent>
								{[1, 3, 6, 12, 24, 36].map((months) => (
									<SelectItem key={months} value={months.toString()}>
										{months} {months === 1 ? "month" : "months"}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>Free Trial</Label>
						<div className="h-10 rounded-md bg-background px-3 flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="includeTrial"
									checked={data.includeTrial}
									onCheckedChange={(checked) => {
										onUpdate({
											...data,
											includeTrial: !!checked,
											trialDays: checked ? 14 : 0,
										});
									}}
								/>
								<Label
									htmlFor="includeTrial"
									className="text-sm cursor-pointer font-normal"
								>
									14-day trial
								</Label>
							</div>

							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="h-6 w-6 rounded-full"
									>
										<span className="sr-only">Trial info</span>
										<InfoIcon className="h-4 w-4 text-muted-foreground" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-80 p-3 text-sm">
									<p>
										Enables a 14-day free trial period. Customer gets immediate
										access to all features. Billing starts after the trial
										period ends.
									</p>
								</PopoverContent>
							</Popover>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="subscriptionStart">Subscription Start Date</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="w-full justify-start text-left font-normal"
								id="subscriptionStart"
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{format(data.subscriptionStart, "dd/MM/yyyy")}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={data.subscriptionStart}
								onSelect={handleStartDateChange}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				</div>
				<div className="space-y-2">
					<Label htmlFor="subscriptionEnd">Subscription End Date</Label>
					<div className="relative">
						<Input
							id="subscriptionEnd"
							readOnly
							value={format(data.subscriptionEnd, "dd/MM/yyyy")}
							className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
						/>
						<div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
							Auto-calculated
						</div>
					</div>
				</div>
			</div>
			{data.includeTrial && (
				<FormDescription>
					Access begins on this date. Paid subscription starts after{" "}
					{data.trialDays} days trial.
				</FormDescription>
			)}
			<div className="grid grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="maxLicenses">Maximum User Licenses</Label>
					<Input
						id="maxLicenses"
						type="number"
						min="1"
						value={data.maxLicenses}
						onChange={(e) => handleMaxLicensesChange(e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="usedLicenses">Used Licenses</Label>
					<div className="relative">
						<Input
							id="usedLicenses"
							readOnly
							value={data.usedLicenses}
							className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="unusedLicenses">Unused Licenses</Label>
					<div className="relative">
						<Input
							id="unusedLicenses"
							readOnly
							value={data.unusedLicenses}
							className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="renewalReminder">Renewal Reminder</Label>
				<span className="text-sm text-muted-foreground ml-1">(Optional)</span>
				<Input
					id="renewalReminder"
					type="number"
					min="1"
					max="90"
					value={data.renewalReminder}
					onChange={(e) =>
						onUpdate({
							...data,
							renewalReminder: Number.parseInt(e.target.value) || 30,
						})
					}
				/>
			</div>
		</div>
	);
}
