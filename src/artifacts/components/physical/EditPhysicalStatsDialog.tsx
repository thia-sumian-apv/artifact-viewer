/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { UserPhysicalProfile } from "../../types/physical";
import { cn } from "@/lib/utils";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

type PhysicalDataUpdate =
	| { userId: string; type: "weight"; weight: number }
	| {
			userId: string;
			type: "ippt";
			data: z.infer<typeof ipptFormSchema> & { runTime: number };
	  }
	| {
			userId: string;
			type: "soc";
			data: z.infer<typeof socFormSchema> & { timeInSeconds: number };
	  }
	| {
			userId: string;
			type: "roadMarch";
			data: z.infer<typeof roadMarchFormSchema> & { timeInSeconds: number };
	  }
	| { userId: string; type: "cardio"; data: z.infer<typeof cardioFormSchema> }
	| {
			userId: string;
			type: "strength";
			data: z.infer<typeof strengthFormSchema> & {
				sprintDragCarryTime: number;
			};
	  };

interface EditPhysicalStatsDialogProps {
	profile: UserPhysicalProfile | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave?: (data: PhysicalDataUpdate) => void;
}

// Form schema for IPPT
const ipptFormSchema = z.object({
	assessmentDate: z.string().min(1, { message: "Date is required" }),
	award: z.enum(["gold", "silver", "bronze", "fail"]),
	pushUpReps: z.coerce.number().min(0, { message: "Must be 0 or higher" }),
	sitUpReps: z.coerce.number().min(0, { message: "Must be 0 or higher" }),
	runMinutes: z.coerce.number().min(0, { message: "Must be 0 or higher" }),
	runSeconds: z.coerce.number().min(0).max(59, { message: "Must be 0-59" }),
	totalScore: z.coerce.number().min(0, { message: "Must be 0 or higher" }),
});

// Form schema for SOC
const socFormSchema = z.object({
	assessmentDate: z.string().min(1, { message: "Date is required" }),
	status: z.enum(["pass", "fail"]),
	minutes: z.coerce.number().min(0, { message: "Must be 0 or higher" }),
	seconds: z.coerce.number().min(0).max(59, { message: "Must be 0-59" }),
});

// Form schema for Road March
const roadMarchFormSchema = z.object({
	assessmentDate: z.string().min(1, { message: "Date is required" }),
	status: z.enum(["pass", "fail"]),
	hours: z.coerce.number().min(0, { message: "Must be 0 or higher" }),
	minutes: z.coerce.number().min(0).max(59, { message: "Must be 0-59" }),
	seconds: z.coerce.number().min(0).max(59, { message: "Must be 0-59" }),
	distanceCompleted: z.coerce
		.number()
		.min(0, { message: "Must be 0 or higher" }),
});

// Form schema for Cardio
const cardioFormSchema = z.object({
	assessmentDate: z.string().min(1, { message: "Date is required" }),
	vo2Max: z.coerce.number().min(0, { message: "Must be 0 or higher" }),
	restingHeartRate: z.coerce
		.number()
		.min(0, { message: "Must be 0 or higher" }),
	exerciseHeartRate: z.coerce
		.number()
		.min(0, { message: "Must be 0 or higher" }),
	heartRateVariability: z.coerce
		.number()
		.min(0, { message: "Must be 0 or higher" }),
});

// Form schema for Strength
const strengthFormSchema = z.object({
	assessmentDate: z.string().min(1, { message: "Date is required" }),
	squatRepMax: z.coerce.number().min(0, { message: "Must be 0 or higher" }),
	deadliftRepMax: z.coerce.number().min(0, { message: "Must be 0 or higher" }),
	maxPullUps: z.coerce.number().min(0, { message: "Must be 0 or higher" }),
	sprintDragCarryMinutes: z.coerce
		.number()
		.min(0, { message: "Must be 0 or higher" }),
	sprintDragCarrySeconds: z.coerce
		.number()
		.min(0)
		.max(59, { message: "Must be 0-59" }),
});

// Form schema for Weight
const weightFormSchema = z.object({
	weight: z.coerce
		.number()
		.min(30, { message: "Weight must be at least 30 kg" }),
});

export function EditPhysicalStatsDialog({
	profile,
	open,
	onOpenChange,
	onSave,
}: EditPhysicalStatsDialogProps) {
	const [activeTab, setActiveTab] = useState("weight");

	// Set up forms
	const weightForm = useForm<z.infer<typeof weightFormSchema>>({
		resolver: zodResolver(weightFormSchema),
		defaultValues: { weight: 70 },
	});

	// IPPT Form setup
	const ipptForm = useForm<z.infer<typeof ipptFormSchema>>({
		resolver: zodResolver(ipptFormSchema),
		defaultValues: {
			assessmentDate: new Date().toISOString().split("T")[0],
			award: "fail",
			pushUpReps: 0,
			sitUpReps: 0,
			runMinutes: 0,
			runSeconds: 0,
			totalScore: 0,
		},
	});

	// SOC Form setup
	const socForm = useForm<z.infer<typeof socFormSchema>>({
		resolver: zodResolver(socFormSchema),
		defaultValues: {
			assessmentDate: new Date().toISOString().split("T")[0],
			status: "fail",
			minutes: 0,
			seconds: 0,
		},
	});

	// Road March Form setup
	const roadMarchForm = useForm<z.infer<typeof roadMarchFormSchema>>({
		resolver: zodResolver(roadMarchFormSchema),
		defaultValues: {
			assessmentDate: new Date().toISOString().split("T")[0],
			status: "fail",
			hours: 0,
			minutes: 0,
			seconds: 0,
			distanceCompleted: 0,
		},
	});

	// Cardio Form setup
	const cardioForm = useForm<z.infer<typeof cardioFormSchema>>({
		resolver: zodResolver(cardioFormSchema),
		defaultValues: {
			assessmentDate: new Date().toISOString().split("T")[0],
			vo2Max: 0,
			restingHeartRate: 0,
			exerciseHeartRate: 0,
			heartRateVariability: 0,
		},
	});

	// Strength Form setup
	const strengthForm = useForm<z.infer<typeof strengthFormSchema>>({
		resolver: zodResolver(strengthFormSchema),
		defaultValues: {
			assessmentDate: new Date().toISOString().split("T")[0],
			squatRepMax: 0,
			deadliftRepMax: 0,
			maxPullUps: 0,
			sprintDragCarryMinutes: 0,
			sprintDragCarrySeconds: 0,
		},
	});

	useEffect(() => {
		if (profile) {
			// Reset weight form
			weightForm.reset({ weight: profile.weight });

			// Reset IPPT form
			const defaultIPPT = profile.ipptRecords[0];
			if (defaultIPPT) {
				ipptForm.reset({
					assessmentDate: defaultIPPT.assessmentDate
						.toISOString()
						.split("T")[0],
					award: defaultIPPT.award,
					pushUpReps: defaultIPPT.pushUpReps,
					sitUpReps: defaultIPPT.sitUpReps,
					runMinutes: Math.floor(defaultIPPT.runTime / 60),
					runSeconds: defaultIPPT.runTime % 60,
					totalScore: defaultIPPT.totalScore,
				});
			} else {
				ipptForm.reset({
					assessmentDate: new Date().toISOString().split("T")[0],
					award: "fail",
					pushUpReps: 0,
					sitUpReps: 0,
					runMinutes: 0,
					runSeconds: 0,
					totalScore: 0,
				});
			}

			// Reset SOC form
			const defaultSOC = profile.socRecords[0];
			if (defaultSOC) {
				socForm.reset({
					assessmentDate: defaultSOC.assessmentDate.toISOString().split("T")[0],
					status: defaultSOC.status,
					minutes: Math.floor(defaultSOC.timeInSeconds / 60),
					seconds: defaultSOC.timeInSeconds % 60,
				});
			} else {
				socForm.reset({
					assessmentDate: new Date().toISOString().split("T")[0],
					status: "fail",
					minutes: 0,
					seconds: 0,
				});
			}

			// Reset Road March form
			const defaultRoadMarch = profile.roadMarchRecords[0];
			if (defaultRoadMarch) {
				roadMarchForm.reset({
					assessmentDate: defaultRoadMarch.assessmentDate
						.toISOString()
						.split("T")[0],
					status: defaultRoadMarch.status,
					hours: Math.floor(defaultRoadMarch.timeInSeconds / 3600),
					minutes: Math.floor((defaultRoadMarch.timeInSeconds % 3600) / 60),
					seconds: defaultRoadMarch.timeInSeconds % 60,
					distanceCompleted: defaultRoadMarch.distanceCompleted,
				});
			} else {
				roadMarchForm.reset({
					assessmentDate: new Date().toISOString().split("T")[0],
					status: "fail",
					hours: 0,
					minutes: 0,
					seconds: 0,
					distanceCompleted: 0,
				});
			}

			// Reset Cardio form
			const defaultCardio = profile.cardioRecords[0];
			if (defaultCardio) {
				cardioForm.reset({
					assessmentDate: defaultCardio.assessmentDate
						.toISOString()
						.split("T")[0],
					vo2Max: defaultCardio.vo2Max,
					restingHeartRate: defaultCardio.restingHeartRate,
					exerciseHeartRate: defaultCardio.exerciseHeartRate,
					heartRateVariability: defaultCardio.heartRateVariability,
				});
			} else {
				cardioForm.reset({
					assessmentDate: new Date().toISOString().split("T")[0],
					vo2Max: 0,
					restingHeartRate: 0,
					exerciseHeartRate: 0,
					heartRateVariability: 0,
				});
			}

			// Reset Strength form
			const defaultStrength = profile.strengthRecords[0];
			if (defaultStrength) {
				strengthForm.reset({
					assessmentDate: defaultStrength.assessmentDate
						.toISOString()
						.split("T")[0],
					squatRepMax: defaultStrength.squatRepMax,
					deadliftRepMax: defaultStrength.deadliftRepMax,
					maxPullUps: defaultStrength.maxPullUps,
					sprintDragCarryMinutes: Math.floor(
						defaultStrength.sprintDragCarryTime / 60,
					),
					sprintDragCarrySeconds: defaultStrength.sprintDragCarryTime % 60,
				});
			} else {
				strengthForm.reset({
					assessmentDate: new Date().toISOString().split("T")[0],
					squatRepMax: 0,
					deadliftRepMax: 0,
					maxPullUps: 0,
					sprintDragCarryMinutes: 0,
					sprintDragCarrySeconds: 0,
				});
			}
		}
	}, [
		profile,
		weightForm,
		ipptForm,
		socForm,
		roadMarchForm,
		cardioForm,
		strengthForm,
	]);

	// Form submission handlers
	const onWeightSubmit = (data: z.infer<typeof weightFormSchema>) => {
		console.log("Weight data submitted:", data);
		if (onSave && profile) {
			onSave({
				userId: profile.userId,
				weight: data.weight,
				type: "weight",
			});
			toast.success(
				`Weight updated for ${profile.user.firstName} ${profile.user.lastName}`,
			);
		}
		onOpenChange(false);
	};

	const onIPPTSubmit = (data: z.infer<typeof ipptFormSchema>) => {
		const runTimeInSeconds = data.runMinutes * 60 + data.runSeconds;
		console.log("IPPT data submitted:", { ...data, runTimeInSeconds });
		if (onSave && profile) {
			onSave({
				userId: profile.userId,
				type: "ippt",
				data: {
					...data,
					runTime: runTimeInSeconds,
				},
			});
			toast.success(
				`IPPT data updated for ${profile.user.firstName} ${profile.user.lastName}`,
			);
		}
		onOpenChange(false);
	};

	const onSOCSubmit = (data: z.infer<typeof socFormSchema>) => {
		const timeInSeconds = data.minutes * 60 + data.seconds;
		console.log("SOC data submitted:", { ...data, timeInSeconds });
		if (onSave && profile) {
			onSave({
				userId: profile.userId,
				type: "soc",
				data: {
					...data,
					timeInSeconds,
				},
			});
			toast.success(
				`SOC data updated for ${profile.user.firstName} ${profile.user.lastName}`,
			);
		}
		onOpenChange(false);
	};

	const onRoadMarchSubmit = (data: z.infer<typeof roadMarchFormSchema>) => {
		const timeInSeconds = data.hours * 3600 + data.minutes * 60 + data.seconds;
		console.log("Road March data submitted:", { ...data, timeInSeconds });
		if (onSave && profile) {
			onSave({
				userId: profile.userId,
				type: "roadMarch",
				data: {
					...data,
					timeInSeconds,
				},
			});
			toast.success(
				`Road March data updated for ${profile.user.firstName} ${profile.user.lastName}`,
			);
		}
		onOpenChange(false);
	};

	const onCardioSubmit = (data: z.infer<typeof cardioFormSchema>) => {
		console.log("Cardio data submitted:", data);
		if (onSave && profile) {
			onSave({
				userId: profile.userId,
				type: "cardio",
				data,
			});
			toast.success(
				`Cardio data updated for ${profile.user.firstName} ${profile.user.lastName}`,
			);
		}
		onOpenChange(false);
	};

	const onStrengthSubmit = (data: z.infer<typeof strengthFormSchema>) => {
		const sprintDragCarryTime =
			data.sprintDragCarryMinutes * 60 + data.sprintDragCarrySeconds;
		console.log("Strength data submitted:", { ...data, sprintDragCarryTime });
		if (onSave && profile) {
			onSave({
				userId: profile.userId,
				type: "strength",
				data: {
					...data,
					sprintDragCarryTime,
				},
			});
			toast.success(
				`Strength data updated for ${profile.user.firstName} ${profile.user.lastName}`,
			);
		}
		onOpenChange(false);
	};

	const handleCancel = () => {
		toast.info("Changes cancelled");
		onOpenChange(false);
	};

	if (!profile || !open) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle>
						Edit Physical Stats: {profile.user.firstName}{" "}
						{profile.user.lastName}
					</DialogTitle>
					<DialogDescription>
						Update the physical assessment data for this user.
					</DialogDescription>
				</DialogHeader>

				<Tabs
					defaultValue="weight"
					className="w-full"
					value={activeTab}
					onValueChange={setActiveTab}
				>
					<TabsList className="grid grid-cols-6 mb-4">
						<TabsTrigger value="weight">Weight</TabsTrigger>
						<TabsTrigger value="ippt">IPPT</TabsTrigger>
						<TabsTrigger value="soc">SOC</TabsTrigger>
						<TabsTrigger value="roadmarch">Road March</TabsTrigger>
						<TabsTrigger value="cardio">Cardio</TabsTrigger>
						<TabsTrigger value="strength">Strength</TabsTrigger>
					</TabsList>

					{/* Weight Tab */}
					<TabsContent value="weight">
						<Form {...weightForm}>
							<form
								onSubmit={weightForm.handleSubmit(onWeightSubmit)}
								className="space-y-6"
							>
								<FormField
									control={weightForm.control}
									name="weight"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Weight (kg)</FormLabel>
											<FormControl>
												<Input type="number" step="0.1" {...field} />
											</FormControl>
											<FormDescription>
												Current recorded weight of the trainee
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={handleCancel}
									>
										Cancel
									</Button>
									<Button type="submit">Save Changes</Button>
								</DialogFooter>
							</form>
						</Form>
					</TabsContent>

					{/* IPPT Tab */}
					<TabsContent value="ippt">
						<Form {...ipptForm}>
							<form
								onSubmit={ipptForm.handleSubmit(onIPPTSubmit)}
								className="space-y-6"
							>
								<div className="grid grid-cols-2 gap-6">
									{/* Assessment Date with Calendar */}
									<FormField
										control={ipptForm.control}
										name="assessmentDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Assessment Date</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant="outline"
																className={cn(
																	"w-full pl-3 text-left font-normal",
																	!field.value && "text-muted-foreground",
																)}
															>
																{field.value ? (
																	format(new Date(field.value), "PPP")
																) : (
																	<span>Pick a date</span>
																)}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<Calendar
															mode="single"
															selected={
																field.value ? new Date(field.value) : undefined
															}
															onSelect={(date) =>
																field.onChange(
																	date ? format(date, "yyyy-MM-dd") : "",
																)
															}
															disabled={(date) => date > new Date()}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Award Selection */}
									<FormField
										control={ipptForm.control}
										name="award"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Award</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select award" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="gold">Gold</SelectItem>
														<SelectItem value="silver">Silver</SelectItem>
														<SelectItem value="bronze">Bronze</SelectItem>
														<SelectItem value="fail">Fail</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Physical Test Results */}
								<div className="grid grid-cols-3 gap-6">
									<FormField
										control={ipptForm.control}
										name="pushUpReps"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Push-Ups</FormLabel>
												<FormControl>
													<Input type="number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={ipptForm.control}
										name="sitUpReps"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Sit-Ups</FormLabel>
												<FormControl>
													<Input type="number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={ipptForm.control}
										name="totalScore"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Total Score</FormLabel>
												<FormControl>
													<Input type="number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* 2.4km Run Time - Improved Layout */}
								<div className="space-y-2">
									<FormLabel>2.4km Run Time</FormLabel>
									<div className="flex items-center space-x-3">
										<FormField
											control={ipptForm.control}
											name="runMinutes"
											render={({ field }) => (
												<FormItem className="flex-1">
													<div className="flex items-center space-x-2">
														<FormControl>
															<Input
																type="number"
																{...field}
																className="text-center"
															/>
														</FormControl>
														<span className="text-sm text-muted-foreground">
															min
														</span>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>

										<span className="text-lg">:</span>

										<FormField
											control={ipptForm.control}
											name="runSeconds"
											render={({ field }) => (
												<FormItem className="flex-1">
													<div className="flex items-center space-x-2">
														<FormControl>
															<Input
																type="number"
																{...field}
																className="text-center"
															/>
														</FormControl>
														<span className="text-sm text-muted-foreground">
															sec
														</span>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={handleCancel}
									>
										Cancel
									</Button>
									<Button type="submit">Save Changes</Button>
								</DialogFooter>
							</form>
						</Form>
					</TabsContent>

					{/* SOC Tab */}
					<TabsContent value="soc">
						<Form {...socForm}>
							<form
								onSubmit={socForm.handleSubmit(onSOCSubmit)}
								className="space-y-6"
							>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={socForm.control}
										name="assessmentDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Assessment Date</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant="outline"
																className={cn(
																	"w-full pl-3 text-left font-normal",
																	!field.value && "text-muted-foreground",
																)}
															>
																{field.value ? (
																	format(new Date(field.value), "PPP")
																) : (
																	<span>Pick a date</span>
																)}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent
														className="w-auto p-0 bg-background border rounded-md shadow-md"
														align="start"
													>
														<Calendar
															mode="single"
															selected={
																field.value ? new Date(field.value) : undefined
															}
															onSelect={(date) =>
																field.onChange(
																	date ? format(date, "yyyy-MM-dd") : "",
																)
															}
															disabled={(date) => date > new Date()}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={socForm.control}
										name="status"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Status</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select status" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="pass">Pass</SelectItem>
														<SelectItem value="fail">Fail</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="space-y-2">
									<FormLabel>Completion Time</FormLabel>
									<div className="flex items-center space-x-3">
										<FormField
											control={socForm.control}
											name="minutes"
											render={({ field }) => (
												<FormItem className="flex-1">
													<div className="flex items-center space-x-2">
														<FormControl>
															<Input
																type="number"
																{...field}
																className="text-center"
															/>
														</FormControl>
														<span className="text-sm text-muted-foreground">
															min
														</span>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>

										<span className="text-lg">:</span>

										<FormField
											control={socForm.control}
											name="seconds"
											render={({ field }) => (
												<FormItem className="flex-1">
													<div className="flex items-center space-x-2">
														<FormControl>
															<Input
																type="number"
																{...field}
																className="text-center"
															/>
														</FormControl>
														<span className="text-sm text-muted-foreground">
															sec
														</span>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={handleCancel}
									>
										Cancel
									</Button>
									<Button type="submit">Save Changes</Button>
								</DialogFooter>
							</form>
						</Form>
					</TabsContent>

					{/* Road March Tab */}
					<TabsContent value="roadmarch">
						<Form {...roadMarchForm}>
							<form
								onSubmit={roadMarchForm.handleSubmit(onRoadMarchSubmit)}
								className="space-y-6"
							>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={roadMarchForm.control}
										name="assessmentDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Assessment Date</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant="outline"
																className={cn(
																	"w-full pl-3 text-left font-normal",
																	!field.value && "text-muted-foreground",
																)}
															>
																{field.value ? (
																	format(new Date(field.value), "PPP")
																) : (
																	<span>Pick a date</span>
																)}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent
														className="w-auto p-0 bg-background border rounded-md shadow-md"
														align="start"
													>
														<Calendar
															mode="single"
															selected={
																field.value ? new Date(field.value) : undefined
															}
															onSelect={(date) =>
																field.onChange(
																	date ? format(date, "yyyy-MM-dd") : "",
																)
															}
															disabled={(date) => date > new Date()}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={roadMarchForm.control}
										name="status"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Status</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select status" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="pass">Pass</SelectItem>
														<SelectItem value="fail">Fail</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={roadMarchForm.control}
									name="distanceCompleted"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Distance Completed (km)</FormLabel>
											<FormControl>
												<Input type="number" step="0.1" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="space-y-2">
									<FormLabel>Completion Time</FormLabel>
									<div className="flex items-center space-x-3">
										<FormField
											control={roadMarchForm.control}
											name="hours"
											render={({ field }) => (
												<FormItem className="flex-1">
													<div className="flex items-center space-x-2">
														<FormControl>
															<Input
																type="number"
																{...field}
																className="text-center"
															/>
														</FormControl>
														<span className="text-sm text-muted-foreground">
															hr
														</span>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>

										<span className="text-lg">:</span>

										<FormField
											control={roadMarchForm.control}
											name="minutes"
											render={({ field }) => (
												<FormItem className="flex-1">
													<div className="flex items-center space-x-2">
														<FormControl>
															<Input
																type="number"
																{...field}
																className="text-center"
															/>
														</FormControl>
														<span className="text-sm text-muted-foreground">
															min
														</span>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>

										<span className="text-lg">:</span>

										<FormField
											control={roadMarchForm.control}
											name="seconds"
											render={({ field }) => (
												<FormItem className="flex-1">
													<div className="flex items-center space-x-2">
														<FormControl>
															<Input
																type="number"
																{...field}
																className="text-center"
															/>
														</FormControl>
														<span className="text-sm text-muted-foreground">
															sec
														</span>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={handleCancel}
									>
										Cancel
									</Button>
									<Button type="submit">Save Changes</Button>
								</DialogFooter>
							</form>
						</Form>
					</TabsContent>

					{/* Cardio Tab */}
					<TabsContent value="cardio">
						<Form {...cardioForm}>
							<form
								onSubmit={cardioForm.handleSubmit(onCardioSubmit)}
								className="space-y-6"
							>
								<FormField
									control={cardioForm.control}
									name="assessmentDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Assessment Date</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															className={cn(
																"w-full pl-3 text-left font-normal",
																!field.value && "text-muted-foreground",
															)}
														>
															{field.value ? (
																format(new Date(field.value), "PPP")
															) : (
																<span>Pick a date</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent
													className="w-auto p-0 bg-background border rounded-md shadow-md"
													align="start"
												>
													<Calendar
														mode="single"
														selected={
															field.value ? new Date(field.value) : undefined
														}
														onSelect={(date) =>
															field.onChange(
																date ? format(date, "yyyy-MM-dd") : "",
															)
														}
														disabled={(date) => date > new Date()}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={cardioForm.control}
										name="vo2Max"
										render={({ field }) => (
											<FormItem>
												<FormLabel>VO2 Max (ml/kg/min)</FormLabel>
												<FormControl>
													<Input type="number" step="0.1" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={cardioForm.control}
										name="restingHeartRate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Resting Heart Rate (BPM)</FormLabel>
												<FormControl>
													<Input type="number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={cardioForm.control}
										name="exerciseHeartRate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Exercise Heart Rate (BPM)</FormLabel>
												<FormControl>
													<Input type="number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={cardioForm.control}
										name="heartRateVariability"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Heart Rate Variability (ms)</FormLabel>
												<FormControl>
													<Input type="number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={handleCancel}
									>
										Cancel
									</Button>
									<Button type="submit">Save Changes</Button>
								</DialogFooter>
							</form>
						</Form>
					</TabsContent>

					{/* Strength Tab */}
					<TabsContent value="strength">
						<Form {...strengthForm}>
							<form
								onSubmit={strengthForm.handleSubmit(onStrengthSubmit)}
								className="space-y-6"
							>
								<FormField
									control={strengthForm.control}
									name="assessmentDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Assessment Date</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															className={cn(
																"w-full pl-3 text-left font-normal",
																!field.value && "text-muted-foreground",
															)}
														>
															{field.value ? (
																format(new Date(field.value), "PPP")
															) : (
																<span>Pick a date</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent
													className="w-auto p-0 bg-background border rounded-md shadow-md"
													align="start"
												>
													<Calendar
														mode="single"
														selected={
															field.value ? new Date(field.value) : undefined
														}
														onSelect={(date) =>
															field.onChange(
																date ? format(date, "yyyy-MM-dd") : "",
															)
														}
														disabled={(date) => date > new Date()}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={strengthForm.control}
										name="squatRepMax"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Squat Rep Max (kg)</FormLabel>
												<FormControl>
													<Input type="number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={strengthForm.control}
										name="deadliftRepMax"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Deadlift Rep Max (kg)</FormLabel>
												<FormControl>
													<Input type="number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={strengthForm.control}
										name="maxPullUps"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Max Pull-Ups (reps)</FormLabel>
												<FormControl>
													<Input type="number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="space-y-2">
									<FormLabel>Sprint-Drag-Carry Time</FormLabel>
									<div className="flex items-center space-x-3">
										<FormField
											control={strengthForm.control}
											name="sprintDragCarryMinutes"
											render={({ field }) => (
												<FormItem className="flex-1">
													<div className="flex items-center space-x-2">
														<FormControl>
															<Input
																type="number"
																{...field}
																className="text-center"
															/>
														</FormControl>
														<span className="text-sm text-muted-foreground">
															min
														</span>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>

										<span className="text-lg">:</span>

										<FormField
											control={strengthForm.control}
											name="sprintDragCarrySeconds"
											render={({ field }) => (
												<FormItem className="flex-1">
													<div className="flex items-center space-x-2">
														<FormControl>
															<Input
																type="number"
																{...field}
																className="text-center"
															/>
														</FormControl>
														<span className="text-sm text-muted-foreground">
															sec
														</span>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={handleCancel}
									>
										Cancel
									</Button>
									<Button type="submit">Save Changes</Button>
								</DialogFooter>
							</form>
						</Form>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
