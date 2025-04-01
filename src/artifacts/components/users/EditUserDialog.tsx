import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { User } from "../../types/users";
import type { UserRole } from "../..";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockCohorts } from "@/artifacts/mocks/cohortData";

export const userFormSchema = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters"),
	lastName: z.string().min(2, "Last name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	role: z.enum([
		"superAdmin",
		"companyAdmin",
		"courseCommander",
		"courseTrainer",
		"trainee",
	]),
	// Make these fields optional since they're only required for specific roles
	courseId: z.string().optional(),
	subcohortId: z.string().optional(),
	dateOfBirth: z.date(),
	weight: z.coerce.number().positive("Weight must be positive"),
	height: z.coerce.number().positive("Height must be positive"),
	gender: z.enum(["male", "female", "other"]),
});

interface EditUserDialogProps {
	user: User | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	roles: UserRole[];
	userRoleLabels: Record<UserRole, string>;
	courses: { id: string; name: string }[]; // Add available courses
	subcohorts: { id: string; name: string; cohortId: string }[]; // Add available subcohorts
	onSave: (values: z.infer<typeof userFormSchema>) => void;
}

export function EditUserDialog({
	user,
	open,
	onOpenChange,
	roles,
	userRoleLabels,
	courses,
	subcohorts,
	onSave,
}: EditUserDialogProps) {
	const form = useForm<z.infer<typeof userFormSchema>>({
		resolver: zodResolver(userFormSchema),
	});

	useEffect(() => {
		if (user && open) {
			// Reset form with user values
			form.reset({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role as UserRole,
				dateOfBirth: user.dateOfBirth,
				weight: user.weight,
				height: user.height,
				gender: user.gender,
			});
		}
	}, [user, open, form]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
						<Tabs defaultValue="basic" className="w-full">
							<TabsList className="grid w-full grid-cols-2 mb-4">
								<TabsTrigger value="basic">Basic Info</TabsTrigger>
								<TabsTrigger value="physical">Physical Details</TabsTrigger>
							</TabsList>

							{/* Basic Info Tab */}
							<TabsContent value="basic" className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>First Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="lastName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Last Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} type="email" />
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Role</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a role" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{roles.map((role) => (
														<SelectItem key={role} value={role}>
															{userRoleLabels[role]}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
								{form.watch("role") === "courseCommander" && (
									<FormField
										control={form.control}
										name="courseId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Assigned Course</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select a course" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{courses.map((course) => (
															<SelectItem key={course.id} value={course.id}>
																{course.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormItem>
										)}
									/>
								)}

								{(form.watch("role") === "courseTrainer" ||
									form.watch("role") === "trainee") && (
									<div className="grid grid-cols-2 gap-4">
										<FormItem>
											<FormLabel>Cohort</FormLabel>
											<Select
												disabled
												value={
													subcohorts.find(
														(s) => s.id === form.watch("subcohortId"),
													)?.cohortId ?? ""
												}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Associated Cohort">
															{mockCohorts.find(
																(c) =>
																	c.id ===
																	subcohorts.find(
																		(s) => s.id === form.watch("subcohortId"),
																	)?.cohortId,
															)?.name ?? "No cohort selected"}
														</SelectValue>
													</SelectTrigger>
												</FormControl>
											</Select>
										</FormItem>

										<FormField
											control={form.control}
											name="subcohortId"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subcohort</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select a subcohort" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{subcohorts.map((subcohort) => (
																<SelectItem
																	key={subcohort.id}
																	value={subcohort.id}
																>
																	{subcohort.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</FormItem>
											)}
										/>
									</div>
								)}
							</TabsContent>

							{/* Physical Details Tab */}
							<TabsContent value="physical" className="space-y-4">
								<FormField
									control={form.control}
									name="dateOfBirth"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>Date of Birth</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"w-full pl-3 text-left font-normal",
																!field.value && "",
															)}
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
												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="gender"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Gender</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select gender" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="male">Male</SelectItem>
														<SelectItem value="female">Female</SelectItem>
														<SelectItem value="other">Other</SelectItem>
													</SelectContent>
												</Select>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="height"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Height (cm)</FormLabel>
												<FormControl>
													<Input {...field} type="number" min="0" />
												</FormControl>
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="weight"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Weight (kg)</FormLabel>
											<FormControl>
												<Input {...field} type="number" min="0" />
											</FormControl>
										</FormItem>
									)}
								/>
							</TabsContent>
						</Tabs>

						<DialogFooter>
							<Button type="submit">Save changes</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
