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
import { format, addMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface SubscriptionDetailsStepProps {
	data: {
		subscriptionDuration: number;
		subscriptionStart: Date;
		subscriptionEnd: Date;
		maxLicenses: number;
		usedLicenses: number;
		renewalReminder: number;
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
		const newEndDate = addMonths(
			data.subscriptionStart,
			data.subscriptionDuration,
		);
		if (newEndDate.getTime() !== data.subscriptionEnd.getTime()) {
			onUpdateRef.current({
				...data,
				subscriptionEnd: newEndDate,
			});
		}
	}, [
		data.subscriptionDuration,
		data.subscriptionStart,
		data.subscriptionEnd,
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

	return (
		<div className="space-y-4 px-1">
			<div className="space-y-2">
				<Label htmlFor="subscriptionDuration">
					Subscription Duration (months)
				</Label>
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

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="maxLicenses">Maximum User Licenses</Label>
					<Input
						id="maxLicenses"
						type="number"
						min="1"
						value={data.maxLicenses}
						onChange={(e) =>
							onUpdate({
								...data,
								maxLicenses: Number.parseInt(e.target.value) || 1,
							})
						}
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
						<div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
							Auto-calculated
						</div>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="renewalReminder">
					Renewal Reminder (days before expiry)
				</Label>
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
