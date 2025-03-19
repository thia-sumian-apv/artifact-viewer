import { useState } from "react";
import {
	Pencil,
	Trash2,
	Eye,
	Calendar as CalendarIcon2,
	User,
} from "lucide-react";
import { dummyAssessmentRunData } from "../types/assessmentRun";
import { dummyCourseData } from "../types/course";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
	PopoverDialog as Popover,
	PopoverContentDialog as PopoverContent,
	PopoverTriggerDialog as PopoverTrigger,
} from "@/components/ui/popover-dialog";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const AssessmentRunsTab = () => {
	const [selectedRun, setSelectedRun] = useState<
		(typeof dummyAssessmentRunData)[0] | null
	>(null);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	// Define the form schema
	const formSchema = z
		.object({
			code: z.string().min(1, "Assessment code is required"),
			name: z.string().min(1, "Assessment name is required"),
			courseId: z.string().min(1, "Course is required"),
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

	// Create form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			code: "",
			name: "",
			courseId: "",
			description: "",
		},
	});

	const handleEdit = (run: (typeof dummyAssessmentRunData)[0]) => {
		setSelectedRun(run);
		form.reset({
			code: run.code,
			name: run.name,
			courseId: run.courseId,
			description: run.description,
			startDate: new Date(run.startDate),
			endDate: new Date(run.endDate),
		});
		setEditDialogOpen(true);
	};

	const handleView = (run: (typeof dummyAssessmentRunData)[0]) => {
		setSelectedRun(run);
		setViewDialogOpen(true);
	};

	const handleDelete = (id: string) => {
		console.log("Delete assessment run:", id);
	};

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		console.log("Submitting form data:", data);
		setEditDialogOpen(false);
		setTimeout(() => {
			setSelectedRun(null);
		}, 100);
	};

	const getCourseNameById = (courseId: string) => {
		return (
			dummyCourseData.find((course) => course.id === courseId)?.name ||
			"Unknown Course"
		);
	};

	return (
		<div className="space-y-6">
			<Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<CardTitle>Assessment Runs</CardTitle>
					<Button>Add Assessment Run</Button>
				</CardHeader>
				<CardContent>
					<div className="border rounded-lg">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Assessment Code</TableHead>
									<TableHead>Assessment Name</TableHead>
									<TableHead>Course</TableHead>
									<TableHead>Start Date</TableHead>
									<TableHead>End Date</TableHead>
									<TableHead>Created By</TableHead>
									<TableHead>Last Modified By</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{dummyAssessmentRunData.map((run) => (
									<TableRow key={run.id}>
										<TableCell className="font-medium">{run.code}</TableCell>
										<TableCell>{run.name}</TableCell>
										<TableCell>{getCourseNameById(run.courseId)}</TableCell>
										<TableCell>
											{new Date(run.startDate).toLocaleDateString()}
										</TableCell>
										<TableCell>
											{new Date(run.endDate).toLocaleDateString()}
										</TableCell>
										<TableCell>{run.createdBy}</TableCell>
										<TableCell>{run.lastModifiedBy}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleView(run)}
													className="h-8 w-8 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
												>
													<Eye className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleEdit(run)}
													className="h-8 w-8 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDelete(run.id)}
													className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* View Assessment Run Dialog */}
			<Dialog
				open={viewDialogOpen}
				onOpenChange={(open) => {
					if (!open) {
						setViewDialogOpen(false);
						setTimeout(() => setSelectedRun(null), 100);
					}
				}}
			>
				<DialogContent className="sm:max-w-[525px]">
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold">
							Assessment Run Details
						</DialogTitle>
					</DialogHeader>
					{selectedRun && (
						<div className="space-y-6">
							<div className="space-y-1">
								<h3 className="text-sm font-medium text-muted-foreground">
									{selectedRun.code}
								</h3>
								<h2 className="text-2xl font-semibold">{selectedRun.name}</h2>
							</div>

							<div className="space-y-2">
								<h4 className="text-sm font-medium text-muted-foreground">
									Course
								</h4>
								<p className="text-sm">
									{getCourseNameById(selectedRun.courseId)}
								</p>
							</div>

							<div className="space-y-2">
								<h4 className="text-sm font-medium text-muted-foreground">
									Description
								</h4>
								<p className="text-sm">{selectedRun.description}</p>
							</div>

							<div className="grid grid-cols-2 gap-4 pt-4 border-t">
								<div className="space-y-2">
									<div className="flex items-center text-sm">
										<CalendarIcon2 className="h-4 w-4 mr-2 text-muted-foreground" />
										<span className="font-medium">Duration</span>
									</div>
									<p className="text-sm text-muted-foreground">
										{new Date(selectedRun.startDate).toLocaleDateString()} -
										{new Date(selectedRun.endDate).toLocaleDateString()}
									</p>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-sm">
										<User className="h-4 w-4 mr-2 text-muted-foreground" />
										<span className="font-medium">Created By</span>
									</div>
									<p className="text-sm text-muted-foreground">
										{selectedRun.createdBy}
									</p>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
			{/* Edit Assessment Run Dialog */}
			<Dialog
				open={editDialogOpen}
				onOpenChange={(open) => {
					if (!open) {
						setEditDialogOpen(false);
						setTimeout(() => setSelectedRun(null), 100);
					}
				}}
				modal={true}
			>
				<DialogContent
					className="sm:max-w-[525px] dialog-content"
					aria-describedby={undefined}
					onPointerDownOutside={(e) => e.preventDefault()}
					onEscapeKeyDown={() => setEditDialogOpen(false)}
				>
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold">
							Edit Assessment Run
						</DialogTitle>
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
											<Input {...field} />
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
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="courseId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Course</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a course" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{dummyCourseData.map((course) => (
													<SelectItem key={course.id} value={course.id}>
														{course.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
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
											<Textarea {...field} rows={3} />
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

							<div className="flex justify-end space-x-2 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setEditDialogOpen(false);
										setTimeout(() => {
											setSelectedRun(null);
										}, 100);
									}}
								>
									Cancel
								</Button>
								<Button type="submit">Save Changes</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AssessmentRunsTab;
