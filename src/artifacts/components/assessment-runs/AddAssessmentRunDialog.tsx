import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
	PopoverDialog as Popover,
	PopoverContentDialog as PopoverContent,
	PopoverTriggerDialog as PopoverTrigger,
} from "@/components/ui/popover-dialog";
import { toast } from "sonner";
import type { AssessmentRun } from "@/artifacts/types/assessmentRun";

interface AddAssessmentRunDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	courseId: string;
	onAdd: (newRun: AssessmentRun) => void;
}

const formSchema = z
	.object({
		code: z.string().min(1, "Assessment code is required"),
		name: z.string().min(1, "Assessment name is required"),
		description: z.string().optional(),
		startDate: z.date({
			required_error: "Start date is required",
		}),
		endDate: z.date({
			required_error: "End date is required",
		}),
	})
	.refine((data) => data.endDate >= data.startDate, {
		message: "End date must be after start date",
		path: ["endDate"],
	});

const AddAssessmentRunDialog = ({
	open,
	onOpenChange,
	courseId,
	onAdd,
}: AddAssessmentRunDialogProps) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			code: "",
			name: "",
			description: "",
			startDate: new Date(),
			endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default to 1 month later
		},
	});

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		// Create new assessment run object
		const newAssessmentRun = {
			...data,
			description: data.description || "",
			startDate: data.startDate.toISOString().split("T")[0], // Convert to YYYY-MM-DD
			endDate: data.endDate.toISOString().split("T")[0], // Convert to YYYY-MM-DD
			courseId,
			assessments: [],
			id: "",
			createdBy: "",
			lastModified: "",
			lastModifiedBy: "",
		};

		onAdd(newAssessmentRun);

		toast.success(`${data.name} has been created successfully.`);

		onOpenChange(false);
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Add New Assessment Run</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Assessment Code</FormLabel>
									<FormControl>
										<Input {...field} placeholder="e.g., AR001" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Assessment Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder="e.g., Q1 2024 Assessment" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											rows={3}
											placeholder="Enter a description for this assessment run"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="startDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Start Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
													type="button"
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0"
											align="start"
											side="bottom"
											sideOffset={4}
										>
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="endDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>End Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
													type="button"
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0"
											align="start"
											side="bottom"
											sideOffset={4}
										>
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) => {
													const startDate = form.getValues("startDate");
													return startDate ? date < startDate : false;
												}}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit">Create Assessment Run</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default AddAssessmentRunDialog;
