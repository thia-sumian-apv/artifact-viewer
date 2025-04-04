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
import type * as z from "zod";
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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockCohorts } from "@/artifacts/mocks/cohortData";
import { mockCompanyData } from "@/artifacts/mocks/companyData";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { userFormSchema } from "@/artifacts/schemas/userFormSchema";

interface EditUserDialogProps {
	user: User | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	roles: UserRole[];
	userRoleLabels: Record<UserRole, string>;
	courses: { id: string; name: string }[];
	subcohorts: { id: string; name: string; cohortId: string }[];
	onSave: (values: z.infer<typeof userFormSchema>) => void;
	isNewUser?: boolean;
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
	isNewUser = false,
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
				companyId: "companyId" in user ? user.companyId : undefined,
				subcohortId: "subcohortId" in user ? user.subcohortId : undefined,
				courseId:
					"courseIds" in user && user.courseIds?.length
						? user.courseIds[0]
						: undefined,
				dateOfBirth: user.dateOfBirth,
				weight: user.weight,
				height: user.height,
				gender: user.gender,
			});
		}
	}, [user, open, form]);

	const handleSubmit = async (values: z.infer<typeof userFormSchema>) => {
		try {
			await onSave(values);
			toast(isNewUser ? "User created" : "User updated", {
				description: `${values.firstName} ${values.lastName} was ${isNewUser ? "created" : "updated"} successfully.`,
				action: {
					label: "View",
					onClick: () => console.log("View user details"),
				},
			});
			onOpenChange(false);
		} catch (error) {
			console.error("Error saving user:", error);
			toast.error(
				isNewUser ? "Failed to create user" : "Failed to update user",
				{
					description: "Please try again.",
				},
			);
		}
	};

	const handleCancel = () => {
		form.reset();
		onOpenChange(false);
		toast("Cancelled", {
			description: isNewUser
				? "User creation was cancelled"
				: "User edit was cancelled",
		});
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(newOpenState) => {
				if (!newOpenState) {
					handleCancel();
				} else {
					onOpenChange(newOpenState);
				}
			}}
		>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{isNewUser ? "Create User Details" : "Edit User Details"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						{/* Basic Information Section */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium text-gray-500">
								Basic Information
							</h3>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name*</FormLabel>
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
										<FormLabel>Email Address*</FormLabel>
										<FormControl>
											<Input {...field} type="email" disabled={!isNewUser} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						{/* Physical Details Section */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium text-gray-500">
								Physical Details
							</h3>
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
									name="dateOfBirth"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Date of Birth</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"w-full pl-3 text-left font-normal",
																!field.value && "text-muted-foreground",
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
														disabled={(date) =>
															date > new Date() || date < new Date("1900-01-01")
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
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
							</div>
						</div>

						{/* Additional Details Section */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium text-gray-500">
								Additional Details
							</h3>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="companyId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Company*</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select company" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{mockCompanyData.map((company) => (
														<SelectItem key={company.id} value={company.id}>
															{company.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Role*</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select role" />
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
							</div>

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
										<FormLabel>Group</FormLabel>
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
													<SelectValue placeholder="Associated Group">
														{mockCohorts.find(
															(c) =>
																c.id ===
																subcohorts.find(
																	(s) => s.id === form.watch("subcohortId"),
																)?.cohortId,
														)?.name ?? "No group selected"}
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
												<FormLabel>Sub-group</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select sub-group" />
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
						</div>

						<DialogFooter className="gap-2">
							<Button variant="outline" type="button" onClick={handleCancel}>
								Cancel
							</Button>
							<Button type="submit">
								{isNewUser ? "Create User" : "Save Changes"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
